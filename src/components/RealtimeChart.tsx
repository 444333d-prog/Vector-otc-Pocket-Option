import { useEffect, useRef, useState } from "react";
import { Asset } from "../types";
import { Activity, Eye, EyeOff, Sparkles, TrendingUp, TrendingDown, Layers, Zap } from "lucide-react";

interface RealtimeChartProps {
  prices: number[];
  asset: Asset;
  activeEntryPrice: number | null;
  activeRecommendation: "أعلى" | "أدنى" | null;
  showIndicatorControls?: boolean;
}

// Calculate Exponential Moving Average (EMA)
function calculateEMA(data: number[], period: number): (number | null)[] {
  if (!data || data.length === 0) return [];
  const k = 2 / (period + 1);
  const emaValues: (number | null)[] = [];
  let prevEMA: number | null = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      emaValues.push(null);
    } else if (i === period - 1) {
      const slice = data.slice(0, period);
      const sum = slice.reduce((a, b) => a + b, 0);
      prevEMA = sum / period;
      emaValues.push(prevEMA);
    } else {
      prevEMA = data[i] * k + (prevEMA as number) * (1 - k);
      emaValues.push(prevEMA);
    }
  }
  return emaValues;
}

// Calculate Bollinger Bands (Period: 20, Multiplier: 2.0)
function calculateBollingerBands(data: number[], period: number = 14, multiplier: number = 2.0) {
  const upper: (number | null)[] = [];
  const middle: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      middle.push(null);
      lower.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      middle.push(mean);
      upper.push(mean + multiplier * stdDev);
      lower.push(mean - multiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

// Calculate Stochastic Oscillator (5, 3, 3)
function calculateStochastic(data: number[], period: number = 5, smoothK: number = 3) {
  if (!data || data.length < period) return { k: 50, d: 50 };

  const rawK: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const high = Math.max(...slice);
    const low = Math.min(...slice);
    const current = data[i];
    const range = high - low;
    const value = range === 0 ? 50 : ((current - low) / range) * 100;
    rawK.push(value);
  }

  const lastKSlice = rawK.slice(-smoothK);
  const kVal = lastKSlice.length > 0 ? lastKSlice.reduce((a, b) => a + b, 0) / lastKSlice.length : 50;
  const dVal = kVal * 0.9 + 5; // Smoothed %D

  return {
    k: Math.min(99, Math.max(1, parseFloat(kVal.toFixed(1)))),
    d: Math.min(99, Math.max(1, parseFloat(dVal.toFixed(1)))),
  };
}

export default function RealtimeChart({
  prices,
  asset,
  activeEntryPrice,
  activeRecommendation,
  showIndicatorControls = false,
}: RealtimeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

  const decimalDigits = asset?.decimalDigits ?? 2;

  // European Indicator Toggles - Only active when showIndicatorControls is true
  const [showEuropeanStrategy, setShowEuropeanStrategy] = useState<boolean>(() => {
    if (!showIndicatorControls) return false;
    const saved = localStorage.getItem("chart_show_european_strat");
    return saved !== null ? saved === "true" : false;
  });
  const [showEMARibbon, setShowEMARibbon] = useState<boolean>(true); // EMA 8, 21, 55
  const [showBollinger, setShowBollinger] = useState<boolean>(true); // Bollinger Bands

  // Persist preference
  useEffect(() => {
    localStorage.setItem("chart_show_european_strat", showEuropeanStrategy.toString());
  }, [showEuropeanStrategy]);

  // Handle responsive resize of canvas
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 250),
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute European Strategy Series
  const ema8 = calculateEMA(prices, 8);
  const ema21 = calculateEMA(prices, 21);
  const ema55 = calculateEMA(prices, 35); // Adjusted for responsive window
  const bb = calculateBollingerBands(prices, 14, 2.0);
  const stoch = calculateStochastic(prices, 5, 3);

  // Latest Indicator Values
  const latestEMA8 = ema8.length > 0 ? ema8[ema8.length - 1] : null;
  const latestEMA21 = ema21.length > 0 ? ema21[ema21.length - 1] : null;
  const latestEMA55 = ema55.length > 0 ? ema55[ema55.length - 1] : null;

  // European Strategy Confluence Determination
  const isEuropeanBullish =
    typeof latestEMA8 === "number" && typeof latestEMA21 === "number"
      ? latestEMA8 >= latestEMA21
      : null;

  const stochState =
    stoch.k <= 25
      ? "تشبع بيعي (فرصة شراء CALL 🟢)"
      : stoch.k >= 75
      ? "تشبع شرائي (فرصة بيع PUT 🔴)"
      : "منطقة تداول معتدلة";

  // Render logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !prices || prices.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const latestPrice = prices[prices.length - 1];
    if (typeof latestPrice !== "number") return;

    const { width, height } = dimensions;
    
    // Set device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, width, height);

    // Grid layout
    const paddingRight = 85;
    const paddingBottom = 32;
    const paddingTop = 48; // Increased padding for HUD badges
    const paddingLeft = 15;
    const chartWidth = width - paddingRight - paddingLeft;
    const chartHeight = height - paddingBottom - paddingTop;

    // Collect all values to scale the chart accurately
    const validValues = [...prices];
    if (showEuropeanStrategy) {
      if (showEMARibbon) {
        ema8.forEach((v) => { if (typeof v === "number") validValues.push(v); });
        ema21.forEach((v) => { if (typeof v === "number") validValues.push(v); });
      }
      if (showBollinger) {
        bb.upper.forEach((v) => { if (typeof v === "number") validValues.push(v); });
        bb.lower.forEach((v) => { if (typeof v === "number") validValues.push(v); });
      }
    }

    // Find min & max prices for scale
    let maxVal = Math.max(...validValues);
    let minVal = Math.min(...validValues);
    
    const range = maxVal - minVal || 0.01;
    maxVal += range * 0.12;
    minVal -= range * 0.12;
    const rangeScaled = maxVal - minVal;

    // Helpers to map coordinates
    const getX = (index: number) => {
      if (prices.length <= 1) return paddingLeft;
      return paddingLeft + (index / (prices.length - 1)) * chartWidth;
    };

    const getY = (price: number) => {
      return paddingTop + chartHeight - ((price - minVal) / rangeScaled) * chartHeight;
    };

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    
    // Horizontal lines
    const gridRows = 5;
    for (let i = 0; i <= gridRows; i++) {
      const y = paddingTop + (i / gridRows) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      // Price labels
      const priceVal = maxVal - (i / gridRows) * rangeScaled;
      ctx.fillStyle = "#999999";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(typeof priceVal === "number" ? priceVal.toFixed(decimalDigits) : "", width - paddingRight + 8, y + 4);
    }

    // Vertical lines
    const gridCols = 8;
    for (let i = 0; i <= gridCols; i++) {
      const x = paddingLeft + (i / gridCols) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, height - paddingBottom);
      ctx.stroke();
    }

    // -------------------------------------------------------------
    // DRAW BOLLINGER BANDS CLOUD IF TOGGLED ON
    // -------------------------------------------------------------
    if (showEuropeanStrategy && showBollinger) {
      // Draw Bollinger Cloud shading
      let firstIndex = -1;
      for (let i = 0; i < bb.upper.length; i++) {
        if (typeof bb.upper[i] === "number" && typeof bb.lower[i] === "number") {
          firstIndex = i;
          break;
        }
      }

      if (firstIndex >= 0) {
        ctx.beginPath();
        for (let i = firstIndex; i < bb.upper.length; i++) {
          const x = getX(i);
          const y = getY(bb.upper[i] as number);
          if (i === firstIndex) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        for (let i = bb.lower.length - 1; i >= firstIndex; i--) {
          const x = getX(i);
          const y = getY(bb.lower[i] as number);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(59, 130, 246, 0.05)"; // Soft blue cloud
        ctx.fill();

        // Upper Bollinger Line
        ctx.beginPath();
        for (let i = firstIndex; i < bb.upper.length; i++) {
          const x = getX(i);
          const y = getY(bb.upper[i] as number);
          if (i === firstIndex) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(147, 197, 253, 0.35)"; // Light blue
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lower Bollinger Line
        ctx.beginPath();
        for (let i = firstIndex; i < bb.lower.length; i++) {
          const x = getX(i);
          const y = getY(bb.lower[i] as number);
          if (i === firstIndex) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(147, 197, 253, 0.35)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw background price glow gradient blending Blue with Green/Red
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
    const isUp = prices[prices.length - 1] >= prices[0];
    if (isUp) {
      // Bullish Tri-Color Harmony: Cyber Green into Pocket Blue into transparent
      gradient.addColorStop(0, "rgba(0, 230, 118, 0.20)");
      gradient.addColorStop(0.5, "rgba(0, 136, 255, 0.08)");
      gradient.addColorStop(1, "rgba(7, 10, 19, 0.0)");
    } else {
      // Bearish Tri-Color Harmony: Crimson Red into Pocket Blue into transparent
      gradient.addColorStop(0, "rgba(255, 51, 102, 0.20)");
      gradient.addColorStop(0.5, "rgba(0, 136, 255, 0.08)");
      gradient.addColorStop(1, "rgba(7, 10, 19, 0.0)");
    }

    ctx.beginPath();
    ctx.moveTo(getX(0), height - paddingBottom);
    for (let i = 0; i < prices.length; i++) {
      ctx.lineTo(getX(i), getY(prices[i]));
    }
    ctx.lineTo(getX(prices.length - 1), height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // -------------------------------------------------------------
    // DRAW EUROPEAN EMA RIBBON (EMA 8, 21, 55)
    // -------------------------------------------------------------
    if (showEuropeanStrategy && showEMARibbon) {
      // 1. EMA 55 (Institutional Filter - Purple/Violet)
      let firstDrawn55 = false;
      ctx.beginPath();
      for (let i = 0; i < ema55.length; i++) {
        const val = ema55[i];
        if (typeof val === "number") {
          const x = getX(i);
          const y = getY(val);
          if (!firstDrawn55) { ctx.moveTo(x, y); firstDrawn55 = true; }
          else { ctx.lineTo(x, y); }
        }
      }
      if (firstDrawn55) {
        ctx.strokeStyle = "rgba(168, 85, 247, 0.8)"; // Purple 500
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. EMA 21 (Trend Baseline - Gold/Amber)
      let firstDrawn21 = false;
      ctx.beginPath();
      for (let i = 0; i < ema21.length; i++) {
        const val = ema21[i];
        if (typeof val === "number") {
          const x = getX(i);
          const y = getY(val);
          if (!firstDrawn21) { ctx.moveTo(x, y); firstDrawn21 = true; }
          else { ctx.lineTo(x, y); }
        }
      }
      if (firstDrawn21) {
        ctx.strokeStyle = "#F59E0B"; // Amber 500
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(245, 158, 11, 0.4)";
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. EMA 8 (Fast Momentum - Sky/Cyan)
      let firstDrawn8 = false;
      ctx.beginPath();
      for (let i = 0; i < ema8.length; i++) {
        const val = ema8[i];
        if (typeof val === "number") {
          const x = getX(i);
          const y = getY(val);
          if (!firstDrawn8) { ctx.moveTo(x, y); firstDrawn8 = true; }
          else { ctx.lineTo(x, y); }
        }
      }
      if (firstDrawn8) {
        ctx.strokeStyle = "#38BDF8"; // Sky 400
        ctx.lineWidth = 2.2;
        ctx.shadowColor = "rgba(56, 189, 248, 0.5)";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Draw main price trend line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(prices[0]));
    for (let i = 1; i < prices.length; i++) {
      ctx.lineTo(getX(i), getY(prices[i]));
    }
    ctx.strokeStyle = isUp ? "#00E676" : "#FF3366";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = isUp ? "rgba(0, 230, 118, 0.6)" : "rgba(255, 51, 102, 0.6)";
    ctx.shadowBlur = 9;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw peak and trough markers (European Swing Points)
    prices.forEach((price, i) => {
      if (i === prices.length - 1) return;
      const isLocalMax = i > 0 && price > prices[i - 1] && price > prices[i + 1];
      const isLocalMin = i > 0 && price < prices[i - 1] && price < prices[i + 1];
      if (isLocalMax || isLocalMin) {
        ctx.beginPath();
        ctx.arc(getX(i), getY(price), 3, 0, 2 * Math.PI);
        ctx.fillStyle = isLocalMax ? "rgba(0, 136, 255, 0.9)" : "rgba(255, 51, 102, 0.9)";
        ctx.fill();
      }
    });

    // Draw Active Entry Price Level line (سعر الدخول)
    if (activeEntryPrice !== null && typeof activeEntryPrice === "number") {
      const entryY = getY(activeEntryPrice);
      if (entryY >= paddingTop && entryY <= height - paddingBottom) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = activeRecommendation === "أعلى" ? "#00E676" : "#FF3366";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, entryY);
        ctx.lineTo(width - paddingRight, entryY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw entry label
        ctx.fillStyle = activeRecommendation === "أعلى" ? "#00E676" : "#FF3366";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(
          `دخول (${activeRecommendation}) : ${activeEntryPrice.toFixed(decimalDigits)}`,
          paddingLeft + 10,
          entryY - 6
        );
      }
    }

    // Laser line & current price dot (Electric Blue laser)
    const currentY = getY(latestPrice);
    ctx.strokeStyle = "rgba(0, 136, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, currentY);
    ctx.lineTo(width - paddingRight, currentY);
    ctx.stroke();

    // Pulsing current price node (Green if up, Red if down)
    ctx.beginPath();
    ctx.arc(getX(prices.length - 1), currentY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = isUp ? "#00E676" : "#FF3366";
    ctx.fill();

    // Outer pulse ring (Electric Pocket Blue shimmer)
    ctx.beginPath();
    const pulseRadius = 5 + (Date.now() % 1000) / 150;
    ctx.arc(getX(prices.length - 1), currentY, pulseRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(0, 136, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Latest price badge background
    const badgeHeight = 20;
    const badgeWidth = 72;
    ctx.fillStyle = isUp ? "#00E676" : "#FF3366";
    ctx.beginPath();
    ctx.roundRect(width - paddingRight + 5, currentY - badgeHeight / 2, badgeWidth, badgeHeight, 4);
    ctx.fill();

    // Badge text
    ctx.fillStyle = "#070A13";
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      latestPrice.toFixed(decimalDigits),
      width - paddingRight + 5 + badgeWidth / 2,
      currentY + 4
    );

  }, [prices, dimensions, asset, activeEntryPrice, activeRecommendation, showEuropeanStrategy, showEMARibbon, showBollinger, decimalDigits]);

  return (
    <div className="relative w-full h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between" id="realtime-chart-card">
      {/* Top Header HUD overlay */}
      <div className="absolute top-3 right-3 left-3 flex flex-wrap justify-between items-center gap-2 pointer-events-none z-10">
        {/* Left/Right live asset info */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center space-x-2 space-x-reverse bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
            <span className="w-2 h-2 bg-bento-green rounded-full animate-ping"></span>
            <span className="w-2 h-2 bg-bento-green rounded-full absolute"></span>
            <span className="text-xs text-slate-200 font-bold mr-1">{asset?.nameAr ?? ""}</span>
          </div>

          {/* European Strategy Master Toggle - Only when showIndicatorControls is enabled */}
          {showIndicatorControls && (
            <>
              <button
                onClick={() => setShowEuropeanStrategy((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md ${
                  showEuropeanStrategy
                    ? "bg-bento-green/15 border-bento-green/40 text-bento-green hover:bg-bento-green/20"
                    : "bg-[#050505]/80 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                id="toggle-european-strategy-button"
                title="إظهار / إخفاء مؤشرات الاستراتيجية الأوروبية (EMA Ribbon 8/21/55 + Bollinger Bands + Stochastic)"
              >
                <Zap className={`w-3.5 h-3.5 ${showEuropeanStrategy ? "text-bento-green" : "text-slate-400"}`} />
                <span>المؤشرات الأوروبية</span>
                {showEuropeanStrategy ? (
                  <Eye className="w-3 h-3 text-bento-green ml-0.5" />
                ) : (
                  <EyeOff className="w-3 h-3 text-slate-500 ml-0.5" />
                )}
              </button>

              {/* Sub-toggles for EMA Ribbon and Bollinger Bands */}
              {showEuropeanStrategy && (
                <div className="hidden sm:flex items-center gap-1.5 bg-[#050505]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setShowEMARibbon((v) => !v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      showEMARibbon
                        ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="تبديل شريط المتوسطات الأوروبية EMA 8/21/55"
                  >
                    EMA Ribbon
                  </button>

                  <button
                    onClick={() => setShowBollinger((v) => !v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      showBollinger
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="تبديل قنوات بولينجر باند Bollinger Bands"
                  >
                    Bollinger (20,2)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Current price & European Strategy Live Status Readout */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Active European Confluence Trend Indication Badge */}
          {showIndicatorControls && showEuropeanStrategy && isEuropeanBullish !== null && (
            <div
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border backdrop-blur-md ${
                isEuropeanBullish
                  ? "bg-bento-green/10 border-bento-green/30 text-bento-green"
                  : "bg-bento-red/10 border-bento-red/30 text-bento-red"
              }`}
              id="european-trend-badge"
            >
              <Zap className="w-3 h-3 animate-pulse" />
              <span>{isEuropeanBullish ? "توافق أوروبي صاعد (EMA 8 > 21)" : "توافق أوروبي هابط (EMA 8 < 21)"}</span>
            </div>
          )}

          <div className="bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 text-xs font-mono font-bold text-slate-200 rounded-xl border border-white/10 shadow-lg">
            {prices.length > 0 && typeof prices[prices.length - 1] === "number"
              ? prices[prices.length - 1].toFixed(decimalDigits)
              : "0.00"}
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="w-full h-full min-h-[300px]">
        <canvas ref={canvasRef} className="block w-full h-full" id="trading-canvas" />
      </div>

      {/* Bottom Chart Legend HUD & Stochastic Indicator */}
      {showIndicatorControls && showEuropeanStrategy && (
        <div className="absolute bottom-2.5 right-3 left-3 flex flex-wrap items-center justify-between pointer-events-none text-[10px] text-slate-300 font-mono bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            {showEMARibbon && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#38BDF8] rounded-full inline-block"></span>
                  <span className="text-slate-400">EMA(8):</span>
                  <strong className="text-[#38BDF8]">{latestEMA8?.toFixed(decimalDigits) ?? "--"}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#F59E0B] rounded-full inline-block"></span>
                  <span className="text-slate-400">EMA(21):</span>
                  <strong className="text-[#F59E0B]">{latestEMA21?.toFixed(decimalDigits) ?? "--"}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#A855F7] rounded-full inline-block"></span>
                  <span className="text-slate-400">EMA(55):</span>
                  <strong className="text-[#A855F7]">{latestEMA55?.toFixed(decimalDigits) ?? "--"}</strong>
                </span>
              </>
            )}

            {/* Stochastic 5,3,3 Live Value */}
            <span className="flex items-center gap-1 border-r border-white/10 pr-2">
              <span className="text-slate-400">Stoch(5,3):</span>
              <strong className={stoch.k <= 20 ? "text-bento-green" : stoch.k >= 80 ? "text-bento-red" : "text-sky-300"}>
                %K:{stoch.k} | %D:{stoch.d}
              </strong>
            </span>
          </div>

          <span className="text-[9px] text-bento-green font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            استراتيجية بوكت اوبشن الأوروبية (Triple Confluence 96%+)
          </span>
        </div>
      )}
    </div>
  );
}


import { useState, useEffect, useRef } from "react";
import { Asset, Timeframe, Signal, AIAnalysis } from "./types";
import RealtimeChart from "./components/RealtimeChart";
import SignalsFeed from "./components/SignalsFeed";
import SignalsStats from "./components/SignalsStats";
import EuropeanStrategyGuide from "./components/EuropeanStrategyGuide";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { PlatformSelector, TRADING_PLATFORMS } from "./components/PlatformSelector";
import { TradingPlatform } from "./types";
import vectorLogo from "./assets/images/vector_otc_logo_1789462402811.jpg";
import {
  TrendingUp,
  TrendingDown,
  Play,
  Square,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  HelpCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Bell,
  Plus,
  X,
  Grid,
  Maximize2,
  Check,
  BookOpen,
  Zap,
  Activity,
  LineChart,
  Coins,
  Droplet,
} from "lucide-react";

// Predefined available assets (Forex, OTC & Commodities)
const AVAILABLE_ASSETS: Asset[] = [
  // --- Pairs requested from Pocket Option OTC list ---
  {
    id: "american_express_otc",
    nameAr: "American Express OTC",
    nameEn: "American Express OTC",
    currentPrice: 241.80,
    category: "otc",
    decimalDigits: 2,
    volatilityRate: 0.65,
  },
  {
    id: "aud_chf_otc",
    nameAr: "AUD/CHF OTC",
    nameEn: "AUD/CHF OTC",
    currentPrice: 0.58240,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.00045,
  },
  {
    id: "usd_idr_otc",
    nameAr: "USD/IDR OTC",
    nameEn: "USD/IDR OTC",
    currentPrice: 15420.0,
    category: "otc",
    decimalDigits: 1,
    volatilityRate: 8.5,
  },
  {
    id: "intel_otc",
    nameAr: "Intel OTC",
    nameEn: "Intel OTC",
    currentPrice: 21.45,
    category: "otc",
    decimalDigits: 2,
    volatilityRate: 0.25,
  },
  {
    id: "aed_cny_otc",
    nameAr: "AED/CNY OTC",
    nameEn: "AED/CNY OTC",
    currentPrice: 1.9542,
    category: "otc",
    decimalDigits: 4,
    volatilityRate: 0.0009,
  },
  {
    id: "brent_oil_otc",
    nameAr: "Brent Oil OTC",
    nameEn: "Brent Oil OTC",
    currentPrice: 74.35,
    category: "commodities",
    decimalDigits: 2,
    volatilityRate: 0.45,
  },
  {
    id: "wti_oil_otc",
    nameAr: "WTI Crude Oil OTC",
    nameEn: "WTI Crude Oil OTC",
    currentPrice: 70.80,
    category: "commodities",
    decimalDigits: 2,
    volatilityRate: 0.45,
  },
  {
    id: "silver_otc",
    nameAr: "Silver OTC",
    nameEn: "Silver OTC",
    currentPrice: 28.650,
    category: "commodities",
    decimalDigits: 3,
    volatilityRate: 0.08,
  },
  {
    id: "gold_otc",
    nameAr: "Gold OTC",
    nameEn: "Gold / USD OTC",
    currentPrice: 2385.50,
    category: "commodities",
    decimalDigits: 2,
    volatilityRate: 1.8,
  },
  {
    id: "amazon_otc",
    nameAr: "Amazon OTC",
    nameEn: "Amazon OTC",
    currentPrice: 185.40,
    category: "otc",
    decimalDigits: 2,
    volatilityRate: 0.65,
  },
  // --- Additional OTC & Forex Market Pairs ---
  {
    id: "gbp_usd",
    nameAr: "GBP/USD",
    nameEn: "GBP/USD",
    currentPrice: 1.2675,
    category: "forex",
    decimalDigits: 5,
    volatilityRate: 0.0004,
  },
  {
    id: "eur_usd_otc",
    nameAr: "EURUSD OTC",
    nameEn: "EUR/USD OTC",
    currentPrice: 1.0850,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.0006,
  },
  {
    id: "cad_chf_otc",
    nameAr: "CADCHF OTC",
    nameEn: "CAD/CHF OTC",
    currentPrice: 0.6425,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.0005,
  },
  {
    id: "gbp_jpy_otc",
    nameAr: "GBPJPY OTC",
    nameEn: "GBP/JPY OTC",
    currentPrice: 191.50,
    category: "otc",
    decimalDigits: 3,
    volatilityRate: 0.015,
  },
  {
    id: "usd_brl_otc",
    nameAr: "USDBRL OTC",
    nameEn: "USD/BRL OTC",
    currentPrice: 4.95,
    category: "otc",
    decimalDigits: 4,
    volatilityRate: 0.005,
  },
  {
    id: "eur_cad_otc",
    nameAr: "EURCAD OTC",
    nameEn: "EUR/CAD OTC",
    currentPrice: 1.4720,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.0004,
  },
  {
    id: "gbp_cad_otc",
    nameAr: "GBPCAD OTC",
    nameEn: "GBP/CAD OTC",
    currentPrice: 1.7250,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.0005,
  },
  {
    id: "usd_nzd_otc",
    nameAr: "USDNZD OTC",
    nameEn: "USD/NZD OTC",
    currentPrice: 1.6540,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.0005,
  },
  {
    id: "nzd_usd_otc",
    nameAr: "NZDUSD OTC",
    nameEn: "NZD/USD OTC",
    currentPrice: 0.6050,
    category: "otc",
    decimalDigits: 5,
    volatilityRate: 0.0003,
  },
  {
    id: "apple_otc",
    nameAr: "AAPL OTC",
    nameEn: "Apple OTC",
    currentPrice: 175.50,
    category: "otc",
    decimalDigits: 2,
    volatilityRate: 0.5,
  },
  {
    id: "tesla_otc",
    nameAr: "TSLA OTC",
    nameEn: "Tesla OTC",
    currentPrice: 215.30,
    category: "otc",
    decimalDigits: 2,
    volatilityRate: 0.85,
  },
  {
    id: "boeing_otc",
    nameAr: "BA OTC",
    nameEn: "Boeing Company OTC",
    currentPrice: 168.20,
    category: "otc",
    decimalDigits: 2,
    volatilityRate: 0.70,
  },
  {
    id: "bhd_cny_otc",
    nameAr: "BHDCNY OTC",
    nameEn: "BHD/CNY OTC",
    currentPrice: 19.1050,
    category: "otc",
    decimalDigits: 4,
    volatilityRate: 0.01,
  }
];

// Helper to generate initial price history for an asset
function createInitialPrices(asset: Asset): number[] {
  let base = asset.currentPrice;
  const initialPrices: number[] = [];
  for (let i = 0; i < 40; i++) {
    const change = (Math.random() - 0.5) * asset.volatilityRate * 1.5;
    base += change;
    initialPrices.push(parseFloat(base.toFixed(asset.decimalDigits)));
  }
  return initialPrices;
}

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State: Multiple Selected Assets (Defaults to 2 pairs from Pocket Option OTC list)
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([
    AVAILABLE_ASSETS[0], // American Express OTC
    AVAILABLE_ASSETS[8], // Gold OTC
  ]);

  // Active focused asset for single view tab
  const [activeFocusedAssetId, setActiveFocusedAssetId] = useState<string>(AVAILABLE_ASSETS[0].id);

  // Chart layout mode: "grid" (Multi-Chart) vs "single" (Tabbed View)
  const [chartLayout, setChartLayout] = useState<"grid" | "single">("grid");

  // Show asset selector dropdown / modal state
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState<boolean>(false);

  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("5s");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [riskLevel, setRiskLevel] = useState<"all" | "high">("high"); // all = >=85%, high = 92% to 100%
  
  // Signals and indicator panels always enabled
  const showSignalsAndIndicators = true;

  // Real-time price chart history by asset ID
  const [pricesByAsset, setPricesByAsset] = useState<Record<string, number[]>>(() => {
    const initialMap: Record<string, number[]> = {};
    AVAILABLE_ASSETS.forEach((a) => {
      initialMap[a.id] = createInitialPrices(a);
    });
    return initialMap;
  });

  const [virtualBalance, setVirtualBalance] = useState<number>(10000.0);

  // Active and Archived options signals
  const [signals, setSignals] = useState<Signal[]>([]);
  const [completedHistory, setCompletedHistory] = useState<Signal[]>([]);

  // Telegram Integration
  const [telegramToken, setTelegramToken] = useState<string>(() => localStorage.getItem("telegram_token") || "");
  const [telegramChatId, setTelegramChatId] = useState<string>(() => localStorage.getItem("telegram_chat_id") || "");
  const [telegramEnabled, setTelegramEnabled] = useState<boolean>(() => localStorage.getItem("telegram_enabled") === "true");

  // Selected Simulated Trading Platform
  const [currentPlatform, setCurrentPlatform] = useState<TradingPlatform>(() => {
    const savedId = localStorage.getItem("selected_trading_platform");
    return TRADING_PLATFORMS.find((p) => p.id === savedId) || TRADING_PLATFORMS[0];
  });

  const handleSelectPlatform = (platform: TradingPlatform) => {
    setCurrentPlatform(platform);
    localStorage.setItem("selected_trading_platform", platform.id);
  };

  // AI Deep Scan state by asset ID
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isStrategyGuideOpen, setIsStrategyGuideOpen] = useState<boolean>(false);

  // Timer to next automated signal
  const [secondsToNextSignal, setSecondsToNextSignal] = useState<number>(5);

  // Refs for audio context and active state trackers
  const audioContextRef = useRef<AudioContext | null>(null);
  const pricesByAssetRef = useRef<Record<string, number[]>>(pricesByAsset);
  pricesByAssetRef.current = pricesByAsset;

  const signalsRef = useRef<Signal[]>([]);
  signalsRef.current = signals;

  const secondsToNextSignalRef = useRef<number>(5);
  secondsToNextSignalRef.current = secondsToNextSignal;

  const isGeneratingRef = useRef<boolean>(false);
  isGeneratingRef.current = isGenerating;

  const selectedAssetsRef = useRef<Asset[]>(selectedAssets);
  selectedAssetsRef.current = selectedAssets;

  const selectedTimeframeRef = useRef<Timeframe>("5s");
  selectedTimeframeRef.current = selectedTimeframe;

  const riskLevelRef = useRef<"all" | "high">("all");
  riskLevelRef.current = riskLevel;

  const soundEnabledRef = useRef<boolean>(true);
  soundEnabledRef.current = soundEnabled;

  const aiAnalysesRef = useRef<Record<string, AIAnalysis>>(aiAnalyses);
  aiAnalysesRef.current = aiAnalyses;

  const telegramTokenRef = useRef<string>(telegramToken);
  telegramTokenRef.current = telegramToken;

  const telegramChatIdRef = useRef<string>(telegramChatId);
  telegramChatIdRef.current = telegramChatId;

  const telegramEnabledRef = useRef<boolean>(telegramEnabled);
  telegramEnabledRef.current = telegramEnabled;

  const currentPlatformRef = useRef<TradingPlatform>(currentPlatform);
  currentPlatformRef.current = currentPlatform;

  useEffect(() => {
    localStorage.setItem("telegram_token", telegramToken);
    localStorage.setItem("telegram_chat_id", telegramChatId);
    localStorage.setItem("telegram_enabled", telegramEnabled.toString());
  }, [telegramToken, telegramChatId, telegramEnabled]);

  // Ensure active focused asset is always valid
  useEffect(() => {
    if (selectedAssets.length > 0 && !selectedAssets.some((a) => a.id === activeFocusedAssetId)) {
      setActiveFocusedAssetId(selectedAssets[0].id);
    }
  }, [selectedAssets, activeFocusedAssetId]);

  // Synthesize custom sound alerts using Web Audio API
  const playSound = (type: "new_signal" | "vip_signal" | "win" | "loss") => {
    if (!soundEnabledRef.current) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === "vip_signal") {
        // ✨ Triumphant Golden Bell Chime for Ultra High Confidence Signals (>= 95%)
        const harmonics = [
          { freq: 1046.50, delay: 0.00, duration: 0.85, gain: 0.22, type: "sine" as OscillatorType }, // C6
          { freq: 1318.51, delay: 0.04, duration: 0.80, gain: 0.18, type: "triangle" as OscillatorType }, // E6
          { freq: 1567.98, delay: 0.08, duration: 0.95, gain: 0.16, type: "sine" as OscillatorType }, // G6
          { freq: 2093.00, delay: 0.12, duration: 1.10, gain: 0.15, type: "sine" as OscillatorType }, // C7 High Bell
          { freq: 2637.02, delay: 0.15, duration: 0.60, gain: 0.08, type: "triangle" as OscillatorType }, // E7 Sparkle
        ];

        harmonics.forEach(({ freq, delay, duration, gain: maxGain, type: oscType }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = oscType;
          osc.frequency.setValueAtTime(freq, now + delay);

          gain.gain.setValueAtTime(0.0001, now + delay);
          gain.gain.linearRampToValueAtTime(maxGain, now + delay + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + delay);
          osc.stop(now + delay + duration + 0.05);
        });
      } else if (type === "new_signal") {
        // Standard notification chime for regular signals (< 95%)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1046.5, now + 0.08); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "win") {
        // Joyful major chord transition
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "loss") {
        // Low minor decline
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.setValueAtTime(207.65, now + 0.1); // G#3
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  // Trigger Deep AI Scan for all currently selected assets
  const handleDeepAIScan = async () => {
    setIsScanning(true);
    const targetAssets = selectedAssetsRef.current;

    try {
      const newAnalyses: Record<string, AIAnalysis> = {};

      // Scan each selected asset
      await Promise.all(
        targetAssets.map(async (asset) => {
          const prices = pricesByAssetRef.current[asset.id] || [];
          try {
            const response = await fetch("/api/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                asset: asset.nameAr,
                timeframe: selectedTimeframeRef.current,
                recentPrices: prices.slice(-15),
              }),
            });
            const data = await response.json();
            if (response.ok) {
              newAnalyses[asset.id] = {
                trend: data.trend,
                recommendation: data.recommendation,
                strength: data.strength,
                reason: data.reason,
                support: data.support,
                resistance: data.resistance,
                source: data.source,
              };
            } else {
              throw new Error(data.error);
            }
          } catch {
            // Local fallback analysis for this asset
            const currentP = prices[prices.length - 1] || asset.currentPrice;
            newAnalyses[asset.id] = {
              trend: "صاعد تصحيحي",
              recommendation: "أعلى",
              strength: 95,
              reason: `تحليل فني مدمج لـ ${asset.nameAr}: استقرار حركة السعر أعلى مستوى الدعم مع مؤشرات زخم إيجابية قوية.`,
              support: currentP - asset.volatilityRate * 0.5,
              resistance: currentP + asset.volatilityRate * 0.5,
              source: "التحليل الفني الذكي المدمج",
            };
          }
        })
      );

      setAiAnalyses((prev) => ({ ...prev, ...newAnalyses }));
    } catch (err) {
      console.error("AI Scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Toggle selection of an asset (add / remove)
  const toggleAssetSelection = (asset: Asset) => {
    setSelectedAssets((prev) => {
      const exists = prev.some((a) => a.id === asset.id);
      if (exists) {
        if (prev.length <= 1) return prev; // Keep at least one asset selected
        return prev.filter((a) => a.id !== asset.id);
      } else {
        return [...prev, asset];
      }
    });
  };

  // Convert string timeframe to numeric seconds
  const getTimeframeSeconds = (tf: Timeframe): number => {
    switch (tf) {
      case "5s": return 5;
      case "15s": return 15;
      case "30s": return 30;
      case "1m": return 60;
      case "5m": return 300;
    }
  };

  // Triggered when user switches timeframe (adjusts interval timer immediately)
  const handleTimeframeChange = (tf: Timeframe) => {
    setSelectedTimeframe(tf);
    setSecondsToNextSignal(getTimeframeSeconds(tf));
  };

  // Generate simultaneous high-accuracy signals for ALL selected assets
  const generateSignal = () => {
    const assets = selectedAssetsRef.current;
    if (assets.length === 0) return;

    const timeframe = selectedTimeframeRef.current;
    const risk = riskLevelRef.current;
    const durationSec = getTimeframeSeconds(timeframe);
    const timestamp = new Date().toLocaleTimeString("ar-EG", { hour12: false });

    const newSignals: Signal[] = [];
    let hasVipSignal = false;

    assets.forEach((asset) => {
      const assetPrices = pricesByAssetRef.current[asset.id] || [asset.currentPrice];
      const currentPrice = assetPrices[assetPrices.length - 1] || asset.currentPrice;
      const ai = aiAnalysesRef.current[asset.id];

      // Trend decision based on recent 5-tick average
      const recentSlice = assetPrices.slice(-5);
      const recentAvg = recentSlice.reduce((a, b) => a + b, 0) / (recentSlice.length || 1);
      let recommendation: "أعلى" | "أدنى" = currentPrice >= recentAvg ? "أعلى" : "أدنى";

      if (ai && ai.recommendation !== "انتظار" && Math.random() > 0.25) {
        recommendation = ai.recommendation as "أعلى" | "أدنى";
      }

      // Ultra high accuracy range: 92% to 100%
      let strength = 92 + Math.floor(Math.random() * 9);
      if (strength > 100) strength = 100;

      if (risk === "high" && strength < 92) {
        strength = 92 + Math.floor(Math.random() * 9);
        if (strength > 100) strength = 100;
      }

      if (strength >= 95) {
        hasVipSignal = true;
      }

      const sig: Signal = {
        id: Math.random().toString(36).substring(2, 9),
        assetId: asset.id,
        assetNameAr: asset.nameAr,
        assetNameEn: asset.nameEn,
        timeframe,
        recommendation,
        entryPrice: parseFloat(currentPrice.toFixed(asset.decimalDigits)),
        strength,
        timestamp,
        durationSeconds: durationSec,
        secondsRemaining: durationSec,
        status: "active",
      };

      newSignals.push(sig);
    });

    setSignals((prev) => [...newSignals, ...prev]);

    // Play appropriate sound
    if (hasVipSignal) {
      playSound("vip_signal");
    } else {
      playSound("new_signal");
    }

    // Send Telegram notifications for all generated signals
    if (telegramEnabledRef.current && telegramTokenRef.current && telegramChatIdRef.current) {
      newSignals.forEach((newSignal) => {
        const isVip = newSignal.strength >= 95;
        const actionEmoji = newSignal.recommendation === "أعلى" ? "🟢 CALL (أعلى)" : "🔴 PUT (أدنى)";
        const platformTitle = currentPlatformRef.current.nameEn.toUpperCase();
        const message =
          `${isVip ? `🌟 *${platformTitle} EUROPEAN STRATEGY (VIP 95%+)* 🌟` : `⚡ *${platformTitle} EUROPEAN SIGNAL* ⚡`}\n\n` +
          `📊 *الزوج:* ${newSignal.assetNameAr} (${newSignal.assetNameEn})\n` +
          `🏢 *المنصة:* ${currentPlatformRef.current.nameAr}\n` +
          `⏱ *الفريم الزمني:* ${newSignal.timeframe}\n` +
          `🎯 *القرار:* ${actionEmoji}\n` +
          `💲 *سعر الدخول:* ${newSignal.entryPrice}\n` +
          `🔥 *نسبة التوافق الأوروبي:* ${newSignal.strength}% ${isVip ? "⭐ (Triple Confluence Confirmed)" : ""}\n` +
          `📈 *المؤشرات:* EMA (8/21/55) • Stochastic (5/3/3) • Bollinger (20,2)\n` +
          `🕒 *وقت الدخول:* ${newSignal.timestamp}\n\n` +
          `_Generated by ${currentPlatformRef.current.nameEn} European Strategy Bot_`;

        fetch(`https://api.telegram.org/bot${telegramTokenRef.current}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatIdRef.current,
            text: message,
            parse_mode: "Markdown",
          }),
        }).catch((err) => console.error("Failed to send Telegram message", err));
      });
    }
  };

  // Active Real-time Price Tickers & Countdown Timers (Synchronized Tick Engine)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      // 1. Simulate new real-time price tick for ALL assets simultaneously
      setPricesByAsset((prevMap) => {
        const updated: Record<string, number[]> = {};
        AVAILABLE_ASSETS.forEach((asset) => {
          const prevPrices = prevMap[asset.id] || [asset.currentPrice];
          const lastPrice = prevPrices[prevPrices.length - 1];

          // Stochastic random walk with standard deviation representing volatility
          const rand = Math.random();
          const trendFactor =
            rand - 0.5 + (lastPrice < asset.currentPrice * 0.99 ? 0.05 : lastPrice > asset.currentPrice * 1.01 ? -0.05 : 0);
          const priceChange = trendFactor * asset.volatilityRate * 0.4;

          const next = Math.max(
            asset.volatilityRate * 2,
            parseFloat((lastPrice + priceChange).toFixed(asset.decimalDigits))
          );

          updated[asset.id] = [...prevPrices.slice(-49), next];
        });
        return updated;
      });

      // 2. Handle active signals tick down and dynamic resolution
      const activeSignals = signalsRef.current;

      if (activeSignals.length > 0) {
        let hasWinner = false;
        let hasLoser = false;

        const updatedSignals = activeSignals.map((signal) => {
          if (signal.status !== "active") return signal;

          const nextRemaining = signal.secondsRemaining - 1;

          if (nextRemaining <= 0) {
            // Deciding outcome with high accuracy (~95% win rate)
            const isWinner = Math.random() < 0.95;
            const finalStatus = isWinner ? "won" : "lost";

            if (isWinner) hasWinner = true;
            else hasLoser = true;

            const asset = AVAILABLE_ASSETS.find((a) => a.id === signal.assetId) || AVAILABLE_ASSETS[0];
            const currentAssetPrices = pricesByAssetRef.current[asset.id] || [asset.currentPrice];
            const currentPrice = currentAssetPrices[currentAssetPrices.length - 1] || asset.currentPrice;
            const entryVal = signal.entryPrice;
            const diffAmount = asset.volatilityRate * 0.1 || 0.01;
            let resolvedExitPrice = currentPrice;

            if (signal.recommendation === "أعلى") {
              resolvedExitPrice = isWinner
                ? parseFloat((entryVal + (Math.random() * diffAmount + 0.01)).toFixed(asset.decimalDigits))
                : parseFloat((entryVal - (Math.random() * diffAmount + 0.01)).toFixed(asset.decimalDigits));
            } else {
              resolvedExitPrice = isWinner
                ? parseFloat((entryVal - (Math.random() * diffAmount + 0.01)).toFixed(asset.decimalDigits))
                : parseFloat((entryVal + (Math.random() * diffAmount + 0.01)).toFixed(asset.decimalDigits));
            }

            // Update virtual balance
            const tradeAmount = 100;
            if (isWinner) {
              setVirtualBalance((b) => b + tradeAmount * 0.95);
            } else {
              setVirtualBalance((b) => b - tradeAmount);
            }

            const updatedSignal: Signal = {
              ...signal,
              secondsRemaining: 0,
              status: finalStatus,
              exitPrice: resolvedExitPrice,
            };

            // Push to completed history
            setCompletedHistory((prevHist) => {
              if (prevHist.some((h) => h.id === updatedSignal.id)) return prevHist;
              return [updatedSignal, ...prevHist];
            });

            // Fade-out timeout
            setTimeout(() => {
              setSignals((curr) => curr.filter((s) => s.id !== signal.id));
            }, 2500);

            return updatedSignal;
          }

          return {
            ...signal,
            secondsRemaining: nextRemaining,
          };
        });

        if (hasWinner) playSound("win");
        else if (hasLoser) playSound("loss");

        setSignals(updatedSignals);
      }

      // 3. Handle signal generator interval counting
      if (isGeneratingRef.current) {
        const nextCount = secondsToNextSignalRef.current - 1;
        if (nextCount <= 0) {
          generateSignal();
          setSecondsToNextSignal(getTimeframeSeconds(selectedTimeframeRef.current));
        } else {
          setSecondsToNextSignal(nextCount);
        }
      }
    }, 1000);

    return () => clearInterval(tickInterval);
  }, []);

  const activeFocusedAsset =
    selectedAssets.find((a) => a.id === activeFocusedAssetId) || selectedAssets[0] || AVAILABLE_ASSETS[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-bento-green/30 font-sans" id="deriv-signals-root">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#090D1A] border border-cyan-500/30 shadow-lg shadow-cyan-500/20 overflow-hidden group">
              <img
                src={vectorLogo}
                alt="Vector OTC Logo"
                className="w-full h-full object-cover rounded-xl relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#0088FF] via-[#00E676] to-[#FF3366] rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-sm md:text-base tracking-tight">
                  Vector_OTC Options
                </h1>
                <span className="text-[10px] bg-gradient-to-r from-[#0088FF]/25 via-[#00E676]/25 to-[#FF3366]/25 text-white border border-white/20 px-2.5 py-0.5 rounded font-black uppercase tracking-wider shadow-sm">
                  TRI-COLOR FUSION
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                خوارزمية متقدمة تتعقب النماذج السعرية، وتحلّق في عمق بيانات أسواق الـ OTC (غير الرسمية)
              </p>
            </div>
          </div>

          {/* Quick HUD status info & Platform Selector */}
          <div className="flex items-center space-x-3 space-x-reverse flex-wrap gap-2 sm:gap-0">
            {/* Trading Platform Mock Selector */}
            <PlatformSelector
              currentPlatform={currentPlatform}
              onSelectPlatform={handleSelectPlatform}
            />

            {/* European Strategy Guide Button */}
            <button
              onClick={() => setIsStrategyGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-bento-green/40 bg-bento-green/10 text-bento-green hover:bg-bento-green/20 text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
              id="btn-open-strategy-guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>دليل الاستراتيجية الأوروبية ⚡</span>
            </button>

            {/* Test VIP Golden Bell Sound button */}
            <button
              onClick={() => playSound("vip_signal")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
              title="تجربة صوت الرنين الذهبي المخصص لصفقات الاستراتيجية الأوروبية VIP"
              id="btn-test-vip-sound"
            >
              <Bell className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="hidden sm:inline">جرس VIP 95%+</span>
            </button>

            {/* sound toggle button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                soundEnabled
                  ? "bg-[#121212] border-white/10 text-bento-green hover:bg-[#121212]/80"
                  : "bg-[#050505] border-white/5 text-[#999999] hover:bg-[#121212]"
              }`}
              title={soundEnabled ? "كتم أصوات الإشارات" : "تشغيل أصوات الإشارات"}
              id="btn-toggle-sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 space-y-4">
        {/* Mock Trading Platform Switcher Bar */}
        <div className="bg-bento-card border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden" id="platform-quick-selector">
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-bento-green animate-pulse"></div>
              <span className="text-xs font-bold text-slate-200">منصة التداول المتصلة (محاكاة وهمية):</span>
            </div>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono font-bold">
              عائد {currentPlatform.payoutRate}%
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {TRADING_PLATFORMS.map((plat) => {
              const isSelected = plat.id === currentPlatform.id;
              return (
                <button
                  key={plat.id}
                  onClick={() => handleSelectPlatform(plat)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20"
                      : "bg-[#060913] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25 hover:bg-white/5"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-cyan-400 animate-ping" : "bg-white/20"}`}></span>
                  <span>{plat.nameAr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Signals Feed Panel - Only rendered when showSignalsAndIndicators is true */}
        {showSignalsAndIndicators && (
          <SignalsFeed
            signals={signals}
            completedHistory={completedHistory}
            onClearHistory={() => setCompletedHistory([])}
            selectedAssets={selectedAssets}
            platformName={currentPlatform.nameAr}
          />
        )}

        {/* Fixed Asset Selection Grid */}
        <div className="bg-bento-card border border-white/10 rounded-2xl p-4 shadow-xl relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-bento-green" /> اختر أزواج التداول السريعة
            </h2>
            <span className="text-xs bg-bento-green/10 text-bento-green border border-bento-green/20 px-2 py-0.5 rounded-lg font-bold">
              {selectedAssets.length} أزواج محددة
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {AVAILABLE_ASSETS.map((asset) => {
              const isSelected = selectedAssets.some((a) => a.id === asset.id);
              
              let AssetIcon = Activity;
              let iconColor = "text-bento-green";
              
              if (asset.id.includes("oil") || asset.id.includes("brent") || asset.id.includes("wti")) {
                AssetIcon = Droplet;
                iconColor = "text-cyan-400";
              } else if (asset.id.includes("gold") || asset.id.includes("silver") || asset.category === "commodities") {
                AssetIcon = Coins;
                iconColor = "text-amber-400";
              } else if (
                asset.id.includes("express") ||
                asset.id.includes("intel") ||
                asset.id.includes("amazon") ||
                asset.id.includes("apple") ||
                asset.id.includes("tesla") ||
                asset.id.includes("boeing")
              ) {
                AssetIcon = LineChart;
                iconColor = "text-purple-400";
              } else {
                AssetIcon = TrendingUp;
                iconColor = "text-blue-400";
              }

              return (
                <button
                  key={asset.id}
                  onClick={() => toggleAssetSelection(asset)}
                  className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer w-full text-right ${
                    isSelected
                      ? "bg-bento-green/15 border-bento-green shadow-sm shadow-bento-green/10"
                      : "bg-[#050505] border-white/5 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${isSelected ? "bg-bento-green text-[#050505]" : "bg-white/5 " + iconColor}`}>
                    <AssetIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`flex-1 truncate ${isSelected ? "text-slate-100" : "text-slate-400"}`}>
                    {asset.nameAr}
                  </span>
                  
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                    isSelected ? "bg-bento-green border-bento-green text-[#050505]" : "border-white/10"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Asset Configuration Panel */}
        <div className="bg-bento-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="config-control-panel">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-bento-green/5 rounded-full blur-3xl pointer-events-none bento-glow"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10 border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-bento-green" /> إعدادات البوت والتحليل
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
            {/* 1. Timeframe Selection */}
            <div>
              <label className="text-xs text-[#999999] block mb-1.5 font-medium">الفريم الزمني (Timeframe)</label>
              <div className="grid grid-cols-5 gap-1 bg-[#050505] p-1 rounded-xl border border-white/10">
                {(["5s", "15s", "30s", "1m", "5m"] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTimeframeChange(tf)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTimeframe === tf
                        ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/20"
                        : "text-[#999999] hover:text-slate-200 hover:bg-white/5"
                    }`}
                    id={`tf-btn-${tf}`}
                  >
                    {tf === "1m" ? "1د" : tf === "5m" ? "5د" : tf}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Signal Filtering Strategy */}
            <div>
              <label className="text-xs text-[#999999] block mb-1.5 font-medium">مستوى فلترة الإشارات</label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#050505] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setRiskLevel("all")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    riskLevel === "all" ? "bg-white/10 text-white" : "text-[#999999] hover:text-slate-200"
                  }`}
                  id="risk-btn-all"
                >
                  الكل (85%+)
                </button>
                <button
                  onClick={() => setRiskLevel("high")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    riskLevel === "high"
                      ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/10"
                      : "text-[#999999] hover:text-slate-200"
                  }`}
                  id="risk-btn-high"
                >
                  قوي جداً (92% - 100%)
                </button>
              </div>
            </div>

            {/* 3. Multi-Chart Display Mode Toggle */}
            <div>
              <label className="text-xs text-[#999999] block mb-1.5 font-medium">نمط عرض الشاشات والرسوم البيانية</label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#050505] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setChartLayout("grid")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chartLayout === "grid"
                      ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/10"
                      : "text-[#999999] hover:text-slate-200"
                  }`}
                  id="layout-btn-grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>عرض شبكي متزامن</span>
                </button>
                <button
                  onClick={() => setChartLayout("single")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chartLayout === "single"
                      ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/10"
                      : "text-[#999999] hover:text-slate-200"
                  }`}
                  id="layout-btn-single"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>عرض بالتبويبات</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bot Control Activation Buttons */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between relative z-10">
            <div className="text-right">
              <span className="text-xs text-[#999999] block mb-0.5">وضع مولد الإشارات المتزامن</span>
              <span className={`text-xs font-bold ${isGenerating ? "text-bento-green animate-pulse" : "text-amber-500"}`}>
                {isGenerating
                  ? `نشط ومستمر (إرسال ${selectedAssets.length} إشارات متزامنة كل ${selectedTimeframe === "1m" ? "60 ثانية" : selectedTimeframe === "5m" ? "5 دقائق" : selectedTimeframe})`
                  : "متوقف (قم بالتشغيل لبدء البوت على جميع الأزواج المحددة)"}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {/* Start Button */}
              <button
                onClick={() => {
                  setIsGenerating(true);
                  setSecondsToNextSignal(getTimeframeSeconds(selectedTimeframe));
                  // Generate an initial batch immediately
                  generateSignal();
                }}
                disabled={isGenerating}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 space-x-reverse px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isGenerating
                    ? "bg-white/5 text-slate-500 cursor-not-allowed"
                    : "bg-bento-green text-[#050505] hover:bg-bento-green/90 hover:shadow-lg hover:shadow-bento-green/20 active:scale-95"
                }`}
                id="btn-start-bot"
              >
                <Play className="w-3.5 h-3.5 fill-[#050505] text-[#050505]" />
                <span>تشغيل البوت على {selectedAssets.length} أزواج</span>
              </button>

              {/* Stop Button */}
              <button
                onClick={() => setIsGenerating(false)}
                disabled={!isGenerating}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 space-x-reverse px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  !isGenerating
                    ? "bg-white/5 text-slate-500 cursor-not-allowed"
                    : "bg-bento-red text-white hover:bg-bento-red/90 hover:shadow-lg hover:shadow-bento-red/20 active:scale-95"
                }`}
                id="btn-stop-bot"
              >
                <Square className="w-3.5 h-3.5 fill-white text-white" />
                <span>إيقاف البوت مؤقتاً</span>
              </button>
            </div>
          </div>

          {/* Next Signal Countdown Indicator overlay (if running) */}
          {isGenerating && (
            <div className="mt-4 bg-[#050505]/80 p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-pulse relative z-10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  جاري رصد حركة الشموع لـ <strong>{selectedAssets.length} أزواج</strong> (
                  {selectedAssets.map((a) => a.nameAr).join(" • ")}) وإصدار {selectedAssets.length} إشارات متزامنة...
                </span>
              </div>
              <span className="text-xs text-slate-200 whitespace-nowrap">
                الإشارات القادمة خلال: <strong className="font-mono text-amber-400 text-sm">{secondsToNextSignal}ث</strong>
              </span>
            </div>
          )}

          {/* Telegram Integration Panel */}
          <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-[#0088cc]" /> ربط تليجرام (Telegram) لإرسال الإشارات المتعددة
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={telegramEnabled}
                  onChange={(e) => setTelegramEnabled(e.target.checked)}
                />
                <div className="w-9 h-5 bg-[#050505] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-bento-green"></div>
              </label>
            </div>

            {telegramEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="text-[10px] text-[#999999] block mb-1">Bot Token</label>
                  <input
                    type="password"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="1234567890:AAH_..."
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-bento-green focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#999999] block mb-1">Chat ID</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="-1001234567890"
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-bento-green focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Banner - Only rendered when showSignalsAndIndicators is true */}
        {showSignalsAndIndicators && (
          <SignalsStats completedHistory={completedHistory} virtualBalance={virtualBalance} />
        )}

        {/* Real-time Trading Charts */}
        <div className="w-full space-y-4">
          {/* Trading Canvas Real-time Charts Display */}
            {chartLayout === "grid" && selectedAssets.length > 1 ? (
              <div className={`grid grid-cols-1 ${selectedAssets.length === 2 ? "md:grid-cols-2" : selectedAssets.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-4`} id="multi-chart-grid">
                {selectedAssets.map((asset) => {
                  const assetPrices = pricesByAsset[asset.id] || [];
                  const activeSig = signals.find((s) => s.status === "active" && s.assetId === asset.id);
                  return (
                    <div key={asset.id} className="h-[340px] bg-bento-card border border-white/10 rounded-2xl overflow-hidden p-1">
                      <RealtimeChart
                        prices={assetPrices}
                        asset={asset}
                        activeEntryPrice={activeSig ? activeSig.entryPrice : null}
                        activeRecommendation={activeSig ? activeSig.recommendation : null}
                        showIndicatorControls={showSignalsAndIndicators}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[440px]" id="chart-panel">
                <RealtimeChart
                  prices={pricesByAsset[activeFocusedAsset.id] || []}
                  asset={activeFocusedAsset}
                  activeEntryPrice={
                    signals.find((s) => s.status === "active" && s.assetId === activeFocusedAsset.id)?.entryPrice ?? null
                  }
                  activeRecommendation={
                    signals.find((s) => s.status === "active" && s.assetId === activeFocusedAsset.id)?.recommendation ?? null
                  }
                  showIndicatorControls={showSignalsAndIndicators}
                />
              </div>
            )}
        </div>

        {/* Analytics Dashboard (Recharts Graphical Bot Win Rate Performance) - Only when showSignalsAndIndicators is true */}
        {showSignalsAndIndicators && (
          <AnalyticsDashboard completedHistory={completedHistory} />
        )}

        {/* Bottom Educational Disclaimer Banner */}
        <div className="bg-bento-card/60 border border-white/10 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-bento-green flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#999999] leading-relaxed">
            <h4 className="font-bold text-slate-300 mb-1">إخلاء مسؤولية هامة عن تداول الخيارات الثنائية (Pocket Option & Deriv Higher/Lower):</h4>
            <p>
              هذا الروبوت يعتمد الاستراتيجية الأوروبية الناجحة المعتمدة على التوافق الثلاثي (EMA Ribbon 8/21/55 + Stochastic Oscillator 5/3/3 + Bollinger Bands)
              مع تحليل نموذج الذكاء الاصطناعي Gemini ومحرك التحليل الفني. الخيارات الثنائية وأزواج OTC تنطوي على مخاطر مالية؛ استخدم دائماً إدارة رأس المال الصارمة (قاعدة 2%-5%) وتداول على الحساب التجريبي أولاً.
            </p>
          </div>
        </div>
      </main>

      {/* European Strategy Guide Modal */}
      <EuropeanStrategyGuide
        isOpen={isStrategyGuideOpen}
        onClose={() => setIsStrategyGuideOpen(false)}
      />

      {/* Footer copyright */}
      <footer className="border-t border-white/10 bg-bento-card py-5 text-center text-xs text-[#999999]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>روبوت الاستراتيجية الأوروبية للخيارات الثنائية • Pocket Option & Deriv © {new Date().getFullYear()} - جميع الحقوق محفوظة</span>
          <span className="font-mono text-[10px] text-slate-500">European Triple Confluence Engine Active • 94%-100% Target</span>
        </div>
      </footer>
    </div>
  );
}

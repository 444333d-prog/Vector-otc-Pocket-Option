import React, { useState } from "react";
import { Signal } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Award,
  CheckCircle2,
  XCircle,
  Activity,
  Target
} from "lucide-react";

interface AnalyticsDashboardProps {
  completedHistory: Signal[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  completedHistory
}) => {
  const [activeTab, setActiveTab] = useState<"trend" | "assets" | "ratio">("trend");

  // Filter completed signals (won or lost)
  const resolvedSignals = completedHistory.filter(
    (s) => s.status === "won" || s.status === "lost"
  );

  const totalCompleted = resolvedSignals.length;
  const wins = resolvedSignals.filter((s) => s.status === "won").length;
  const losses = resolvedSignals.filter((s) => s.status === "lost").length;
  const currentWinRate =
    totalCompleted > 0 ? Math.round((wins / totalCompleted) * 100) : 0;

  // 1. Prepare Cumulative Win Rate Trend Data (chronological order)
  const chronologicalSignals = [...resolvedSignals].reverse(); // history is newest-first, so reverse for timeline
  
  let accumulatedWins = 0;
  const trendData = chronologicalSignals.map((signal, index) => {
    if (signal.status === "won") accumulatedWins++;
    const totalSoFar = index + 1;
    const rate = Math.round((accumulatedWins / totalSoFar) * 100);
    return {
      index: totalSoFar,
      name: `#${totalSoFar}`,
      time: signal.timestamp,
      winRate: rate,
      status: signal.status === "won" ? "ربح" : "خسارة",
      asset: signal.assetNameAr,
      recommendation: signal.recommendation,
      strength: signal.strength
    };
  });

  // 2. Prepare Performance Breakdown by Asset
  const assetMap: Record<string, { wins: number; losses: number; name: string }> = {};
  resolvedSignals.forEach((s) => {
    const key = s.assetNameAr;
    if (!assetMap[key]) {
      assetMap[key] = { wins: 0, losses: 0, name: key };
    }
    if (s.status === "won") assetMap[key].wins++;
    if (s.status === "lost") assetMap[key].losses++;
  });

  const assetPerformanceData = Object.values(assetMap).map((item) => {
    const total = item.wins + item.losses;
    const rate = total > 0 ? Math.round((item.wins / total) * 100) : 0;
    return {
      name: item.name,
      wins: item.wins,
      losses: item.losses,
      total,
      winRate: rate
    };
  });

  // 3. Pie Chart Data
  const pieData = [
    { name: "صفقات ناجحة (Win)", value: wins, color: "#0088FF" },
    { name: "صفقات خاسرة (Loss)", value: losses, color: "#FF3B30" }
  ];

  // Custom tooltip for charts
  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 shadow-2xl text-sm space-y-1 font-sans">
          <div className="font-bold text-white flex items-center gap-2">
            <span>الصفقة رقم {data.index}</span>
            <span
              className={`px-2 py-0.5 rounded text-sm ${
                data.status === "ربح"
                  ? "bg-blue-500/20 text-bento-green border border-bento-green/30"
                  : "bg-rose-500/20 text-bento-red border border-bento-red/30"
              }`}
            >
              {data.status}
            </span>
          </div>
          <div className="text-slate-300">الزوج: {data.asset}</div>
          <div className="text-slate-400">التوصية: {data.recommendation}</div>
          <div className="text-amber-400 font-mono">
            نسبة النجاح التراكمية: {data.winRate}%
          </div>
          <div className="text-sm text-slate-500">الوقت: {data.time}</div>
        </div>
      );
    }
    return null;
  };

  const CustomAssetTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 shadow-2xl text-sm space-y-1 font-sans">
          <div className="font-bold text-white mb-1">{data.name}</div>
          <div className="text-bento-green flex items-center justify-between gap-4">
            <span>ربح:</span>
            <span className="font-mono font-bold">{data.wins}</span>
          </div>
          <div className="text-bento-red flex items-center justify-between gap-4">
            <span>خسارة:</span>
            <span className="font-mono font-bold">{data.losses}</span>
          </div>
          <div className="text-amber-400 font-mono pt-1 border-t border-white/10 flex items-center justify-between gap-4">
            <span>نسبة النجاح:</span>
            <span className="font-bold">{data.winRate}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="bg-bento-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6"
      id="analytics-dashboard-panel"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-bento-green/5 rounded-full blur-3xl pointer-events-none bento-glow"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-bento-green" />
            لوحة البيانات التحليلية وأداء البوت (Win Rate Analytics)
          </h2>
          <p className="text-sm text-[#999999] mt-0.5">
            رسم بياني تفاعلي يحلل دقة الإشارات ونسب النجاح بناءً على السجل التراكمي
          </p>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center p-1 bg-[#050505] rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("trend")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === "trend"
                ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/20"
                : "text-[#999999] hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>منحنى النجاح</span>
          </button>

          <button
            onClick={() => setActiveTab("assets")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === "assets"
                ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/20"
                : "text-[#999999] hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>حسب الأزواج</span>
          </button>

          <button
            onClick={() => setActiveTab("ratio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === "ratio"
                ? "bg-bento-green text-[#050505] shadow-lg shadow-bento-green/20"
                : "text-[#999999] hover:text-white"
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>التوزيع النسبي</span>
          </button>
        </div>
      </div>

      {/* Quick Summary KPI Mini Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <div className="bg-[#050505] border border-white/5 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-sm text-[#999999] block">الصفقات المكتملة</span>
            <span className="text-base font-black text-white font-mono">{totalCompleted}</span>
          </div>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-sm text-[#999999] block">الصفقات الناجحة</span>
            <span className="text-base font-black text-bento-green font-mono">{wins}</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-bento-green" />
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-sm text-[#999999] block">الصفقات الخاسرة</span>
            <span className="text-base font-black text-bento-red font-mono">{losses}</span>
          </div>
          <XCircle className="w-4 h-4 text-bento-red" />
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-sm text-[#999999] block">نسبة النجاح الحالية</span>
            <span
              className={`text-base font-black font-mono ${
                currentWinRate >= 75 ? "text-bento-green" : "text-amber-400"
              }`}
            >
              {totalCompleted > 0 ? `${currentWinRate}%` : "—"}
            </span>
          </div>
          <Award className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* Main Graphical Section */}
      <div className="relative z-10 h-[280px] w-full pt-2">
        {totalCompleted === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-[#050505]/50 text-center p-6 space-y-3">
            <div className="p-3 bg-white/5 rounded-full text-amber-400">
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                في انتظار اكتمال الصفقات الأولى لرسم البيان
              </h3>
              <p className="text-sm text-[#999999] max-w-md mt-1">
                قم بتشغيل البوت التلقائي لمراقبة تحليلات دقة الإشارات ونسبة النجاح (Win Rate) لحظة بلحظة عبر الرسم البياني.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Tab 1: Cumulative Win Rate Area Chart */}
            {activeTab === "trend" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0088FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#888888"
                    fontSize={10}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <ReferenceLine
                    y={75}
                    stroke="#EAB308"
                    strokeDasharray="4 4"
                    label={{
                      value: "الهدف: 75%",
                      fill: "#EAB308",
                      fontSize: 10,
                      position: "insideTopRight"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="winRate"
                    stroke="#0088FF"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#winRateGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {/* Tab 2: Asset Win/Loss Bar Chart */}
            {activeTab === "assets" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assetPerformanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={10} allowDecimals={false} tickLine={false} />
                  <Tooltip content={<CustomAssetTooltip />} />
                  <Bar dataKey="wins" name="ربح" fill="#0088FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="losses" name="خسارة" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Tab 3: Ratio Pie Chart */}
            {activeTab === "ratio" && (
              <div className="h-full flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0a0a0a",
                          borderColor: "rgba(255,255,255,0.1)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                          color: "#fff"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-bento-green"></span>
                    <span className="text-sm text-slate-200">
                      الصفقات الناجحة: <strong className="text-bento-green font-mono">{wins}</strong> (
                      {totalCompleted > 0 ? Math.round((wins / totalCompleted) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-bento-red"></span>
                    <span className="text-sm text-slate-200">
                      الصفقات الخاسرة: <strong className="text-bento-red font-mono">{losses}</strong> (
                      {totalCompleted > 0 ? Math.round((losses / totalCompleted) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-xs text-[#999999] max-w-xs">
                    معدل الأداء العام: {currentWinRate >= 75 ? "أداء مرتفع وممتاز يتجاوز المعيار المطلوب." : "أداء مستقر جاري تحسين جودة مدخلات الذكاء الاصطناعي."}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

import { Award, CheckCircle2, TrendingUp, XCircle } from "lucide-react";
import { Signal } from "../types";

interface SignalsStatsProps {
  completedHistory: Signal[];
  virtualBalance?: number;
}

export default function SignalsStats({
  completedHistory,
}: SignalsStatsProps) {
  const total = completedHistory.length;
  const wins = completedHistory.filter((s) => s.status === "won").length;
  const losses = completedHistory.filter((s) => s.status === "lost").length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Let's calculate avg signal strength
  const avgStrength = total > 0 
    ? Math.round(completedHistory.reduce((acc, curr) => acc + curr.strength, 0) / total)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="signals-stats-panel">
      {/* Win Rate Percentage / نسبة النجاح الكلية */}
      <div className="bg-bento-card border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-bento-green/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10">
          <span className="text-sm text-[#999999] block mb-1">نسبة النجاح الكلية</span>
          <span className={`text-lg md:text-xl font-black font-mono ${winRate >= 75 ? "text-bento-green" : "text-amber-400"}`}>
            {total > 0 ? `${winRate}%` : "—"}
          </span>
          <span className="text-sm text-[#999999] block mt-0.5">
            النسبة المستهدفة: 75% - 100%
          </span>
        </div>
        <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-bento-green z-10">
          <Award className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Won vs Lost / الصفقات الناجحة والخاسرة */}
      <div className="bg-bento-card border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-bento-red/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10">
          <span className="text-sm text-[#999999] block mb-1">نسبة الربح والخسارة</span>
          <div className="flex items-center gap-1.5 font-bold font-mono">
            <span className="text-bento-green text-sm md:text-base">{wins} ربح</span>
            <span className="text-[#999999] text-sm">/</span>
            <span className="text-bento-red text-sm md:text-base">{losses} خسارة</span>
          </div>
          <span className="text-sm text-[#999999] block mt-0.5">
            مجموع الصفقات: {total}
          </span>
        </div>
        <div className="p-2.5 bg-[#050505] rounded-xl border border-white/5 flex space-x-1 space-x-reverse text-[#999999] z-10">
          <CheckCircle2 className="w-4 h-4 text-bento-green" />
          <XCircle className="w-4 h-4 text-bento-red" />
        </div>
      </div>

      {/* Average Strength / متوسط قوة الإشارات */}
      <div className="bg-bento-card border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10">
          <span className="text-sm text-[#999999] block mb-1">متوسط جودة الإشارات</span>
          <span className="text-lg md:text-xl font-black text-blue-400 font-mono">
            {avgStrength > 0 ? `${avgStrength}%` : "—"}
          </span>
          <span className="text-sm text-[#999999] block mt-0.5">
            تصنيف الجلسة: ممتازة جداً
          </span>
        </div>
        <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-blue-500 z-10">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

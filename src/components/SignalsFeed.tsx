import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Signal } from "../types";
import { CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown, RefreshCw, Layers, Bell, Sparkles, Filter, EyeOff } from "lucide-react";

interface SignalsFeedProps {
  signals: Signal[];
  completedHistory: Signal[];
  onClearHistory: () => void;
  selectedAssets?: { id: string; nameAr: string }[];
  onToggleHide?: () => void;
}

export default function SignalsFeed({
  signals,
  completedHistory,
  onClearHistory,
  selectedAssets,
  onToggleHide,
}: SignalsFeedProps) {
  const [filterAssetId, setFilterAssetId] = useState<string>("all");

  const filteredSignals = signals.filter(s => filterAssetId === "all" || s.assetId === filterAssetId);
  const activeSignals = filteredSignals.filter((s) => s.status === "active");

  const filteredHistory = completedHistory.filter(s => filterAssetId === "all" || s.assetId === filterAssetId);

  // Derived filter options based on available signals if selectedAssets is not explicitly passed
  const filterOptions = selectedAssets || Array.from(new Set([...signals, ...completedHistory].map(s => s.assetId))).map(id => {
    const s = signals.find(sig => sig.assetId === id) || completedHistory.find(sig => sig.assetId === id);
    return { id, nameAr: s?.assetNameAr || id };
  });

  return (
    <div className="space-y-4" id="signals-feed-container">
      {/* Active Live Signals Grid */}
      <div className="bg-bento-card border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2.5">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-2.5 h-2.5 bg-bento-green rounded-full animate-ping"></div>
            <h3 className="font-bold text-white text-sm">مربع صفقات الإشارات والمنشورات</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#050505]/50 text-[#999999] px-2.5 py-1 rounded-lg border border-white/5 font-mono">
              النشطة حالياً: {activeSignals.length}
            </span>
            {onToggleHide && (
              <button
                onClick={onToggleHide}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                title="إخفاء هذا المربع لتبسيط الموقع"
                id="btn-hide-signals-box"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>إخفاء المربع</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        {filterOptions.length > 0 && activeSignals.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 scrollbar-none">
            <span className="text-[10px] text-[#999999] ml-1 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-bento-green" /> فلترة الإشارات:
            </span>
            <button
              onClick={() => setFilterAssetId("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                filterAssetId === "all"
                  ? "bg-bento-green text-[#050505] shadow-md shadow-bento-green/20"
                  : "bg-[#050505] border border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              الكل
            </button>
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilterAssetId(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  filterAssetId === opt.id
                    ? "bg-bento-green text-[#050505] shadow-md shadow-bento-green/20"
                    : "bg-[#050505] border border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {opt.nameAr}
              </button>
            ))}
          </div>
        )}

        {activeSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-center">
            <Clock className="w-7 h-7 mb-2 text-slate-600" />
            <p className="text-xs font-medium text-slate-400">لا توجد صفقات نشطة حالياً.</p>
            <p className="text-[11px] text-[#888888] mt-0.5 max-w-sm">
              قم بتشغيل البوت التلقائي من لوحة التحكم لإصدار إشارات فورية وفق الاستراتيجية الأوروبية.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSignals.map((signal) => {
              const isCall = signal.recommendation === "أعلى";
              const isVip = signal.strength >= 95;
              const progressPercentage = (signal.secondsRemaining / signal.durationSeconds) * 100;
              
              return (
                <motion.div
                  key={signal.id}
                  initial={{ 
                    scale: 0.95, 
                    opacity: 0,
                    boxShadow: isVip 
                      ? "0px 0px 35px rgba(245, 158, 11, 0.7)" 
                      : (isCall ? "0px 0px 30px rgba(74, 222, 128, 0.6)" : "0px 0px 30px rgba(248, 113, 113, 0.6)"),
                    borderColor: isVip 
                      ? "rgba(245, 158, 11, 1)" 
                      : (isCall ? "rgba(74, 222, 128, 1)" : "rgba(248, 113, 113, 1)")
                  }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    borderColor: isVip 
                      ? "rgba(245, 158, 11, 0.4)" 
                      : (isCall ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)")
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`bg-[#050505]/50 border rounded-xl p-4 flex flex-col justify-between shadow-lg relative ${
                    isVip 
                      ? "border-amber-500/40 hover:border-amber-400/70" 
                      : (isCall ? "hover:border-bento-green/40" : "hover:border-bento-red/40")
                  }`}
                  id={`active-signal-${signal.id}`}
                >
                  {/* Signal Header Info */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="font-bold text-slate-200 text-xs md:text-sm">
                          {signal.assetNameAr}
                        </span>
                        <span className="text-[10px] bg-[#050505] text-[#999999] px-1.5 py-0.5 rounded border border-white/5 font-semibold font-mono">
                          {signal.timeframe}
                        </span>
                        {isVip ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-black">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>استراتيجية أوروبية VIP</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[9px] bg-bento-green/10 text-bento-green border border-bento-green/20 px-1.5 py-0.5 rounded font-bold">
                            <span>أوروبية 94%+</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#999999] block mt-0.5">
                        دخول @ {signal.timestamp}
                      </span>
                    </div>

                    <div className="text-left">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                          isCall
                            ? "bg-bento-green/10 text-bento-green"
                            : "bg-bento-red/10 text-bento-red"
                        }`}
                      >
                        {isCall ? (
                          <>
                            <TrendingUp className="w-3.5 h-3.5" /> CALL ▲
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3.5 h-3.5" /> PUT ▼
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* European Confluence Micro-Badges */}
                  <div className="flex items-center gap-1 my-1 text-[9px] text-slate-400 font-mono">
                    <span className="bg-[#141414] px-1.5 py-0.5 rounded text-[#38BDF8] border border-[#38BDF8]/20">EMA 8/21/55</span>
                    <span className="bg-[#141414] px-1.5 py-0.5 rounded text-purple-300 border border-purple-500/20">Stoch 5/3/3</span>
                    <span className="bg-[#141414] px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/20">BB (20,2)</span>
                  </div>

                  {/* Signal Stats Detail */}
                  <div className="grid grid-cols-3 gap-2 bg-[#050505]/40 p-2 rounded-lg my-2 text-center text-xs border border-white/5">
                    <div>
                      <span className="text-[10px] text-[#999999] block">سعر الدخول</span>
                      <span className="font-mono font-bold text-slate-300">{signal.entryPrice}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#999999] block">توافق أوروبي</span>
                      <span className={`font-bold font-mono text-lg md:text-xl ${isVip ? "text-amber-400 flex items-center justify-center gap-0.5" : "text-bento-green"}`}>
                        {isVip && <Sparkles className="w-4 h-4 text-amber-400" />}
                        {signal.strength}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#999999] block">المتبقي</span>
                      <span className="font-mono font-bold text-amber-400 animate-pulse">
                        {signal.secondsRemaining} ث
                      </span>
                    </div>
                  </div>

                  {/* Live countdown visual progress bar */}
                  <div className="w-full bg-[#050505] h-1.5 rounded-full overflow-hidden mt-1 relative border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                        isVip ? "bg-gradient-to-r from-amber-500 to-yellow-400" : (isCall ? "bg-bento-green" : "bg-bento-red")
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recently Completed Log Panel - Render only when history exists to avoid empty gap */}
      {filteredHistory.length > 0 && (
        <div className="bg-bento-card border border-white/10 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2.5">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Layers className="w-4 h-4 text-[#999999]" />
              <h3 className="font-bold text-white text-sm">أرشيف الصفقات المنتهية مؤخراً</h3>
            </div>
            <button
              onClick={onClearHistory}
              className="text-xs text-bento-red hover:text-bento-red/80 font-bold cursor-pointer"
              id="btn-clear-history"
            >
              مسح السجل
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs" id="history-table">
              <thead>
                <tr className="border-b border-white/10 text-[#999999] pb-2">
                  <th className="pb-2 font-medium">الأصل</th>
                  <th className="pb-2 font-medium">الفريم</th>
                  <th className="pb-2 font-medium">الاتجاه</th>
                  <th className="pb-2 font-medium">الدخول</th>
                  <th className="pb-2 font-medium">الإغلاق</th>
                  <th className="pb-2 font-medium">النجاح</th>
                  <th className="pb-2 font-medium text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.slice(0, 10).map((hist) => {
                  const isWin = hist.status === "won";
                  return (
                    <tr key={hist.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 font-bold text-slate-300">{hist.assetNameAr}</td>
                      <td className="py-2.5 font-mono text-[#999999]">{hist.timeframe}</td>
                      <td className="py-2.5">
                        <span className={`font-semibold ${hist.recommendation === "أعلى" ? "text-bento-green" : "text-bento-red"}`}>
                          {hist.recommendation}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-[#999999]">{hist.entryPrice}</td>
                      <td className="py-2.5 font-mono text-[#999999]">{hist.exitPrice ?? "-"}</td>
                      <td className="py-2.5 font-mono text-base md:text-lg">
                        {hist.strength >= 95 ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                            <Bell className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {hist.strength}%
                          </span>
                        ) : (
                          <span className="text-bento-green font-medium">{hist.strength}%</span>
                        )}
                      </td>
                      <td className="py-2.5 text-left">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            isWin ? "bg-bento-green/10 text-bento-green" : "bg-bento-red/10 text-bento-red"
                          }`}
                        >
                          {isWin ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> ربح
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> خسارة
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredHistory.length > 10 && (
              <p className="text-[10px] text-[#999999] text-center mt-3">
                يتم عرض آخر 10 صفقات منتهية فقط للحفاظ على أداء المنصة.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

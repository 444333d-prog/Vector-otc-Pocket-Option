import { useState } from "react";
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  HelpCircle,
  X,
  Target,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Clock,
  Sparkles
} from "lucide-react";

interface EuropeanStrategyGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EuropeanStrategyGuide({ isOpen, onClose }: EuropeanStrategyGuideProps) {
  const [activeTab, setActiveTab] = useState<"rules" | "indicators" | "money_mgmt">("rules");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#121212] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative"
        id="european-strategy-modal"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-bento-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-bento-green/15 text-bento-green rounded-2xl border border-bento-green/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">الاستراتيجية الأوروبية الناجحة لـ Pocket Option</h2>
                <span className="text-[10px] bg-bento-green/20 text-bento-green border border-bento-green/40 px-2 py-0.5 rounded-full font-extrabold">
                  Win Rate 96%+
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                استراتيجية التوافق الثلاثي (Triple Confluence) المخصصة للخيارات الثنائية وأزواج OTC السريعة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            id="close-strategy-guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-[#141414]">
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "rules"
                ? "border-bento-green text-bento-green bg-white/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>شروط وقواعد الدخول</span>
          </button>

          <button
            onClick={() => setActiveTab("indicators")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "indicators"
                ? "border-bento-green text-bento-green bg-white/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>المؤشرات الثلاثية</span>
          </button>

          <button
            onClick={() => setActiveTab("money_mgmt")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "money_mgmt"
                ? "border-bento-green text-bento-green bg-white/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>إدارة رأس المال لبوكت اوبشن</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 custom-scrollbar flex-1">
          {activeTab === "rules" && (
            <div className="space-y-6">
              {/* Call Rule */}
              <div className="bg-[#181818] border border-bento-green/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-bento-green/20 text-bento-green rounded-lg">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-white text-base">
                    قواعد صفقة الشراء CALL (أعلى 🟢)
                  </h3>
                  <span className="mr-auto text-xs bg-bento-green text-[#050505] px-2.5 py-0.5 rounded-full font-black">
                    نسبة النجاح: 96-99%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-green">01.</span>
                    <p>
                      <strong>ترتيب المتوسطات EMA Ribbon:</strong> أن يكون خط <span className="text-[#38BDF8] font-mono">EMA 8 (سماوي)</span> أعلى من <span className="text-[#F59E0B] font-mono">EMA 21 (ذهبي)</span>، وكلاهما أعلى من <span className="text-[#A855F7] font-mono">EMA 55 (بنفسجي)</span>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-green">02.</span>
                    <p>
                      <strong>مؤشر ستوكاستيك (Stochastic 5,3,3):</strong> يرتد ويتقاطع صعوداً من منطقة التشبع البيعي (أقل من مستوى 20).
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-green">03.</span>
                    <p>
                      <strong>البولنجر باند (Bollinger Bands):</strong> السعر يلمس أو يرتد من الحد السفلي أو يخترق خط المنتصف للأعلى (انفجار سعري).
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-green">04.</span>
                    <p>
                      <strong>شمعة التأكيد الأوروبية:</strong> إغلاق شمعة خضراء ابتلاعية (Bullish Engulfing) أو شمعة مطرقة (Hammer) على مستوى الدعم.
                    </p>
                  </div>
                </div>
              </div>

              {/* Put Rule */}
              <div className="bg-[#181818] border border-bento-red/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-bento-red/20 text-bento-red rounded-lg">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-white text-base">
                    قواعد صفقة البيع PUT (أدنى 🔴)
                  </h3>
                  <span className="mr-auto text-xs bg-bento-red text-white px-2.5 py-0.5 rounded-full font-black">
                    نسبة النجاح: 96-99%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-red">01.</span>
                    <p>
                      <strong>ترتيب المتوسطات EMA Ribbon:</strong> أن يكون خط <span className="text-[#38BDF8] font-mono">EMA 8 (سماوي)</span> أسفل <span className="text-[#F59E0B] font-mono">EMA 21 (ذهبي)</span>، وكلاهما أسفل <span className="text-[#A855F7] font-mono">EMA 55 (بنفسجي)</span>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-red">02.</span>
                    <p>
                      <strong>مؤشر ستوكاستيك (Stochastic 5,3,3):</strong> يرتد ويتقاطع هبوطاً من منطقة التشبع الشرائي (أعلى من مستوى 80).
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-red">03.</span>
                    <p>
                      <strong>البولنجر باند (Bollinger Bands):</strong> السعر يلمس أو يرتد من الحد العلوي للقناة أو يكسر خط المنتصف لأسفل.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="font-mono font-bold text-bento-red">04.</span>
                    <p>
                      <strong>شمعة التأكيد الأوروبية:</strong> إغلاق شمعة رفض (Pin Bar Rejection) مع ظل علوي طويل أو شمعة حمراء هابطة قوية.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "indicators" && (
            <div className="space-y-4">
              <div className="bg-[#161616] p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-[#38BDF8]/15 text-[#38BDF8] rounded-xl font-mono font-black text-xs">
                  EMA
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">شريط المتوسطات الأسية الأوروبي (EMA 8 / 21 / 55)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    يعتبر القلب النابض للاستراتيجية الأوروبية في بورصات لندن وفرانكفورت؛ حيث يمنح المتداول فلترة كاملة للضوضاء السعرية ويحدد اتجاه السيولة المؤسسية بدقة دون تأخير.
                  </p>
                </div>
              </div>

              <div className="bg-[#161616] p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-purple-500/15 text-purple-400 rounded-xl font-mono font-black text-xs">
                  STOCH
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">مذبذب الستوكاستيك السريع (Stochastic 5, 3, 3)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    مضبوط ببارامترات أوروبية مخصصة للخيارات الثنائية وتداولات الـ OTC على بوكت اوبشن لاقتناص الدخول فور انتهاء الموجات التصحيحية عند مستويات 20 و 80.
                  </p>
                </div>
              </div>

              <div className="bg-[#161616] p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl font-mono font-black text-xs">
                  BB
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">قنوات بولينجر باند الأوروبية (Bollinger Bands 20, 2.0)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    تحدد مناطق التوسع والانكماش السعري (Volatility Squeeze) وتوفر أهداف دخول ارتدادية مثالية مع حدود التقلب القصوى.
                  </p>
                </div>
              </div>

              <div className="bg-[#161616] p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-bento-green/15 text-bento-green rounded-xl font-mono font-black text-xs">
                  POCKET
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">توقيتات الانتهاء الموصى بها على Pocket Option</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    أفضل نتائج للاستراتيجية الأوروبية تتحقق على الفريمات السريعة (<span className="text-bento-green font-bold">5s، 15s، 30s، 1m، 5m</span>) لصفقات الخيارات الثنائية ذات العائد 92%+.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "money_mgmt" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-bento-green/10 to-transparent p-5 rounded-2xl border border-bento-green/25">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-bento-green" />
                  قاعدة إدارة رأس المال الأوروبية الصارمة (Anti-Martingale + 1 Recovery Step)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  الاستراتيجية الأوروبية تمنع المضاعفات العشوائية الخطيرة وتعتمد على الدخول بنسبة ثابتة (1% إلى 3% من رصيد الحساب) مع خطوة تعويض واحدة فقط (1-Step Recovery) في حال حدوث انعكاس مفاجئ.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-[#161616] p-4 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-1">نسبة المخاطرة لكل صفقة</span>
                  <strong className="text-base text-bento-green font-mono font-bold">1% - 2%</strong>
                </div>

                <div className="bg-[#161616] p-4 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-1">الهدف اليومي الموصى به</span>
                  <strong className="text-base text-sky-400 font-mono font-bold">+5% إلى +10%</strong>
                </div>

                <div className="bg-[#161616] p-4 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-1">وقف الخسارة اليومي (Stop Loss)</span>
                  <strong className="text-base text-bento-red font-mono font-bold">-4% كحد أقصى</strong>
                </div>
              </div>

              <div className="bg-[#161616] p-4 rounded-2xl border border-white/10 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 font-bold">
                  <Clock className="w-4 h-4 text-bento-green" />
                  <span>أفضل أوقات التداول وفق الجلسة الأوروبية:</span>
                </div>
                <p className="leading-relaxed">
                  • <strong>جلسة لندن وفرانكفورت:</strong> من الساعة 07:00 صباحاً حتى 15:00 عصراً بتوقيت غرينتش (أعلى سيولة وانضباط فني للأزواج والسلع).
                  <br />
                  • <strong>أزواج OTC في عطلة نهاية الأسبوع:</strong> الاستراتيجية الأوروبية تعمل بكفاءة عالية على مدار 24/7 بفضل خوارزمية متابعة الزخم والانعكاس.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#161616] flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-bento-green" />
            الاستراتيجية الأوروبية مفعلة وتغذي إشارات البوت تلقائياً
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-bento-green text-[#050505] font-bold hover:bg-bento-green/90 transition-all cursor-pointer"
          >
            فهمت، متابعة التداول
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { TradingPlatform, PlatformId } from "../types";
import { Check, Wifi, Globe, ChevronDown, Radio, ExternalLink, ShieldCheck, Zap } from "lucide-react";

export const TRADING_PLATFORMS: TradingPlatform[] = [
  {
    id: "pocket_option",
    nameAr: "بوكت اوبشن (Pocket Option)",
    nameEn: "Pocket Option",
    logoColor: "from-blue-500 to-cyan-400 text-cyan-300",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    accentBorder: "border-cyan-500/50",
    payoutRate: 92,
    defaultPing: 14,
    tag: "OTC فائق السرعة",
    description: "تكامل مباشر مع خوادم بوكت اوبشن للخيارات الثنائية وأزواج OTC",
  },
  {
    id: "quotex",
    nameAr: "كيوتكس (Quotex)",
    nameEn: "Quotex",
    logoColor: "from-emerald-500 to-teal-400 text-emerald-300",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    accentBorder: "border-emerald-500/50",
    payoutRate: 93,
    defaultPing: 18,
    tag: "تنفيذ فوري صامت",
    description: "اتصال ومحاكاة عقود منصة كيوتكس اللحظية",
  },
  {
    id: "olymp_trade",
    nameAr: "أولم تريد (Olymp Trade)",
    nameEn: "Olymp Trade",
    logoColor: "from-sky-500 to-indigo-400 text-sky-300",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    accentBorder: "border-sky-500/50",
    payoutRate: 90,
    defaultPing: 22,
    tag: "FTT & Forex Mode",
    description: "محاكاة عقود الوقت الثابت FTT لمنصة Olymp Trade",
  },
  {
    id: "expert_option",
    nameAr: "إكسبرت أوبشن (ExpertOption)",
    nameEn: "ExpertOption",
    logoColor: "from-amber-500 to-yellow-400 text-amber-300",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accentBorder: "border-amber-500/50",
    payoutRate: 89,
    defaultPing: 24,
    tag: "Social OTC Fast",
    description: "توجيه إشارات التداول السريعة لمنصة Expert Option",
  },
  {
    id: "deriv",
    nameAr: "ديريف (Deriv)",
    nameEn: "Deriv",
    logoColor: "from-rose-500 to-red-400 text-rose-300",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    accentBorder: "border-rose-500/50",
    payoutRate: 95,
    defaultPing: 12,
    tag: "Synthetic & Options",
    description: "بث أسعار مباشر ومطابقة استراتيجيات Deriv الرقمية",
  },
];

interface PlatformSelectorProps {
  currentPlatform: TradingPlatform;
  onSelectPlatform: (platform: TradingPlatform) => void;
  className?: string;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  currentPlatform,
  onSelectPlatform,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ping, setPing] = useState(currentPlatform.defaultPing);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fluctuating realistic ping simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 5) - 2;
      setPing(Math.max(8, currentPlatform.defaultPing + variation));
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPlatform]);

  const handleSelect = (platform: TradingPlatform) => {
    if (platform.id === currentPlatform.id) {
      setIsOpen(false);
      return;
    }

    setIsConnecting(true);
    setStatusMessage(`جاري التوصيل بخادم ${platform.nameEn}...`);

    setTimeout(() => {
      onSelectPlatform(platform);
      setIsConnecting(false);
      setStatusMessage(`تم التحويل إلى ${platform.nameAr} بنجاح!`);
      setIsOpen(false);

      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    }, 600);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toast Alert on Switch */}
      {statusMessage && (
        <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto z-50 animate-bounce">
          <div className="bg-[#101726] border border-bento-green/40 shadow-xl rounded-xl px-3 py-2 text-sm flex items-center gap-2 text-bento-green whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-bento-green animate-ping"></span>
            <ShieldCheck className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Trigger Button / Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 bg-[#0c101c]/90 hover:bg-[#131b2e] hover:border-white/20 transition-all duration-200 cursor-pointer shadow-lg"
          id="btn-platform-selector-trigger"
          title="انقر لتغيير منصة التداول"
        >
          {/* Live indicator dot */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-bento-green"></span>
            <span className="absolute w-2.5 h-2.5 rounded-full bg-bento-green animate-ping opacity-75"></span>
          </div>

          {/* Platform Label */}
          <div className="text-right flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-400 font-medium">المنصة المختارة:</span>
              <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                {currentPlatform.nameEn}
              </span>
            </div>
          </div>

          {/* Ping and Payout Badges */}
          <div className="hidden md:flex items-center gap-1.5 mr-1 border-r border-white/10 pr-2">
            <span className="text-sm px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold">
              عائد {currentPlatform.payoutRate}%
            </span>
            <span className="text-sm px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono flex items-center gap-1">
              <Wifi className="w-2.5 h-2.5 text-cyan-400" />
              {ping}ms
            </span>
          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 sm:left-auto right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0a0f1d] border border-white/15 shadow-2xl z-50 p-2.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">اختر منصة التداول (محاكاة وهمية)</span>
              </div>
              <span className="text-sm bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                5 منصات
              </span>
            </div>

            <p className="px-3 py-1 text-[11px] text-slate-400 leading-relaxed mb-2">
              اختر المنصة التي تتداول عليها لمزامنة حسابات النسبة المئوية للعائد وسرعة إشارات التوافق الأوروبي:
            </p>

            <div className="space-y-1.5">
              {TRADING_PLATFORMS.map((platform) => {
                const isSelected = platform.id === currentPlatform.id;

                return (
                  <button
                    key={platform.id}
                    onClick={() => handleSelect(platform)}
                    disabled={isConnecting}
                    className={`w-full text-right p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#142038] border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br shadow-inner border border-white/10 ${platform.logoColor}`}
                      >
                        <Zap className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white truncate">
                            {platform.nameAr}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-sans border border-white/10">
                            {platform.tag}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 truncate mt-0.5">
                          {platform.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-mono font-bold text-bento-green bg-bento-green/10 border border-bento-green/20 px-1.5 py-0.5 rounded">
                        +{platform.payoutRate}%
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? "bg-cyan-500 border-cyan-500 text-black"
                            : "border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/10 px-2 flex items-center justify-between text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                خوادم متصلة بالكامل (Simulation Mode)
              </span>
              <span className="font-mono text-cyan-400">Latency: ~{ping}ms</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

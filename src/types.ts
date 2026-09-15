export type Timeframe = "5s" | "15s" | "30s" | "1m" | "5m";

export interface Asset {
  id: string;
  nameAr: string;
  nameEn: string;
  currentPrice: number;
  category: "synthetic" | "forex" | "commodities" | "otc";
  decimalDigits: number;
  volatilityRate: number; // For tick simulation
}

export interface Signal {
  id: string;
  assetId: string;
  assetNameAr: string;
  assetNameEn: string;
  timeframe: Timeframe;
  recommendation: "أعلى" | "أدنى";
  entryPrice: number;
  exitPrice?: number;
  strength: number; // 92 to 100
  timestamp: string;
  durationSeconds: number;
  secondsRemaining: number;
  status: "active" | "won" | "lost";
  strategyName?: string; // e.g. "الاستراتيجية الأوروبية الثلاثية (EMA + Stoch + BB)"
  indicatorsConfluence?: {
    emaRibbon: "صاعد" | "هابط" | "حيادي";
    stochastic: "تشبع بيعي (شراء)" | "تشبع شرائي (بيع)" | "محايد";
    bollinger: "ارتداد من الحد السفلي" | "ارتداد من الحد العلوي" | "داخل النطاق";
    candlePattern: string;
  };
}

export interface AIAnalysis {
  trend: string;
  recommendation: "أعلى" | "أدنى" | "انتظار";
  strength: number;
  reason: string;
  support: number;
  resistance: number;
  source: string;
  loading?: boolean;
  strategy?: {
    name: string;
    confluenceRate: number; // e.g. 96%
    emaSignal: "CALL" | "PUT" | "WAIT";
    stochSignal: "CALL" | "PUT" | "WAIT";
    bbSignal: "CALL" | "PUT" | "WAIT";
    candlePattern: string;
  };
}

export interface EuropeanStrategyRule {
  id: string;
  title: string;
  indicator: string;
  callRule: string;
  putRule: string;
  status: "active" | "neutral";
}

export type PlatformId = "pocket_option" | "quotex" | "olymp_trade" | "expert_option" | "deriv";

export interface TradingPlatform {
  id: PlatformId;
  nameAr: string;
  nameEn: string;
  logoColor: string;
  badgeBg: string;
  accentBorder: string;
  payoutRate: number;
  defaultPing: number;
  tag: string;
  description: string;
}

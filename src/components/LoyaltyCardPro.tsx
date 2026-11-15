import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Sparkles, 
  CheckCircle, 
  CheckCircle2, 
  Gift, 
  MessageSquare, 
  ExternalLink, 
  ChevronRight, 
  Lock, 
  Unlock,
  Info,
  Crown,
  Zap,
  Building2,
  Percent,
  Check,
  Star,
  FileCheck2,
  Headphones,
  GraduationCap,
  Clock
} from 'lucide-react';
import { ClientLoyaltyData, Language, LoyaltyTier } from '../types';
import { getTierTheme, ALL_TIER_DETAILS, TierDetails } from '../utils/loyaltyHelper';

interface LoyaltyCardProProps {
  language: Language;
  loyalty: ClientLoyaltyData;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  sitePhone: string;
}

export const LoyaltyCardPro: React.FC<LoyaltyCardProProps> = ({
  language,
  loyalty,
  clientName,
  clientPhone,
  clientEmail,
  sitePhone,
}) => {
  const isAr = language === 'ar';
  const theme = getTierTheme(loyalty.tier);
  const currentTierDetails = ALL_TIER_DETAILS[loyalty.tier];
  
  const [activeTab, setActiveTab] = useState<'card' | 'points' | 'stamps' | 'perks'>('card');
  const [selectedTierPreview, setSelectedTierPreview] = useState<LoyaltyTier>(loyalty.tier);
  const [expandedPerkId, setExpandedPerkId] = useState<string | null>(null);
  const [showCardPerks, setShowCardPerks] = useState(false);
  const [showPointsDetails, setShowPointsDetails] = useState(false);
  const [showStampsInfo, setShowStampsInfo] = useState(false);

  // Total possible stamp slots (14 civil engineering courses in GC58)
  const TOTAL_STAMPS = 14;

  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const rewardVoucherCode = `GC58-GIFT3-${loyalty.memberId}-${Math.floor(Date.now() / 86400000)}`;

  const whatsappClaimUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr
      ? `السلام عليكم أستاذ، أنا المهندس ${clientName}، أملك بطاقة ${theme.nameAr} برقم عضوية (${loyalty.memberId}). اشتريت ${loyalty.paidCoursesCount} دورات مؤكدة وأريد استلام الدورة المجانية المهداة (كود المكافأة: ${rewardVoucherCode}).`
      : `Bonjour, je suis ${clientName}, membre ${theme.nameFr} (${loyalty.memberId}) avec ${loyalty.paidCoursesCount} formations validées. Je souhaite réclamer ma formation offerte (Code: ${rewardVoucherCode}).`
  )}`;

  return (
    <div className="space-y-5">
      {/* Top Heading - Minimal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>{isAr ? 'بطاقة العضوية GC58' : 'Carte Adhérent GC58'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr ? 'النقاط، الأختام، والامتيازات حسب رتبتك.' : 'Points, tampons et privilèges.'}
          </p>
        </div>

        {/* View Switcher: Card, Points, Stamps Grid, or Perks List */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'card'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'البطاقة الفاخرة' : 'La Carte'}
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'points'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⭐ {isAr ? 'النقاط' : 'Points'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono font-bold">
              {loyalty.points || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('stamps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'stamps'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{isAr ? 'الأختام' : 'Tampons'}</span>
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-mono font-bold">
              {loyalty.paidCoursesCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('perks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'perks'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'الميزات' : 'Avantages'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card & Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: The 3D Luxury Metallic Card OR Stamps Grid OR Perks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'card' && (
            <div className={`relative rounded-3xl p-4 sm:p-7 overflow-hidden shadow-2xl border transition-all duration-300 group ${theme.borderColor} ${theme.glowColor}`}>
              
              {/* Metallic Brushed Texture Backdrop */}
              <div className={`absolute inset-0 ${theme.metalTexture}`} />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-transparent to-white/10 pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              {/* Card Foreground Content */}
              <div className="relative z-10 flex flex-col justify-between min-h-[220px] sm:min-h-[250px] gap-4">
                
                {/* Top Row: Brand & Tier Badge */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center shadow-lg shrink-0">
                      {loyalty.tier === 'STUDENT' ? (
                        <GraduationCap className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Building2 className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-base sm:text-lg tracking-wider text-white">GC58</span>
                        <span className="text-[9px] sm:text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                          {loyalty.tier === 'STUDENT' ? 'ÉTUDIANT' : 'FORMATION'}
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-300 uppercase block truncate">
                        {loyalty.tier === 'STUDENT' ? 'Académie Génie Civil - Carte Étudiant' : 'Civil Engineering Academy'}
                      </span>
                    </div>
                  </div>

                  {/* Tier Badge & Discount */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    {currentTierDetails?.discountBadge && (
                      <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/20 text-[9px] sm:text-[10px] font-mono font-black text-amber-300">
                        {currentTierDetails.discountBadge}
                      </span>
                    )}
                    <div className={`px-2.5 py-1 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md flex items-center gap-1 ${theme.badgeBg}`}>
                      {loyalty.tier === 'STUDENT' ? (
                        <GraduationCap className="w-3.5 h-3.5" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{loyalty.tier === 'STUDENT' ? (isAr ? 'طالب جامعي' : 'ÉTUDIANT') : loyalty.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: EMV Chip & Counter or Status */}
                <div className="flex items-center justify-between">
                  {/* Gold / Metallic Smart Chip Graphic */}
                  <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border border-yellow-100/60 shadow-inner flex flex-col justify-around p-1 relative overflow-hidden">
                    <div className="w-full h-[1px] bg-amber-900/40" />
                    <div className="w-full h-[1px] bg-amber-900/40" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-900/40" />
                  </div>

                  {/* Quick Stamp Counter on Card */}
                  <div className="text-right">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300 block">
                      {isAr ? 'الدورات المكتملة' : 'Formations Validées'}
                    </span>
                    <div className="flex items-baseline justify-end gap-1 font-mono font-black">
                      <span className="text-xl sm:text-2xl text-white">{loyalty.paidCoursesCount}</span>
                      <span className="text-xs text-slate-400">/ 14</span>
                    </div>
                  </div>
                </div>

                {/* Active / Inactive Status Banner */}
                {!loyalty.hasActiveCard && (
                  <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin" />
                    <span>
                      {loyalty.cardStatus === 'pending'
                        ? (isAr ? 'طلبك قيد مراجعة الأدمين للتفعيل ⏳' : 'Demande en attente de validation ⏳')
                        : (isAr ? 'اطلب بطاقتك أولاً من النموذج بالأسفل (ستوندار أو طالب)' : 'Demandez d’abord votre carte ci-dessous')}
                    </span>
                  </div>
                )}

                {/* Bottom Row: Member Name, ID, & Verification Seal */}
                <div className="pt-2 border-t border-white/10 flex items-end justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                      {isAr ? (loyalty.tier === 'STUDENT' ? 'اسم الطالب' : 'اسم العضو') : 'Titulaire'}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white truncate tracking-wide">
                      {loyalty.customCardName || clientName || (loyalty.tier === 'STUDENT' ? 'طالب جامعي' : 'Ingénieur')}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300/90 font-bold truncate">
                      {loyalty.memberId}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {loyalty.hasActiveCard ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/40 border border-white/10 text-[9px] sm:text-[10px] text-emerald-300 font-bold">
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                        <span>{isAr ? 'مؤكدة رسميـاً' : 'Active'}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[9px] sm:text-[10px] text-amber-300 font-bold">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{loyalty.cardStatus === 'pending' ? (isAr ? 'قيد التدقيق' : 'En attente') : (isAr ? 'غير مفعلة' : 'Inactive')}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Points Progress Widget below Card in Card View */}
          {activeTab === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">⭐</span>
                  <span className="text-xs font-bold text-white">
                    {isAr ? 'نقاط التفاعل' : 'Points'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-xs">
                    {loyalty.points || 0} {isAr ? 'نقطة' : 'pts'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPointsDetails(!showPointsDetails)}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    {showPointsDetails ? (isAr ? 'إخفاء ▴' : 'Masquer ▴') : (isAr ? 'مزيد من المعلومات ▾' : 'Plus d’infos ▾')}
                  </button>
                </div>
              </div>

              {showPointsDetails && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {loyalty.tier === 'GOLDEN'
                        ? (isAr ? '👑 بلغت أعلى مرتبة ذهبية VIP!' : 'Niveau maximal atteint !')
                        : (isAr ? `كل دخلة للموقع = +1 نقطة (الهدف: ${loyalty.pointsNextTierThreshold} نقطة)` : `+1 pt par visite (Objectif: ${loyalty.pointsNextTierThreshold})`)}
                    </span>
                    <span className="font-mono font-bold text-amber-300">{loyalty.pointsProgressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, loyalty.pointsProgressPercent))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DEDICATED POINTS TAB VIEW */}
          {activeTab === 'points' && (
            <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
                    ⭐
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      {isAr ? 'نقاط التفاعل والترقية' : 'Points de Visites'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'كل دخلة = +1 نقطة' : '+1 pt / visite'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-amber-400 font-mono block">
                    {loyalty.points || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">{isAr ? 'نقطة' : 'pts'}</span>
                </div>
              </div>

              {/* Points Milestone Ladder */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {isAr ? 'سلم الترقية بالنقاط:' : 'Paliers par points :'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPointsDetails(!showPointsDetails)}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    {showPointsDetails ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من المعلومات ▾' : 'Plus d’infos ▾')}
                  </button>
                </div>

                {/* Compact Tier Chips */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${(loyalty.points || 0) >= 1000 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                    <span className="font-black block">PRO</span>
                    <span className="font-mono text-[11px] font-bold">1 000 ⭐</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${(loyalty.points || 0) >= 5000 ? 'bg-slate-200/15 border-slate-300/40 text-slate-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                    <span className="font-black block">SILVER</span>
                    <span className="font-mono text-[11px] font-bold">5 000 ⭐</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${(loyalty.points || 0) >= 10000 ? 'bg-amber-400/20 border-amber-400/50 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                    <span className="font-black block">GOLDEN</span>
                    <span className="font-mono text-[11px] font-bold">10 000 ⭐</span>
                  </div>
                </div>

                {showPointsDetails && (
                  <div className="space-y-2 pt-2 animate-in fade-in duration-200 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span>PRO (1000 ⭐): {isAr ? 'تخفيض 20% + دورة رابعة مجاناً' : '20% + 4ème cours offert'}</span>
                      <span className="font-mono text-amber-400">{(loyalty.points || 0) >= 1000 ? '✅' : `-${Math.max(0, 1000 - (loyalty.points || 0))}`}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span>SILVER (5000 ⭐): {isAr ? 'تخفيض 20% + تدقيق مشاريع' : '20% + Audit'}</span>
                      <span className="font-mono text-slate-300">{(loyalty.points || 0) >= 5000 ? '✅' : `-${Math.max(0, 5000 - (loyalty.points || 0))}`}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span>GOLDEN (10000 ⭐): {isAr ? 'تخفيض 30% + شيتات إكسل ودعم' : '30% + Excel & Support'}</span>
                      <span className="font-mono text-amber-300">{(loyalty.points || 0) >= 10000 ? '✅' : `-${Math.max(0, 10000 - (loyalty.points || 0))}`}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stamps' && (
            /* STAMPS GRID VIEW (14 PUNCHED HOLES) */
            <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'أختام الدورات المؤكدة (14 دورة هندسية)' : 'Tampons de Formations Validées'}</span>
                </h4>
                <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg">
                  {loyalty.paidCoursesCount} / 14 {isAr ? 'مكتملة' : 'acquis'}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {Array.from({ length: TOTAL_STAMPS }).map((_, idx) => {
                  const stampNumber = idx + 1;
                  const isChecked = stampNumber <= loyalty.paidCoursesCount;
                  const isTierMilestone = stampNumber === 3 || stampNumber === 5 || stampNumber === 14;

                  return (
                    <div
                      key={stampNumber}
                      className={`relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-center text-center transition-all ${
                        isChecked
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                          : 'bg-slate-950 border border-dashed border-slate-800 text-slate-500'
                      }`}
                    >
                      {/* Milestone Crown Indicator */}
                      {isTierMilestone && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-950 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[9px] font-bold">
                          ★
                        </div>
                      )}

                      {isChecked ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-[10px] font-mono font-black mt-1">
                            #{stampNumber}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-mono font-bold">{stampNumber}</span>
                          <span className="text-[9px] text-slate-600 mt-0.5">
                            {stampNumber === 3 ? 'PRO 🎁' : stampNumber === 5 ? 'SILVER' : stampNumber === 14 ? 'GOLD' : 'دورة'}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowStampsInfo(!showStampsInfo)}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  {showStampsInfo ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من المعلومات ▾' : 'Plus d’infos ▾')}
                </button>
              </div>
              {showStampsInfo && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'يتم تعليم كل دورة تلقائياً بعد تأكيد الأدمين، وعند 3 دورات تُفتح الدورة الرابعة مجاناً.'
                      : 'Chaque formation est validée après confirmation administrative.'}
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'perks' && (
            /* ALL TIERS COMPARISON VIEW */
            <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'دليل ميزات بطاقات العضوية والمستويات' : 'Guide des Avantages des Niveaux'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr ? 'تعرف على امتيازات بطاقتك الحالية وما ستحصل عليه عند الترقية.' : 'Découvrez les privilèges de chaque statut.'}
                  </p>
                </div>
              </div>

              {/* Tier selector pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['STANDARD', 'STUDENT', 'PRO', 'SILVER', 'GOLDEN'] as LoyaltyTier[]).map((t) => {
                  const tDetails = ALL_TIER_DETAILS[t];
                  const isCurrent = loyalty.tier === t;
                  const isSelected = selectedTierPreview === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTierPreview(t)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/30' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="text-xs font-black">{t}</span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {tDetails.threshold === 0 ? '0' : tDetails.threshold === 14 ? '14' : `${tDetails.threshold}+`} {isAr ? 'دورات' : 'cours'}
                      </span>
                      {isCurrent && (
                        <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          {isAr ? 'مستواك الحالي' : 'Actuel'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Tier Perks Card */}
              {(() => {
                const prevTheme = getTierTheme(selectedTierPreview);
                const prevDetails = ALL_TIER_DETAILS[selectedTierPreview];
                const isUserCurrent = loyalty.tier === selectedTierPreview;

                return (
                  <div className={`p-5 rounded-2xl border space-y-4 bg-slate-950/80 ${prevTheme.borderColor}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${prevTheme.badgeBg}`}>
                            {selectedTierPreview}
                          </span>
                          <h5 className="text-sm font-black text-white">
                            {isAr ? prevDetails.nameAr : prevDetails.nameFr}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {isAr ? prevDetails.summaryAr : prevDetails.summaryFr}
                        </p>
                      </div>

                      {prevDetails.discountBadge && (
                        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold self-start sm:self-auto">
                          {prevDetails.discountBadge}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isAr ? 'قائمة الامتيازات والمكافآت المضمونة:' : 'Privilèges & Récompenses :'}
                      </span>

                      <div className="space-y-2">
                        {prevDetails.perks.map((perk) => {
                          const isExpanded = expandedPerkId === perk.id;
                          return (
                            <div 
                              key={perk.id}
                              className={`p-3 rounded-xl border transition-all ${
                                perk.isHighlight
                                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                  <h6 className="text-xs font-bold text-white flex items-center gap-2">
                                    <span>{isAr ? perk.titleAr : perk.titleFr}</span>
                                    {perk.isHighlight && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                        {isAr ? 'ميزة حصرية' : 'Exclusif'}
                                      </span>
                                    )}
                                  </h6>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedPerkId(isExpanded ? null : perk.id)}
                                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
                                >
                                  {isExpanded ? (isAr ? 'إخفاء' : 'Fermer') : (isAr ? 'تفاصيل ▾' : 'Détails ▾')}
                                </button>
                              </div>
                              {isExpanded && (
                                <p className="text-[11px] text-slate-400 leading-relaxed pt-2 mt-2 border-t border-slate-800/60 pr-7">
                                  {isAr ? perk.descAr : perk.descFr}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick Perks Teaser under Card (Collapsed by default for clean UI) */}
          {activeTab === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? `ميزات (${loyalty.tier})` : `Avantages (${loyalty.tier})`}</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCardPerks(!showCardPerks)}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    {showCardPerks ? (isAr ? 'إخفاء ▴' : 'Masquer ▴') : (isAr ? 'مزيد من المعلومات ▾' : 'Plus d’infos ▾')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('perks');
                      setSelectedTierPreview(loyalty.tier);
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{isAr ? 'كل الرتب' : 'Niveaux'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {showCardPerks && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 animate-in fade-in duration-200">
                  {currentTierDetails.perks.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-bold text-slate-200 text-[11px]">{isAr ? p.titleAr : p.titleFr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Reward Claim & Tier Progression (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* FREE COURSE REWARD BOX (when paidCoursesCount >= 3) */}
          {loyalty.eligibleForFreeGift ? (
            <div className="relative rounded-3xl p-6 bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-emerald-500/20 border-2 border-amber-500/50 shadow-xl space-y-4 overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                  <Gift className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                    {isAr ? 'مكافأة العضوية مفعلة ومتاحة الآن' : 'Récompense Débloquée !'}
                  </span>
                  <h4 className="text-base font-black text-white">
                    {isAr ? 'مبروك! يحق لك دورة مجانية هدية' : 'Votre Formation Gratuite est prête'}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? `بما أنك اشتريت ${loyalty.paidCoursesCount} دورات مؤكدة، يحق لك الآن اختيار أي دورة هندسية واستلامها كهدية مجانية 100% من إدارة المنصة.`
                  : `Félicitations pour vos ${loyalty.paidCoursesCount} formations. Réclamez votre cours offert dès maintenant.`}
              </p>

              {/* Voucher Code Chip */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/40 flex items-center justify-between text-xs">
                <span className="text-slate-400">{isAr ? 'كود المكافأة:' : 'Code :'}</span>
                <span className="font-mono font-black text-amber-300">{rewardVoucherCode}</span>
              </div>

              {/* WhatsApp Claim Button */}
              <a
                href={whatsappClaimUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>{isAr ? 'استلام الدورة المجانية عبر الواتساب' : 'Réclamer ma formation gratuite'}</span>
              </a>
            </div>
          ) : (
            /* Motivational Tracker when < 3 courses - Minimal */
            <div className="rounded-2xl p-5 bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      {isAr ? 'هدية الدورة الرابعة' : '4ème cours offert'}
                    </h4>
                    <p className="text-[11px] text-amber-400 font-bold">
                      {isAr
                        ? `متبقي ${3 - loyalty.paidCoursesCount} دورات`
                        : `Encore ${3 - loyalty.paidCoursesCount} cours`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {loyalty.paidCoursesCount}/3
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (loyalty.paidCoursesCount / 3) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* TIER LEVEL ROADMAP */}
          <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {isAr ? 'خارطة مستويات العضوية والترقية' : 'Évolution des Niveaux'}
              </span>
              <button
                onClick={() => setActiveTab('perks')}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300"
              >
                {isAr ? 'تفاصيل الميزات' : 'Détails'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Level 1: PRO (3 courses) */}
              <div 
                onClick={() => { setActiveTab('perks'); setSelectedTierPreview('PRO'); }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 ${
                  loyalty.paidCoursesCount >= 3
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <span className="block">{isAr ? 'مستوى GC58 PRO (دورة مجانية هدية)' : 'Niveau PRO (1 cours offert)'}</span>
                    <span className="text-[10px] text-slate-400 block">{isAr ? 'خصم 10% دائم وشيتات إكسل' : 'Remise 10% & Excel'}</span>
                  </div>
                </div>
                {loyalty.paidCoursesCount >= 3 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              {/* Level 2: SILVER (5 courses) */}
              <div 
                onClick={() => { setActiveTab('perks'); setSelectedTierPreview('SILVER'); }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-slate-400/60 ${
                  loyalty.paidCoursesCount >= 5
                    ? 'bg-slate-300/15 border-slate-300/40 text-slate-100 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-300 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    5
                  </span>
                  <div>
                    <span className="block">{isAr ? 'مستوى SILVER (تخفيض 20% وتدقيق مشاريع)' : 'Niveau SILVER (Avantages VIP)'}</span>
                    <span className="text-[10px] text-slate-400 block">{isAr ? 'أولوية مراجعة مشاريع التخرج والعمل' : 'Audit de projets réels'}</span>
                  </div>
                </div>
                {loyalty.paidCoursesCount >= 5 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              {/* Level 3: GOLDEN (14 courses) */}
              <div 
                onClick={() => { setActiveTab('perks'); setSelectedTierPreview('GOLDEN'); }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-yellow-400/60 ${
                  loyalty.paidCoursesCount >= 14
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-yellow-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    14
                  </span>
                  <div>
                    <span className="block">{isAr ? 'مستوى GOLDEN (الوصول الشامل الأبدي)' : 'Niveau GOLDEN (Accès Total à Vie)'}</span>
                    <span className="text-[10px] text-slate-400 block">{isAr ? 'كافة الـ 14 دورة مجاناً مدى الحياة + استشارات' : '14 cours à vie'}</span>
                  </div>
                </div>
                {loyalty.paidCoursesCount >= 14 ? (
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

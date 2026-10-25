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
  Headphones
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
  
  const [activeTab, setActiveTab] = useState<'card' | 'stamps' | 'perks'>('card');
  const [showPerksModal, setShowPerksModal] = useState(false);
  const [selectedTierPreview, setSelectedTierPreview] = useState<LoyaltyTier>(loyalty.tier);

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
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black mb-1.5">
            <Crown className="w-3.5 h-3.5" />
            <span>{isAr ? 'برنامج الولاء والعضوية الحصرية' : 'Programme de Fidélité VIP'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'بطاقة العضوية الرسمية GC58 PRO' : 'Carte d’Adhérent Officielle'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'تُسجل البطاقة تلقائياً كافة الدورات المسددة والمؤكدة من طرف الأدمين وتمنحك ترقيات ومكافآت مجانية.'
              : 'Votre carte comptabilise vos formations validées par l’administration et débloque vos récompenses.'}
          </p>
        </div>

        {/* View Switcher: Card, Stamps Grid, or Perks List */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
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
            <span>{isAr ? 'ميزات المستويات' : 'Avantages'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card & Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: The 3D Luxury Metallic Card OR Stamps Grid OR Perks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'card' && (
            <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl border transition-all duration-300 group hover:scale-[1.01] ${theme.borderColor} ${theme.glowColor}`}>
              
              {/* Metallic Brushed Texture Backdrop */}
              <div className={`absolute inset-0 ${theme.metalTexture}`} />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10 pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              {/* Card Foreground Content */}
              <div className="relative z-10 flex flex-col justify-between h-[250px] sm:h-[280px]">
                
                {/* Top Row: Brand & Tier Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-lg tracking-wider text-white">GC58</span>
                        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          FORMATION
                        </span>
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                        Civil Engineering Academy
                      </span>
                    </div>
                  </div>

                  {/* Tier Badge & Discount */}
                  <div className="flex items-center gap-1.5">
                    {currentTierDetails.discountBadge && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/20 text-[10px] font-mono font-black text-amber-300">
                        {currentTierDetails.discountBadge}
                      </span>
                    )}
                    <div className={`px-3 py-1 rounded-xl font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 ${theme.badgeBg}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{loyalty.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: EMV Chip & Holographic Stamps Bar */}
                <div className="flex items-center justify-between">
                  {/* Gold / Metallic Smart Chip Graphic */}
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border border-yellow-100/60 shadow-inner flex flex-col justify-around p-1 relative overflow-hidden">
                    <div className="w-full h-[1px] bg-amber-900/40" />
                    <div className="w-full h-[1px] bg-amber-900/40" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-900/40" />
                  </div>

                  {/* Quick Stamp Counter on Card */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">
                      {isAr ? 'الدورات المكتملة' : 'Formations Validées'}
                    </span>
                    <div className="flex items-baseline justify-end gap-1 font-mono font-black">
                      <span className="text-2xl text-white">{loyalty.paidCoursesCount}</span>
                      <span className="text-xs text-slate-400">/ 14</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Member Name, ID, & Verification Seal */}
                <div className="pt-2 border-t border-white/10 flex items-end justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                      {isAr ? 'اسم المهندس العضو' : 'Titulaire de la Carte'}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white truncate tracking-wide">
                      {clientName || 'Ingénieur Étudiant'}
                    </h3>
                    <p className="text-[11px] font-mono tracking-widest text-amber-300/90 font-bold">
                      {loyalty.memberId}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] text-emerald-300 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAr ? 'مؤكدة رسميـاً' : 'Officiel CTC'}</span>
                    </div>
                  </div>
                </div>

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

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'يتم تعليم وتكويش كل دورة تلقائياً بمجرد تأكيد الأدمين لحالة الدفع (Payé). عند الوصول لـ 3 دورات يتم فتح الدورة الرابعة مجاناً.'
                    : 'Chaque formation est validée dès confirmation du paiement par l’administration.'}
                </span>
              </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['STANDARD', 'PRO', 'SILVER', 'GOLDEN'] as LoyaltyTier[]).map((t) => {
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
                        {prevDetails.perks.map((perk) => (
                          <div 
                            key={perk.id}
                            className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                              perk.isHighlight
                                ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                                : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                            }`}
                          >
                            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <h6 className="text-xs font-bold text-white flex items-center gap-2">
                                <span>{isAr ? perk.titleAr : perk.titleFr}</span>
                                {perk.isHighlight && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                    {isAr ? 'ميزة حصرية' : 'Exclusif'}
                                  </span>
                                )}
                              </h6>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {isAr ? perk.descAr : perk.descFr}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick Perks Teaser under Card (always visible when card is active) */}
          {activeTab === 'card' && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? `ميزات بطاقتك الحالية (${loyalty.tier}):` : `Vos avantages actuels (${loyalty.tier}) :`}</span>
                </span>
                <button
                  onClick={() => {
                    setActiveTab('perks');
                    setSelectedTierPreview(loyalty.tier);
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>{isAr ? 'عرض مقارنة المستويات' : 'Voir tous les niveaux'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentTierDetails.perks.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">{isAr ? p.titleAr : p.titleFr}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{isAr ? p.descAr : p.descFr}</span>
                    </div>
                  </div>
                ))}
              </div>
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
            /* Motivational Tracker when < 3 courses */
            <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {isAr ? 'كيف تحصل على دورتك المجانية؟' : 'Comment obtenir votre cours gratuit ?'}
                  </h4>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">
                    {isAr
                      ? `بقيت لك ${3 - loyalty.paidCoursesCount} دورات فقط لفتح الدورة الهدية!`
                      : `Plus que ${3 - loyalty.paidCoursesCount} formation(s) pour le cadeau.`}
                  </p>
                </div>
              </div>

              {/* Progress Bar to 3 courses */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{loyalty.paidCoursesCount} / 3 {isAr ? 'دورات مسددة' : 'cours'}</span>
                  <span className="text-amber-400 font-bold">{Math.round((loyalty.paidCoursesCount / 3) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (loyalty.paidCoursesCount / 3) * 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr
                  ? 'بمجرد أن تقوم بتسديد 3 دورات ويؤكدها الأدمين في سجلك، ستترقى إلى عضوية GC58 PRO وتحصل فوراً على دورة مجانية من اختيارك.'
                  : 'Atteignez 3 formations payées pour débloquer votre statut PRO et votre formation offerte.'}
              </p>
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

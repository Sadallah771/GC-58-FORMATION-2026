import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Crown, 
  Sparkles, 
  Award, 
  Search, 
  Download, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Gift, 
  Filter, 
  Building2, 
  MapPin, 
  BookOpen, 
  Eye, 
  X,
  CreditCard,
  Mail,
  GraduationCap,
  Clock,
  AlertTriangle,
  Trash2,
  Check,
  PhoneCall
} from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Language, Registration, LoyaltyTier, MemberCardRequest } from '../types';
import { 
  aggregateClientsLoyalty, 
  ClientSummaryWithLoyalty, 
  getTierTheme, 
  ALL_TIER_DETAILS 
} from '../utils/loyaltyHelper';

interface AdminMembersManagerProps {
  language: Language;
  orders: Registration[];
  sitePhone: string;
}

export const AdminMembersManager: React.FC<AdminMembersManagerProps> = ({
  language,
  orders,
  sitePhone,
}) => {
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | LoyaltyTier | 'gift_eligible'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientSummaryWithLoyalty | null>(null);

  // Real-time Card Requests (Student Cards & Standard Cards submitted by users)
  const [cardRequests, setCardRequests] = useState<MemberCardRequest[]>([]);
  const [cardFilter, setCardFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [viewingCardImage, setViewingCardImage] = useState<{ url: string; studentName: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'card_requests'), (snapshot) => {
        const loaded: MemberCardRequest[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...(d.data() as MemberCardRequest) });
        });
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCardRequests(loaded);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Card requests listener:', e);
    }
  }, []);

  const handleApproveCard = async (reqId: string, studentName: string) => {
    try {
      await updateDoc(doc(db, 'card_requests', reqId), {
        status: 'approved',
        approvedAt: new Date().toISOString(),
      });
      setActionSuccess(isAr ? `تمت المصادقة وتفعيل بطاقة (${studentName}) بنجاح! ✅` : `Carte validée avec succès pour ${studentName} !`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error('Approve error:', err);
      alert(isAr ? 'حدث خطأ أثناء المصادقة' : 'Erreur de validation');
    }
  };

  const handleRejectCard = async (reqId: string, studentName: string) => {
    if (!window.confirm(isAr ? `هل أنت متأكد من رفض طلب بطاقة ${studentName}؟` : `Rejeter la demande de ${studentName} ?`)) {
      return;
    }
    try {
      await updateDoc(doc(db, 'card_requests', reqId), {
        status: 'rejected',
      });
      setActionSuccess(isAr ? `تم رفض طلب بطاقة (${studentName})` : `Demande rejetée`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleDeleteCardRequest = async (reqId: string) => {
    if (!window.confirm(isAr ? 'حذف هذا الطلب نهائياً من السجل؟' : 'Supprimer définitivement cette demande ?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'card_requests', reqId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Aggregate all unique clients from all orders
  const allClients = useMemo(() => aggregateClientsLoyalty(orders), [orders]);

  // Compute live statistics
  const stats = useMemo(() => {
    let goldenCount = 0;
    let silverCount = 0;
    let proCount = 0;
    let standardCount = 0;
    let giftEligibleCount = 0;
    let totalRevenue = 0;

    allClients.forEach((c) => {
      totalRevenue += c.totalPaidAmount;
      if (c.loyalty.tier === 'GOLDEN') goldenCount++;
      else if (c.loyalty.tier === 'SILVER') silverCount++;
      else if (c.loyalty.tier === 'PRO') proCount++;
      else standardCount++;

      if (c.loyalty.eligibleForFreeGift) giftEligibleCount++;
    });

    return {
      total: allClients.length,
      goldenCount,
      silverCount,
      proCount,
      standardCount,
      giftEligibleCount,
      totalRevenue,
    };
  }, [allClients]);

  // Filter clients based on search and tier filter
  const filteredClients = useMemo(() => {
    return allClients.filter((c) => {
      // Tier filter
      if (tierFilter === 'gift_eligible') {
        if (!c.loyalty.eligibleForFreeGift) return false;
      } else if (tierFilter !== 'all') {
        if (c.loyalty.tier !== tierFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.fullName.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone.includes(q);
        const matchWilaya = c.wilaya.toLowerCase().includes(q);
        const matchMemberId = c.loyalty.memberId.toLowerCase().includes(q);
        const matchCourse = c.coursesList.some((crs) => crs.toLowerCase().includes(q));
        if (!matchName && !matchEmail && !matchPhone && !matchWilaya && !matchMemberId && !matchCourse) {
          return false;
        }
      }

      return true;
    });
  }, [allClients, tierFilter, searchQuery]);

  // Export Members List to Excel
  const exportMembersToExcel = () => {
    if (filteredClients.length === 0) {
      alert(isAr ? 'لا يوجد أعضاء في القائمة الحالية لتصديرهم' : 'Aucun membre à exporter');
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const tableRows = filteredClients.map((c, idx) => {
      const tierInfo = ALL_TIER_DETAILS[c.loyalty.tier];
      const tierLabel = isAr ? tierInfo.nameAr : tierInfo.nameFr;
      const discountLabel = tierInfo.discountBadge || '10% Réduction';
      const formattedDate = c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleString('fr-FR') : '';
      const giftStatus = c.loyalty.eligibleForFreeGift ? 'نعم - مستحق لدورة هدية 🎁' : `ينقصه ${Math.max(0, 3 - c.loyalty.paidCoursesCount)} دورات`;
      const allCourses = c.coursesList.join(' | ');
      const perksSummary = tierInfo.perks.map((p) => isAr ? p.titleAr : p.titleFr).join(' • ');

      return `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold; background-color: #f1f5f9;">${c.loyalty.memberId}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${c.fullName}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@';">${c.phone}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${c.email}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${c.wilaya}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold; color: #b45309;">${c.loyalty.tier} (${tierLabel})</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold; color: #047857;">${discountLabel}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${c.loyalty.paidCoursesCount} / 14</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${giftStatus}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: bold;">${c.totalPaidAmount.toLocaleString()} DZD</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${perksSummary}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${allCourses}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${formattedDate}</td>
        </tr>
      `;
    }).join('');

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Membres GC58 Loyalty</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body dir="${isAr ? 'rtl' : 'ltr'}">
        <h2 style="font-family: Arial; color: #1e293b;">سجل أعضاء الموقع وبطاقات الولاء GC58 - بتأكيد الأدمين</h2>
        <p style="font-family: Arial; color: #64748b;">تاريخ التصدير: ${new Date().toLocaleString()} | إجمالي الأعضاء: ${filteredClients.length}</p>
        <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px; width: 100%;">
          <thead>
            <tr style="background-color: #1e293b; color: #ffffff;">
              <th style="padding: 10px; border: 1px solid #334155;">رقم العضوية</th>
              <th style="padding: 10px; border: 1px solid #334155;">اسم المهندس</th>
              <th style="padding: 10px; border: 1px solid #334155;">رقم الهاتف</th>
              <th style="padding: 10px; border: 1px solid #334155;">البريد الإلكتروني</th>
              <th style="padding: 10px; border: 1px solid #334155;">الولاية</th>
              <th style="padding: 10px; border: 1px solid #334155;">مستوى البطاقة (Niveau)</th>
              <th style="padding: 10px; border: 1px solid #334155;">نسبة التخفيض المكتسبة</th>
              <th style="padding: 10px; border: 1px solid #334155;">الدورات المؤكدة (Payé)</th>
              <th style="padding: 10px; border: 1px solid #334155;">استحقاق الدورة المجانية</th>
              <th style="padding: 10px; border: 1px solid #334155;">إجمالي المبالغ المسددة</th>
              <th style="padding: 10px; border: 1px solid #334155;">ميزات وامتيازات المستوى</th>
              <th style="padding: 10px; border: 1px solid #334155;">الدورات المقتناة</th>
              <th style="padding: 10px; border: 1px solid #334155;">آخر طلب</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GC58_Membres_Cartes_Loyalty_${dateStr}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* SECTION 1: INCOMING STUDENT & STANDARD CARD REQUESTS */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black mb-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>{isAr ? 'طلبات بطاقات الطلاب والأعضاء الواردة' : 'Demandes de Cartes Reçues'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                {cardRequests.filter(r => r.status === 'pending').length} {isAr ? 'جديدة' : 'nouvelles'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {isAr ? 'مصادقة وتفعيل بطاقات الطلاب والـ Standard' : 'Validation & Activation des Cartes'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'تحقق من مطابقة اسم الطالب الحقيقي مع صورة بطاقة الطالب الجامعية المرفوعة واضغط "قبول وتفعيل البطاقة".'
                : 'Vérifiez la concordance du nom réel avec la carte d’étudiant et validez.'}
            </p>
          </div>

          {/* Filter tabs for card requests */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setCardFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                cardFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'قيد المراجعة ⏳' : 'En attente'} ({cardRequests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setCardFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                cardFilter === 'approved'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'المعتمدة ✅' : 'Validées'} ({cardRequests.filter(r => r.status === 'approved').length})
            </button>
            <button
              onClick={() => setCardFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                cardFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'الكل' : 'Tous'} ({cardRequests.length})
            </button>
          </div>
        </div>

        {/* Requests Cards List */}
        {cardRequests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center text-xs text-slate-400">
            {isAr ? 'لا توجد طلبات بطاقات مرسلة حالياً.' : 'Aucune demande de carte pour le moment.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardRequests
              .filter(r => cardFilter === 'all' || r.status === cardFilter)
              .map((req) => (
                <div
                  key={req.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    req.status === 'approved'
                      ? 'bg-slate-950/80 border-emerald-500/30'
                      : req.status === 'rejected'
                      ? 'bg-slate-950/50 border-rose-900/40 opacity-70'
                      : 'bg-slate-950 border-amber-500/40 ring-1 ring-amber-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        req.tierRequested === 'STUDENT'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {req.tierRequested === 'STUDENT' ? <GraduationCap className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-white">{req.fullName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          req.tierRequested === 'STUDENT'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}>
                          {req.tierRequested === 'STUDENT' ? (isAr ? 'طلب بطاقة طالب جامعي (PRO 20%) 🎓' : 'Carte Étudiant PRO (20%)') : (isAr ? 'طلب بطاقة ستوندار (10%) 💳' : 'Carte Standard (10%)')}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {req.status === 'approved' ? (isAr ? 'معتمدة ومفعلة ✅' : 'Validée') : req.status === 'rejected' ? (isAr ? 'مرفوضة ❌' : 'Rejetée') : (isAr ? 'في الانتظار ⏳' : 'En attente')}
                    </span>
                  </div>

                  {req.university && (
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold">{req.university}</span>
                    </div>
                  )}

                  {/* Student Card Photo Preview */}
                  {req.studentCardImageUrl && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {isAr ? 'صورة بطاقة الطالب الجامعية المرفوعة (اضغط للتكبير والفحص):' : 'Photo de la carte d’étudiant :'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingCardImage({ url: req.studentCardImageUrl!, studentName: req.fullName })}
                        className="w-full relative h-36 rounded-xl overflow-hidden border border-emerald-500/40 group hover:border-emerald-400 transition-colors bg-black"
                      >
                        <img
                          src={req.studentCardImageUrl}
                          alt="Student Card"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 flex items-center justify-center transition-colors">
                          <span className="px-3 py-1 rounded-xl bg-slate-950/80 text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-500/30 shadow-lg">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تكبير وفحص الاسم' : 'Agrandir'}</span>
                          </span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Direct Contact Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <a
                      href={`tel:${req.phone}`}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      title={req.phone}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span dir="ltr" className="font-mono">{req.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/${req.phone.replace(/^0/, '213')}?text=${encodeURIComponent(
                        isAr
                          ? `السلام عليكم ${req.fullName}، بخصوص طلب بطاقتك في منصة GC58 FORMATIONS...`
                          : `Bonjour ${req.fullName}, concernant votre carte GC58...`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-[#25D366]" />
                      <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    {req.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => req.id && handleApproveCard(req.id, req.fullName)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isAr ? 'قبول وتفعيل البطاقة فوراً' : 'Valider la carte'}</span>
                      </button>
                    )}

                    {req.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => req.id && handleRejectCard(req.id, req.fullName)}
                        className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {isAr ? 'رفض' : 'Rejeter'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => req.id && handleDeleteCardRequest(req.id)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                      title={isAr ? 'حذف من السجل' : 'Supprimer'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* SECTION 2: TOP BANNER & MEMBERS LIST */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black mb-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isAr ? 'لوحة تحكم بطاقات العملاء ومستويات الولاء' : 'Suivi des Cartes & Niveaux Membres'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'الأعضاء المسجلون وبطاقاتهم في الموقع' : 'Membres Inscrits & Statuts VIP'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'متابعة شاملة لكل مهندس وطالب مسجل بالموقع: مستوى بطاقته، دوراته المؤكدة، واستحقاقه للدورة المجانية.'
              : 'Supervision complète de chaque membre : niveau de carte, formations validées et cadeaux.'}
          </p>
        </div>

        {/* Excel Export Button */}
        <button
          onClick={exportMembersToExcel}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{isAr ? 'تصدير جدول الأعضاء (Excel)' : 'Exporter Membres (Excel)'}</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Members */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">{isAr ? 'إجمالي الأعضاء' : 'Total Membres'}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.total}</div>
          <span className="text-[10px] text-slate-500">{isAr ? 'طالب ومهندس مسجل' : 'inscrits'}</span>
        </div>

        {/* Golden Members */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/30">
          <div className="flex items-center justify-between text-yellow-300 mb-1">
            <span className="text-[11px] font-black">{isAr ? 'بطاقة GOLDEN' : 'Niveau GOLD'}</span>
            <Crown className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-400 font-mono">{stats.goldenCount}</div>
          <span className="text-[10px] text-yellow-200/80">{isAr ? '14 دورة مؤكدة' : '14 cours'}</span>
        </div>

        {/* Silver Members */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-300/10 to-slate-400/10 border border-slate-400/30">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-[11px] font-black">{isAr ? 'بطاقة SILVER' : 'Niveau SILVER'}</span>
            <Award className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-2xl font-black text-slate-200 font-mono">{stats.silverCount}</div>
          <span className="text-[10px] text-slate-400">{isAr ? '5+ دورات مؤكدة' : '5+ cours'}</span>
        </div>

        {/* Pro Members */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-700/10 border border-amber-500/30">
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="text-[11px] font-black">{isAr ? 'بطاقة GC58 PRO' : 'Niveau PRO'}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{stats.proCount}</div>
          <span className="text-[10px] text-amber-300/80">{isAr ? '3+ دورات مؤكدة' : '3+ cours'}</span>
        </div>

        {/* Standard Members */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">{isAr ? 'عضو مسجل' : 'Standard'}</span>
            <ShieldCheck className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-300 font-mono">{stats.standardCount}</div>
          <span className="text-[10px] text-slate-500">{isAr ? 'أقل من 3 دورات' : '< 3 cours'}</span>
        </div>

        {/* Free Gift Eligible */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-700/10 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-[11px] font-black">{isAr ? 'مستحقو الهدية 🎁' : 'Éligibles Cadeau'}</span>
            <Gift className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{stats.giftEligibleCount}</div>
          <span className="text-[10px] text-emerald-300/80">{isAr ? 'يحق لهم دورة هدية' : 'cours offert'}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث بالاسم، رقم الهاتف، البريد، الولاية، أو رقم العضوية (GC58-XXXX)...' : 'Rechercher par nom, tél, email, wilaya ou ID...'}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tier Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tierFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {isAr ? `الكل (${allClients.length})` : `Tous (${allClients.length})`}
            </button>

            <button
              onClick={() => setTierFilter('GOLDEN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                tierFilter === 'GOLDEN'
                  ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-950 text-yellow-400/80 hover:text-yellow-300 border border-yellow-500/30'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>GOLDEN ({stats.goldenCount})</span>
            </button>

            <button
              onClick={() => setTierFilter('SILVER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                tierFilter === 'SILVER'
                  ? 'bg-slate-200 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>SILVER ({stats.silverCount})</span>
            </button>

            <button
              onClick={() => setTierFilter('PRO')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                tierFilter === 'PRO'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>PRO ({stats.proCount})</span>
            </button>

            <button
              onClick={() => setTierFilter('STANDARD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tierFilter === 'STANDARD'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {isAr ? `STANDARD (${stats.standardCount})` : `STANDARD (${stats.standardCount})`}
            </button>

            <button
              onClick={() => setTierFilter('gift_eligible')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                tierFilter === 'gift_eligible'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <Gift className="w-3 h-3" />
              <span>{isAr ? `مستحق للهدية (${stats.giftEligibleCount})` : `Cadeau (${stats.giftEligibleCount})`}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Members Cards / Table */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
          <Users className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <h4 className="text-base font-bold text-white">
            {isAr ? 'لم يتم العثور على أعضاء مطابقين للبحث' : 'Aucun membre trouvé'}
          </h4>
          <p className="text-xs text-slate-500">
            {isAr ? 'جرّب تغيير كلمة البحث أو فلتر المستوى.' : 'Modifiez vos filtres de recherche.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const theme = getTierTheme(client.loyalty.tier);
            const tierDetails = ALL_TIER_DETAILS[client.loyalty.tier];
            const cleanPhone = client.phone.replace(/^0/, '213').replace(/\s+/g, '');
            const whatsappMsg = encodeURIComponent(
              isAr
                ? `السلام عليكم مهندس ${client.fullName}، معك إدارة منصة GC58 FORMATIONS. نبارك لك وصولك لمستوى ${theme.nameAr} برقم عضوية (${client.loyalty.memberId}). رصيدك حالياً ${client.loyalty.paidCoursesCount} دورات مؤكدة.${
                    client.loyalty.eligibleForFreeGift ? ' نود إعلامك أن دورتك المجانية جاهزة للاستلام!' : ''
                  }`
                : `Bonjour ${client.fullName}, félicitations pour votre niveau ${theme.nameFr} (${client.loyalty.memberId}). Vous avez ${client.loyalty.paidCoursesCount} formations validées.`
            );
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

            return (
              <div
                key={client.clientId}
                className={`rounded-2xl p-5 border bg-slate-900/90 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between space-y-4 group ${theme.borderColor} hover:shadow-xl`}
              >
                {/* Header: Member ID & Tier Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold block">
                      {client.loyalty.memberId}
                    </span>
                    <h4 className="text-sm font-black text-white mt-0.5 truncate max-w-[200px]" title={client.fullName}>
                      {client.fullName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <span className="text-amber-400 font-mono font-bold" dir="ltr">{client.phone}</span>
                      <span>•</span>
                      <span className="text-slate-300 truncate max-w-[150px]" title={client.email}>{client.email}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{client.wilaya}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm ${theme.badgeBg}`}>
                      {client.loyalty.tier === 'GOLDEN' ? <Crown className="w-3 h-3" /> :
                       client.loyalty.tier === 'SILVER' ? <Award className="w-3 h-3" /> :
                       client.loyalty.tier === 'PRO' ? <Sparkles className="w-3 h-3" /> : null}
                      <span>{client.loyalty.tier}</span>
                    </span>
                    {tierDetails.discountBadge && (
                      <span className="text-[10px] text-amber-300 font-mono font-bold block mt-1">
                        {tierDetails.discountBadge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {client.loyalty.paidCoursesCount} / 14 {isAr ? 'مؤكدة' : 'cours'}
                    </span>
                  </div>
                </div>

                {/* Middle: Courses and Free Gift Status */}
                <div className="space-y-2 text-xs">
                  {/* Free Gift Badge if eligible */}
                  {client.loyalty.eligibleForFreeGift ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-emerald-400 animate-bounce" />
                        <span>{isAr ? 'مستحق لدورة هدية 100% 🎁' : 'Formation offerte disponible'}</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">
                        PRO
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-between text-[11px]">
                      <span>{isAr ? 'الترقية التالية (PRO هدية):' : 'Objectif PRO :'}</span>
                      <span className="font-bold text-amber-400">
                        {isAr ? `ينقصه ${3 - client.loyalty.paidCoursesCount} دورات` : `reste ${3 - client.loyalty.paidCoursesCount} cours`}
                      </span>
                    </div>
                  )}

                  {/* Summary row: Orders count & Total paid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-500 block">{isAr ? 'الطلبات المسددة' : 'Payées'}</span>
                      <span className="font-black text-slate-200 font-mono text-xs">
                        {client.paidOrdersCount} / {client.totalOrdersCount} {isAr ? 'طلب' : 'cdes'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-500 block">{isAr ? 'إجمالي المبالغ' : 'Total payé'}</span>
                      <span className="font-black text-amber-300 font-mono text-xs">
                        {client.totalPaidAmount.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>

                  {/* Purchased Courses Preview */}
                  {client.coursesList.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {isAr ? 'الدورات المقتناة المسجلة:' : 'Formations suivies :'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {client.coursesList.slice(0, 3).map((crs, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium truncate max-w-[150px]"
                            title={crs}
                          >
                            {crs}
                          </span>
                        ))}
                        {client.coursesList.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-amber-400 font-bold">
                            +{client.coursesList.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions: WhatsApp & View Card Details */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'معاينة البطاقة' : 'Voir Carte'}</span>
                  </button>

                  {client.phone && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                      title={isAr ? 'مراسلة العضو على الواتساب' : 'WhatsApp'}
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span className="hidden sm:inline">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  )}

                  {client.phone && (
                    <a
                      href={`tel:${client.phone}`}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center justify-center transition-all"
                      title={isAr ? 'اتصال هاتف' : 'Appeler'}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      className="py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs flex items-center justify-center transition-all"
                      title={isAr ? 'إرسال بريد إلكتروني' : 'Envoyer un email'}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MEMBER DETAILS / CARD MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {selectedClient.loyalty.memberId}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedClient.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Metallic Card Simulation for Admin */}
            {(() => {
              const theme = getTierTheme(selectedClient.loyalty.tier);
              const tierDetails = ALL_TIER_DETAILS[selectedClient.loyalty.tier];

              return (
                <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl border ${theme.borderColor} ${theme.glowColor}`}>
                  <div className={`absolute inset-0 ${theme.metalTexture}`} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10 pointer-events-none" />

                  <div className="relative z-10 flex flex-col justify-between h-[230px]">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-amber-400" />
                        <span className="font-black text-white tracking-wider">GC58 FORMATION</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tierDetails.discountBadge && (
                          <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/20 text-[10px] font-mono font-bold text-amber-300">
                            {tierDetails.discountBadge}
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-xl font-black text-xs uppercase shadow-md ${theme.badgeBg}`}>
                          {selectedClient.loyalty.tier}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border border-yellow-100/60 shadow-inner" />
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-300 block">
                          {isAr ? 'الدورات المعتمدة' : 'Formations'}
                        </span>
                        <span className="text-2xl font-black text-white font-mono">
                          {selectedClient.loyalty.paidCoursesCount} / 14
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                          {isAr ? 'اسم المهندس' : 'Titulaire'}
                        </span>
                        <h4 className="text-base font-black text-white">
                          {selectedClient.fullName}
                        </h4>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {selectedClient.loyalty.memberId}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{isAr ? 'مؤكدة رسمياً' : 'Vérifié CTC'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Member Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">{isAr ? 'رقم الهاتف:' : 'Téléphone :'}</span>
                <span className="font-mono font-bold text-white text-sm" dir="ltr">{selectedClient.phone}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">{isAr ? 'البريد الإلكتروني:' : 'Email :'}</span>
                <span className="font-mono text-white text-xs truncate block" title={selectedClient.email}>{selectedClient.email || 'غير مسجل'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">{isAr ? 'الولاية:' : 'Wilaya :'}</span>
                <span className="font-bold text-white text-xs">{selectedClient.wilaya}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">{isAr ? 'إجمالي المبالغ المسددة:' : 'Total payé :'}</span>
                <span className="font-mono font-black text-amber-400 text-sm">{selectedClient.totalPaidAmount.toLocaleString()} DZD</span>
              </div>
            </div>

            {/* Member Tier Entitlements & Level Perks (Visible to Admin) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? `مستوى هذا العضو (${selectedClient.loyalty.tier}) وامتيازاته المكتسبة:` : `Privilèges statut ${selectedClient.loyalty.tier} :`}
                  </span>
                </div>
                {ALL_TIER_DETAILS[selectedClient.loyalty.tier].discountBadge && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                    {ALL_TIER_DETAILS[selectedClient.loyalty.tier].discountBadge}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {ALL_TIER_DETAILS[selectedClient.loyalty.tier].perks.map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">
                        {isAr ? p.titleAr : p.titleFr}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {isAr ? p.descAr : p.descFr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders History List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {isAr ? `سجل طلبات هذا العضو (${selectedClient.orders.length}):` : `Historique des commandes (${selectedClient.orders.length}) :`}
              </span>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedClient.orders.map((ord, idx) => (
                  <div key={ord.id || idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{ord.courseNames}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ''} · {ord.totalAmount?.toLocaleString()} DZD
                      </span>
                    </div>

                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'paye' ? 'bg-emerald-500/20 text-emerald-400' :
                        ord.status === 'confirme' ? 'bg-blue-500/20 text-blue-400' :
                        ord.status === 'annule' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ord.status === 'paye' ? 'مؤكد ومسدد (Payé)' :
                         ord.status === 'confirme' ? 'مؤكد (Confirmé)' :
                         ord.status === 'annule' ? 'ملغى' : 'في الانتظار'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Contact Button */}
            {selectedClient.phone && (
              <a
                href={`https://wa.me/${selectedClient.phone.replace(/^0/, '213').replace(/\s+/g, '')}?text=${encodeURIComponent(
                  isAr
                    ? `السلام عليكم مهندس ${selectedClient.fullName}، معك إدارة منصة GC58 FORMATIONS. نبارك لك وصولك لمستوى ${ALL_TIER_DETAILS[selectedClient.loyalty.tier].nameAr} برقم العضوية (${selectedClient.loyalty.memberId})...`
                    : `Bonjour ${selectedClient.fullName}, gestion GC58 formations concernant votre carte ${selectedClient.loyalty.tier}...`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{isAr ? 'مراسلة هذا العضو مباشرة عبر الواتساب' : 'Contacter sur WhatsApp'}</span>
              </a>
            )}

          </div>
        </div>
      )}

      {/* Student Card Photo Zoom & Inspection Modal for Admin */}
      {viewingCardImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setViewingCardImage(null)}
        >
          <div 
            className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {isAr ? `فحص بطاقة الطالب: ${viewingCardImage.studentName}` : `Inspection Carte Étudiant : ${viewingCardImage.studentName}`}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {isAr ? '⚠️ تأكد من تطابق الاسم الكامل على بطاقة الطالب الجامعية مع الاسم المسجل أعلاه' : 'Vérifiez la concordance stricte du nom officiel'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCardImage(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title={isAr ? 'إغلاق' : 'Fermer'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-slate-800 bg-black flex items-center justify-center p-2">
              <img
                src={viewingCardImage.url}
                alt={viewingCardImage.studentName}
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {isAr ? 'مستند ثبوتي مرفوع من طرف الطالب للمصادقة' : 'Document officiel fourni par l’étudiant'}
              </span>
              <button
                type="button"
                onClick={() => setViewingCardImage(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                {isAr ? 'إغلاق الفحص' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

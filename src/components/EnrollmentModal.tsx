import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Printer, 
  Copy, 
  FileCheck, 
  Check, 
  Star,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Course, Language, Registration, ClientLoyaltyData } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { AddReviewModal } from './AddReviewModal';
import { calculateCartDiscount, getTierNameAr, getTierDiscountPercent } from '../utils/loyaltyHelper';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  preselectedCourseIds?: string[];
  onOrderCompleted?: () => void;
  onOpenReviewModal?: (courseId?: string) => void;
  courses?: Course[];
  sitePhone?: string;
  userLoyalty?: ClientLoyaltyData | null;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  language,
  preselectedCourseIds = [],
  onOrderCompleted,
  courses = COURSES_DATA,
  sitePhone = '0797034244',
  userLoyalty,
}) => {
  const { user } = useAuth();
  const isAr = language === 'ar';

  // 2-step flow: 'form' -> 'voucher'
  const [currentStep, setCurrentStep] = useState<'form' | 'voucher'>('form');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger (الجزائر العاصمة)');
  const [statusEducation, setStatusEducation] = useState('Étudiant / Ingénieur Génie Civil');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [voucherCopied, setVoucherCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Registration | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sync if user already authenticated or stored email
  useEffect(() => {
    if (user) {
      if (user.displayName) setFullName(user.displayName);
      if (user.email) setEmailInput(user.email);
    } else {
      const savedEmail = localStorage.getItem('gc58_student_email');
      if (savedEmail) setEmailInput(savedEmail);
    }
  }, [user]);

  // Sync preselected courses
  useEffect(() => {
    if (preselectedCourseIds.length > 0) {
      setSelectedCourses(preselectedCourseIds);
    } else if (selectedCourses.length === 0 && courses.length > 0) {
      setSelectedCourses([courses[0].id]);
    }
  }, [preselectedCourseIds, courses]);

  if (!isOpen) return null;

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      if (selectedCourses.length === 1) return; // Keep at least 1 course
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const selectedCourseObjs = courses.filter((c) => selectedCourses.includes(c.id));
  const hasCard = Boolean(userLoyalty?.hasActiveCard);
  const activeTier = userLoyalty?.tier || 'STANDARD';
  const cartPricing = calculateCartDiscount(
    selectedCourseObjs.map((c) => c.price),
    activeTier,
    hasCard
  );

  const originalTotalAmount = cartPricing.originalTotal;
  const discountAmount = cartPricing.discountAmount;
  const discountPercent = cartPricing.discountPercent;
  const netTotalAmount = cartPricing.netTotal;
  const courseNamesSummary = selectedCourseObjs.map((c) => c.title).join(', ');

  const activeMemberId =
    userLoyalty?.memberId ||
    `GC58-${(emailInput || phone || 'MEMBER').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase().padEnd(6, 'X')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg(
        isAr
          ? `رقم الهاتف يجب أن يتكون من 10 أرقام تماماً (مثال: 0797034244). لقد أدخلت ${cleanPhone.length} أرقام فقط، لا يمكن التسجيل بأقل أو أكثر من 10 أرقام.`
          : `Le numéro de téléphone doit comporter exactement 10 chiffres (ex: 0797034244). Vous avez saisi ${cleanPhone.length} chiffres.`
      );
      return;
    }
    if (!cleanPhone.startsWith('0')) {
      setErrorMsg(
        isAr
          ? 'رقم الهاتف الجزائري يجب أن يبدأ بالرقم 0 (مثال: 0797034244 أو 05 أو 06).'
          : 'Le numéro de téléphone doit commencer par 0 (ex: 0797034244).'
      );
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      setErrorMsg(
        isAr
          ? 'البريد الإلكتروني إجباري لتأكيد التسجيل واستلام روابط الدورات وحسابك في المنصة.'
          : 'L’adresse email est obligatoire pour recevoir vos accès de formation.'
      );
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg(
        isAr
          ? 'يرجى إدخال بريد إلكتروني صالح ومعتمد (مثال: exemple@gmail.com).'
          : 'Veuillez saisir une adresse email valide (ex: exemple@gmail.com).'
      );
      return;
    }

    if (selectedCourses.length === 0) {
      setErrorMsg(isAr ? 'يرجى اختيار دورة واحدة على الأقل' : 'Veuillez sélectionner au moins une formation.');
      return;
    }

    setLoading(true);

    const voucherCodeGenerated = `GC58-${Date.now().toString().slice(-6).toUpperCase()}`;

    const newRegistration: Registration = {
      fullName: fullName.trim() || (isAr ? 'مهندس / تقني' : 'Ingénieur'),
      phone: cleanPhone,
      email: cleanEmail,
      wilaya,
      statusEducation,
      courseIds: selectedCourses,
      courseNames: courseNamesSummary,
      originalAmount: originalTotalAmount,
      discountAmount,
      memberTier: activeTier,
      memberDiscountPercent: discountPercent,
      memberId: activeMemberId,
      totalAmount: netTotalAmount,
      status: 'en_attente',
      notes: notes.trim(),
      userId: user?.uid || 'guest_' + Date.now(),
      voucherCode: voucherCodeGenerated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('gc58_student_email', cleanEmail);
      const docRef = await addDoc(collection(db, 'registrations'), newRegistration);
      setSubmittedOrder({ ...newRegistration, id: docRef.id });
      setCurrentStep('voucher');
      if (onOrderCompleted) onOrderCompleted();
    } catch (err: any) {
      console.error('Error submitting order to Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'registrations');
      } catch {
        setErrorMsg(isAr ? 'تعذر إرسال الطلب، يرجى المحاولة مجدداً أو مراسلتنا عبر الواتساب.' : 'Erreur lors de l’enregistrement. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedOrder(null);
    setCurrentStep('form');
    onClose();
  };

  // WhatsApp Voucher Text with clear Member Card Discount breakdown (وش نقصتلو)
  const voucherCode = submittedOrder?.voucherCode || (submittedOrder?.id ? `GC58-${submittedOrder.id.slice(0, 6).toUpperCase()}` : 'GC58-2026');
  const algerianIntPhone = sitePhone.replace(/^0/, '213');

  const orderOriginalPrice = (submittedOrder?.originalAmount || originalTotalAmount).toLocaleString();
  const orderDiscountVal = (submittedOrder?.discountAmount ?? discountAmount).toLocaleString();
  const orderDiscountPercent = submittedOrder?.memberDiscountPercent ?? discountPercent;
  const orderNetTotal = (submittedOrder?.totalAmount ?? netTotalAmount).toLocaleString();
  const orderTierName = getTierNameAr(submittedOrder?.memberTier || activeTier);
  const orderMemberId = submittedOrder?.memberId || activeMemberId;

  const voucherText = submittedOrder
    ? `📋 *قسيمة تسجيل رسمية - GC58 FORMATIONS*
----------------------------------------
🔖 *رقم القسيمة:* #${voucherCode}
👤 *الاسم واللقب:* ${submittedOrder.fullName}
📞 *رقم الهاتف:* ${submittedOrder.phone}
📧 *البريد:* ${submittedOrder.email}
📍 *الولاية:* ${submittedOrder.wilaya}
💳 *بطاقة العضوية:* ${orderTierName} (${orderMemberId})
----------------------------------------
📚 *الدورات المسجلة:*
${submittedOrder.courseNames}
----------------------------------------
💵 *سعر الدورات المعتمد (الأدمن):* ${orderOriginalPrice} دج
✂️ *ما تم خصمه ببطاقتك (وش نقصتلك المنصة):* -${orderDiscountVal} دج (-${orderDiscountPercent}%)
💰 *المجموع النهائي الصافي المطلوب:* ${orderNetTotal} دج
----------------------------------------
السلام عليكم أستاذ، هذه هي قسيمة تسجيلي الرسمية مع احتساب تخفيض بطاقتي. يرجى تأكيد تسجيلي وإرسال روابط الوصول للدورات التدريبية.`
    : '';

  const whatsappOrderUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(voucherText)}`;

  const copyVoucherToClipboard = () => {
    navigator.clipboard.writeText(voucherText);
    setVoucherCopied(true);
    setTimeout(() => setVoucherCopied(false), 3000);
  };

  const printVoucher = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">GC58 FORMATIONS</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                  {isAr ? 'تسجيل مباشر' : 'Inscription Directe'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'تأكيد التسجيل الفوري واستخراج قسيمة الاشتراك الرسمية' : 'Inscription rapide et obtention immédiate du bon'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: FAST DIRECT REGISTRATION (NO PAYMENT HURDLES, NO RECEIPT) */}
          {currentStep === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Courses Selection Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'الدورات المختارة للتسجيل (حدد أو ألغِ بنقرة واحدة):' : 'Formations sélectionnées :'}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    {selectedCourses.length} {isAr ? 'دورة' : 'cours'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {courses.filter((c) => c.isActive !== false).map((c) => {
                    const isSelected = selectedCourses.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCourse(c.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="truncate flex-1">
                          <p className="text-xs font-semibold truncate text-slate-100">{c.title}</p>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">
                            {c.price.toLocaleString()} DA
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-500 text-slate-950' : 'border border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Information Fields */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'معلومات الاتصال بالمسجل:' : 'Coordonnées de l’apprenant :'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'الاسم واللقب' : 'Nom & Prénom'} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isAr ? 'مثال: محمد بن علي' : 'Ex: Mohamed Benali'}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        {isAr ? 'رقم الهاتف (الواتساب)' : 'Numéro de Téléphone (WhatsApp)'} <span className="text-amber-400 font-bold">*</span>
                      </label>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                          phone.length === 10
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : phone.length > 0
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-500'
                        }`}
                      >
                        {phone.length === 10 ? '✓ 10/10' : `${phone.length}/10 ${isAr ? 'أرقام' : 'chiffres'}`}
                      </span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(val);
                      }}
                      placeholder="0797034244"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs sm:text-sm focus:border-amber-500 focus:outline-none text-left"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{isAr ? 'يجب 10 أرقام تماماً (مثال: 0797034244)' : 'Exactement 10 chiffres (ex: 0797034244)'}</span>
                      {phone.length > 0 && phone.length < 10 && (
                        <span className="text-amber-400 font-medium">
                          {isAr ? `(ناقص ${10 - phone.length} أرقام)` : `(-${10 - phone.length})`}
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        {isAr ? 'البريد الإلكتروني' : 'Email'} <span className="text-amber-400 font-bold">* ({isAr ? 'إجباري' : 'obligatoire'})</span>
                      </label>
                      <span className="text-[10px] text-amber-400/90 font-medium">
                        {isAr ? 'لاستلام الروابط' : 'Pour les liens'}
                      </span>
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="exemple@gmail.com"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isAr ? 'تأكد من كتابة بريدك بشكل صحيح لإرسال الدورات' : 'Votre email sert à vous envoyer les cours'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'الولاية' : 'Wilaya'}
                    </label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                    >
                      {ALGERIAN_WILAYAS.map((w) => {
                        const label = `${w.code} - ${w.nameFr} (${w.nameAr})`;
                        return (
                          <option key={w.code} value={label} className="bg-slate-900 text-white">
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'ملاحظة إضافية (اختياري)' : 'Note additionnelle (facultatif)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: تفضيل الاتصال في المساء، أو استفسار محدد...' : 'Remarque ou question éventuelle...'}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Total & Member Discount Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-bold">
                      {isAr ? `تخفيض بطاقة العضوية (${cartPricing.tierNameAr}):` : `Remise carte (${cartPricing.tierNameFr}) :`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                      -{discountPercent}%
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">
                    {isAr ? `وش نقصتلك المنصة: -${discountAmount.toLocaleString()} دج` : `Montant déduit : -${discountAmount.toLocaleString()} DA`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {originalTotalAmount.toLocaleString()} دج
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({isAr ? 'سعر الأدمن المعتمد' : 'Prix initial'})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xs text-slate-300 font-bold">{isAr ? 'المجموع النهائي بعد التخفيض:' : 'Total net à payer :'}</span>
                      <span className="text-2xl font-black text-amber-400 font-mono" dir="ltr">
                        {netTotalAmount.toLocaleString()} DA
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-5 h-5 text-slate-950" />
                    <span>
                      {loading
                        ? (isAr ? 'جاري تأكيد التسجيل واستخراج القسيمة...' : 'Traitement...')
                        : (isAr ? 'تأكيد التسجيل واستخراج قسيمة الاشتراك 📋' : 'Confirmer & Obtenir le bon 📋')}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: OFFICIAL VOUCHER & DIRECT WHATSAPP */}
          {currentStep === 'voucher' && submittedOrder && (
            <div className="space-y-6">
              {/* Important Instruction Alert */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-100 leading-relaxed space-y-2.5">
                <div className="flex items-center gap-2 font-black text-base text-emerald-300">
                  <CheckCircle className="w-6 h-6 shrink-0 text-emerald-400" />
                  <span>
                    {isAr ? 'تم تأكيد طلبك واستخراج قسيمة الاشتراك الرسمية بنجاح! 📋' : 'Votre inscription et bon de commande sont validés !'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-emerald-300 font-bold text-xs sm:text-sm">
                  {isAr ? (
                    <p>
                      📢 <strong>الخطوة التالية المباشرة:</strong> اضغط على زر الواتساب بالأسفل لمراسلة الأدمن وإرسال القسيمة بنقرة واحدة لتأكيد حسابك واستلام روابط الدورات!
                    </p>
                  ) : (
                    <p>
                      📢 <strong>Étape suivante :</strong> Cliquez sur le bouton WhatsApp ci-dessous pour envoyer votre bon et recevoir vos accès immédiatement !
                    </p>
                  )}
                </div>
              </div>

              {/* Printable Official Voucher Box */}
              <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 space-y-4 shadow-xl">
                {/* Voucher Top Brand */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-400" />
                    <span className="font-extrabold text-white text-sm">GC58 FORMATIONS</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-xs font-mono font-black">
                    #{voucherCode}
                  </span>
                </div>

                {/* Voucher Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'الاسم واللقب:' : 'Nom :'}</span>
                    <strong className="text-white text-sm">{submittedOrder.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'رقم الهاتف:' : 'Téléphone :'}</span>
                    <strong className="text-amber-400 font-mono text-sm">
                      <span dir="ltr" className="inline-block">{submittedOrder.phone}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'البريد الإلكتروني:' : 'Email :'}</span>
                    <span className="text-slate-200 font-mono">{submittedOrder.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'الولاية:' : 'Wilaya :'}</span>
                    <span className="text-slate-200">{submittedOrder.wilaya}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block mb-1">{isAr ? 'بطاقة العضوية المعتمدة:' : 'Carte d’adhérent :'}</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>{orderTierName} ({orderMemberId})</span>
                    </span>
                  </div>
                </div>

                {/* Courses List in Voucher */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <span className="text-slate-400 block font-semibold">{isAr ? 'الدورات المسجلة:' : 'Formations sélectionnées :'}</span>
                  <p className="text-white font-bold leading-relaxed">{submittedOrder.courseNames}</p>
                </div>

                {/* Detailed Price & Member Deduction Breakdown (وش نقصتلو في القسيمة) */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{isAr ? 'سعر الدورات المعتمد (سعر الأدمن الأصلي):' : 'Prix initial officiel :'}</span>
                    <span className="line-through font-mono">{orderOriginalPrice} دج</span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{isAr ? `تخفيض بطاقة ${orderTierName} (وش نقصتلك المنصة):` : `Remise carte ${orderTierName} :`}</span>
                    </span>
                    <span className="font-mono">-{orderDiscountVal} دج (-{orderDiscountPercent}%)</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-amber-400 block">
                        {isAr ? 'المجموع النهائي المطلوب بالسعر الجديد:' : 'Total net final :'}
                      </span>
                      <span className="text-[10px] text-emerald-400">
                        {isAr ? '✅ مطبق عليه خصم بطاقة العضوية بالكامل' : '✅ Remise appliquée'}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-amber-400">
                      <span dir="ltr" className="font-mono inline-block">{orderNetTotal}</span>{' '}
                      <span className="text-xs text-slate-300">دج / DZD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big WhatsApp Action Button */}
              <div className="space-y-3 pt-2">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-[#25D366]/30 hover:scale-[1.02] transition-all text-center"
                >
                  <MessageSquare className="w-5 h-5 fill-white shrink-0" />
                  <span>
                    {isAr 
                      ? 'مراسلة الأدمن عبر الواتساب وإرسال القسيمة (بنقرة واحدة)' 
                      : 'Envoyer le bon à l’administrateur sur WhatsApp'}
                  </span>
                </a>

                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={copyVoucherToClipboard}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{voucherCopied ? (isAr ? 'تم نسخ نص القسيمة!' : 'Copié !') : (isAr ? 'نسخ نص القسيمة' : 'Copier le bon')}</span>
                  </button>

                  <button
                    onClick={printVoucher}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'طباعة / حفظ القسيمة' : 'Imprimer'}</span>
                  </button>

                  <button
                    onClick={handleResetAndClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-bold cursor-pointer"
                  >
                    {isAr ? 'إغلاق' : 'Fermer'}
                  </button>
                </div>
              </div>

              {/* Evaluation Callout Card: في آخر المطاف */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/15 border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                      <span>{isAr ? 'شاركنا تقييمك ورأيك في المنصة ⭐' : 'Votre avis compte énormément ⭐'}</span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded font-mono">
                        1-5
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      {isAr
                        ? 'قيم منصة GC58 بنجومك واكتب تعليقك ليتم نشره فوراً باسمك في أعلى قائمة التقييمات!'
                        : 'Notez la plateforme avec vos étoiles et votre commentaire sera affiché en tête de liste !'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>{isAr ? 'أضف تقييمك الآن ⭐' : 'Évaluer maintenant ⭐'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Review Modal for "في آخر المطاف" */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        language={language}
        courses={courses}
        preselectedCourseId={selectedCourses[0]}
      />
    </div>
  );
};

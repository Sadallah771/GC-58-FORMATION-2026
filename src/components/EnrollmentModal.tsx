import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle, 
  Building,
  User,
  Mail,
  MapPin,
  GraduationCap,
  MessageSquare,
  Printer,
  Copy,
  FileCheck,
  Check,
  ArrowRight,
  CreditCard,
  Upload,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Course, Language, Registration } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { AddReviewModal } from './AddReviewModal';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  preselectedCourseIds?: string[];
  onOrderCompleted?: () => void;
  onOpenReviewModal?: (courseId?: string) => void;
  courses?: Course[];
  sitePhone?: string;
}

const BARIDIMOB_RIP = '00799999002361295068';
const CCP_ACCOUNT = '0023612950';
const CCP_KEY = '68';

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  language,
  preselectedCourseIds = [],
  onOrderCompleted,
  courses = COURSES_DATA,
  sitePhone = '0797034244',
}) => {
  const { user } = useAuth();
  const isAr = language === 'ar';

  // Simplified 2-step flow: 'form' -> 'voucher'
  const [currentStep, setCurrentStep] = useState<'form' | 'voucher'>('form');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger (الجزائر العاصمة)');
  const [statusEducation, setStatusEducation] = useState('Étudiant / Ingénieur Génie Civil');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'baridimob' | 'ccp'>('baridimob');

  // Receipt upload state
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  // Copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);
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
  const totalAmount = selectedCourseObjs.reduce((acc, c) => acc + c.price, 0);
  const totalOriginalAmount = selectedCourseObjs.reduce((acc, c) => acc + (c.originalPrice || c.price), 0);
  const totalSavings = Math.max(0, totalOriginalAmount - totalAmount);
  const courseNamesSummary = selectedCourseObjs.map((c) => c.title).join(', ');

  // Handle receipt image compression & load
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFileName(file.name);
    setIsUploadingReceipt(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Resize image to max 900px width/height to keep Firestore payload lightweight
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 900;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setReceiptImage(dataUrl);
        setIsUploadingReceipt(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      setErrorMsg(isAr ? 'يرجى إدخال رقم هاتف جزائري صحيح للاتصال بك (مثال: 0797034244)' : 'Veuillez saisir un numéro de téléphone valide.');
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
      email: emailInput.trim().toLowerCase() || `${cleanPhone}@gc58.dz`,
      wilaya,
      statusEducation,
      courseIds: selectedCourses,
      courseNames: courseNamesSummary,
      totalAmount,
      status: receiptImage ? 'en_attente' : 'en_attente',
      notes: notes.trim(),
      userId: user?.uid || 'guest_' + Date.now(),
      receiptUrl: receiptImage || undefined,
      receiptFileName: receiptFileName || undefined,
      paymentMethod,
      voucherCode: voucherCodeGenerated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (emailInput.trim()) {
        localStorage.setItem('gc58_student_email', emailInput.trim().toLowerCase());
      }
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

  // WhatsApp Voucher Text
  const voucherCode = submittedOrder?.voucherCode || (submittedOrder?.id ? `GC58-${submittedOrder.id.slice(0, 6).toUpperCase()}` : 'GC58-2026');
  const algerianIntPhone = sitePhone.replace(/^0/, '213');

  const voucherText = submittedOrder
    ? `📋 *قسيمة اشتراك رسمية - GC58 FORMATIONS*
----------------------------------------
🔖 *رقم القسيمة:* #${voucherCode}
👤 *الاسم:* ${submittedOrder.fullName}
📞 *رقم الهاتف:* ${submittedOrder.phone}
📧 *البريد:* ${submittedOrder.email}
📍 *الولاية:* ${submittedOrder.wilaya}
💳 *طريقة الدفع:* ${submittedOrder.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob)' : 'حساب CCP'}
📷 *وصل التحويل:* ${submittedOrder.receiptUrl ? 'تم تسجيل الوصل في الموقع بنجاح' : 'سيتم إرساله'}
----------------------------------------
📚 *الدورات المسجلة:*
${submittedOrder.courseNames}
💰 *المجموع المدفوع/المطلوب:* ${submittedOrder.totalAmount.toLocaleString()} دج
----------------------------------------
السلام عليكم أستاذ، هذه هي قسيمة اشتراكي الرسمية في منصة GC58 FORMATIONS. يرجى تفعيل حسابي وإرسال رابط الوصول للدورات التدريبية.`
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
                {isAr ? 'تأكيد التسجيل، الدفع ببريدي موب / CCP، واستلام قسيمة الاشتراك' : 'Confirmation de commande, paiement BaridiMob et bon'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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

          {/* STEP 1: ULTRA-SIMPLE REGISTRATION & PAYMENT */}
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
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'رقم الهاتف (الواتساب)' : 'Numéro de Téléphone (WhatsApp)'} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0797034244"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs sm:text-sm focus:border-amber-500 focus:outline-none text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="exemple@gmail.com"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                    />
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
              </div>

              {/* PAYMENT INFORMATION SECTION (BARIDIMOB & CCP) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-black text-white">
                      {isAr ? 'معلومات الدفع المباشر (بريدي موب أو CCP):' : 'Coordonnées de paiement (BaridiMob & CCP) :'}
                    </h4>
                  </div>
                  <div className="text-sm font-black text-amber-400 font-mono">
                    <span className="text-xs text-slate-400 font-normal ml-1">{isAr ? 'المبلغ الإجمالي:' : 'Total :'}</span>
                    <span dir="ltr">{totalAmount.toLocaleString()}</span> DA
                  </div>
                </div>

                {/* Payment Methods Tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('baridimob')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'baridimob'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{isAr ? 'بريدي موب (BaridiMob)' : 'BaridiMob'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ccp')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'ccp'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{isAr ? 'الحساب البريدي (CCP)' : 'Compte CCP'}</span>
                  </button>
                </div>

                {/* Active Payment Details Box */}
                {paymentMethod === 'baridimob' ? (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        {isAr ? 'رقم الحساب البريدي الجاري بريدي موب (RIP):' : 'Numéro RIP BaridiMob :'}
                      </span>
                      <strong className="text-white font-mono text-sm sm:text-base font-black tracking-wide" dir="ltr">
                        {BARIDIMOB_RIP}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(BARIDIMOB_RIP, 'rip')}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all border border-slate-700/60"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'rip' ? (isAr ? 'تم النسخ!' : 'Copié !') : (isAr ? 'نسخ الـ RIP' : 'Copier')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        {isAr ? 'رقم حساب CCP والمفتاح:' : 'Compte CCP & Clé :'}
                      </span>
                      <strong className="text-white font-mono text-sm sm:text-base font-black tracking-wide" dir="ltr">
                        {CCP_ACCOUNT} Clé {CCP_KEY}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${CCP_ACCOUNT} ${CCP_KEY}`, 'ccp')}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all border border-slate-700/60"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'ccp' ? (isAr ? 'تم النسخ!' : 'Copié !') : (isAr ? 'نسخ الـ CCP' : 'Copier')}</span>
                    </button>
                  </div>
                )}

                {/* Upload Receipt File (Optional or Immediate) */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-dashed border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'إرفاق وصل التحويل (صورة الوصل أو سكرين شوت بريدي موب):' : 'Reçu de paiement (Capture ou photo) :'}</span>
                    </label>
                    {receiptImage && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {isAr ? 'تم إرفاق الوصل' : 'Reçu joint'}
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 cursor-pointer"
                  />

                  {receiptImage && (
                    <div className="flex items-center gap-3 pt-2">
                      <img
                        src={receiptImage}
                        alt="Receipt Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-amber-500/40 shadow-sm"
                      />
                      <div className="text-[11px] text-slate-300">
                        <p className="font-semibold text-emerald-300 truncate max-w-xs">{receiptFileName || 'Reçu de virement'}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                          {isAr ? 'سيتم حفظ هذا الوصل تلقائياً مع طلبك في الموقع!' : 'Enregistré automatiquement sur le site !'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{isAr ? 'المجموع النهائي بعد التخفيض:' : 'Total net :'}</span>
                    <span className="text-xl font-black text-amber-400 font-mono" dir="ltr">
                      {totalAmount.toLocaleString()} DA
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                      {isAr ? `وفرت ${totalSavings.toLocaleString()} دج في هذا الطلب!` : `Économie : ${totalSavings.toLocaleString()} DA !`}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || isUploadingReceipt}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-5 h-5 text-slate-950" />
                  <span>
                    {loading
                      ? (isAr ? 'جاري تأكيد الطلب وحفظ الوصل...' : 'Traitement...')
                      : (isAr ? 'تأكيد الطلب واستخراج قسيمة الاشتراك' : 'Confirmer & Obtenir le bon')}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OFFICIAL VOUCHER & CONTACT ADMIN */}
          {currentStep === 'voucher' && submittedOrder && (
            <div className="space-y-6">
              {/* Important Instruction Alert */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-100 text-xs sm:text-sm leading-relaxed space-y-2.5">
                <div className="flex items-center gap-2 font-black text-amber-400 text-base">
                  <CheckCircle className="w-6 h-6 shrink-0 text-amber-400" />
                  <span>{isAr ? 'تم استلام طلبك وحفظ الوصل بنجاح في الموقع!' : 'Inscription et reçu enregistrés avec succès !'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm">
                  📢 {isAr ? (
                    <>
                      <strong>تنبيه هام ومريح:</strong> لقد تم تسجيل وصل الدفع الخاص بك تلقائياً في الموقع!{' '}
                      <span className="text-white underline">أرسل للأدمن القسيمة فقط عبر الواتساب</span>، ولست بحاجة لإعادة إرسال الوصل لأنه محفوظ لدينا مسبقاً!
                    </>
                  ) : (
                    <>
                      <strong>Note importante :</strong> Votre reçu de paiement est déjà enregistré automatiquement sur la plateforme. Envoyez uniquement votre bon à l'administrateur !
                    </>
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
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'طريقة الدفع:' : 'Paiement :'}</span>
                    <span className="text-emerald-400 font-bold">
                      {submittedOrder.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob)' : 'حساب CCP'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'حالة الوصل:' : 'Reçu :'}</span>
                    <span className="text-amber-400 font-medium">
                      {submittedOrder.receiptUrl ? '✓ مسجل في الموقع' : 'قيد المراجعة'}
                    </span>
                  </div>
                </div>

                {/* Courses List in Voucher */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <span className="text-slate-400 block font-semibold">{isAr ? 'الدورات المسجلة:' : 'Formations sélectionnées :'}</span>
                  <p className="text-white font-bold leading-relaxed">{submittedOrder.courseNames}</p>
                </div>

                {/* Total */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{isAr ? 'المجموع المدفوع:' : 'Montant total :'}</span>
                  <div className="text-2xl font-black text-amber-400">
                    <span dir="ltr" className="font-mono inline-block">{submittedOrder.totalAmount.toLocaleString()}</span>{' '}
                    <span className="text-xs text-slate-300">دج / DZD</span>
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
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{voucherCopied ? (isAr ? 'تم نسخ نص القسيمة!' : 'Copié !') : (isAr ? 'نسخ نص القسيمة' : 'Copier le bon')}</span>
                  </button>

                  <button
                    onClick={printVoucher}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'طباعة / حفظ القسيمة' : 'Imprimer'}</span>
                  </button>

                  <button
                    onClick={handleResetAndClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-bold"
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

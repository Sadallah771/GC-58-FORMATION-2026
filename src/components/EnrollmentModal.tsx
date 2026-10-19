import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle, 
  Layers, 
  Send, 
  Building,
  User,
  Mail,
  MapPin,
  GraduationCap,
  MessageSquare,
  Printer,
  Copy,
  FileCheck,
  Flame,
  Clock,
  Check,
  Plus,
  ArrowRight,
  Info
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Course, Language, Registration } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { ALGERIAN_WILAYAS } from '../data/wilayas';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  preselectedCourseIds?: string[];
  onOrderCompleted?: () => void;
  courses?: Course[];
  sitePhone?: string;
}

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

  // Step state: 
  // 'email_entry' (التسجيل بالايمايل هادا مكان) 
  // 'course_selection' (يلقى الدورات و يخير كيما يحب مع طمأنته بلي تسجيل اولي فقط)
  // 'voucher' (القسيمة الرسمية)
  const [currentStep, setCurrentStep] = useState<'email_entry' | 'course_selection' | 'voucher'>('email_entry');

  const [emailInput, setEmailInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger (الجزائر العاصمة)');
  const [statusEducation, setStatusEducation] = useState('Étudiant en Génie Civil (طالب جامعي)');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'beton_arme' | 'charpente_metallique' | 'routes_vrd'>('all');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Registration | null>(null);
  const [voucherCopied, setVoucherCopied] = useState(false);

  // Sync if user already authenticated or stored email
  useEffect(() => {
    if (user) {
      if (user.displayName) setFullName(user.displayName);
      if (user.email) {
        setEmailInput(user.email);
        setCurrentStep('course_selection');
      }
    } else {
      const savedEmail = localStorage.getItem('gc58_student_email');
      if (savedEmail) {
        setEmailInput(savedEmail);
        setCurrentStep('course_selection');
      }
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

  const handleEmailStepProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg(isAr ? 'يرجى إدخال بريد إلكتروني صحيح للمتابعة' : 'Veuillez saisir une adresse email valide.');
      return;
    }
    localStorage.setItem('gc58_student_email', cleanEmail);
    setCurrentStep('course_selection');
  };

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      if (selectedCourses.length === 1) return; // keep at least 1
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

    const newRegistration: Registration = {
      fullName: fullName.trim() || (isAr ? 'مهندس / تقني' : 'Ingénieur'),
      phone: cleanPhone,
      email: emailInput.trim().toLowerCase(),
      wilaya,
      statusEducation,
      courseIds: selectedCourses,
      courseNames: courseNamesSummary,
      totalAmount,
      status: 'en_attente',
      notes: notes.trim(),
      userId: user?.uid || 'guest_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'registrations'), newRegistration);
      setSubmittedOrder({ ...newRegistration, id: docRef.id });
      setCurrentStep('voucher');
      if (onOrderCompleted) onOrderCompleted();
    } catch (err: any) {
      console.error('Error submitting order to Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'registrations');
      } catch (e: any) {
        setErrorMsg(isAr ? 'تعذر إرسال الطلب، يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.' : 'Erreur lors de l’enregistrement. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedOrder(null);
    onClose();
  };

  // Generate WhatsApp message with formatted voucher for GC58 FORMATIONS
  const voucherCode = submittedOrder?.id ? `GC58-${submittedOrder.id.slice(0, 6).toUpperCase()}` : 'GC58-2026';
  const algerianIntPhone = sitePhone.replace(/^0/, '213');

  const voucherText = submittedOrder
    ? `📋 *قسيمة طلب تسجيل أولية - GC58 FORMATIONS*
----------------------------------------
🔖 *رقم القسيمة:* #${voucherCode}
👤 *الاسم:* ${submittedOrder.fullName}
📞 *رقم الهاتف:* ${submittedOrder.phone}
📧 *البريد:* ${submittedOrder.email}
📍 *الولاية:* ${submittedOrder.wilaya}
🎓 *المستوى:* ${submittedOrder.statusEducation}
----------------------------------------
📚 *الدورات المختارة (عرض 50 ساعة):*
${submittedOrder.courseNames}
💰 *المجموع بعد التخفيض:* ${submittedOrder.totalAmount.toLocaleString()} DZD
----------------------------------------
السلام عليكم، هذه هي قسيمة التسجيل الأولي الخاصة بي في GC58 FORMATIONS للاستفسار وتأكيد تسجيلي في الدورات التدريبية.`
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

  const filteredCatalog = courses.filter((c) => {
    if (c.isActive === false) return false;
    if (categoryFilter === 'all') return true;
    return c.category === categoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  GC58 FORMATIONS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                  {isAr ? 'عرض 50 ساعة' : 'Promo 50h'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentStep === 'email_entry'
                  ? (isAr ? 'التسجيل السريع بالبريد الإلكتروني للبدء' : 'Accès rapide par email')
                  : currentStep === 'course_selection'
                  ? (isAr ? 'فضاء اختيار الدورات (تسجيل أولي بدون أي التزام مالي)' : 'Sélectionnez vos cours sans engagement')
                  : (isAr ? 'قسيمة الطلب الرسمية' : 'Bon de commande officiel')}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {/* STEP 1: REGISTRATION BY EMAIL ONLY */}
          {currentStep === 'email_entry' && (
            <div className="max-w-md mx-auto py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                  <Mail className="w-8 h-8 text-amber-400" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  {isAr ? 'ابدأ بإدخال بريدك الإلكتروني' : 'Commencez avec votre Email'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {isAr
                    ? 'أدخل بريدك الإلكتروني للدخول إلى فضاء اختيار الدورات. التسجيل مجاني ولا يلزمك بأي دفع إطلاقاً!'
                    : 'Renseignez votre email pour accéder à l’espace de sélection des cours, sans aucun engagement financier.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleEmailStepProceed} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'بريدك الإلكتروني (Email)' : 'Votre adresse email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      dir="ltr"
                      autoFocus
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="ingenieur.algerie@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500 shadow-inner"
                    />
                  </div>
                </div>

                {/* Reassurance pill */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'طمأنة: هذا التسجيل مجرد خطوة أولية للتعرف على اختياراتك ولن يُطلب منك أي دفع إلكتروني أو بطاقة بنكية.'
                      : 'Rassurez-vous : Aucune carte bancaire ni paiement immédiat requis. Vous choisissez vos formations librement.'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <span>{isAr ? 'متابعة واختيار الدورات الآن' : 'Continuer et choisir mes cours'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500">
                  {isAr ? 'GC58 FORMATIONS - معتمدة ومطابقة لمتطلبات CTC الجزائر' : 'Formations certifiées conformes aux exigences du CTC'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: COURSE SELECTION WORKSPACE & REASSURANCE */}
          {currentStep === 'course_selection' && (
            <div className="space-y-6">
              {/* BIG REASSURANCE BANNER (طمنو بلي هذا تسجيل اولي فقط و الاختيار مشي معناها رايح يشري) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/60 shadow-lg text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2.5 font-black text-emerald-400 text-sm sm:text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    {isAr
                      ? '✨ اطمئن تماماً: هذا تسجيل أولي واستفسار فقط، ولا يعني الشراء الفوري!'
                      : '✨ Rassurez-vous : Pré-inscription gratuite et sans engagement !'}
                  </span>
                </div>
                <p className="text-slate-200">
                  {isAr ? (
                    <>
                      اختيارك للدورات بالأسفل لا يلزمك بأي دفع مسبق أو التزام مالي. 
                      <strong> يمكنك اختيار ما تريده بحرية تامة وبدون أي خوف</strong>، حيث سيقوم مستشارنا بالاتصال بك أو التواصل معك على الواتساب ليجيب عن كل تساؤلاتك ويشرح لك برنامج التكوين بالتفصيل قبل أي تأكيد.
                    </>
                  ) : (
                    <>
                      Sélectionner vos cours ne vous engage à aucun paiement immédiat. Choisissez vos formations en toute sérénité, notre conseiller technique vous contactera d’abord pour vous renseigner et vous orienter.
                    </>
                  )}
                </p>

                {/* Promo timer tag inside banner */}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{isAr ? 'بروموسيون 50 ساعة فعال الآن' : 'Offre 50h Active'}</span>
                  </span>
                  <span className="text-amber-300 font-semibold">
                    {isAr ? (
                      <>
                        تخفيضات خاصة: <span dir="ltr" className="font-mono inline-block">3000</span> دج بدل <span dir="ltr" className="font-mono inline-block">5000</span> دج | <span dir="ltr" className="font-mono inline-block">5000</span> دج بدل <span dir="ltr" className="font-mono inline-block">10 000</span> دج
                      </>
                    ) : (
                      'Tarifs réduits : 3 000 DA au lieu de 5 000 DA | 5 000 DA au lieu de 10 000 DA'
                    )}
                  </span>
                </div>
              </div>

              {/* Connected user email chip with change option */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'بريدك المسجل:' : 'Votre email :'}</span>
                  <span className="font-mono text-white font-bold" dir="ltr">{emailInput}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('email_entry')}
                  className="text-amber-400 hover:underline text-[11px] font-semibold"
                >
                  {isAr ? 'تغيير البريد' : 'Changer'}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>{isAr ? 'اختر الدورات التي تهمك (اضغط للإضافة أو الحذف)' : 'Sélectionnez vos formations :'}</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono" dir="ltr">
                    {selectedCourses.length} {isAr ? 'دورة مختارة' : 'sélectionnée(s)'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', labelAr: 'الكل (13)', labelFr: 'Toutes (13)' },
                    { id: 'beton_arme', labelAr: 'الخرسانة المسلحة (3000 دج)', labelFr: 'Béton Armé (3 000 DA)' },
                    { id: 'charpente_metallique', labelAr: 'الشاربونت ميتاليك (5000 دج)', labelFr: 'Charpente (5 000 DA)' },
                    { id: 'routes_vrd', labelAr: 'الطرقات وVRD (3000 دج)', labelFr: 'Routes & VRD (3 000 DA)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        categoryFilter === tab.id
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {isAr ? tab.labelAr : tab.labelFr}
                    </button>
                  ))}
                </div>

                {/* Courses Interactive Selection List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1 pr-2">
                  {filteredCatalog.map((course) => {
                    const isSelected = selectedCourses.includes(course.id);
                    const origPrice = course.originalPrice || (course.price === 5000 ? 10000 : 5000);

                    return (
                      <div
                        key={course.id}
                        onClick={() => toggleCourse(course.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-1 transition-colors ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>

                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-800 shadow-sm"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                              {course.software}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {origPrice > course.price && (
                                <span className="text-[11px] font-mono text-slate-500 line-through" dir="ltr">
                                  {origPrice.toLocaleString()} دج
                                </span>
                              )}
                              <span className="text-xs font-mono font-black text-amber-300" dir="ltr">
                                {course.price.toLocaleString()} دج
                              </span>
                            </div>
                          </div>

                          <h5 className="text-xs font-bold text-white mt-1 leading-snug line-clamp-1">
                            {course.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {course.durationHours} Heures • {course.level}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order form fields: Phone, Name, Wilaya */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  {isAr ? 'معلومات الاتصال بك (لتأكيد التسجيل الأولي واستلام القسيمة):' : 'Vos coordonnées de contact :'}
                </h4>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'الاسم واللقب *' : 'Nom & Prénom *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Mohamed Amine"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'رقم الهاتف (للاتصال بك وتأكيد الدورة) *' : 'Numéro de Téléphone *'}
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05 / 06 / 07 XX XX XX XX"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'الولاية (58 ولاية) *' : 'Wilaya de résidence *'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={wilaya}
                        onChange={(e) => setWilaya(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      >
                        {ALGERIAN_WILAYAS.map((w) => (
                          <option key={w.code} value={`${w.code} - ${w.nameFr} (${w.nameAr})`}>
                            {w.code} - {w.nameFr} ({w.nameAr})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'المستوى أو التخصص' : 'Statut professionnel'}
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={statusEducation}
                        onChange={(e) => setStatusEducation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="Étudiant en Génie Civil (طالب جامعي)">Étudiant en Génie Civil (طالب جامعي)</option>
                        <option value="Ingénieur d'État diplômé (مهندس دولة متخرج)">Ingénieur d'État diplômé (مهندس دولة متخرج)</option>
                        <option value="Ingénieur en bureau d'études (مهندس في مكتب دراسات)">Ingénieur en bureau d'études (مهندس في مكتب دراسات)</option>
                        <option value="Technicien Supérieur BTP (تقني سامي)">Technicien Supérieur BTP (تقني سامي)</option>
                        <option value="Autre profession BTP (مهنة أخرى)">Autre profession BTP (مهنة أخرى)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Total & Savings summary */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">{isAr ? 'المبلغ الإجمالي بعد التخفيض:' : 'Total après réduction :'}</span>
                    <div className="text-2xl font-black text-amber-400">
                      <span dir="ltr" className="font-mono inline-block">{totalAmount.toLocaleString()}</span>{' '}
                      <span className="text-xs text-slate-400 font-bold">دج</span>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        {isAr ? (
                          <>
                            وفرت <span dir="ltr" className="font-mono inline-block font-black">{totalSavings.toLocaleString()}</span> دج!
                          </>
                        ) : (
                          `Économie : ${totalSavings.toLocaleString()} DA !`
                        )}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                        {isAr ? 'سعر البروموسيون المحدود' : 'Tarif promotionnel'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-5 h-5 text-slate-950" />
                  <span>
                    {loading
                      ? (isAr ? 'جاري تسجيل طلبك...' : 'Enregistrement...')
                      : (isAr ? 'تأكيد طلب التسجيل الأولي والحصول على القسيمة' : 'Confirmer la pré-inscription & Obtenir le bon')}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: OFFICIAL ORDER VOUCHER SCREEN */}
          {currentStep === 'voucher' && submittedOrder && (
            <div className="space-y-6">
              {/* Important Instruction Alert */}
              <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-200 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-400 text-base">
                  <AlertCircle className="w-5 h-5 shrink-0 animate-bounce" />
                  <span>{isAr ? 'تم استلام تسجيلك الأولي بنجاح في GC58 FORMATIONS!' : 'Pré-inscription reçue avec succès !'}</span>
                </div>
                <p>
                  {isAr ? (
                    <>
                      هذه هي <strong>قسيمة طلبك الرسمية</strong>. لقد تم حفظ تسجيلك وسيقوم مستشارنا بالاتصال بك على الرقم{' '}
                      <strong className="text-white font-mono" dir="ltr">{submittedOrder.phone}</strong>.
                      <br />
                      يمكنك أيضاً إرسال القسيمة مباشرة عبر الواتساب لتسريع التأكيد:
                    </>
                  ) : (
                    <>
                      Voici votre <strong>bon de pré-inscription officiel</strong>. Notre conseiller vous appellera sous peu au <strong dir="ltr">{submittedOrder.phone}</strong>.
                    </>
                  )}
                </p>
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
                    <span className="text-slate-400 block">{isAr ? 'الاسم:' : 'Nom :'}</span>
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
                </div>

                {/* Courses List in Voucher */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <span className="text-slate-400 block font-semibold">{isAr ? 'الدورات المسجلة (عرض 50 ساعة):' : 'Formations sélectionnées :'}</span>
                  <p className="text-white font-bold leading-relaxed">{submittedOrder.courseNames}</p>
                </div>

                {/* Total */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{isAr ? 'المجموع المخفض المطلوب:' : 'Montant total promo :'}</span>
                  <div className="text-2xl font-black text-amber-400">
                    <span dir="ltr" className="font-mono inline-block">{submittedOrder.totalAmount.toLocaleString()}</span>{' '}
                    <span className="text-xs text-slate-300">دج / DZD</span>
                  </div>
                </div>
              </div>

              {/* Big Prominent Action: Complete order via WhatsApp */}
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
                      ? 'متابعة عبر الواتساب (إرسال القسيمة تلقائياً)' 
                      : 'Finaliser sur WhatsApp (Envoyer le bon)'}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

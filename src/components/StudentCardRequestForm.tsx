import React, { useState } from 'react';
import { 
  GraduationCap, 
  CreditCard, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  X,
  Phone,
  Mail,
  User,
  Building,
  Edit3,
  Save,
  LogIn
} from 'lucide-react';
import { Language, MemberCardRequest } from '../types';
import { collection, addDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface StudentCardRequestFormProps {
  language: Language;
  userEmail: string;
  userName: string;
  existingRequest?: MemberCardRequest | null;
  onRequestSubmitted: (req: MemberCardRequest) => void;
  onOpenAuth?: () => void;
  onUpdateDetails?: (name: string, phone: string) => Promise<boolean> | Promise<void>;
}

export const StudentCardRequestForm: React.FC<StudentCardRequestFormProps> = ({
  language,
  userEmail,
  userName,
  existingRequest,
  onRequestSubmitted,
  onOpenAuth,
  onUpdateDetails,
}) => {
  const isAr = language === 'ar';

  const [selectedTier, setSelectedTier] = useState<'STUDENT' | 'STANDARD'>('STUDENT');
  const [fullName, setFullName] = useState(userName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [university, setUniversity] = useState('');
  const [studentCardImage, setStudentCardImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Editing existing card details (Name on card and phone)
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editName, setEditName] = useState(existingRequest?.customCardName || existingRequest?.fullName || userName || '');
  const [editPhone, setEditPhone] = useState(existingRequest?.phone || '');
  const [saveEditSuccess, setSaveEditSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Phone validation (exact 10 digits starting with 0)
  const validatePhone = (p: string) => {
    const clean = p.replace(/\s+/g, '');
    const regex = /^0[567][0-9]{8}$/;
    return regex.test(clean);
  };

  // Sync user credentials when logged in or updated
  React.useEffect(() => {
    if (userEmail) setEmail(userEmail);
    if (userName && !fullName) setFullName(userName);
  }, [userEmail, userName]);

  // Sync edit state when existingRequest changes
  React.useEffect(() => {
    if (existingRequest) {
      setEditName(existingRequest.customCardName || existingRequest.fullName || userName || '');
      setEditPhone(existingRequest.customPhone || existingRequest.phone || '');
    }
  }, [existingRequest, userName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError(isAr ? 'يرجى اختيار ملف صورة صالح (JPG, PNG)' : 'Veuillez choisir une image valide.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError(isAr ? 'حجم الصورة كبير، يرجى اختيار صورة أقل من 5 ميغابايت' : 'Taille max 5 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setStudentCardImage(reader.result as string);
    };
    reader.onerror = () => {
      setImageError(isAr ? 'تعذر قراءة الصورة، حاول مجدداً' : 'Erreur de lecture de l’image.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setImageError(null);

    if (!userEmail) {
      alert(isAr ? 'يرجى تسجيل الدخول أولاً بحسابك لطلب البطاقة' : 'Connexion requise');
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (!validatePhone(cleanPhone)) {
      setPhoneError(isAr ? 'يجب إدخال 10 أرقام صحيحة تبدأ بـ 0 (مثال: 0797034244)' : 'Numéro invalide (10 chiffres).');
      return;
    }

    if (!fullName.trim()) {
      alert(isAr ? 'يرجى إدخال اسمك الحقيقي الكامل كما يظهر في الوثائق الرسمية' : 'Nom complet requis.');
      return;
    }

    if (selectedTier === 'STUDENT' && !studentCardImage) {
      setImageError(isAr ? 'إلزامي: يجب رفع صورة بطاقة الطالب الجامعية للمصادقة وتأكيد هويتك' : 'La photo de la carte d’étudiant est obligatoire.');
      return;
    }

    setSubmitting(true);
    try {
      const newRequest: MemberCardRequest = {
        fullName: fullName.trim(),
        customCardName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        tierRequested: selectedTier,
        university: university.trim() || undefined,
        studentCardImageUrl: studentCardImage || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'card_requests'), newRequest);
      const savedWithId = { ...newRequest, id: docRef.id };

      try {
        localStorage.setItem(`gc58_card_request_${email.trim().toLowerCase()}`, JSON.stringify(savedWithId));
      } catch {}

      setSuccessMsg(true);
      onRequestSubmitted(savedWithId);
    } catch (err) {
      console.error('Error submitting card request:', err);
      alert(isAr ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً.' : 'Erreur lors de l’envoi de la demande.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCardDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = editPhone.replace(/\s+/g, '');
    if (!validatePhone(cleanPhone)) {
      alert(isAr ? 'يجب إدخال 10 أرقام صحيحة تبدأ بـ 0' : 'Numéro invalide');
      return;
    }
    if (!editName.trim()) {
      alert(isAr ? 'يرجى كتابة الاسم الذي تريده على البطاقة' : 'Nom requis');
      return;
    }

    try {
      if (onUpdateDetails) {
        await onUpdateDetails(editName.trim(), cleanPhone);
      } else if (existingRequest?.id) {
        await updateDoc(doc(db, 'card_requests', existingRequest.id), {
          fullName: editName.trim(),
          customCardName: editName.trim(),
          phone: cleanPhone,
          customPhone: cleanPhone,
        });
      }

      const updated = {
        ...(existingRequest || {}),
        fullName: editName.trim(),
        customCardName: editName.trim(),
        phone: cleanPhone,
        customPhone: cleanPhone,
      } as MemberCardRequest;

      try {
        localStorage.setItem(`gc58_card_request_${userEmail.trim().toLowerCase()}`, JSON.stringify(updated));
      } catch {}

      onRequestSubmitted(updated);
      setSaveEditSuccess(true);
      setIsEditingCard(false);
      setTimeout(() => setSaveEditSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating card details:', err);
      alert(isAr ? 'حدث خطأ أثناء حفظ التعديلات' : 'Erreur de modification');
    }
  };

  // If user is not logged in: must be signed in to request card
  if (!userEmail) {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mb-1.5">
            {isAr ? '🎁 مجاناً 100% - دون شراء دورة' : '100% Gratuit - Sans achat'}
          </span>
          <h3 className="text-base sm:text-lg font-black text-white">
            {isAr ? 'سجل حسابك واطلب بطاقتك مباشرة' : 'Créez votre compte et demandez votre carte'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'بطاقة ستاندار (10%) أو بطاقة طالب جامعي (20%) متاحة مجاناً وتعتمد فوراً من الأدمين.'
              : 'Carte Standard (10%) ou Étudiant (20%) gratuite après validation.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-950" />
              <span>{isAr ? 'تسجيل الدخول / فتح حساب' : 'Connexion / Inscription'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            {showDetails ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من التفاصيل ▾' : 'Détails ▾')}
          </button>
        </div>

        {showDetails && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-right space-y-2 animate-fadeIn mt-2">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr
                ? '• بطاقة ستاندار: تمنحك تخفيض 10% فوري على كل الدورات وتجميع نقاط الزيارات.'
                : '• Carte Standard : 10% de remise immédiate et cumul de points.'}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr
                ? '• بطاقة طالب جامعي: تمنحك تخفيض 20% (مميزات PRO كاملة) وتتطلب فقط رفع صورة بطاقة الطالب الخاصة بك لنفس الاسم.'
                : '• Carte Étudiant : 20% de remise (statut PRO) sur justificatif étudiant.'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // If already has an approved card
  if (existingRequest?.status === 'approved') {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-black text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>
              {isAr 
                ? `تهانينا! بطاقتك (${existingRequest.tierRequested === 'STUDENT' ? 'طالب جامعي 🎓' : 'Standard 💳'}) مفعلة ومعتمدة رسمياً!` 
                : 'Votre carte est validée et active !'}
            </span>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            {isAr
              ? `تم التحقق والمصادقة من طرف الأدمين. نسبة التخفيض (${existingRequest.tierRequested === 'STUDENT' ? '20%' : '10%'}) مطبقة تلقائياً على حسابك باسم (${existingRequest.customCardName || existingRequest.fullName}).`
              : 'Votre statut donne droit aux réductions et avantages exclusifs sur l’ensemble du site.'}
          </p>
        </div>

        {/* Change Cardholder Name & Phone */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'الاسم ورقم الهاتف المسجل على البطاقة:' : 'Coordonnées sur la carte :'}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsEditingCard(!isEditingCard)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingCard ? (isAr ? 'إلغاء التعديل' : 'Annuler') : (isAr ? 'تعديل الاسم أو رقم الهاتف ✏️' : 'Modifier')}</span>
            </button>
          </div>

          {!isEditingCard ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">{isAr ? 'الاسم على البطاقة:' : 'Nom sur la carte :'}</span>
                <span className="font-bold text-white">{existingRequest.customCardName || existingRequest.fullName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">{isAr ? 'رقم الهاتف:' : 'Téléphone :'}</span>
                <span className="font-mono font-bold text-amber-300" dir="ltr">{existingRequest.phone}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateCardDetails} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isAr ? 'الاسم الجديد على البطاقة:' : 'Nouveau nom sur la carte :'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف (10 أرقام):' : 'Numéro de téléphone (10 chiffres) :'}
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    dir="ltr"
                    required
                    maxLength={10}
                    placeholder="0797034244"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حفظ التعديلات على البطاقة' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          )}

          {saveEditSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تم تحديث الاسم ورقم الهاتف على بطاقتك بنجاح!' : 'Coordonnées mises à jour avec succès !'}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If request is pending validation by admin
  if (existingRequest?.status === 'pending') {
    return (
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-3">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              <span>
                {isAr 
                  ? `طلبك (${existingRequest.tierRequested === 'STUDENT' ? 'طالب جامعي 🎓' : 'ستوندار 💳'}) في انتظار مصادقة الأدمين` 
                  : 'Demande en cours de validation'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              {showDetails ? (isAr ? 'إخفاء' : 'Fermer') : (isAr ? 'مزيد من التفاصيل ▾' : 'Détails ▾')}
            </button>
          </div>
          {showDetails && (
            <p className="text-[11px] text-amber-200/90 leading-relaxed pt-2 border-t border-amber-500/20">
              {isAr
                ? `تم استلام طلبك باسم: "${existingRequest.customCardName || existingRequest.fullName}". الإدارة تدقق البيانات وسيتم تفعيل التخفيض تلقائياً فور الموافقة دون الحاجة لشراء أي دورة.`
                : 'Votre demande est en cours de traitement par l’administrateur.'}
            </p>
          )}
        </div>

        {/* Edit name & phone even during pending */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'تعديل اسمك ورقم هاتفك للبطاقة قبل الاعتماد:' : 'Modifier coordonnées :'}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsEditingCard(!isEditingCard)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingCard ? (isAr ? 'إلغاء' : 'Annuler') : (isAr ? 'تعديل ✏️' : 'Modifier')}</span>
            </button>
          </div>

          {isEditingCard && (
            <form onSubmit={handleUpdateCardDetails} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isAr ? 'الاسم المراد ظهوره على البطاقة:' : 'Nom sur la carte :'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف (10 أرقام):' : 'Numéro de téléphone :'}
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    dir="ltr"
                    required
                    maxLength={10}
                    placeholder="0797034244"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حفظ التعديل' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          )}

          {saveEditSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تم تحديث البيانات بنجاح!' : 'Mise à jour réussie !'}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-black mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'طلب بطاقة العضوية والخصومات (مجاناً 100%)' : 'Demande de Carte (Gratuite)'}</span>
        </div>
        <h3 className="text-sm sm:text-base font-black text-white">
          {isAr ? 'اختر بطاقتك وسيقوم الأدمين بمصادقتها دون شراء دورة' : 'Choisissez votre carte sans achat préalable'}
        </h3>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {isAr 
              ? 'تم إرسال طلب البطاقة بنجاح! سيقوم الأدمين بالمصادقة عليها قريباً.' 
              : 'Demande envoyée avec succès !'}
          </span>
        </div>
      )}

      {/* Tier Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedTier('STUDENT')}
          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            selectedTier === 'STUDENT'
              ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              {isAr ? 'تخفيض 20% (PRO)' : '20% PRO'}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-black text-white mb-0.5">
            {isAr ? 'بطاقة طالب جامعي 🎓' : 'Carte Étudiant 🎓'}
          </h4>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'مميزات PRO كاملة (تتطلب رفع صورة بطاقة الطالب لنفس الاسم).' : 'Avantages PRO (justificatif requis).'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTier('STANDARD')}
          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            selectedTier === 'STANDARD'
              ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/60 shadow-md shadow-amber-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              {isAr ? 'تخفيض 10%' : '10%'}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-black text-white mb-0.5">
            {isAr ? 'بطاقة ستوندار 💳' : 'Carte Standard 💳'}
          </h4>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'تخفيض 10% فوري ومتاحة للجميع مجاناً دون شروط.' : '10% de remise immédiate pour tous.'}
          </p>
        </button>
      </div>

      {/* The Request Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Real Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'الاسم واللقب الحقيقي الكامل (كما يظهر بالوثائق الرسمية) *' : 'Nom et Prénom Réel Complet *'}</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isAr ? 'مثال: محمد الأمين سعد الله' : 'Ex: Mohamed Amine'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'رقم الهاتف (10 أرقام) *' : 'Téléphone (10 chiffres) *'}</span>
            </label>
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError(null);
              }}
              placeholder="0797034244"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-slate-100 font-mono text-xs sm:text-sm focus:outline-none ${
                phoneError ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {phoneError && <p className="text-[11px] text-rose-400 mt-1">{phoneError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'البريد الإلكتروني *' : 'Email *'}</span>
            </label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* University field for student */}
        {selectedTier === 'STUDENT' && (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'الجامعة أو الكلية والتخصص الهندسي *' : 'Université et Spécialité *'}</span>
            </label>
            <input
              type="text"
              required
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder={isAr ? 'مثال: جامعة العلوم والتكنولوجيا هواري بومدين (USTHB) - هندسة مدنية' : 'Ex: Université USTHB - Génie Civil'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* MANDATORY STUDENT CARD PHOTO UPLOAD */}
        {selectedTier === 'STUDENT' && (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'رفع صورة بطاقة الطالب الرسمية (إلزامي) *' : 'Photo de la carte d’étudiant (Obligatoire) *'}</span>
              </label>
              {studentCardImage && (
                <button
                  type="button"
                  onClick={() => setStudentCardImage(null)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
                >
                  {isAr ? 'حذف الصورة' : 'Supprimer'}
                </button>
              )}
            </div>

            {/* Strict Name Matching Warning */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isAr
                  ? '⚠️ إجراء إداري صارم: يجب أن تكون بطاقة الطالب الجامعية المرفوعة حاملة لنفس اسمك الحقيقي الذي سجلت به في الخانة أعلاه. لن يقبل الأدمين أي بطاقة باسم مختلف.'
                  : '⚠️ Condition stricte : Le nom sur la carte d’étudiant doit être strictement identique au nom saisi.'}
              </p>
            </div>

            {studentCardImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 max-h-56 flex items-center justify-center p-2">
                <img
                  src={studentCardImage}
                  alt="Student Card Preview"
                  className="max-h-48 w-auto object-contain rounded-xl"
                />
              </div>
            ) : (
              <label className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/70">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-200">
                  {isAr ? 'اضغط هنا لرفع صورة بطاقة الطالب من هاتفك أو جهازك' : 'Cliquez pour choisir une photo de la carte'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  {isAr ? 'JPG, PNG أو التقاط صورة واضحة بالكاميرا (حد أقصى 5MB)' : 'JPG, PNG max 5 Mo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {imageError && <p className="text-[11px] text-rose-400 font-bold">{imageError}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            selectedTier === 'STUDENT'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
              : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {submitting ? (
            <span>{isAr ? 'جاري إرسال الطلب للأدمين...' : 'Envoi en cours...'}</span>
          ) : (
            <>
              <span>
                {selectedTier === 'STUDENT'
                  ? (isAr ? 'إرسال طلب بطاقة الطالب الجامعي للأدمين للمصادقة 🎓' : 'Envoyer la demande de Carte Étudiant')
                  : (isAr ? 'إرسال طلب بطاقة ستوندار للأدمين للمصادقة 💳' : 'Envoyer la demande Standard')}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

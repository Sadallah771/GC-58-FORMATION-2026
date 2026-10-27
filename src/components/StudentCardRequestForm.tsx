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
  Building
} from 'lucide-react';
import { Language, MemberCardRequest } from '../types';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface StudentCardRequestFormProps {
  language: Language;
  userEmail: string;
  userName: string;
  existingRequest?: MemberCardRequest | null;
  onRequestSubmitted: (req: MemberCardRequest) => void;
}

export const StudentCardRequestForm: React.FC<StudentCardRequestFormProps> = ({
  language,
  userEmail,
  userName,
  existingRequest,
  onRequestSubmitted,
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

  // Phone validation (exact 10 digits starting with 0)
  const validatePhone = (p: string) => {
    const clean = p.replace(/\s+/g, '');
    const regex = /^0[567][0-9]{8}$/;
    return regex.test(clean);
  };

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

  // If already has an approved card
  if (existingRequest?.status === 'approved') {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
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
            ? `تم التحقق والمصادقة من طرف الأدمين. نسبة التخفيض (${existingRequest.tierRequested === 'STUDENT' ? '20%' : '10%'}) مطبقة تلقائياً على حسابك (${existingRequest.fullName}).`
            : 'Votre statut donne droit aux réductions et avantages exclusifs sur l’ensemble du site.'}
        </p>
      </div>
    );
  }

  // If request is pending validation by admin
  if (existingRequest?.status === 'pending') {
    return (
      <div className="p-5 sm:p-7 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-3">
        <div className="flex items-center gap-2.5 font-black text-sm sm:text-base">
          <Clock className="w-5 h-5 text-amber-400 animate-spin" />
          <span>
            {isAr 
              ? `طلبك (${existingRequest.tierRequested === 'STUDENT' ? 'بطاقة طالب جامعي 🎓' : 'بطاقة ستوندار 💳'}) قيد التدقيق الإداري والمطابقة` 
              : 'Demande de carte en cours de validation'}
          </span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          {isAr
            ? `لقد تم استلام طلبك بنجاح باسم: "${existingRequest.fullName}". الإدارة تقوم بمطابقة الاسم مع بطاقة الطالب المرفوعة. بمجرد موافقة الأدمين، ستصبح البطاقة مفعلة مباشرة في حسابك.`
            : 'Votre demande est en cours d’examen par l’administration. La carte sera activée dès validation.'}
        </p>
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>{isAr ? 'حالة الطلب:' : 'Statut :'}</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono">
            {isAr ? 'في انتظار مصادقة الأدمين ⏳' : 'En attente'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'طلب بطاقة العضوية والخصومات (متاحة للجميع مجاناً)' : 'Demande de Carte d’Adhérent'}</span>
        </div>
        <h3 className="text-base sm:text-xl font-black text-white">
          {isAr ? 'سجل واحصل على بطاقتك المعتمدة دون الحاجة لشراء دورة' : 'Obtenez votre carte sans achat préalable'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'اختر نوع البطاقة: بطاقة طالب جامعي (مميزات فئة البرو 20%) أو بطاقة Standard (10%). البطاقة تُفعل بعد تدقيق ومصادقة الأدمين.'
            : 'Choisissez votre formule : Carte Étudiant (avantages PRO 20%) ou Standard (10%).'}
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {isAr 
              ? 'تم إرسال طلب البطاقة بنجاح! سيقوم الأدمين بمطابقة الاسم والموافقة عليها قريباً.' 
              : 'Demande envoyée avec succès !'}
          </span>
        </div>
      )}

      {/* Tier Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedTier('STUDENT')}
          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            selectedTier === 'STUDENT'
              ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              {isAr ? 'مميزات الـ PRO (تخفيض 20%)' : 'Avantages PRO 20%'}
            </span>
          </div>
          <h4 className="text-sm font-black text-white mb-1">
            {isAr ? 'بطاقة طالب جامعي 🎓 (Carte Étudiant)' : 'Carte Étudiant BTP 🎓'}
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isAr 
              ? 'مخصصة للطلبة - تخفيض 20% وكتب ومذكرات تخرج مجانية (تتطلب رفع صورة بطاقة الطالب لنفس الاسم).' 
              : '20% de remise et livres gratuits (photo de carte requise).'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTier('STANDARD')}
          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            selectedTier === 'STANDARD'
              ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              {isAr ? 'تخفيض 10%' : '10% Réduction'}
            </span>
          </div>
          <h4 className="text-sm font-black text-white mb-1">
            {isAr ? 'بطاقة ستوندار 💳 (GC58 Standard)' : 'Carte Standard 💳'}
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isAr 
              ? 'متاحة للجميع دون شراء - تخفيض 10%، الدورة الهدية والكتب المرفوعة في الموقع.' 
              : 'Accessible à tous sans achat préalable (10% de remise).'}
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

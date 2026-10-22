import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Building, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Course, Language, Review } from '../types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  courses: Course[];
  preselectedCourseId?: string;
  onReviewAdded?: (newReview: Review) => void;
}

const RATING_LABELS_AR: Record<number, string> = {
  1: 'بحاجة لتحسين (1/5)',
  2: 'مقبول (2/5)',
  3: 'جيد ومفيد (3/5)',
  4: 'ممتاز جداً (4/5)',
  5: 'رائع واستثنائي - أنصح به بشدة! (5/5) ⭐',
};

const RATING_LABELS_FR: Record<number, string> = {
  1: 'À améliorer (1/5)',
  2: 'Passable (2/5)',
  3: 'Bonne formation (3/5)',
  4: 'Très satisfait (4/5)',
  5: 'Exceptionnel & Hautement recommandé ! (5/5) ⭐',
};

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  language,
  courses,
  preselectedCourseId,
  onReviewAdded,
}) => {
  const { user } = useAuth();
  const isAr = language === 'ar';

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    preselectedCourseId || courses[0]?.id || 'etabs-ba-r4'
  );
  const [authorName, setAuthorName] = useState<string>('');
  const [authorTitle, setAuthorTitle] = useState<string>('');
  const [authorWilaya, setAuthorWilaya] = useState<string>('Alger (16)');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync user info if logged in with Google
  useEffect(() => {
    if (user) {
      if (user.displayName) setAuthorName(user.displayName);
      else if (user.email) setAuthorName(user.email.split('@')[0]);
    } else {
      const saved = localStorage.getItem('gc58_reviewer_name');
      if (saved) setAuthorName(saved);
    }
  }, [user]);

  // Sync preselected course
  useEffect(() => {
    if (preselectedCourseId) {
      setSelectedCourseId(preselectedCourseId);
    } else if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [preselectedCourseId, courses]);

  if (!isOpen) return null;

  const activeRating = hoverRating || rating;
  const ratingLabels = isAr ? RATING_LABELS_AR : RATING_LABELS_FR;
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة نص التقييم أو رأيك.' : 'Veuillez saisir votre commentaire.');
      return;
    }
    if (!authorName.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسمك الكريم.' : 'Veuillez indiquer votre nom.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      userId: user?.uid || 'guest-' + Date.now(),
      userName: authorName.trim(),
      userTitle: authorTitle.trim() || (isAr ? 'مهندس دولة في الهندسة المدنية' : 'Ingénieur Génie Civil'),
      userWilaya: authorWilaya.trim() || undefined,
      courseId: selectedCourseId,
      courseTitle: selectedCourse?.title || 'Formation Génie Civil GC58',
      rating: rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save to local storage for instant immediate display
    try {
      localStorage.setItem('gc58_reviewer_name', authorName.trim());
      const existingStr = localStorage.getItem('gc58_custom_reviews');
      const existing: Review[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(newReview);
      localStorage.setItem('gc58_custom_reviews', JSON.stringify(existing));
    } catch (e) {
      console.warn('Local review cache info:', e);
    }

    // Save to Firestore
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: newReview.userId,
        userName: newReview.userName,
        userTitle: newReview.userTitle,
        userWilaya: newReview.userWilaya,
        courseId: newReview.courseId,
        courseTitle: newReview.courseTitle,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: newReview.createdAt,
      });
    } catch (err: any) {
      console.warn('Firestore review save fallback:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    if (onReviewAdded) {
      onReviewAdded(newReview);
    }

    setTimeout(() => {
      setIsSuccess(false);
      setComment('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{isAr ? 'أضف تقييمك ورأيك في الدورة' : 'Donnez votre avis'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  ⭐ 5 نجوم
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'تقييمك يُعرض مباشرة في المنصة مرتباً بالأحدث لمساعدة زملائك المهندسين' : 'Votre avis sera affiché en tête de liste'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-black text-white">
                {isAr ? 'شكراً جزيلاً لتقييمك القيّم! 🇩🇿' : 'Merci pour votre retour !'}
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? 'تم تسجيل ونشر تقييمك بنجاح باسمك وسيظهر مباشرة في أعلى قائمة التقييمات (الأحدث بالأحدث).'
                  : 'Votre avis a été publié avec succès au sommet des témoignages récents.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Star Rating Selector (Interactive 1-5) */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  {isAr ? 'حدد تقييمك بالنجوم (1 إلى 5):' : 'Sélectionnez votre note (1 à 5 étoiles) :'}
                </span>

                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      title={`${s} / 5`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          s <= activeRating
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-700 hover:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-amber-400 h-5">
                  {ratingLabels[activeRating]}
                </div>
              </div>

              {/* User Account / Identity Info */}
              <div className="space-y-3">
                {user ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                        {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-emerald-400 block font-semibold">
                          {isAr ? '✓ سيتم نشر التقييم باسم حسابك الموثق:' : '✓ Avis certifié via votre compte :'}
                        </span>
                        <strong className="text-white text-xs font-bold truncate block">
                          {user.displayName || user.email}
                        </strong>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
                      Google ID
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block">
                      {isAr ? 'اسمك واللقب (أو اسم حسابك):' : 'Votre Nom & Prénom :'}
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={isAr ? 'مثال: أسامة بلقاسم' : 'Ex : Oussama Belkacem'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      {isAr ? 'الصفة أو التخصص:' : 'Profession / Titre :'}
                    </label>
                    <input
                      type="text"
                      value={authorTitle}
                      onChange={(e) => setAuthorTitle(e.target.value)}
                      placeholder={isAr ? 'مهندس مكتب دراسات / طالب ماستر' : 'Ingénieur d’études / Master'}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      {isAr ? 'الولاية:' : 'Wilaya :'}
                    </label>
                    <input
                      type="text"
                      value={authorWilaya}
                      onChange={(e) => setAuthorWilaya(e.target.value)}
                      placeholder={isAr ? 'الجزائر (16) أو سطيف (19)...' : 'Alger (16)...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isAr ? 'الدورة التدريبية المراد تقييمها:' : 'Formation concernée :'}
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.category === 'beton_arme' ? 'خرسانة' : course.category === 'charpente_metallique' ? 'شاربونت' : 'طرقات'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Review Comment */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isAr ? 'رأيك وتجربتك بالتفصيل:' : 'Votre retour d’expérience :'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ما رأيك في طريقة الشرح، الملفات ونماذج الحساب CTC، متابعة الأساتذة والدعم الفني؟'
                      : 'Qualité des explications, conformité CTC, fichiers RTD/Excel fournis...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>
                    {isSubmitting
                      ? (isAr ? 'جاري النشر...' : 'Publication...')
                      : (isAr ? 'نشر التقييم فورياً' : 'Publier mon avis')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

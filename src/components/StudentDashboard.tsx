import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Star, 
  Download, 
  Clock, 
  Layers, 
  Sparkles, 
  Send, 
  LogIn, 
  Video, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Course, Language, Registration, Review } from '../types';
import { COURSES_DATA } from '../data/coursesData';

interface StudentDashboardProps {
  language: Language;
  onOpenAuth: () => void;
  onOpenEnroll: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  language,
  onOpenAuth,
  onOpenEnroll,
}) => {
  const { user } = useAuth();
  const isAr = language === 'ar';

  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Course Progress State (saved in localStorage for instant tracking)
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('dz_student_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Review & Evaluation state
  const [reviewCourseId, setReviewCourseId] = useState(COURSES_DATA[0].id);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch student orders from Firestore
  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);

    try {
      // Query by userId or email
      const q = query(collection(db, 'registrations'), where('email', '==', user.email?.toLowerCase()));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Registration[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Registration) });
          });
          setMyRegistrations(list);
          setLoadingOrders(false);
        },
        () => setLoadingOrders(false)
      );

      return () => unsubscribe();
    } catch (e) {
      setLoadingOrders(false);
    }
  }, [user]);

  const toggleLessonProgress = (courseId: string, topicName: string) => {
    const current = completedLessons[courseId] || [];
    let updated: string[];
    if (current.includes(topicName)) {
      updated = current.filter((t) => t !== topicName);
    } else {
      updated = [...current, topicName];
    }
    const newProgress = { ...completedLessons, [courseId]: updated };
    setCompletedLessons(newProgress);
    localStorage.setItem('dz_student_progress', JSON.stringify(newProgress));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    const targetCourse = COURSES_DATA.find((c) => c.id === reviewCourseId);

    const newReview: Review = {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Ingénieur Étudiant',
      userTitle: 'Étudiant Certifié DZ Academy',
      courseId: reviewCourseId,
      courseTitle: targetCourse?.title || reviewCourseId,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'reviews'), newReview);
      setReviewSuccess(true);
      setReviewComment('');
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="py-16 max-w-3xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">
              {isAr ? 'مرحباً بك في لوحة تحكم الطالب' : 'Bienvenue dans votre Espace Étudiant'}
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              {isAr
                ? 'سجل الدخول بضغطة زر واحدة باستخدام Google أو ببريدك الإلكتروني لمتابعة دوراتك، تقييم أدائك، وتحميل ملفات العمل والشهادات.'
                : 'Connectez-vous pour suivre votre progression de cours, télécharger les modèles de calcul CTC, et évaluer vos formations.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={onOpenAuth}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Connexion ou Inscription rapide'}</span>
            </button>
            <button
              onClick={onOpenEnroll}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
            >
              {isAr ? 'التسجيل في دورة جديدة' : 'S’inscrire à une formation'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Student Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {user.displayName || user.email?.split('@')[0]}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {isAr ? 'حساب مهندس طالب' : 'Compte Étudiant'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
          </div>
        </div>

        <button
          onClick={onOpenEnroll}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/15 hover:scale-105 transition-all"
        >
          {isAr ? '+ التسجيل في دورة أخرى' : '+ S’inscrire à une nouvelle formation'}
        </button>
      </div>

      {/* Grid: Registrations & Course Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Orders & Requests */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'طلباتي وتسجيلاتي' : 'Mes Inscriptions & Dossiers'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              {myRegistrations.length}
            </span>
          </div>

          {loadingOrders ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              {isAr ? 'جاري جلب الطلبات...' : 'Chargement...'}
            </div>
          ) : myRegistrations.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">
                {isAr ? 'لم تقم بالتسجيل في أي دورة بعد.' : 'Aucun dossier de formation pour le moment.'}
              </p>
              <button
                onClick={onOpenEnroll}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                {isAr ? 'سجل في دورتك الأولى الآن' : 'Choisir ma formation'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white line-clamp-2">{reg.courseNames}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        reg.status === 'en_attente'
                          ? 'bg-amber-500/20 text-amber-400'
                          : reg.status === 'paye'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {reg.status === 'en_attente'
                        ? (isAr ? 'في انتظار الاتصال' : 'En attente d’appel')
                        : reg.status === 'paye'
                        ? (isAr ? 'مدفوع ومؤكد' : 'Validé & Actif')
                        : (isAr ? 'مؤكد' : 'Confirmé')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-extrabold text-amber-400">{reg.totalAmount.toLocaleString()} دج</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Access to Resources */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'مستندات التكوين المتاحة' : 'Fichiers & Modèles inclus'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-slate-300">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Modèles 3D Robot & ETABS (.rtd, .edb)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Inclus</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-slate-300">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Note de calcul type validée CTC (.pdf)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Inclus</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-slate-300">
                <span className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>Accès aux rediffusions HD à vie</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">À vie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Column: Interactive Course Progression & Review Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progression Tracker */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'متابعة تقدم المستوى والدروس المكتملة' : 'Suivi de Progression Pédagogique'}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'ضع علامة أمام كل درس قمت بإنهائه لمتابعة نسبة استيعابك وتطور مستواك في البرامج'
                  : 'Cochez les modules assimilés pour suivre l’évolution de vos compétences'}
              </p>
            </div>

            {/* Select course to view modules */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {COURSES_DATA.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setReviewCourseId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      reviewCourseId === c.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {c.software}
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              {(() => {
                const target = COURSES_DATA.find((c) => c.id === reviewCourseId) || COURSES_DATA[0];
                const allTopics = target.syllabus.flatMap((m) => m.topics);
                const completed = completedLessons[target.id] || [];
                const percent = allTopics.length > 0 ? Math.round((completed.length / allTopics.length) * 100) : 0;

                return (
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{target.title}</h4>
                        <span className="text-xs text-slate-400">{completed.length} sur {allTopics.length} modules validés</span>
                      </div>
                      <span className="text-xl font-black text-amber-400">{percent}%</span>
                    </div>

                    {/* Progress bar track */}
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Module checklists */}
                    <div className="space-y-3 pt-2">
                      {target.syllabus.map((mod, mIdx) => (
                        <div key={mIdx} className="space-y-1.5">
                          <p className="text-xs font-bold text-slate-300">{mod.title}</p>
                          <div className="space-y-1 pl-2">
                            {mod.topics.map((top, tIdx) => {
                              const isChecked = (completedLessons[target.id] || []).includes(top);
                              return (
                                <label
                                  key={tIdx}
                                  className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleLessonProgress(target.id, top)}
                                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700 mt-0.5 cursor-pointer"
                                  />
                                  <span className={isChecked ? 'line-through text-slate-500' : ''}>
                                    {top}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Student Evaluation / Review System */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{isAr ? 'نظام تقييم الدورة التدريبية والمدرب' : 'Évaluation de la Formation (Avis Étudiant)'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr
                  ? 'شارك رأيك وتقييمك الصادق بعد نهاية الدورة لمساعدة زملائك المهندسين وإثراء المنصة'
                  : 'Partagez votre retour d’expérience et votre note après avoir suivi la formation'}
              </p>
            </div>

            {reviewSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>
                  {isAr
                    ? 'شكراً جزيلاً لك! تم حفظ تقييمك ونشره في قائمة الآراء.'
                    : 'Merci beaucoup ! Votre évaluation a été enregistrée avec succès.'}
                </span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isAr ? 'اختر الدورة المنجزة' : 'Formation évaluée'}
                  </label>
                  <select
                    value={reviewCourseId}
                    onChange={(e) => setReviewCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {COURSES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isAr ? 'العلامة / التقييم (من 1 إلى 5 نجوم)' : 'Note attribuée (1 à 5 étoiles)'}
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">{reviewRating} / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'تعليقك وتقييمك التفصيلي للمحتوى والتطبيق' : 'Votre avis & commentaire d’évaluation'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ما رأيك في جودة الشرح، التمارين، ملفات العمل، واستجابة المهندس المكوّن؟...'
                      : 'Qualité des explications, projets concrets, réactivité du formateur...'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting || !reviewComment.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{reviewSubmitting ? (isAr ? 'جاري الإرسال...' : 'Publication...') : (isAr ? 'إرسال التقييم النهائي' : 'Publier mon évaluation')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

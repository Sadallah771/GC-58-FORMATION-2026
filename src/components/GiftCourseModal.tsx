import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Play, 
  CheckCircle, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  FileText,
  RotateCcw,
  Film,
  LogIn,
  UserCheck
} from 'lucide-react';
import { GiftCourseSettings, GiftEpisode, Language } from '../types';
import { getEmbeddableVideoUrl } from '../utils/driveHelper';

interface GiftCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  giftCourse: GiftCourseSettings;
  sitePhone: string;
  isAdmin?: boolean;
  user?: any;
  onOpenAuth?: () => void;
}

export const GiftCourseModal: React.FC<GiftCourseModalProps> = ({
  isOpen,
  onClose,
  language,
  giftCourse,
  sitePhone,
  isAdmin = false,
  user,
  onOpenAuth,
}) => {
  const isAr = language === 'ar';

  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);
  const [completedEpisodeIds, setCompletedEpisodeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gc58_gift_completed_eps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check saved unlocked state strictly for this logged-in user against current secret code
  useEffect(() => {
    if (isOpen) {
      if (!user) {
        setIsUnlocked(false);
        return;
      }
      try {
        const expectedCode = (giftCourse.secretAccessCode || 'GC58-GIFT').trim().toUpperCase();
        const savedCode = localStorage.getItem(`gc58_gift_unlocked_code_${user.uid}`);
        if (savedCode && savedCode === expectedCode) {
          setIsUnlocked(true);
        } else {
          // If code was changed by admin or doesn't match, relock immediately!
          setIsUnlocked(false);
          if (savedCode && savedCode !== expectedCode) {
            localStorage.removeItem(`gc58_gift_unlocked_code_${user.uid}`);
            localStorage.removeItem(`gc58_gift_unlocked_${user.uid}`);
          }
        }
      } catch {
        setIsUnlocked(false);
      }
    }
  }, [isOpen, user, giftCourse.secretAccessCode]);

  if (!isOpen) return null;

  const currentEpisode: GiftEpisode | undefined = giftCourse.episodes[activeEpisodeIndex] || giftCourse.episodes[0];
  const activeVideoUrl = currentEpisode 
    ? (currentEpisode.previewEmbedUrl || getEmbeddableVideoUrl(currentEpisode.driveUrl))
    : '';

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth?.();
      return;
    }

    const cleanInput = inputCode.trim().toUpperCase();
    const correctCode = (giftCourse.secretAccessCode || 'GC58-GIFT').trim().toUpperCase();

    if (cleanInput === correctCode || (isAdmin && cleanInput === 'ADMIN')) {
      setIsUnlocked(true);
      setCodeError('');
      try {
        localStorage.setItem(`gc58_gift_unlocked_code_${user.uid}`, correctCode);
        localStorage.setItem(`gc58_gift_unlocked_${user.uid}`, 'true');
      } catch {
        // ignore
      }
    } else {
      setCodeError(
        isAr 
          ? 'الكود المدخل غير صحيح أو تم تحديثه! يرجى إدخال الكود الجديد المعتمد أو مراسلتنا عبر الواتساب للحصول عليه.' 
          : 'Code d’accès invalide ou expiré. Veuillez saisir le nouveau code fourni par l’administration.'
      );
    }
  };

  const handleRelock = () => {
    if (user) {
      try {
        localStorage.removeItem(`gc58_gift_unlocked_${user.uid}`);
        localStorage.removeItem(`gc58_gift_unlocked_code_${user.uid}`);
      } catch {
        // ignore
      }
    }
    setIsUnlocked(false);
    setInputCode('');
    setCodeError('');
  };

  const toggleCompleteEpisode = (epId: string) => {
    let updated: string[];
    if (completedEpisodeIds.includes(epId)) {
      updated = completedEpisodeIds.filter((id) => id !== epId);
    } else {
      updated = [...completedEpisodeIds, epId];
    }
    setCompletedEpisodeIds(updated);
    try {
      localStorage.setItem('gc58_gift_completed_eps', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const whatsappCodeRequestUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr 
      ? `السلام عليكم، أريد الحصول على كود فتح الدورة المجانية (${giftCourse.title}).`
      : `Bonjour, je souhaite obtenir le code d'accès à la formation gratuite (${giftCourse.title}).`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-6xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
              isUnlocked ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
            }`}>
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400">
                  {isAr ? 'هدية الموقع الحصرية' : 'Cadeau Exclusif'}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">
                  {isUnlocked 
                    ? (isAr ? 'تم فتح التشفير بنجاح' : 'Accès Débloqué')
                    : (isAr ? 'محتوى مشفر بكود' : 'Contenu Sécurisé')}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white truncate max-w-md sm:max-w-xl">
                {giftCourse.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleRelock}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                title="إعادة قفل الدورة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'قفل الدورة' : 'Verrouiller'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {!user ? (
            /* LOGIN REQUIRED VIEW */
            <div className="p-8 sm:p-14 max-w-xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
                <Lock className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'يجب تسجيل الدخول إلى حسابك أولاً' : 'Connexion requise'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {isAr
                    ? 'مشاهدة الدورة الهدية المجانية واستخدام كود فك التشفير متاح حصرياً للمهندسين والطلبة المسجلين من داخل حساباتهم.'
                    : 'La formation cadeau est accessible uniquement depuis votre compte étudiant.'}
                </p>
              </div>

              <div className="pt-2 max-w-sm mx-auto space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth?.();
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4 text-slate-950" />
                  <span>{isAr ? 'تسجيل الدخول / إنشاء حساب مجاني' : 'Se connecter / S’inscrire'}</span>
                </button>
              </div>
            </div>
          ) : !isUnlocked ? (
            /* LOCKED STATE: Code Entry View */
            <div className="p-6 sm:p-12 max-w-2xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
                <Lock className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'أدخل كود فك التشفير لمشاهدة الدورة' : 'Entrez votre code de déverrouillage'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {isAr
                    ? 'هذه الدورة مقدمة مجاناً لمهندسي وطلبة الهندسة المدنية. إذا لم تكن تملك الكود، يمكنك طلبه فوراً عبر الواتساب من إدارة الموقع مجاناً.'
                    : 'Cette formation est offerte gratuitement. Entrez votre code secret ou demandez-le sur WhatsApp.'}
                </p>
              </div>

              {/* Code Form */}
              <form onSubmit={handleUnlockSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setCodeError('');
                    }}
                    placeholder={isAr ? 'أدخل الكود السري هنا (مثال: GC58-GIFT)' : 'Code d’accès'}
                    dir="ltr"
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-amber-500 text-center text-lg font-mono font-bold tracking-widest text-amber-300 placeholder:text-slate-600 focus:outline-none transition-all"
                  />
                  {codeError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-right flex items-start gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{codeError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all active:scale-95"
                >
                  <Unlock className="w-4 h-4 text-slate-950" />
                  <span>{isAr ? 'فك التشفير وفتح الحلقات' : 'Déverrouiller la formation'}</span>
                </button>
              </form>

              {/* WhatsApp Request Kicker */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3 max-w-md mx-auto">
                <p className="text-xs text-slate-400">
                  {isAr ? 'ليس لديك كود بعد؟ تواصل معنا مباشرة على الواتساب:' : 'Vous n’avez pas encore de code ?'}
                </p>
                <a
                  href={whatsappCodeRequestUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-[#25D366]" />
                  <span>{isAr ? 'اطلب الكود عبر الواتساب (0797034244)' : 'Demander le code via WhatsApp'}</span>
                </a>
              </div>

              {/* Admin helper prompt if sadallah771 is viewing */}
              {isAdmin && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/40 text-emerald-300 text-xs">
                  <span>💡 تنبيه الأدمين: الكود السري الحالي المضبوط هو: </span>
                  <span className="font-mono font-bold text-amber-300 mr-1 ml-1">{giftCourse.secretAccessCode}</span>
                  <span>(يمكنك تغييره من لوحة التحكم في أي وقت).</span>
                </div>
              )}
            </div>
          ) : (
            /* UNLOCKED STATE: Full Video Player & Episodes Playlist */
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
              {/* Left / Main Column: Video Player & Episode Details (8 cols) */}
              <div className="lg:col-span-8 p-4 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* Responsive Video Container */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  {activeVideoUrl ? (
                    <iframe
                      src={activeVideoUrl}
                      title={currentEpisode?.title || 'GC58 Video Player'}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                      <Film className="w-12 h-12 text-slate-600" />
                      <p className="text-sm font-bold text-slate-300">
                        {isAr ? 'لم يتم ضبط رابط تشغيل لهذه الحلقة بعد' : 'Lien vidéo indisponible'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isAr ? 'يمكن للأدمين إضافة رابط Google Drive من لوحة التحكم' : 'L’administrateur peut configurer le lien dans le panneau d’admin.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Episode Meta & Action Bar */}
                {currentEpisode && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                          <span>{isAr ? `الحلقة رقم ${currentEpisode.order}` : `Épisode ${currentEpisode.order}`}</span>
                          {currentEpisode.duration && (
                            <>
                              <span>·</span>
                              <span className="font-mono">{currentEpisode.duration}</span>
                            </>
                          )}
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-white">
                          {currentEpisode.title}
                        </h4>
                      </div>

                      {/* Complete status toggle */}
                      <button
                        onClick={() => toggleCompleteEpisode(currentEpisode.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          completedEpisodeIds.includes(currentEpisode.id)
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {completedEpisodeIds.includes(currentEpisode.id)
                            ? (isAr ? 'تم إكمال المشاهدة' : 'Terminé')
                            : (isAr ? 'تحديد كمكتمل' : 'Marquer comme vu')}
                        </span>
                      </button>
                    </div>

                    {/* Description */}
                    {currentEpisode.description && (
                      <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
                        {currentEpisode.description}
                      </p>
                    )}

                    {/* Attachments / Files */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {currentEpisode.attachmentUrl && (
                        <a
                          href={currentEpisode.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-4 h-4 text-blue-400" />
                          <span>{currentEpisode.attachmentName || (isAr ? 'تحميل ملف العمل المرفق' : 'Télécharger le fichier joint')}</span>
                        </a>
                      )}

                      {currentEpisode.driveUrl && (
                        <a
                          href={currentEpisode.driveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                          <span>{isAr ? 'فتح الملف على Google Drive' : 'Ouvrir sur Drive'}</span>
                        </a>
                      )}

                      {giftCourse.driveFolderUrl && (
                        <a
                          href={giftCourse.driveFolderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-amber-400" />
                          <span>{isAr ? 'مجلد الدورة الكامل على Google Drive' : 'Dossier Drive complet'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Episodes Playlist (4 cols) */}
              <div className="lg:col-span-4 bg-slate-950/70 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      <span>{isAr ? 'قائمة الحلقات والدروس' : 'Épisodes de la formation'}</span>
                    </h5>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {completedEpisodeIds.length} / {giftCourse.episodes.length}
                    </span>
                  </div>

                  {/* Playlist Scroll Area */}
                  <div className="space-y-2 mt-3 max-h-[50vh] lg:max-h-[58vh] overflow-y-auto pr-1">
                    {giftCourse.episodes.map((ep, idx) => {
                      const isCurrent = idx === activeEpisodeIndex;
                      const isDone = completedEpisodeIds.includes(ep.id);

                      return (
                        <button
                          key={ep.id}
                          onClick={() => setActiveEpisodeIndex(idx)}
                          className={`w-full text-right p-3 rounded-xl transition-all flex items-start gap-3 ${
                            isCurrent
                              ? 'bg-amber-500/15 border border-amber-500/40 text-white shadow-sm'
                              : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950'
                              : isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h6 className={`text-xs font-bold truncate ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                              {ep.title}
                            </h6>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              {ep.duration && <span className="font-mono">{ep.duration}</span>}
                              {ep.attachmentUrl && (
                                <span className="text-blue-400 flex items-center gap-0.5">
                                  <FileText className="w-3 h-3" />
                                  <span>{isAr ? 'ملف مرفق' : 'Fichier'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{isAr ? 'نسبة التقدم' : 'Progression'}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {giftCourse.episodes.length > 0 
                        ? Math.round((completedEpisodeIds.length / giftCourse.episodes.length) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                      style={{
                        width: `${giftCourse.episodes.length > 0 
                          ? (completedEpisodeIds.length / giftCourse.episodes.length) * 100 
                          : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

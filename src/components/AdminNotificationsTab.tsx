import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Plus, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  FileSpreadsheet, 
  MessageSquare, 
  Megaphone, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  RefreshCw,
  Eye,
  Layers,
  Volume2
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppNotification, Course, Language, NotificationType } from '../types';
import { sendDesktopNotification, playNotificationSound } from '../utils/notificationHelper';

interface AdminNotificationsTabProps {
  language: Language;
  courses: Course[];
  adminEmail: string;
}

export const AdminNotificationsTab: React.FC<AdminNotificationsTabProps> = ({
  language,
  courses,
  adminEmail,
}) => {
  const isAr = language === 'ar';

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('course');
  const [link, setLink] = useState('');
  const [actionLabel, setActionLabel] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Real-time listener for site notifications
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(
        collection(db, 'site_notifications'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: AppNotification[] = [];
          snapshot.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as AppNotification) });
          });
          setNotifications(loaded);
          setLoading(false);
        },
        () => setLoading(false)
      );
    } catch {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Quick preset template selector
  const applyTemplate = (preset: 'course' | 'file' | 'message' | 'announcement') => {
    if (preset === 'course') {
      setType('course');
      const sampleCourse = courses[0];
      setTitle(isAr ? `🎓 إطلاق دورة جديدة: ${sampleCourse?.title || 'دورة احترافية'}` : 'Nouvelle formation disponible');
      setMessage(
        isAr
          ? 'تمت إضافة دورة تدريبية جديدة ومحدثة بالمعايير الجزائرية. انقر للاطلاع على المحاور والتسجيل!'
          : 'Une nouvelle formation a été publiée. Découvrez le programme dès maintenant.'
      );
      setLink('#courses');
      setActionLabel(isAr ? 'عرض الدورة والتسجيل 📋' : 'Voir la formation');
      setIsImportant(true);
    } else if (preset === 'file') {
      setType('file');
      setTitle(isAr ? '📁 ملف إكسل وكتب هندسية جديدة متاحة للتحميل' : 'Nouveau fichier Excel & Livres');
      setMessage(
        isAr
          ? 'تم رفع ملفات إكسل حسابية وكتب قيمة في الموقع. أصحاب العضويات يمكنهم التحميل المباشر الآن!'
          : 'Nouveaux fichiers de calcul Excel disponibles en téléchargement direct.'
      );
      setLink('#student');
      setActionLabel(isAr ? 'تحميل الملفات الهندسية ⬇️' : 'Télécharger');
      setIsImportant(false);
    } else if (preset === 'message') {
      setType('message');
      setTitle(isAr ? '💬 رسالة وتوجيه إداري لجميع الطلاب والمهندسين' : 'Message important de l’administration');
      setMessage(
        isAr
          ? 'السلام عليكم، نحيطكم علماً بإمكانية استخراج قسائم التسجيل والحصول على تخفيضات بطاقات العضوية فوراً.'
          : 'Chers apprenants, profitez des remises spéciales sur vos cartes d’adhésion.'
      );
      setLink('#courses');
      setActionLabel(isAr ? 'مراسلة الإدارة عبر الواتساب' : 'Contacter l’administration');
      setIsImportant(false);
    } else if (preset === 'announcement') {
      setType('announcement');
      setTitle(isAr ? '📢 إعلان هام: تحديث شامل في منصة GC58' : 'Annonce générale');
      setMessage(
        isAr
          ? 'تم تحديث المنصة ودعم تثبيتها على سطح المكتب والهاتف لتلقي الإشعارات الفورية في الخلفية!'
          : 'L’application GC58 est maintenant installable sur PC et Mobile.'
      );
      setLink('/');
      setActionLabel(isAr ? 'تثبيت البرنامج 📲' : 'Installer l’app');
      setIsImportant(true);
    }
  };

  // Sync when a specific course is chosen from dropdown
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const crs = courses.find((c) => c.id === courseId);
    if (crs) {
      setType('course');
      setTitle(isAr ? `🎓 دورة جديدة: ${crs.title}` : `Nouvelle formation : ${crs.title}`);
      setMessage(
        isAr
          ? `دورة تدريبية احترافية في ${crs.software} (${crs.durationHours} ساعة). السعر: ${crs.price.toLocaleString()} دج مع تخفيضات بطاقة العضوية.`
          : `Formation complète en ${crs.software}. Inscrivez-vous dès maintenant.`
      );
      setLink('#courses');
      setActionLabel(isAr ? 'التسجيل في هذه الدورة 📋' : 'S’inscrire');
    }
  };

  // Send Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);

    const newNotif: AppNotification = {
      title: title.trim(),
      message: message.trim(),
      type,
      link: link.trim() || undefined,
      actionLabel: actionLabel.trim() || undefined,
      isImportant,
      authorEmail: adminEmail,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'site_notifications'), newNotif);

      // Play local audio chime & send test desktop notification to verify
      sendDesktopNotification(newNotif.title, newNotif.message, newNotif.link);

      showNotification(
        isAr
          ? 'تم إطلاق وبث الإشعار لجميع العملاء وزوار الموقع بنجاح! 🔔'
          : 'Notification envoyée à tous les utilisateurs avec succès !'
      );

      // Reset form
      setTitle('');
      setMessage('');
      setLink('');
      setActionLabel('');
      setIsImportant(false);
      setSelectedCourseId('');
    } catch (err) {
      console.error('Error dispatching notification:', err);
      alert(isAr ? 'حدث خطأ أثناء إطلاق الإشعار' : 'Erreur lors de l’envoi');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Notification
  const handleDeleteNotification = async (id?: string) => {
    if (!id) return;
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الإشعار من سجل المنصة؟' : 'Supprimer cette notification ?')) {
      try {
        await deleteDoc(doc(db, 'site_notifications', id));
        showNotification(isAr ? 'تم حذف الإشعار' : 'Notification supprimée');
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Tab Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-md shadow-amber-500/10">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'نظام إطلاق وإدارة الإشعارات الشامل' : 'Gestionnaire des Notifications'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                Live Broadcast
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {isAr
                ? 'تحكم كامل في إرسال الإشعارات لجميع زوار وطلاب الموقع. تظهر الإشعارات على سطح المكتب والهاتف وفي جرس التنبيهات مع نغمة صوتية فورية.'
                : 'Envoyez des alertes instantanées sur PC, Mobile et dans la cloche du site.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playNotificationSound();
            sendDesktopNotification('تجربة إشعار GC58', 'هكذا يظهر الإشعار في زاوية الشاشة لجميع العملاء!');
          }}
          className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isAr ? 'تجربة صوت الإشعار 🔔' : 'Tester le son'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Create Notification Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / CREATOR FORM (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                {isAr ? 'إنشاء وبث إشعار جديد للعملاء' : 'Composer une notification'}
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              {isAr ? 'يصل فوراً للجميع' : 'Diffusion immédiate'}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نماذج جاهزة سريعة (انقر لتعبئة النموذج تلقائياً):' : 'Modèles rapides :'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('course')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'دورة جديدة' : 'Formation'}</span>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('file')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'ملف جديد' : 'Fichier'}</span>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('message')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-blue-500/10 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>{isAr ? 'رسالة توجيهية' : 'Message'}</span>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('announcement')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-purple-400" />
                <span>{isAr ? 'إعلان عام' : 'Annonce'}</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Quick Course Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'ربط بدورة معينة من الموقع (اختياري):' : 'Associer à une formation :'}
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => handleSelectCourse(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="">{isAr ? '-- اختر دورة لملء الإشعار آلياً --' : '-- Choisir une formation --'}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.software})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'نوع الإشعار' : 'Type d’alerte'} <span className="text-amber-400">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NotificationType)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="course">{isAr ? '🎓 دورة جديدة' : 'Formation'}</option>
                  <option value="file">{isAr ? '📁 ملف إكسل / كتب' : 'Fichier'}</option>
                  <option value="message">{isAr ? '💬 رسالة من الإدارة' : 'Message'}</option>
                  <option value="discount">{isAr ? '🏷️ تخفيض أو عرض' : 'Remise'}</option>
                  <option value="announcement">{isAr ? '📢 إعلان عام' : 'Annonce'}</option>
                </select>
              </div>

              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'عنوان الإشعار البارز' : 'Titre de la notification'} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: دورة جديدة نزلت في الموقع!' : 'Ex: Nouvelle formation disponible !'}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'نص وتفاصيل الإشعار' : 'Texte du message'} <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isAr ? 'اكتب ما تود إخبار العملاء به بالتفصيل...' : 'Détails de la notification...'}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Link & Action Button Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'رابط التوجيه عند النقر (اختياري)' : 'Lien (optionnel)'}
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="#courses أو https://..."
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'نص زر الإجراء (اختياري)' : 'Texte du bouton'}
                </label>
                <input
                  type="text"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder={isAr ? 'مثال: عرض الدورة والتسجيل' : 'Ex: Voir la formation'}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Importance toggle */}
            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800 cursor-pointer"
                />
                <span>{isAr ? 'تحديد كإشعار عاجل ومهم 🔴' : 'Marquer comme urgent'}</span>
              </label>
            </div>

            {/* Submit Broadcast Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>
                {submitting
                  ? (isAr ? 'جاري إطلاق الإشعار في السيرفر...' : 'Envoi en cours...')
                  : (isAr ? 'إطلاق وبث الإشعار لجميع الأجهزة والعملاء 🚀' : 'Diffuser la notification 🚀')}
              </span>
            </button>
          </form>
        </div>

        {/* RIGHT / HISTORY & MANAGE (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                {isAr ? `سجل الإشعارات السابقة (${notifications.length})` : 'Historique des notifications'}
              </h4>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              Firestore Sync
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[580px] pr-1">
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                <span>{isAr ? 'جاري تحميل سجل الإشعارات...' : 'Chargement...'}</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-600" />
                <p className="font-bold">{isAr ? 'لم تطلق أي إشعار بعد' : 'Aucune notification envoyée'}</p>
                <p className="text-[11px]">{isAr ? 'املأ النموذج باليسار لإرسال أول إشعار!' : 'Utilisez le formulaire pour commencer.'}</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const dateStr = notif.createdAt
                  ? new Date(notif.createdAt).toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-all relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {notif.type}
                        </span>
                        {notif.isImportant && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold">
                            {isAr ? 'عاجل' : 'Urgent'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {dateStr}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                        title={isAr ? 'حذف الإشعار' : 'Supprimer'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h5 className="text-xs font-black text-white leading-snug">
                      {notif.title}
                    </h5>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900">
                        <span className="truncate max-w-[200px]" dir="ltr">{notif.link}</span>
                        {notif.actionLabel && (
                          <span className="text-amber-400 font-bold">{notif.actionLabel}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

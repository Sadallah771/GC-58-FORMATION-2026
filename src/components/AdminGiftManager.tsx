import React, { useState } from 'react';
import { 
  Gift, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw, 
  ExternalLink, 
  Link, 
  Eye, 
  EyeOff, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  HelpCircle,
  Play
} from 'lucide-react';
import { GiftCourseSettings, GiftEpisode, Language } from '../types';
import { extractDriveFileId, getEmbeddableVideoUrl, parseBulkDriveLinks } from '../utils/driveHelper';

interface AdminGiftManagerProps {
  language: Language;
  giftCourse: GiftCourseSettings;
  onSaveGiftCourse: (updated: GiftCourseSettings) => Promise<void>;
  sitePhone: string;
}

export const AdminGiftManager: React.FC<AdminGiftManagerProps> = ({
  language,
  giftCourse,
  onSaveGiftCourse,
  sitePhone,
}) => {
  const isAr = language === 'ar';

  // Local form state
  const [formData, setFormData] = useState<GiftCourseSettings>(giftCourse);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Bulk Drive links input state
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Edit single episode modal state
  const [editingEpisode, setEditingEpisode] = useState<GiftEpisode | null>(null);
  const [isNewEpisode, setIsNewEpisode] = useState(false);

  // Preview episode state
  const [previewEp, setPreviewEp] = useState<GiftEpisode | null>(null);

  const handleFieldChange = (field: keyof GiftCourseSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      await onSaveGiftCourse({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;
    const newEpisodes = parseBulkDriveLinks(bulkInput, formData.episodes.length);
    if (newEpisodes.length === 0) {
      alert(isAr ? 'لم يتم العثور على روابط صالحة في النص المدخل!' : 'Aucun lien valide trouvé.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      episodes: [...prev.episodes, ...newEpisodes],
    }));
    setBulkInput('');
    setShowBulkModal(false);
  };

  const handleDeleteEpisode = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الحلقة؟' : 'Supprimer cet épisode ?')) return;
    const updated = formData.episodes
      .filter((ep) => ep.id !== id)
      .map((ep, idx) => ({ ...ep, order: idx + 1 }));
    setFormData((prev) => ({ ...prev, episodes: updated }));
  };

  const handleMoveEpisode = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.episodes.length) return;
    const items = [...formData.episodes];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    const reordered = items.map((ep, idx) => ({ ...ep, order: idx + 1 }));
    setFormData((prev) => ({ ...prev, episodes: reordered }));
  };

  const handleOpenNewEpisode = () => {
    setIsNewEpisode(true);
    setEditingEpisode({
      id: 'ep_' + Date.now(),
      order: formData.episodes.length + 1,
      title: `الحلقة ${formData.episodes.length + 1}: `,
      duration: '30:00',
      driveUrl: '',
      previewEmbedUrl: '',
      description: '',
      attachmentUrl: '',
      attachmentName: '',
    });
  };

  const handleSaveEpisodeModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode) return;

    const embedUrl = getEmbeddableVideoUrl(editingEpisode.driveUrl);
    const finalizedEpisode: GiftEpisode = {
      ...editingEpisode,
      previewEmbedUrl: embedUrl,
    };

    if (isNewEpisode) {
      setFormData((prev) => ({
        ...prev,
        episodes: [...prev.episodes, finalizedEpisode],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        episodes: prev.episodes.map((ep) =>
          ep.id === finalizedEpisode.id ? finalizedEpisode : ep
        ),
      }));
    }

    setEditingEpisode(null);
  };

  return (
    <div className="space-y-8 text-slate-200">
      {/* Top Banner Alert / Action Status */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{isAr ? 'تم حفظ وتحديث إعدادات وحلقات هدية الموقع بنجاح على سيرفرات Firebase!' : 'Modifications enregistrées avec succès !'}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Control Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                {isAr ? 'إدارة هدية الموقع (الدورة المجانية المشفرة)' : 'Gestion du Cadeau / Formation Gratuite'}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                formData.isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {formData.isActive ? (isAr ? 'مفعلة وتظهر للطلبة' : 'Active') : (isAr ? 'معطلة ومخفية' : 'Masquée')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'تحكم كامل في الحلقات، إضافة روابط Google Drive، تغيير الكود السري، وحذف أو تعديل أي حلقة في أي وقت.'
                : 'Contrôlez les épisodes, ajoutez des liens Google Drive, modifiez le code secret d’accès.'}
            </p>
          </div>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? (isAr ? 'جاري الحفظ...' : 'Enregistrement...') : (isAr ? 'حفظ التغييرات الآن' : 'Sauvegarder')}</span>
        </button>
      </div>

      {/* Grid: 2 Columns - Settings & Drive Link Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: General Configuration (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إعدادات الحماية وكود الوصول' : 'Sécurité & Code d’accès'}</span>
          </h3>

          {/* Toggle Active */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">
                {isAr ? 'تفعيل ظهور هدية الموقع للزوار' : 'Activer l’affichage public'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isAr ? 'إذا قمت بالتعطيل، لن تظهر في شريط التنقل أو الصفحة الرئيسية' : 'Masquer la section sur le site.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange('isActive', !formData.isActive)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                formData.isActive ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                formData.isActive ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Secret Access Code */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'كود الدخول السري للدورة (Secret Access Code)' : 'Code secret d’accès'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.secretAccessCode}
                onChange={(e) => handleFieldChange('secretAccessCode', e.target.value.toUpperCase())}
                placeholder="مثال: GC58-GIFT"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 font-mono text-amber-400 font-bold text-sm"
              />
              <span className="absolute left-3 top-3 text-[11px] text-slate-500 pointer-events-none">
                {isAr ? 'حروف وأرقام' : 'Code'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isAr ? 'هذا هو الرمز الذي يقدمه الأدمين للطالب عبر الواتساب لفتح الحلقات.' : 'Partagez ce code aux étudiants.'}
            </p>
            <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {isAr
                  ? '🔒 تنبيه أمني وتأكيد: بمجرد تغيير هذا الكود وحفظ الإعدادات، ستُقفل الدورة تلقائياً عند جميع الطلاب والزوار فوراً، ويجب عليهم إدخال الكود الجديد لفتحها.'
                  : '🔒 Sécurité : Modifier ce code reverrouille instantanément la formation pour tous les utilisateurs jusqu’à saisie du nouveau code.'}
              </span>
            </div>
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'عنوان الدورة الهدية' : 'Titre de la formation'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white"
            />
          </div>

          {/* Subtitle / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'الوصف الترويجي' : 'Sous-titre explicatif'}
            </label>
            <textarea
              rows={2}
              value={formData.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'المهندس المكوّن' : 'Formateur'}
              </label>
              <input
                type="text"
                value={formData.instructorName}
                onChange={(e) => handleFieldChange('instructorName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'مدة الدورة الإجمالية' : 'Durée totale'}
              </label>
              <input
                type="text"
                value={formData.totalDuration || ''}
                onChange={(e) => handleFieldChange('totalDuration', e.target.value)}
                placeholder="مثال: 4 ساعات"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Google Drive Folder Integration (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'ربط وأدوات Google Drive الذكية' : 'Intégration Google Drive'}</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'رابط مجلد Google Drive الكامل (اختياري للتحميل العام)' : 'Lien du dossier Google Drive'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.driveFolderUrl || ''}
                onChange={(e) => handleFieldChange('driveFolderUrl', e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                dir="ltr"
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-amber-500 font-mono"
              />
              {formData.driveFolderUrl && (
                <a
                  href={formData.driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                  title="فتح الرابط"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isAr
                ? 'تأكد من جعل إذن المجلد في جوجل درايف: "أي شخص لديه الرابط يمكنه العرض (Anyone with link can view)".'
                : 'Assurez-vous que le partage Drive est réglé sur public.'}
            </p>
          </div>

          {/* Quick Bulk Import Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-start gap-2">
              <Link className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">
                  {isAr ? 'استيراد الحلقات بالجملة من Drive' : 'Importation automatique de liens Drive'}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {isAr
                    ? 'الصق قائمة روابط فيديوهات Google Drive مباشرة دفعة واحدة، وسيقوم النظام بتوليد الحلقات وتجهيز مشغل المعاينة فوراً.'
                    : 'Collez plusieurs liens de vidéos Drive pour générer automatiquement la liste des cours.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBulkModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'فتح أداة لصق روابط Drive المتعددة' : 'Coller des liens Drive en lot'}</span>
            </button>
          </div>

          {/* Quick stats box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">{isAr ? 'إجمالي الحلقات الحالية:' : 'Nombre d’épisodes :'}</span>
              <span className="text-base font-black text-amber-400 font-mono">{formData.episodes.length} {isAr ? 'حلقات' : 'vidéos'}</span>
            </div>
            <button
              onClick={handleOpenNewEpisode}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{isAr ? '+ إضافة حلقة يدوية' : '+ Ajouter un épisode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Episodes Management Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'جدول حلقات الدورة الهدية والتحكم بها' : 'Liste des Épisodes'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr ? 'يمكنك إعادة الترتيب، تعديل الروابط، إضافة مرفقات العمل، أو حذف أي حلقة بحرية.' : 'Réorganisez, modifiez ou supprimez les épisodes.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNewEpisode}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/15"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة حلقة جديدة' : 'Nouvel épisode'}</span>
            </button>
          </div>
        </div>

        {formData.episodes.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
            <p className="text-xs text-slate-400">
              {isAr ? 'لا توجد أي حلقات بعد في الدورة الهدية.' : 'Aucun épisode enregistré.'}
            </p>
            <button
              onClick={handleOpenNewEpisode}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              {isAr ? 'أضف أول حلقة الآن' : 'Créer le premier épisode'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.episodes.map((ep, idx) => (
              <div
                key={ep.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                {/* Left Side: Order & Title */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {ep.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      {ep.duration && (
                        <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-400">
                          {ep.duration}
                        </span>
                      )}
                      <span className="font-mono truncate max-w-xs text-slate-400" dir="ltr">
                        {ep.driveUrl}
                      </span>
                      {ep.attachmentUrl && (
                        <span className="text-blue-400 flex items-center gap-1 font-semibold">
                          <FileText className="w-3 h-3" />
                          <span>{ep.attachmentName || 'مرفق'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveEpisode(idx, 'up')}
                      className="p-1.5 hover:text-amber-400 disabled:opacity-30 transition-colors"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.episodes.length - 1}
                      onClick={() => handleMoveEpisode(idx, 'down')}
                      className="p-1.5 hover:text-amber-400 disabled:opacity-30 transition-colors"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preview button */}
                  <button
                    type="button"
                    onClick={() => setPreviewEp(ep)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 transition-colors"
                    title="معاينة التشغيل"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewEpisode(false);
                      setEditingEpisode(ep);
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white transition-colors"
                    title="تعديل"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteEpisode(ep.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="حذف الحلقة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">
              {isAr ? 'لصق روابط جوجل درايف المتعددة بالجملة' : 'Importation de liens Drive'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'الصق النص الذي يحتوي على روابط ملفات Google Drive (كل رابط في سطر أو نص مشاركة كامل). سيقوم النظام باستخراج معرفات الملفات تلقائياً وإضافتها كحلقات جديدة.'
                : 'Collez le texte contenant les URLs Google Drive.'}
            </p>

            <textarea
              rows={8}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder={`https://drive.google.com/file/d/1A.../view\nhttps://drive.google.com/file/d/1B.../view\nhttps://drive.google.com/file/d/1C.../view`}
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                {isAr ? 'استخراج وإضافة الحلقات الآن' : 'Extraire & Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Single Episode Modal */}
      {editingEpisode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveEpisodeModal}
            className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-extrabold text-white">
              {isNewEpisode 
                ? (isAr ? 'إضافة حلقة جديدة للدورة الهدية' : 'Ajouter un épisode')
                : (isAr ? 'تعديل بيانات الحلقة' : 'Modifier l’épisode')}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'عنوان الحلقة' : 'Titre'}
              </label>
              <input
                type="text"
                required
                value={editingEpisode.title}
                onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'المدة التقديرية' : 'Durée'}
                </label>
                <input
                  type="text"
                  value={editingEpisode.duration || ''}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, duration: e.target.value })}
                  placeholder="25:00"
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'الترتيب' : 'Ordre'}
                </label>
                <input
                  type="number"
                  value={editingEpisode.order}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'رابط ملف الفيديو (Google Drive URL أو YouTube)' : 'Lien vidéo Google Drive'}
              </label>
              <input
                type="text"
                required
                value={editingEpisode.driveUrl}
                onChange={(e) => setEditingEpisode({ ...editingEpisode, driveUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
                dir="ltr"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isAr ? 'يقوم الموقع تلقائياً بتحويل الرابط إلى مشغل معاينة Google Drive المباشر.' : 'Lien transformé automatiquement en embed.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'شرح أو ملخص الحلقة (اختياري)' : 'Description du contenu'}
              </label>
              <textarea
                rows={2}
                value={editingEpisode.description || ''}
                onChange={(e) => setEditingEpisode({ ...editingEpisode, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رابط الملف المرفق (Excel, DWG, PDF)' : 'Lien fichier joint'}
                </label>
                <input
                  type="url"
                  value={editingEpisode.attachmentUrl || ''}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, attachmentUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'اسم الملف المرفق' : 'Nom du fichier'}
                </label>
                <input
                  type="text"
                  value={editingEpisode.attachmentName || ''}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, attachmentName: e.target.value })}
                  placeholder="مذكرة حساب RPA.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingEpisode(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                {isAr ? 'تأكيد وحفظ الحلقة' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Episode Preview Modal */}
      {previewEp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400">{isAr ? 'معاينة تشغيل الحلقة' : 'Aperçu'}</span>
                <h4 className="text-sm font-bold text-white">{previewEp.title}</h4>
              </div>
              <button
                onClick={() => setPreviewEp(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src={previewEp.previewEmbedUrl || getEmbeddableVideoUrl(previewEp.driveUrl)}
                title="Preview"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

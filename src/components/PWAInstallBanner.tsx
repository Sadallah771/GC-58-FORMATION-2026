import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Monitor, 
  Smartphone, 
  Apple, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  Share2, 
  PlusSquare, 
  ExternalLink,
  Laptop
} from 'lucide-react';
import { Language } from '../types';

interface PWAInstallBannerProps {
  language: Language;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  language,
  isOpenModal = false,
  onCloseModal,
}) => {
  const isAr = language === 'ar';

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    try {
      if (localStorage.getItem('gc58_pwa_installed') === 'true') return true;
      if (typeof window !== 'undefined') {
        if (window.matchMedia('(display-mode: standalone)').matches) return true;
        if ((window.navigator as any).standalone === true) return true;
      }
      return false;
    } catch {
      return false;
    }
  });
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      if (localStorage.getItem('gc58_pwa_installed') === 'true') return true;
      return localStorage.getItem('gc58_pwa_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showHelperModal, setShowHelperModal] = useState(isOpenModal);
  const [platformTab, setPlatformTab] = useState<'desktop' | 'android' | 'ios'>('desktop');

  // Sync external modal state
  useEffect(() => {
    if (isOpenModal) {
      setShowHelperModal(true);
    }
  }, [isOpenModal]);

  // Detect platform & standalone
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone || localStorage.getItem('gc58_pwa_installed') === 'true') {
      setIsInstalled(true);
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatformTab('ios');
      setIsInstallable(true);
    } else if (/android/.test(ua)) {
      setPlatformTab('android');
    } else {
      setPlatformTab('desktop');
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('gc58_pwa_installed', 'true');
        localStorage.setItem('gc58_pwa_banner_dismissed', 'true');
      } catch {}
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          try {
            localStorage.setItem('gc58_pwa_installed', 'true');
            localStorage.setItem('gc58_pwa_banner_dismissed', 'true');
          } catch {}
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt note:', err);
        setShowHelperModal(true);
      }
    } else {
      setShowHelperModal(true);
    }
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    try {
      localStorage.setItem('gc58_pwa_banner_dismissed', 'true');
    } catch {}
  };

  const closeAnyModal = () => {
    setShowHelperModal(false);
    if (onCloseModal) onCloseModal();
  };

  // If already installed as standalone app, don't show the top banner
  const showBanner = !isInstalled && !bannerDismissed;

  return (
    <>
      {/* 1. TOP SMART BANNER */}
      {showBanner && (
        <div className="relative z-40 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-3 sm:px-6 py-2.5 shadow-lg border-b border-amber-600/30 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <Download className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black tracking-tight truncate">
                  {isAr 
                    ? '⚡ نصّب برنامج GC58 الآن على جهازك للوصول السريع بدون متصفح وتلقي الإشعارات!' 
                    : '⚡ Installez l’application GC58 sur PC/Mobile pour un accès rapide hors navigateur !'}
                </p>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-900/80 hidden sm:block">
                  {isAr 
                    ? 'يعمل كتطبيق مستقل خفيف على سطح المكتب والهاتف مع دعم الإشعارات والتشغيل التلقائي.' 
                    : 'Fonctionne comme une appli native sur Windows, Mac, Android & iOS.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="py-1.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-amber-300 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تنصيب البرنامج 🚀' : 'Installer l’App 🚀'}</span>
              </button>

              <button
                onClick={handleDismissBanner}
                className="p-1 rounded-lg text-slate-900/70 hover:text-slate-950 transition-colors"
                title={isAr ? 'إغلاق' : 'Fermer'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPREHENSIVE INSTALLATION & BACKGROUND GUIDE MODAL */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isAr ? 'تنصيب تطبيق GC58 FORMATIONS' : 'Installation de l’App GC58'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'تثبيت البرنامج على الكمبيوتر أو الهاتف والعمل في الخلفية' : 'Installation sur PC, Mac, Android ou iPhone'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeAnyModal}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-center gap-2">
              <button
                onClick={() => setPlatformTab('desktop')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platformTab === 'desktop'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>{isAr ? 'كمبيوتر سطح المكتب (PC/Mac)' : 'Ordinateur PC / Mac'}</span>
              </button>

              <button
                onClick={() => setPlatformTab('android')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platformTab === 'android'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android</span>
              </button>

              <button
                onClick={() => setPlatformTab('ios')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platformTab === 'ios'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>iPhone / iPad</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* DESKTOP TAB */}
              {platformTab === 'desktop' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Laptop className="w-4 h-4" />
                      <span>{isAr ? 'التثبيت على سطح المكتب مثل اليوتيوب وتطبيقات ويندوز:' : 'Installation sur Bureau (Windows / Mac) :'}</span>
                    </div>

                    <div className="space-y-2.5 text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          1
                        </span>
                        <p>
                          {isAr
                            ? 'إذا كنت تستخدم متصفح Google Chrome أو Microsoft Edge، ستجد أيقونة تثبيت صغيرة (شاشة مع سهم لأسفل) في أقصى يمين شريط العنوان العلوي (URL).'
                            : 'Dans Chrome ou Edge, cliquez sur l’icône d’installation dans la barre d’adresse.'}
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          2
                        </span>
                        <p>
                          {isAr
                            ? 'أو اضغط مباشرة على الزر الذهبي بالأسفل "تنصيب التطبيق فوراً" لفتح نافذة التثبيت.'
                            : 'Ou cliquez directement sur le bouton "Installer maintenant" ci-dessous.'}
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          3
                        </span>
                        <p>
                          {isAr
                            ? 'سيتم إنشاء أيقونة خاصة بالتطبيق على سطح المكتب (Desktop) وشريط المهام (Taskbar) لفتحه مباشرة بضغطة واحدة وبدون الحاجة لفتح المتصفح.'
                            : 'Un raccourci sera créé sur votre bureau et dans la barre des tâches.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Background Autostart explanation */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'الربط التلقائي والتشغيل في الخلفية عند فتح الكمبيوتر:' : 'Lancement automatique en arrière-plan :'}</span>
                    </div>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      {isAr
                        ? 'البرنامج مبرمج ليبقى مربوطاً بجهازك؛ وبمجرد تفعيل الإشعارات وتثبيت التطبيق، سيصلك أي إشعار يطلقه الأدمين مباشرة في زاوية الشاشة حتى وإن كان البرنامج مغلقاً!'
                        : 'L’application reste synchronisée avec votre PC pour vous envoyer les notifications prioritaires.'}
                    </p>
                  </div>

                  {deferredPrompt && (
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>{isAr ? 'تنصيب البرنامج على سطح المكتب الآن 💻' : 'Installer sur le bureau maintenant 💻'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* ANDROID TAB */}
              {platformTab === 'android' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Smartphone className="w-4 h-4" />
                      <span>{isAr ? 'التثبيت على هواتف الأندرويد (Samsung / Xiaomi / Oppo...):' : 'Installation sur Android :'}</span>
                    </div>

                    <div className="space-y-2.5 text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          1
                        </span>
                        <p>
                          {isAr
                            ? 'اضغط على النقاط الثلاث ⋮ في أعلى يمين متصفح Chrome أو متصفحك الحالي.'
                            : 'Appuyez sur le menu (les 3 points ⋮) en haut du navigateur.'}
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          2
                        </span>
                        <p>
                          {isAr
                            ? 'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية" (Installer l’application).'
                            : 'Sélectionnez "Installer l’application" ou "Ajouter à l’écran d’accueil".'}
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          3
                        </span>
                        <p>
                          {isAr
                            ? 'سيظهر التطبيق كبرنامج أصلي على شاشة هاتفك مع إمكانية تلقي الإشعارات الفورية.'
                            : 'L’icône GC58 apparaîtra sur votre écran d’accueil.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {deferredPrompt && (
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>{isAr ? 'تثبيت التطبيق في الهاتف الآن 📱' : 'Installer sur le téléphone maintenant 📱'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* IOS TAB */}
              {platformTab === 'ios' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Apple className="w-4 h-4" />
                      <span>{isAr ? 'التثبيت على هواتف iPhone وأجهزة iPad:' : 'Installation sur iPhone / iPad :'}</span>
                    </div>

                    <div className="space-y-2.5 text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          1
                        </span>
                        <p className="flex items-center gap-1.5 flex-wrap">
                          <span>{isAr ? 'في متصفح Safari، اضغط على زر المشاركة بالأسفل:' : 'Dans Safari, cliquez sur le bouton Partager :'}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-white font-bold text-xs">
                            <Share2 className="w-3.5 h-3.5 text-amber-400" /> Partager
                          </span>
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          2
                        </span>
                        <p className="flex items-center gap-1.5 flex-wrap">
                          <span>{isAr ? 'انزل للأسفل واختر:' : 'Faites défiler vers le bas et sélectionnez :'}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-white font-bold text-xs">
                            <PlusSquare className="w-3.5 h-3.5 text-amber-400" />
                            {isAr ? 'إضافة إلى الشاشة الرئيسية' : 'Sur l’écran d’accueil'}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          3
                        </span>
                        <p>
                          {isAr
                            ? 'اضغط على "إضافة" (Ajouter) في الزاوية العلوية، وسيصبح البرنامج مثبتاً على هاتفك كأي تطبيق رسمي.'
                            : 'Cliquez sur "Ajouter". L’appli sera accessible directement depuis votre écran d’accueil.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'تطبيق آمن وخفيف ولا يستهلك ذاكرة الجهاز' : 'Appli légère, sécurisée et rapide'}</span>
              </span>
              <button
                onClick={closeAnyModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
              >
                {isAr ? 'تم وفهمت' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

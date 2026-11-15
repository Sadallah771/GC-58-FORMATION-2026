import React from 'react';
import { 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  ShoppingCart, 
  Globe, 
  PhoneCall, 
  MessageSquare, 
  Menu, 
  X, 
  LogIn, 
  LogOut,
  Gift,
  CreditCard,
  Download,
  Home,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../firebase';
import { Language, AppView, ClientLoyaltyData } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { getUserAvatar, saveUserAvatar, subscribeToAvatarChanges } from '../utils/userAvatarHelper';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedCourseIds: string[];
  onOpenCartOrEnroll: () => void;
  onOpenAuth: () => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  sitePhone: string;
  onOpenGiftModal: () => void;
  onOpenInstallModal?: () => void;
  userLoyalty?: ClientLoyaltyData | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  selectedCourseIds,
  onOpenCartOrEnroll,
  onOpenAuth,
  currentView,
  setCurrentView,
  sitePhone,
  onOpenGiftModal,
  onOpenInstallModal,
  userLoyalty,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isAr = language === 'ar';

  const [userAvatar, setUserAvatar] = React.useState<string | null>(() => getUserAvatar(user?.uid));
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setUserAvatar(getUserAvatar(user?.uid));
    const unsub = subscribeToAvatarChanges(user?.uid, (newAv) => setUserAvatar(newAv));
    return () => unsub();
  }, [user?.uid]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      alert(isAr ? 'يرجى اختيار ملف صورة صالح (JPG, PNG)' : 'Veuillez choisir une image');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert(isAr ? 'حجم الصورة كبير، اختر صورة أقل من 4 ميغابايت' : 'Image trop volumineuse (max 4Mo)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveUserAvatar(user.uid, dataUrl);
      setUserAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const whatsappUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr ? 'السلام عليكم، أريد إكمال الطلب والتسجيل في دورات الهندسة المدنية.' : 'Bonjour, je souhaite finaliser ma commande de formation.'
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/95 border-b border-slate-800/80 transition-all">
      {/* Top Banner with phone properly LTR formatted */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs font-bold py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 mx-auto flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isAr ? 'للتسجيل والاستفسار المباشر:' : 'Inscriptions & Contact :'}</span>
              <a href={`tel:${sitePhone}`} className="underline font-bold">
                <span dir="ltr" className="inline-block font-mono tracking-wider">{sitePhone}</span>
              </a>
            </span>
            <span className="hidden sm:inline opacity-60">•</span>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-slate-950 text-white px-3 py-0.5 rounded-full text-[11px] font-bold hover:bg-slate-900 transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-[#25D366] fill-[#25D366]" />
              <span>{isAr ? 'أكمل الطلب عبر الواتساب' : 'Finaliser la commande sur WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                GC58
              </span>
              <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-md font-mono font-black bg-amber-500 text-slate-950 shadow-sm">
                FORMATIONS
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              {isAr ? 'منصة التكوين الاحترافي في الهندسة المدنية' : 'Formations Pro Béton Armé & Charpente'}
            </p>
          </div>
        </div>

        {/* Top-Left Action Controls & User Account with Photo and Card ("لفوق اغوش مع الكونت تاعو و بطاقتو") */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Notification Bell Center */}
          <NotificationCenter language={language} />

          {/* Desktop & Mobile App Install Button */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm active:scale-95 cursor-pointer"
              title={isAr ? 'تنصيب البرنامج على الكمبيوتر أو الهاتف' : 'Installer l’application'}
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'تنصيب التطبيق 📲' : 'Installer'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{language === 'ar' ? 'Français' : 'العربية'}</span>
          </button>

          {/* Master Admin Button (Only shown to sadallah771@gmail.com) */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/60 hover:bg-emerald-900/60 animate-pulse'
              }`}
              title="لوحة تحكم الأدمين الحصري"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAr ? 'المالك' : 'Admin'}</span>
            </button>
          )}

          {/* User Account + Custom Photo + Card Status Chip (لفوق اغوش) */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 sm:p-1.5 px-2 shadow-sm max-w-[190px] sm:max-w-none">
              {/* Profile Avatar with Photo Upload */}
              <div 
                className="relative group cursor-pointer shrink-0" 
                onClick={() => fileInputRef.current?.click()} 
                title={isAr ? 'انقر لرفع أو تغيير صورتك الشخصية 📷' : 'Changer votre photo de profil'}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="User Avatar"
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl object-cover border border-amber-500/50 shadow-md group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-md">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-950 text-amber-400 border border-amber-500/50 flex items-center justify-center shadow">
                  <Camera className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                </div>
              </div>

              {/* Name & Card Chip */}
              <div 
                onClick={() => setCurrentView(currentView === 'student' ? 'home' : 'student')}
                className="cursor-pointer min-w-0 max-w-[85px] sm:max-w-[160px] leading-tight"
                title={isAr ? 'انقر لفتح فضاء الطالب والبطاقة' : 'Voir ma carte'}
              >
                <div className="text-[11px] sm:text-xs font-bold text-white truncate">
                  {userLoyalty?.customCardName || user.displayName || user.email?.split('@')[0]}
                </div>

                {/* Card Status Chip */}
                {userLoyalty?.hasActiveCard ? (
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-bold truncate">
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      {userLoyalty.tier === 'STUDENT' ? (isAr ? 'طالب 🎓' : 'Étudiant') : `${userLoyalty.tier}`}
                    </span>
                  </div>
                ) : userLoyalty?.cardStatus === 'pending' ? (
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-amber-400 font-bold truncate">
                    <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{isAr ? 'مراجعة ⏳' : 'Attente ⏳'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-amber-300 font-bold truncate hover:underline">
                    <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{isAr ? 'اطلب بطاقتك' : 'Carte'}</span>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm(isAr ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Confirmer la déconnexion ?')) {
                    await logout();
                    setCurrentView('home');
                  }
                }}
                className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={isAr ? 'تسجيل الخروج' : 'Déconnexion'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer"
                title={isAr ? 'طلب بطاقتك مجاناً دون شراء دورة' : 'Demander votre carte'}
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'اطلب بطاقتك مجاناً 💳' : 'Carte Gratuite'}</span>
              </button>
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-950" />
                <span>{isAr ? 'دخول / حساب' : 'Connexion'}</span>
              </button>
            </div>
          )}

          {/* Fast Registration Trigger */}
          <button
            onClick={onOpenCartOrEnroll}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'طلب دورة' : 'Commander'}</span>
            {selectedCourseIds.length > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-extrabold ml-0.5">
                {selectedCourseIds.length}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0 cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 space-y-2.5 border-t border-slate-800/80 bg-slate-950">
          {onOpenInstallModal && (
            <button
              onClick={() => {
                onOpenInstallModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm cursor-pointer"
            >
              <Download className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>{isAr ? 'تنصيب التطبيق على الهاتف / الكمبيوتر 📲' : 'Installer l’application 📲'}</span>
            </button>
          )}

          {/* Mobile Drawer Home */}
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'home' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Home className="w-5 h-5 text-amber-400" />
            <span>{isAr ? 'الصفحة الرئيسية' : 'Page d’accueil'}</span>
          </button>

          {/* Mobile Drawer Courses */}
          <button
            onClick={() => { setCurrentView('courses'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'courses' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>{isAr ? 'قائمة الدورات التدريبية' : 'Toutes les formations'}</span>
          </button>

          {/* Mobile Drawer Gift */}
          <button
            onClick={() => {
              setCurrentView('gift');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              currentView === 'gift' ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40' : 'bg-amber-500/10 text-amber-300/90 border border-amber-500/20'
            }`}
          >
            <Gift className="w-5 h-5 text-amber-400" />
            <span>{isAr ? 'هدية الموقع (دورة مجانية مشفرة) 🎁' : 'Cadeau du Site 🎁'}</span>
          </button>

          {/* Mobile Drawer Student Card */}
          <button
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                setCurrentView('student');
              }
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              currentView === 'student'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-300 bg-slate-900 border border-slate-800'
            }`}
          >
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>
              {userLoyalty?.hasActiveCard 
                ? (isAr ? 'بطاقتي المعتمدة والمفعلة 🎓' : 'Ma Carte Active') 
                : userLoyalty?.cardStatus === 'pending'
                ? (isAr ? 'طلب بطاقتي (قيد المراجعة ⏳)' : 'Demande en attente ⏳')
                : (isAr ? 'طلب بطاقتي مجاناً (بدون شراء دورة) 💳' : 'Demander ma carte gratuite 💳')}
            </span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#25D366]/20 text-[#25D366]"
          >
            <MessageSquare className="w-5 h-5 fill-[#25D366]" />
            <span>{isAr ? 'أكمل الطلب عبر الواتساب' : 'Finaliser sur WhatsApp'}</span>
          </a>

          <a
            href={`tel:${sitePhone}`}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-slate-900 text-amber-400 border border-slate-800"
          >
            <PhoneCall className="w-5 h-5" />
            <span>{isAr ? 'اتصل بنا: ' : 'Appeler : '}</span>
            <span dir="ltr" className="font-mono inline-block">{sitePhone}</span>
          </a>

          {isAdmin && (
            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer ${
                currentView === 'admin' ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950/40 text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isAr ? 'لوحة تحكم الأدمين (المالك)' : 'Administration Master'}</span>
            </button>
          )}

          {/* User Account & Logout in Mobile Menu */}
          {user ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate" dir="ltr">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                  {isAdmin ? (isAr ? 'المالك' : 'Admin') : (isAr ? 'عضو' : 'Membre')}
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 transition-colors cursor-pointer shadow-sm active:scale-98"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{isAr ? 'تسجيل الخروج من الحساب 🚪' : 'Se déconnecter'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-white text-slate-950 cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Connexion ou Inscription'}</span>
            </button>
          )}
        </div>
      )}

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR (FIXED FOR 1-HAND NAVIGATION) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'home'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-tight font-medium">{isAr ? 'الرئيسية' : 'Accueil'}</span>
        </button>

        <button
          onClick={() => setCurrentView('courses')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'courses'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] leading-tight font-medium">{isAr ? 'الدورات' : 'Formations'}</span>
        </button>

        <button
          onClick={() => setCurrentView('gift')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'gift'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] leading-tight font-medium">{isAr ? 'الهدية' : 'Cadeau'}</span>
        </button>

        <button
          onClick={() => {
            if (!user) {
              onOpenAuth();
            } else {
              setCurrentView('student');
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'student'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] leading-tight font-medium">
            {userLoyalty?.hasActiveCard 
              ? (isAr ? 'بطاقتي' : 'Ma Carte') 
              : userLoyalty?.cardStatus === 'pending'
              ? (isAr ? 'قيد التدقيق' : 'En attente')
              : (isAr ? 'طلب بطاقة' : 'Carte')}
          </span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-emerald-500/80 hover:text-emerald-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] leading-tight font-medium">{isAr ? 'الأدمين' : 'Admin'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenCartOrEnroll}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-amber-400 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] leading-tight font-medium">{isAr ? 'طلب دورة' : 'Commander'}</span>
          </button>
        )}
      </nav>
    </header>
  );
};

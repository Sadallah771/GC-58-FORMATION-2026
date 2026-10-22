import React from 'react';
import { 
  Building2, 
  Layers, 
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
  User,
  Bot,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../firebase';
import { Language } from '../types';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedCourseIds: string[];
  onOpenCartOrEnroll: () => void;
  onOpenAuth: () => void;
  onOpenAIAssistant?: () => void;
  currentView: 'catalog' | 'admin';
  setCurrentView: (view: 'catalog' | 'admin') => void;
  sitePhone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  selectedCourseIds,
  onOpenCartOrEnroll,
  onOpenAuth,
  onOpenAIAssistant,
  currentView,
  setCurrentView,
  sitePhone,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isAr = language === 'ar';

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
          onClick={() => { setCurrentView('catalog'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                GC58
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-black bg-amber-500 text-slate-950 shadow-sm">
                FORMATIONS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {isAr ? 'منصة التكوين الاحترافي في الهندسة المدنية' : 'Formations Pro Béton Armé & Charpente'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setCurrentView('catalog')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'catalog'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'الدورات التدريبية' : 'Formations'}</span>
          </button>

          {/* AI Advisor Button */}
          {onOpenAIAssistant && (
            <button
              onClick={onOpenAIAssistant}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'وكيل GC58 AI' : 'GC58 AI'}</span>
            </button>
          )}

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-all flex items-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 fill-[#25D366]" />
            <span>{isAr ? 'أكمل الطلب عبر الواتساب' : 'Finaliser sur WhatsApp'}</span>
          </a>

          {/* Call direct */}
          <a
            href={`tel:${sitePhone}`}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span dir="ltr" className="font-mono inline-block">{sitePhone}</span>
          </a>

          {/* ONLY SHOWN TO sadallah771@gmail.com */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/60 hover:bg-emerald-900/60 animate-pulse'
              }`}
              title="لوحة تحكم الأدمين الحصري"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'لوحة تحكم الأدمين (المالك)' : 'Administration Master'}</span>
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'Français' : 'العربية'}</span>
          </button>

          {/* Google Sign-in / User Profile (RESTORED) */}
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs max-w-[140px] truncate ${
                  isAdmin 
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                title={user.email || ''}
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                </div>
                <span className="truncate text-[11px] font-semibold">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setCurrentView('catalog');
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isAr ? 'دخول Google' : 'Connexion'}</span>
            </button>
          )}

          {/* Fast Registration Trigger */}
          <button
            onClick={onOpenCartOrEnroll}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-amber-300 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'التسجيل في دورة' : 'S’inscrire'}</span>
            {selectedCourseIds.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-xs font-extrabold ml-0.5">
                {selectedCourseIds.length}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 space-y-2.5 border-t border-slate-800/80 bg-slate-950">
          <button
            onClick={() => { setCurrentView('catalog'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
              currentView === 'catalog' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>{isAr ? 'قائمة الدورات التدريبية' : 'Toutes les formations'}</span>
          </button>

          {onOpenAIAssistant && (
            <button
              onClick={() => { onOpenAIAssistant(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30"
            >
              <Bot className="w-5 h-5 text-amber-400" />
              <span>{isAr ? 'وكيل GC58 AI (استشارة فورية)' : 'GC58 AI (Conseil Gratuit)'}</span>
            </button>
          )}

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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                currentView === 'admin' ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950/40 text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isAr ? 'لوحة تحكم الأدمين (المالك)' : 'Administration Master'}</span>
            </button>
          )}

          {!user && (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-white text-slate-950"
            >
              <span>{isAr ? 'تسجيل الدخول عبر Google' : 'Connexion Google'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

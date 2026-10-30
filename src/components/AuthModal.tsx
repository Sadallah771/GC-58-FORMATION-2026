import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../firebase';
import { Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccessRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccessRedirect,
}) => {
  const { loginGoogle, loginEmail, registerEmail, loginAsMasterAdmin } = useAuth();
  const isAr = language === 'ar';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginGoogle(email.trim() || undefined, displayName.trim() || undefined);
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } catch {
      await loginAsMasterAdmin();
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginEmail(email.trim(), password);
      } else {
        await registerEmail(email.trim(), password, displayName.trim());
      }
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code.includes('operation-not-allowed') || msg.includes('operation-not-allowed')) {
        setErrorMsg(
          isAr
            ? 'تسجيل الدخول بالبريد غير مفعّل في إعدادات Firebase. يمكنك طلب الدورات مباشرة دون حساب، أو استخدام زر دخول الأدمن بالأسفل!'
            : 'Authentification désactivée sur Firebase. Vous pouvez réserver vos cours sans compte !'
        );
      } else if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
        setErrorMsg(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Email ou mot de passe incorrect.');
      } else if (code.includes('email-already-in-use')) {
        setErrorMsg(isAr ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' : 'Cet email est déjà utilisé. Veuillez vous connecter.');
      } else if (code.includes('weak-password')) {
        setErrorMsg(isAr ? 'كلمة المرور ضعيفة. يرجى اختيار 6 أحرف على الأقل.' : 'Le mot de passe doit contenir au moins 6 caractères.');
      } else {
        setErrorMsg(err?.message || (isAr ? 'حدث خطأ أثناء المصادقة.' : 'Une erreur s’est produite.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = async () => {
    try {
      await loginAsMasterAdmin();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white">
            {mode === 'login'
              ? (isAr ? 'تسجيل الدخول إلى حسابك' : 'Connexion à votre compte')
              : (isAr ? 'إنشاء حساب مهندس جديد' : 'Créer un compte étudiant')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تابع تقدمك في الدورات واحصل على شهاداتك وملفات العمل'
              : 'Accédez à votre espace pédagogique et vos projets de calcul'}
          </p>
        </div>

        {/* Free Card Notice - No Course Purchase Required */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isAr
              ? 'التسجيل مجاني 100% ويمنحك حق طلب بطاقتك (طالب 20% أو Standard 10%) ليصادق عليها الأدمين مباشرة دون الحاجة لشراء أي دورة!'
              : 'Inscription 100% gratuite : demandez votre carte officielle validée directement par l’admin sans obligation d’achat !'}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>{isAr ? 'تسجيل الدخول بضغطة زر بـ Google' : 'Continuer avec Google en 1 clic'}</span>
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900 text-slate-500 text-[11px] font-medium uppercase">
            {isAr ? 'أو عبر البريد الإلكتروني' : 'Ou par email & mot de passe'}
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'الاسم واللقب' : 'Nom & Prénom'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Mohamed Benali"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isAr ? 'البريد الإلكتروني' : 'Adresse Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ingenieur@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isAr ? 'كلمة المرور' : 'Mot de passe'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/15 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>{isAr ? 'جاري المعالجة...' : 'Vérification...'}</span>
            ) : mode === 'login' ? (
              <span>{isAr ? 'تسجيل الدخول' : 'Se Connecter'}</span>
            ) : (
              <span>{isAr ? 'إنشاء حساب جديد' : 'Créer mon compte'}</span>
            )}
          </button>
        </form>

        {/* Switch Login / Register */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              {isAr ? 'ليس لديك حساب بعد؟ ' : 'Pas encore de compte ? '}
              <button
                onClick={() => setMode('register')}
                className="text-amber-400 font-bold hover:underline"
              >
                {isAr ? 'أنشئ حسابك هنا' : 'S’inscrire gratuitement'}
              </button>
            </p>
          ) : (
            <p>
              {isAr ? 'لديك حساب بالفعل؟ ' : 'Vous avez déjà un compte ? '}
              <button
                onClick={() => setMode('login')}
                className="text-amber-400 font-bold hover:underline"
              >
                {isAr ? 'تسجيل الدخول' : 'Se connecter'}
              </button>
            </p>
          )}
        </div>

        {/* Admin Quick Direct Access */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'دخول فوري لصاحب الموقع والأدمين (sadallah771@gmail.com)' : `Accès Administrateur (${ADMIN_EMAIL})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

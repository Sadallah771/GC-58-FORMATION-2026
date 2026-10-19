import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Layers 
} from 'lucide-react';
import { ADMIN_EMAIL } from '../firebase';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onSelectCategory: (cat: string) => void;
  onOpenEnroll: () => void;
  sitePhone: string;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectCategory,
  onOpenEnroll,
  sitePhone,
}) => {
  const isAr = language === 'ar';
  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const whatsappUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr ? 'السلام عليكم، أريد الاستفسار والتسجيل في دورات الهندسة المدنية.' : 'Bonjour, je souhaite m’inscrire.'
  )}`;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                GC58 FORMATIONS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'المنصة الجزائرية الرائدة لتكوين مهندسي وتقنيي الهندسة المدنية. دراسات حقيقية مطابقة لدفاتر شروط وهيئات المراقبة التقنية CTC.'
                : 'La plateforme de référence en Algérie pour la formation pratique des ingénieurs BTP aux logiciels de calcul de structures et d’infrastructures.'}
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'معايير جزائرية RPA99 / CCM97 / RNV99' : 'Conformité RPA 99 v2003 & Eurocodes'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'تخصصات التكوين وأسعار البروموسيون' : 'Pôles de Formation & Tarifs Promo'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('beton_arme')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>{isAr ? 'الخرسانة المسلحة (Robot, ETABS, Tunnel)' : 'Béton Armé (Robot, ETABS, Tunnel)'}</span>
                  <span className="text-[10px] font-bold text-blue-400">3 000 DA</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('charpente_metallique')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>{isAr ? 'الشاربونت ميتاليك (Hangars, Tekla, IDEA)' : 'Charpente Métallique (Tekla, IDEA)'}</span>
                  <span className="text-[10px] font-bold text-amber-400">5 000 DA</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('routes_vrd')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>{isAr ? 'حساب الطرقات وVRD (Covadis, Piste)' : 'Routes & VRD (Covadis, Piste 5)'}</span>
                  <span className="text-[10px] font-bold text-emerald-400">3 000 DA</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('routes_vrd')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>AutoCAD Génie Civil (Coffrage & Ferraillage)</span>
                  <span className="text-[10px] font-bold text-slate-300">3 000 DA</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Registration Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'خدمة التسجيل والمتابعة' : 'Contact & Inscriptions'}
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${sitePhone}`} className="font-mono text-white hover:text-amber-400 transition-colors">
                  {sitePhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#25D366] fill-[#25D366] shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-white hover:text-[#25D366] transition-colors">
                  WhatsApp: {sitePhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white">{ADMIN_EMAIL}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'تغطية كاملة لـ 58 ولاية (مرافقة هاتفية)' : 'Couverture nationale 58 Wilayas'}</span>
              </li>
            </ul>
          </div>

          {/* Order & Confirmation Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isAr ? '📞 اتصال شخصي مؤكد' : 'Validation par Appel'}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isAr
                ? 'فور تسجيل اسمك ورقم هاتفك في الموقع، سيتصل بك فريقنا لتأكيد طلبيتك وتسليمك برامج العمل وملفات التدريب.'
                : 'Dès que vous soumettez votre demande, notre équipe vous contacte par téléphone pour valider votre dossier et répondre à toutes vos questions.'}
            </p>
            <button
              onClick={onOpenEnroll}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isAr ? 'سجل طلبك الآن' : 'S’inscrire maintenant'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} GC58 FORMATIONS. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Algérie - 58 Wilayas</span>
            <span>•</span>
            <span>Tél: {sitePhone}</span>
            <span>•</span>
            <span>Admin: {ADMIN_EMAIL}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

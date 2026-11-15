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
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                GC58 FORMATIONS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr ? 'منصة تكوين مهندسي الهندسة المدنية وفق معايير CTC.' : 'Formation pratique en Génie Civil & CTC.'}
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>RPA 2024 / CCM 97 / RNV 2013</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'التخصصات والأسعار' : 'Pôles & Tarifs'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('beton_arme')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>{isAr ? 'الخرسانة المسلحة' : 'Béton Armé'}</span>
                  <span className="text-[10px] font-bold text-blue-400">3 000 DA</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('charpente_metallique')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>{isAr ? 'الشاربونت ميتاليك' : 'Charpente Métallique'}</span>
                  <span className="text-[10px] font-bold text-amber-400">5 000 DA</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('routes_vrd')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>{isAr ? 'الطرقات وAutoCAD' : 'Routes, VRD & AutoCAD'}</span>
                  <span className="text-[10px] font-bold text-emerald-400">3 000 DA</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'التواصل' : 'Contact'}
            </h4>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Order Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 self-start">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isAr ? '📞 تأكيد بالاتصال' : 'Validation Directe'}
            </h4>
            <p className="text-[11px] text-slate-300">
              {isAr ? 'سجل طلبك ليتصل بك فريقنا للتأكيد.' : 'Commandez et recevez un appel de confirmation.'}
            </p>
            <button
              onClick={onOpenEnroll}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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

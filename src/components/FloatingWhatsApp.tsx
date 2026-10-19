import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { Language } from '../types';

interface FloatingWhatsAppProps {
  language: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ language }) => {
  const isAr = language === 'ar';
  const phoneNumber = '0797034244';
  const whatsappUrl = `https://wa.me/213797034244?text=${encodeURIComponent(
    isAr 
      ? 'السلام عليكم، أريد الاستفسار وإكمال التسجيل في دورات GC58 FORMATIONS.' 
      : 'Bonjour, je souhaite des informations et finaliser mon inscription sur GC58 FORMATIONS.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
      {/* Call Direct Button with strict LTR direction */}
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-500 text-white shadow-xl hover:scale-105 transition-all text-xs font-bold"
        title="Appeler directement le 0797034244"
      >
        <PhoneCall className="w-4 h-4 text-amber-400" />
        <span dir="ltr" className="font-mono inline-block tracking-wider">{phoneNumber}</span>
      </a>

      {/* Main WhatsApp Floating Pill */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl shadow-[#25D366]/40 hover:scale-105 transition-all active:scale-95"
        title="أكمل الطلب عبر الواتساب"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-white text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold leading-tight">
            {isAr ? 'أكمل الطلب عبر الواتساب' : 'Finaliser sur WhatsApp'}
          </span>
          <span dir="ltr" className="text-[10px] font-mono opacity-90 inline-block">{phoneNumber}</span>
        </div>
      </a>
    </div>
  );
};

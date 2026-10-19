import React from 'react';
import { 
  X, 
  Clock, 
  Award, 
  CheckCircle, 
  Download, 
  BookOpen, 
  User, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers, 
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { Course, Language } from '../types';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  language: Language;
  onEnroll: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  language,
  onEnroll,
}) => {
  if (!course) return null;

  const isAr = language === 'ar';
  const isBA = course.category === 'beton_arme';
  const isMetal = course.category === 'charpente_metallique';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Course Thumbnail Banner */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-950/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white backdrop-blur-md transition-colors z-10 border border-slate-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-slate-900 border-b border-slate-800 flex-shrink-0">

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
              {course.software}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold ${
                isBA
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : isMetal
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isBA ? 'Béton Armé' : isMetal ? 'Charpente Métallique' : 'Routes & VRD'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {course.durationHours} Heures
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
            {course.title}
          </h2>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm font-mono text-slate-500 line-through">
                {course.originalPrice.toLocaleString()} دج
              </span>
            )}
            <div className="text-3xl font-black text-amber-400">
              <span dir="ltr" className="inline-block font-mono">{course.price.toLocaleString()}</span> <span className="text-sm font-bold text-slate-300">دج / DZD</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              {isAr ? 'بروموسيون 50 ساعة' : 'Offre 50h'}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {isAr ? '• تسجيل أولي بدون دفع مسبق' : '• Pré-inscription sans engagement'}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              {isAr ? 'عن الدورة التدريبية' : 'Présentation de la Formation'}
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isAr ? course.fullDesc.ar : course.fullDesc.fr}
            </p>
          </div>

          {/* Instructor Section */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{isAr ? 'المهندس المكوّن المشرف' : 'Formateur & Ingénieur Encadrant'}</span>
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-base">
                    {isAr
                      ? (course.category === 'charpente_metallique'
                          ? 'الأستاذ: أيمن سعد الله'
                          : (course.category === 'beton_arme' || course.id === 'autocad-genie-civil')
                            ? 'الأستاذ: صالحي حسين'
                            : course.instructor.name)
                      : (course.category === 'charpente_metallique'
                          ? 'Ing. Aymen Saadallah'
                          : (course.category === 'beton_arme' || course.id === 'autocad-genie-civil')
                            ? 'Ing. Hocine Salehi'
                            : course.instructor.name)}
                  </h5>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                    Agréé
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium mt-0.5">{course.instructor.title}</p>
                <p className="text-xs text-slate-400 mt-1">{course.instructor.experience} • {course.instructor.bio}</p>
              </div>
            </div>
          </div>

          {/* Detailed Syllabus */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{isAr ? 'البرنامج التفصيلي للدورة' : 'Programme Pédagogique Détaillé'}</span>
            </h4>
            <div className="space-y-3">
              {course.syllabus.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{mod.title}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {mod.duration}
                    </span>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {mod.topics.map((top, tIdx) => (
                      <li key={tIdx} className="text-xs text-slate-400 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables & Norms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <h5 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'الملفات المرفقة المسلّمة' : 'Ce que vous recevez'}</span>
              </h5>
              <ul className="space-y-1.5">
                {course.deliverables.map((item, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <h5 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>{isAr ? 'المعايير المعتمدة' : 'Règlements & Normes'}</span>
              </h5>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {course.standards.map((std, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-200 font-mono">
                    {std}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'مطابقة بنسبة 100% لمتطلبات مكاتب الدراسات وهيئات المراقبة التقنية CTC.'
                  : 'Totalement conforme aux exigences techniques de validation des dossiers CTC en Algérie.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div>
            <p className="text-xs text-slate-400">{isAr ? 'السعر المخفض (عرض 50 ساعة):' : 'Tarif Promo (50h) :'}</p>
            <p className="text-2xl font-black text-amber-400">
              <span dir="ltr" className="inline-block font-mono">{course.price.toLocaleString()}</span> <span className="text-xs font-bold text-slate-300">دج</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800"
            >
              {isAr ? 'إغلاق' : 'Fermer'}
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="flex-1 sm:flex-initial px-7 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'طلب الدورة (تسجيل أولي مجاني)' : 'Commander (Pré-inscription)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

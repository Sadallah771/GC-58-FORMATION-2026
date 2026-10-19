import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  Clock, 
  Check, 
  ArrowRight, 
  Plus,
  User
} from 'lucide-react';
import { Course, CourseCategory, Language } from '../types';
import { COURSES_DATA } from '../data/coursesData';

interface CourseCatalogProps {
  language: Language;
  courses?: Course[];
  onSelectCourseForDetail?: (course: Course) => void;
  onSelectCourseForEnroll: (course: Course) => void;
  selectedCourseIds: string[];
  onToggleSelectCourse: (courseId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  language,
  courses = COURSES_DATA,
  onSelectCourseForDetail,
  onSelectCourseForEnroll,
  selectedCourseIds,
  onToggleSelectCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CourseCategory>('all');
  const [selectedSoftware, setSelectedSoftware] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAr = language === 'ar';

  const softwareList = ['all', 'Robot', 'ETABS', 'Tekla', 'IDEA StatiCa', 'AutoCAD', 'Covadis', 'Piste'];

  const visibleCourses = courses.filter((c) => c.isActive !== false);

  const filteredCourses = visibleCourses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSoftware = selectedSoftware === 'all' || course.software.toLowerCase().includes(selectedSoftware.toLowerCase()) || course.title.toLowerCase().includes(selectedSoftware.toLowerCase());
    const matchesSearch = 
      searchQuery.trim() === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDesc.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDesc.ar.includes(searchQuery);

    return matchesCategory && matchesSoftware && matchesSearch;
  });

  return (
    <section id="courses-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'كتالوج الدورات المعتمدة - GC58 FORMATIONS' : 'Catalogue Officiel - GC58 FORMATIONS'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isAr ? 'تصفح الدورات وسجل تسجيلك الأولي' : 'Formations Spécialisées'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isAr ? (
              <>
                🔥 عرض <span dir="ltr" className="font-bold inline-block">50</span> ساعة: دورات الخرسانة المسلحة بـ <span dir="ltr" className="font-bold inline-block">3 000</span> دج | الشاربونت ميتاليك بـ <span dir="ltr" className="font-bold inline-block">5 000</span> دج | الطرقات وVRD بـ <span dir="ltr" className="font-bold inline-block">3 000</span> دج
              </>
            ) : (
              '🔥 Promo 50h : Béton Armé à 3 000 DA | Charpente à 5 000 DA | Routes & VRD à 3 000 DA'
            )}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن برنامج أو دورة...' : 'Rechercher un logiciel...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Reassurance Banner in Catalog */}
      <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>
            {isAr
              ? '💡 تنبيه: تصفح كل الدورات متاح للجميع من هنا. عند النقر على "طلب الدورة"، يتم تسجيلك تسجيل أولي واستفساري فقط دون أي التزام مالي أو دفع فوري!'
              : '💡 Note : Vous pouvez consulter librement tous les cours. Cliquer sur "Commander" est une pré-inscription sans engagement ni paiement immédiat.'}
          </span>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 shrink-0">
          {isAr ? 'تخفيض 50 ساعة' : 'Promo 50h'}
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b border-slate-800/60">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isAr ? 'جميع الدورات (13)' : 'Toutes les formations (13)'}
        </button>

        <button
          onClick={() => setSelectedCategory('beton_arme')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'beton_arme'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>{isAr ? 'الخرسانة المسلحة (3 000 دج)' : 'Béton Armé (3 000 DA)'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('charpente_metallique')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'charpente_metallique'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>{isAr ? 'الشاربونت ميتاليك (5000 دج)' : 'Charpente Métallique (5 000 DA)'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('routes_vrd')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'routes_vrd'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>{isAr ? 'حساب الطرقات وVRD (3000 دج)' : 'Routes & VRD (3 000 DA)'}</span>
        </button>
      </div>

      {/* Software Filters */}
      <div className="flex flex-wrap items-center gap-1.5 mb-8">
        <span className="text-xs text-slate-400 font-semibold mr-1">
          {isAr ? 'البرنامج:' : 'Logiciel :'}
        </span>
        {softwareList.map((soft) => (
          <button
            key={soft}
            onClick={() => setSelectedSoftware(soft)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedSoftware === soft
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {soft === 'all' ? (isAr ? 'الكل' : 'Tous') : soft}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isSelected = selectedCourseIds.includes(course.id);
          const isBA = course.category === 'beton_arme';
          const isMetal = course.category === 'charpente_metallique';

          return (
            <div
              key={course.id}
              className={`group flex flex-col rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Software Badge */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-200 border border-slate-700/60">
                    {course.software}
                  </span>
                </div>

                {/* Price & Promo Badge */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-amber-500/40 backdrop-blur-md shadow-lg">
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-[10px] font-mono text-slate-400 line-through">
                        {course.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs font-mono font-black text-amber-300">
                      {course.price.toLocaleString()} DA
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span><span dir="ltr" className="inline-block font-mono">{course.durationHours}</span> Heures</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {isAr ? course.shortDesc.ar : course.shortDesc.fr}
                  </p>

                  {/* Standards Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.standards.slice(0, 2).map((std) => (
                      <span
                        key={std}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {std}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      CTC Valide
                    </span>
                  </div>

                  {/* Instructor Mini Badge - Photos removed as requested */}
                  <div className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
                    <div className="w-7 h-7 rounded-full bg-slate-800/90 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200 truncate">
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
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{course.instructor.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCourseForEnroll(course)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-1.5"
                  >
                    <span>{isAr ? 'طلب الدورة (تسجيل أولي مجاني)' : 'Commander (Pré-inscription)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleSelectCourse(course.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/60'
                    }`}
                    title={isSelected ? (isAr ? 'إزالة من السلة' : 'Retirer du panier') : (isAr ? 'إضافة إلى السلة' : 'Ajouter au panier')}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  Clock, 
  Check, 
  ArrowRight, 
  Plus,
  User,
  CreditCard,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { Course, CourseCategory, Language, ClientLoyaltyData } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { calculateCourseDiscount, getTierNameAr, getTierDiscountPercent } from '../utils/loyaltyHelper';

interface CourseCatalogProps {
  language: Language;
  courses?: Course[];
  userLoyalty?: ClientLoyaltyData | null;
  onSelectCourseForDetail?: (course: Course) => void;
  onSelectCourseForEnroll: (course: Course) => void;
  selectedCourseIds: string[];
  onToggleSelectCourse: (courseId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  language,
  courses = COURSES_DATA,
  userLoyalty,
  onSelectCourseForDetail,
  onSelectCourseForEnroll,
  selectedCourseIds,
  onToggleSelectCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CourseCategory>('all');
  const [selectedSoftware, setSelectedSoftware] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCatalogDetails, setShowCatalogDetails] = useState<boolean>(false);

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

      {/* Sleek 1-Line Reassurance & Membership Bar with Expandable Details */}
      {(() => {
        const hasCard = Boolean(userLoyalty?.hasActiveCard);
        const activeTier = userLoyalty?.tier || 'STANDARD';
        const activeTierPercent = getTierDiscountPercent(activeTier, hasCard);
        const activeTierName = getTierNameAr(activeTier);

        return (
          <div className="mb-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  {hasCard
                    ? (isAr ? `بطاقتك معتمدة (${activeTierName}): تخفيض -${activeTierPercent}% على كل الدورات` : `Carte validée (${activeTier}) : -${activeTierPercent}%`)
                    : (isAr ? '💡 تصفح واطلب أي دورة بدون التزام مالي مسبق' : '💡 Consultez et commandez sans engagement')}
                </span>
                {!hasCard && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold shrink-0">
                    {isAr ? 'بطاقة مجانية متاحة' : 'Gratuit'}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowCatalogDetails(!showCatalogDetails)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{showCatalogDetails ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من التفاصيل والخصومات ▾' : 'Détails & remises ▾')}</span>
              </button>
            </div>

            {/* Expandable Details Section */}
            {showCatalogDetails && (
              <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3 animate-fadeIn">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{isAr ? 'ضمان التسجيل والاستفسار المجاني:' : 'Garantie d’inscription sans engagement :'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isAr
                      ? 'عند النقر على "طلب الدورة"، يتم تسجيل طلبك واستفسارك فقط لتتواصل معك الإدارة وتجيبك عن تفاصيل الدورة والبرامج دون أي التزام أو دفع فوري.'
                      : 'Cliquer sur commander est une simple pré-inscription d’information sans obligation de paiement immédiat.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>{isAr ? 'تخفيضات بطاقات العضوية المعتمدة:' : 'Barème des remises par carte :'}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Standard</span>
                      <span className="text-xs font-black text-amber-300 font-mono">-10%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">طالب جامعي 🎓 / PRO</span>
                      <span className="text-xs font-black text-emerald-400 font-mono">-20%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Silver</span>
                      <span className="text-xs font-black text-slate-200 font-mono">-20%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Golden VIP</span>
                      <span className="text-xs font-black text-amber-400 font-mono">-30%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
          const hasCard = Boolean(userLoyalty?.hasActiveCard);
          const pricing = calculateCourseDiscount(course.price, userLoyalty?.tier || 'STANDARD', hasCard);

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

                {/* Price & Promo Badge with Member Discount */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-amber-500/40 backdrop-blur-md shadow-lg">
                    <span className="text-[10px] font-mono text-slate-400 line-through">
                      {pricing.basePrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-black text-amber-300">
                      {pricing.discountedPrice.toLocaleString()} DA
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[9px] font-black">
                      -{pricing.discountPercent}%
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
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-1.5">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-xs text-slate-400 line-clamp-1 flex-1">
                      {isAr ? course.shortDesc.ar : course.shortDesc.fr}
                    </p>
                    {onSelectCourseForDetail && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourseForDetail(course);
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline shrink-0 cursor-pointer"
                      >
                        {isAr ? 'تفاصيل أكثر ▾' : 'Détails ▾'}
                      </button>
                    )}
                  </div>

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

                  {/* Instructor Mini Badge */}
                  <div className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
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

                  {/* High-Clarity Pricing Box */}
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 mb-4 space-y-1.5 shadow-inner">
                    {hasCard ? (
                      <>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1 font-bold">
                            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isAr ? `تخفيض بطاقة ${pricing.tierNameAr}:` : `Remise ${pricing.tierNameFr} :`}</span>
                          </span>
                          <span className="font-extrabold text-emerald-400 font-mono text-[11px] bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                            -{pricing.discountPercent}% ({isAr ? `وفرت ${pricing.discountAmount.toLocaleString()} دج` : `-${pricing.discountAmount.toLocaleString()} DA`})
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                          <div className="text-[11px] font-mono">
                            <span className="text-slate-500 line-through block">{pricing.basePrice.toLocaleString()} دج</span>
                            <span className="text-[9px] text-slate-500">{isAr ? 'سعر الأدمن المعتمد' : 'Prix initial'}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-amber-400 font-mono" dir="ltr">
                              {pricing.discountedPrice.toLocaleString()} DA
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold block">
                              {isAr ? 'السعر الجديد لحامل البطاقة' : 'Nouveau tarif'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isAr ? 'سعر الدورة المعتمد' : 'Tarif officiel'}
                          </span>
                          <span className="text-[10px] text-amber-400 font-medium">
                            {isAr ? '💡 احصل على تخفيض عند طلب بطاقة' : 'Remise avec carte'}
                          </span>
                        </div>
                        <div className="text-base font-black text-white font-mono" dir="ltr">
                          {course.price.toLocaleString()} DA
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCourseForEnroll(course)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isAr ? 'طلب بالسعر الجديد' : 'Commander'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onSelectCourseForDetail && (
                    <button
                      onClick={() => onSelectCourseForDetail(course)}
                      className="p-2.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                      title={isAr ? 'تفاصيل الدورة' : 'Détails du cours'}
                    >
                      <Info className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  <button
                    onClick={() => onToggleSelectCourse(course.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
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

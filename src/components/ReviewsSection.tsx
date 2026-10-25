import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Sparkles, 
  MessageSquarePlus, 
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Language, Review } from '../types';
import { INITIAL_REVIEWS } from '../data/coursesData';

interface ReviewsSectionProps {
  language: Language;
  onOpenEvaluateModal: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  language,
  onOpenEvaluateModal,
}) => {
  const isAr = language === 'ar';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Helper to load and merge reviews
  const loadMergedReviews = (firestoreList: Review[] = []) => {
    // 1. Get local storage reviews
    let localList: Review[] = [];
    try {
      const saved = localStorage.getItem('gc58_custom_reviews');
      if (saved) localList = JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading local reviews:', e);
    }

    // 2. Combine all lists with de-duplication by id
    const map = new Map<string, Review>();

    // Initial fallback
    INITIAL_REVIEWS.forEach((r) => map.set(r.id || r.comment, r));

    // Local submissions
    localList.forEach((r) => map.set(r.id || r.comment, r));

    // Firestore live
    firestoreList.forEach((r) => map.set(r.id || r.comment, r));

    // Convert to array and strictly sort newest first: الأحدث بالأحدث
    const sorted = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setReviews(sorted);
  };

  useEffect(() => {
    // Initial load
    loadMergedReviews([]);

    // Listen to Firestore real-time updates
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Review[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as Review) });
            });
            loadMergedReviews(list);
          }
        },
        () => {
          // Fallback to local
          loadMergedReviews([]);
        }
      );
      return () => unsubscribe();
    } catch {
      loadMergedReviews([]);
    }
  }, []);

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  // Format relative or friendly date
  const formatReviewDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 24) {
        return isAr ? 'اليوم (الأحدث)' : "Aujourd'hui (Récent)";
      }
      if (diffDays === 1) {
        return isAr ? 'أمس' : 'Hier';
      }
      if (diffDays < 7) {
        return isAr ? `منذ ${diffDays} أيام` : `Il y a ${diffDays} jours`;
      }
      return date.toLocaleDateString(isAr ? 'ar-DZ' : 'fr-DZ', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const isRecentReview = (isoStr: string) => {
    try {
      const diffDays = (Date.now() - new Date(isoStr).getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    } catch {
      return false;
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 8);

  return (
    <section id="reviews-section" className="py-16 bg-slate-950/70 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تقييمات وآراء المهندسين الموثقة' : 'Avis & Témoignages Vérifiés'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {isAr ? 'ماذا يقول مهندسونا بعد إتمام الدورات؟' : 'Ils ont validé leurs projets avec nos formations'}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-300/90 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isAr
                  ? '✨ التقييمات معروضة تلقائياً الأحدث بالأحدث'
                  : '✨ Affichage trié : les plus récents en premier'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Rating summary */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="text-3xl font-black text-amber-400 font-mono" dir="ltr">{averageRating}</div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr ? (
                    <>
                      بناءً على <span dir="ltr" className="font-mono font-bold inline-block text-white">{reviews.length}</span> تقييماً معتمداً
                    </>
                  ) : (
                    `Basé sur ${reviews.length} avis récents`
                  )}
                </p>
              </div>
            </div>

            {/* Direct Add Review Button */}
            <button
              onClick={onOpenEvaluateModal}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'أضف تقييمك الآن ⭐' : 'Ajouter votre avis ⭐'}</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid (Sorted Newest First) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedReviews.map((rev, index) => {
            const isRecent = isRecentReview(rev.createdAt);
            return (
              <div
                key={rev.id || `rev-${index}`}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-lg relative overflow-hidden"
              >
                {/* Recent Badge */}
                {isRecent && (
                  <div className="absolute top-0 right-0">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 rounded-bl-lg">
                      {isAr ? 'جديد' : 'Récent'}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Date Newest Format */}
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-500" />
                      <span>{formatReviewDate(rev.createdAt)}</span>
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
                    {rev.userName ? rev.userName[0].toUpperCase() : 'M'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <p className="text-xs font-bold text-white truncate">{rev.userName}</p>
                      <span title={isAr ? 'تقييم معتمد وموثق' : 'Avis vérifié'} className="inline-flex">
                        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-400 truncate">
                      {rev.userTitle || rev.userWilaya || (isAr ? 'مهندس هندسة مدنية' : 'Ingénieur Génie Civil')}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {rev.courseTitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More / View Less Toggle */}
        {reviews.length > 8 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <span>
                {showAll
                  ? (isAr ? 'عرض أقل' : 'Voir moins')
                  : (isAr ? `عرض باقي التقييمات (${reviews.length - 8} تقييم إضافي)` : `Voir plus (${reviews.length - 8} avis)`)}
              </span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Call to Action for evaluation at the bottom of the section */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenEvaluateModal}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-500 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span>
              {isAr
                ? 'هل سجلت معنا أو أكملت دورة؟ شارك رأيك وقيم المنصة بنجومك ⭐'
                : 'Vous suivez une formation ? Donnez votre avis et notez-nous ⭐'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

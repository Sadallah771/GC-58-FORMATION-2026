import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle, 
  Sparkles, 
  MessageSquarePlus, 
  User 
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
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  useEffect(() => {
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
            // Merge Firestore reviews with initial reviews
            setReviews([...list, ...INITIAL_REVIEWS.filter(ir => !list.some(l => l.id === ir.id))]);
          }
        },
        () => {
          // fallback to INITIAL_REVIEWS
        }
      );
      return () => unsubscribe();
    } catch {
      // ignore fallback
    }
  }, []);

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تقييمات وآراء الطلاب والمهندسين' : 'Avis & Témoignages Vérifiés'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {isAr ? 'ماذا يقول مهندسونا بعد إتمام الدورات؟' : 'Ils ont validé leurs projets avec nos formations'}
            </h2>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-3xl font-black text-amber-400" dir="ltr">{averageRating}</div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr ? (
                  <>
                    بناءً على <span dir="ltr" className="font-mono font-bold inline-block">{reviews.length}</span> تقييم حقيقي
                  </>
                ) : (
                  `Basé sur ${reviews.length} avis certifiés`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 8).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString('fr-DZ', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <p className="text-xs font-bold text-white truncate">{rev.userName}</p>
                <p className="text-[11px] text-amber-400/90 truncate">{rev.userTitle || rev.userWilaya || 'Ingénieur Génie Civil'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{rev.courseTitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action for evaluation */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenEvaluateModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'هل أكملت دورة معنا؟ أضف تقييمك الآن' : 'Vous avez terminé une session ? Donnez votre avis'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

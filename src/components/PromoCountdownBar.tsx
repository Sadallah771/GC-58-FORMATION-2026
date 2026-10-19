import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface PromoCountdownBarProps {
  language: Language;
  onOpenEnroll: () => void;
}

export const PromoCountdownBar: React.FC<PromoCountdownBarProps> = ({
  language,
  onOpenEnroll,
}) => {
  const isAr = language === 'ar';

  // 50 Hours countdown calculation stored in localStorage
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 49,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const STORAGE_KEY = 'gc58_promo_endtime_50h';
    const FIFTY_HOURS_MS = 50 * 60 * 60 * 1000;

    let targetTime: number;
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed > now) {
        targetTime = parsed;
      } else {
        // If expired, reset to fresh 50 hours promo cycle for visitor
        targetTime = now + FIFTY_HOURS_MS;
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
      }
    } else {
      targetTime = now + FIFTY_HOURS_MS;
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
    }

    const updateTimer = () => {
      const current = Date.now();
      const diff = Math.max(0, targetTime - current);

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 py-2.5 px-3 sm:px-4 shadow-lg sticky top-0 z-50 border-b border-amber-400/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        {/* Promo Title & Badge */}
        <div className="flex items-center gap-2 font-black text-center sm:text-left">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[11px] font-extrabold uppercase shadow-sm shrink-0 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{isAr ? 'بروموسيون 50 ساعة فقط!' : 'Promo 50 Heures !'}</span>
          </span>
          <span className="leading-tight text-slate-950 font-black">
            {isAr ? (
              <>
                تخفيضات استثنائية: دورات بـ <span dir="ltr" className="font-mono font-black inline-block">3000</span> دج و <span dir="ltr" className="font-mono font-black inline-block">5000</span> دج بدل <span dir="ltr" className="font-mono inline-block">10 000</span> دج!
              </>
            ) : (
              <>
                Tarifs Réduits : Formations à <span dir="ltr" className="font-mono font-black inline-block">3 000</span> DA et <span dir="ltr" className="font-mono font-black inline-block">5 000</span> DA !
              </>
            )}
          </span>
        </div>

        {/* Live 50H Countdown & Action Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm bg-slate-950 text-white px-3 py-1 rounded-xl shadow-inner border border-slate-800" dir="ltr">
            <Clock className="w-3.5 h-3.5 text-amber-400 mr-1 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">{format2(timeLeft.hours)}h</span>
            <span className="text-amber-400">:</span>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">{format2(timeLeft.minutes)}m</span>
            <span className="text-amber-400">:</span>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 w-7 text-center">{format2(timeLeft.seconds)}s</span>
          </div>

          <button
            onClick={onOpenEnroll}
            className="px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs transition-all shadow-md hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1"
          >
            <span>{isAr ? 'احجز بالسعر المخفض' : 'Profiter du tarif promo'}</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

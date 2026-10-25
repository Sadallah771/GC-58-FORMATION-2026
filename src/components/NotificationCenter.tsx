import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  BookOpen, 
  FileSpreadsheet, 
  MessageSquare, 
  Megaphone, 
  Tag, 
  ExternalLink, 
  Clock, 
  Sparkles,
  Volume2,
  VolumeX,
  Monitor
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppNotification, Language } from '../types';
import { 
  getReadNotificationIds, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  requestNotificationPermission,
  getNotificationPermission,
  sendDesktopNotification,
  playNotificationSound
} from '../utils/notificationHelper';

interface NotificationCenterProps {
  language: Language;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => getReadNotificationIds());
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(() => getNotificationPermission());
  const [hasPromptedPermission, setHasPromptedPermission] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastKnownCountRef = useRef<number>(0);

  // Real-time Firestore listener for site notifications
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(
        collection(db, 'site_notifications'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: AppNotification[] = [];
          snapshot.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as AppNotification) });
          });

          // Check if a brand new notification arrived (trigger desktop notification & chime)
          if (lastKnownCountRef.current > 0 && loaded.length > lastKnownCountRef.current) {
            const newest = loaded[0];
            if (newest && !readIds.includes(newest.id || '')) {
              sendDesktopNotification(
                newest.title,
                newest.message,
                newest.link || '/'
              );
            }
          }
          lastKnownCountRef.current = loaded.length;
          setNotifications(loaded);
        },
        (err) => {
          console.warn('Notifications Firestore listener notice:', err);
        }
      );
    } catch (err) {
      console.warn('Failed to listen to notifications:', err);
    }

    return () => unsubscribe();
  }, [readIds]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Request permission helper
  const handleEnableDesktopNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    setHasPromptedPermission(true);
    if (result === 'granted') {
      sendDesktopNotification(
        isAr ? 'تم تفعيل إشعارات سطح المكتب بنجاح! 🔔' : 'Notifications activées ! 🔔',
        isAr ? 'ستصلك كافة التحديثات والدورات الجديدة في الخلفية فور إطلاقها.' : 'Vous recevrez les nouveautés en temps réel.'
      );
    }
  };

  const handleItemClick = (notif: AppNotification) => {
    if (notif.id) {
      markNotificationAsRead(notif.id);
      setReadIds((prev) => (prev.includes(notif.id!) ? prev : [...prev, notif.id!]));
    }
    if (notif.link) {
      window.location.href = notif.link;
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id).filter(Boolean) as string[];
    markAllNotificationsAsRead(allIds);
    setReadIds(allIds);
  };

  const unreadCount = notifications.filter((n) => n.id && !readIds.includes(n.id)).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'file':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'discount':
        return <Tag className="w-4 h-4 text-rose-400" />;
      default:
        return <Megaphone className="w-4 h-4 text-amber-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'course':
        return { label: isAr ? 'دورة جديدة' : 'Formation', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'file':
        return { label: isAr ? 'ملف جديد' : 'Fichier', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'message':
        return { label: isAr ? 'رسالة هامة' : 'Message', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'discount':
        return { label: isAr ? 'تخفيض خاص' : 'Remise', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      default:
        return { label: isAr ? 'إعلان عام' : 'Annonce', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
        title={isAr ? 'الإشعارات والتنبيهات' : 'Notifications'}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-amber-400 animate-wiggle' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-black text-[10px] flex items-center justify-center shadow-md shadow-rose-500/40 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-[340px] sm:w-[410px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{isAr ? 'الإشعارات والتنبيهات' : 'Notifications'}</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                      {unreadCount} {isAr ? 'جديد' : 'nouveau'}
                    </span>
                  )}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-2.5 py-1 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer font-bold"
                  title={isAr ? 'تحديد الكل كمقروء' : 'Tout marquer comme lu'}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'قراءة الكل' : 'Tout lu'}</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Push Permissions Callout (if not granted) */}
          {permission !== 'granted' && (
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 text-[11px] font-medium leading-tight truncate">
                  {isAr ? 'فعّل إشعارات سطح المكتب لتصلك التحديثات في الخلفية' : 'Activez les notifications PC'}
                </span>
              </div>
              <button
                onClick={handleEnableDesktopNotifications}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                {isAr ? 'تفعيل 🔔' : 'Activer 🔔'}
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 text-slate-600 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400">
                  {isAr ? 'لا توجد إشعارات حالياً' : 'Aucune notification'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isAr ? 'ستصلك هنا كافة الدورات والتحديثات التي يطلقها الأدمين' : 'Toutes les actualités apparaîtront ici'}
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isRead = notif.id ? readIds.includes(notif.id) : false;
                const badge = getTypeBadge(notif.type);
                const timeStr = notif.createdAt
                  ? new Date(notif.createdAt).toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 transition-all cursor-pointer relative group flex items-start gap-3 ${
                      isRead ? 'bg-slate-900/40 hover:bg-slate-800/60' : 'bg-slate-900/90 hover:bg-slate-850'
                    }`}
                  >
                    {/* Unread blue dot */}
                    {!isRead && (
                      <span className="absolute top-4 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                    )}

                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                        {notif.isImportant && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold font-mono">
                            {isAr ? 'عاجل' : 'Urgent'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono ml-auto">
                          {timeStr}
                        </span>
                      </div>

                      <h5 className={`text-xs font-bold leading-snug ${isRead ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </h5>

                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      {notif.link && (
                        <div className="pt-1 flex items-center gap-1 text-[11px] text-amber-400 font-bold group-hover:underline">
                          <span>{notif.actionLabel || (isAr ? 'عرض التفاصيل' : 'Voir plus')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
            <span>{isAr ? 'تطبيق GC58 - إشعارات فورية متصلة بالخلفية' : 'GC58 App - Notifications en direct'}</span>
          </div>

        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PromoCountdownBar } from './components/PromoCountdownBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CourseCatalog } from './components/CourseCatalog';
import { EnrollmentModal } from './components/EnrollmentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ReviewsSection } from './components/ReviewsSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AddReviewModal } from './components/AddReviewModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { StudentDashboard } from './components/StudentDashboard';
import { GiftCourseSection } from './components/GiftCourseSection';
import { GiftCourseModal } from './components/GiftCourseModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Course, Language, GiftCourseSettings, Registration, ClientLoyaltyData } from './types';
import { COURSES_DATA } from './data/coursesData';
import { DEFAULT_GIFT_COURSE } from './utils/driveHelper';
import { calculateClientLoyalty } from './utils/loyaltyHelper';
import { collection, onSnapshot, doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [language, setLanguage] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<'catalog' | 'admin' | 'student'>('catalog');
  
  // Dynamic courses that can be edited by Admin
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [sitePhone, setSitePhone] = useState<string>('0797034244');
  
  // Gift Course state with default civil engineering content
  const [giftCourse, setGiftCourse] = useState<GiftCourseSettings>(DEFAULT_GIFT_COURSE);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'analytics' | 'orders' | 'courses' | 'gift' | 'settings'>('analytics');
  
  // Selected courses for enrollment
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  
  // Modals state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollPreselectedIds, setEnrollPreselectedIds] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [courseForDetail, setCourseForDetail] = useState<Course | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Register Service Worker for Desktop/Mobile PWA and background notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('GC58 PWA Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('GC58 Service Worker registration note:', err);
          });
      });
    }
  }, []);

  // User confirmed orders & loyalty state
  const [userOrders, setUserOrders] = useState<Registration[]>([]);

  useEffect(() => {
    const emailToUse = user?.email?.toLowerCase().trim() || localStorage.getItem('gc58_student_email')?.toLowerCase().trim();
    if (!emailToUse) {
      setUserOrders([]);
      return;
    }

    try {
      const q = query(collection(db, 'registrations'), where('email', '==', emailToUse));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const loaded: Registration[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...(d.data() as Registration) });
          });
          setUserOrders(loaded);
        },
        (err) => {
          console.warn('User orders listener info:', err);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Orders listener setup:', e);
    }
  }, [user]);

  const userLoyalty = React.useMemo(() => {
    const emailToUse = user?.email?.toLowerCase().trim() || localStorage.getItem('gc58_student_email')?.toLowerCase().trim() || null;
    return calculateClientLoyalty(userOrders, emailToUse, null);
  }, [userOrders, user]);

  // Sync HTML dir with selected language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Load custom site courses & settings from Firestore if available
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'site_courses'), (snapshot) => {
        if (!snapshot.empty) {
          const overrides: Record<string, Partial<Course>> = {};
          snapshot.forEach((doc) => {
            overrides[doc.id] = doc.data() as Partial<Course>;
          });
          setCourses((prevCourses) =>
            prevCourses.map((c) => {
              if (overrides[c.id]) {
                return { ...c, ...overrides[c.id] };
              }
              return c;
            })
          );
        }
      });

      // Load general settings
      getDoc(doc(db, 'site_settings', 'general')).then((snap) => {
        if (snap.exists() && snap.data()?.phone) {
          setSitePhone(snap.data().phone);
        }
      }).catch(() => {});

      // Load gift course settings
      const unsubGift = onSnapshot(doc(db, 'site_settings', 'gift_course'), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<GiftCourseSettings>;
          setGiftCourse((prev) => ({
            ...prev,
            ...data,
            episodes: Array.isArray(data.episodes) && data.episodes.length > 0 ? data.episodes : prev.episodes,
          }));
        }
      });

      return () => {
        unsub();
        unsubGift();
      };
    } catch (e) {
      console.warn('Firestore real-time sync info:', e);
    }
  }, []);

  const handleSaveGiftCourse = async (updated: GiftCourseSettings) => {
    setGiftCourse(updated);
    try {
      await setDoc(doc(db, 'site_settings', 'gift_course'), updated, { merge: true });
    } catch (err) {
      console.error('Failed to save gift course in Firestore:', err);
      throw err;
    }
  };

  const toggleSelectCourse = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleEnrollSingleCourse = (course: Course) => {
    setEnrollPreselectedIds([course.id]);
    setIsEnrollModalOpen(true);
  };

  const handleOpenCartOrEnroll = () => {
    if (selectedCourseIds.length > 0) {
      setEnrollPreselectedIds(selectedCourseIds);
    } else {
      setEnrollPreselectedIds([courses[0]?.id || COURSES_DATA[0].id]);
    }
    setIsEnrollModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* 50-Hours Promotional Countdown Banner */}
      <PromoCountdownBar
        language={language}
        onOpenEnroll={handleOpenCartOrEnroll}
      />

      {/* PWA Smart Installation Banner & Multi-Device Helper */}
      <PWAInstallBanner
        language={language}
        isOpenModal={isInstallModalOpen}
        onCloseModal={() => setIsInstallModalOpen(false)}
      />

      {/* Top Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        selectedCourseIds={selectedCourseIds}
        onOpenCartOrEnroll={handleOpenCartOrEnroll}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sitePhone={sitePhone}
        onOpenGiftModal={() => setIsGiftModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <>
            <Hero
              language={language}
              onExploreCourses={() => {
                const el = document.getElementById('courses-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenFastEnroll={handleOpenCartOrEnroll}
              sitePhone={sitePhone}
            />

            {/* Exclusive Site Gift Section (Google Drive Free Course) */}
            <GiftCourseSection
              language={language}
              giftCourse={giftCourse}
              sitePhone={sitePhone}
              onOpenGiftModal={() => setIsGiftModalOpen(true)}
              isAdmin={isAdmin}
              onOpenAdminGiftTab={() => {
                setAdminInitialTab('gift');
                setCurrentView('admin');
              }}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />

            <CourseCatalog
              language={language}
              courses={courses}
              userLoyalty={userLoyalty}
              onSelectCourseForDetail={(c) => setCourseForDetail(c)}
              onSelectCourseForEnroll={handleEnrollSingleCourse}
              selectedCourseIds={selectedCourseIds}
              onToggleSelectCourse={toggleSelectCourse}
            />

            <ReviewsSection
              language={language}
              onOpenEvaluateModal={() => setIsReviewModalOpen(true)}
            />
          </>
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            language={language}
            courses={courses}
            onUpdateCourses={(updated) => setCourses(updated)}
            sitePhone={sitePhone}
            onUpdateSitePhone={(newP) => setSitePhone(newP)}
            onCloseAdmin={() => setCurrentView('catalog')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            giftCourse={giftCourse}
            onSaveGiftCourse={handleSaveGiftCourse}
            initialTab={adminInitialTab}
          />
        )}

        {currentView === 'student' && (
          <StudentDashboard
            language={language}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenEnroll={handleOpenCartOrEnroll}
            sitePhone={sitePhone}
            onOpenGiftModal={() => setIsGiftModalOpen(true)}
            giftCourse={giftCourse}
          />
        )}
      </main>

      {/* Floating WhatsApp and Call button with 0797034244 */}
      <FloatingWhatsApp language={language} />

      {/* Footer */}
      <Footer
        language={language}
        onSelectCategory={(cat) => {
          setCurrentView('catalog');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenEnroll={handleOpenCartOrEnroll}
        sitePhone={sitePhone}
      />

      {/* Modals */}
      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        language={language}
        preselectedCourseIds={enrollPreselectedIds}
        courses={courses}
        sitePhone={sitePhone}
        userLoyalty={userLoyalty}
      />

      <CourseDetailModal
        course={courseForDetail}
        onClose={() => setCourseForDetail(null)}
        language={language}
        userLoyalty={userLoyalty}
        onEnroll={handleEnrollSingleCourse}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />

      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        language={language}
        courses={courses}
      />

      {/* Gift Course Video Player Modal (Free & Code-Gated) */}
      <GiftCourseModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        language={language}
        giftCourse={giftCourse}
        sitePhone={sitePhone}
        isAdmin={isAdmin}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

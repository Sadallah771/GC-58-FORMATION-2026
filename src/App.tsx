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
import { AIAssistantModal } from './components/AIAssistantModal';
import { AddReviewModal } from './components/AddReviewModal';
import { Bot } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Course, Language } from './types';
import { COURSES_DATA } from './data/coursesData';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

function AppContent() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<'catalog' | 'admin'>('catalog');
  
  // Dynamic courses that can be edited by Admin
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [sitePhone, setSitePhone] = useState<string>('0797034244');
  
  // Selected courses for enrollment
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  
  // Modals state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollPreselectedIds, setEnrollPreselectedIds] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

      return () => unsub();
    } catch (e) {
      console.warn('Firestore real-time sync info:', e);
    }
  }, []);

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

      {/* Top Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        selectedCourseIds={selectedCourseIds}
        onOpenCartOrEnroll={handleOpenCartOrEnroll}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sitePhone={sitePhone}
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
              onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
              sitePhone={sitePhone}
            />

            <CourseCatalog
              language={language}
              courses={courses}
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
          />
        )}
      </main>

      {/* Floating AI Consultant Widget Launcher (Bottom-Left) */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 left-6 z-40 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all border border-amber-300/40 cursor-pointer"
        title={language === 'ar' ? 'استشر وكيل الذكاء الاصطناعي GC58 AI' : 'Conseiller GC58 AI'}
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
        </div>
        <span className="hidden sm:inline">
          {language === 'ar' ? 'وكيل GC58 AI (استشارة هندسية مجانية)' : 'GC58 AI (Conseil Gratuit)'}
        </span>
        <span className="sm:hidden font-mono font-bold">
          GC58 AI
        </span>
      </button>

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
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        language={language}
        courses={courses}
        onSelectCourseForEnroll={handleEnrollSingleCourse}
        sitePhone={sitePhone}
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

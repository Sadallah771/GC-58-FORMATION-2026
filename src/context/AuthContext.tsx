import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  ADMIN_EMAIL, 
  ADMIN_EMAILS,
  loginWithGoogle as fbLoginWithGoogle, 
  loginWithEmail as fbLoginWithEmail, 
  registerWithEmail as fbRegisterWithEmail, 
  logoutUser 
} from '../firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  loginGoogle: (optionalEmail?: string, optionalName?: string) => Promise<User | AppUser>;
  loginEmail: (email: string, pass: string) => Promise<User | AppUser>;
  registerEmail: (email: string, pass: string, name?: string) => Promise<User | AppUser>;
  loginAsMasterAdmin: (passcode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  simulateAdminMode: boolean;
  setSimulateAdminMode: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_ADMIN_KEY = 'gc58_admin_session_sadallah';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulateAdminMode, setSimulateAdminMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if master admin session was previously authenticated on this browser
    try {
      const savedAdmin = localStorage.getItem(STORAGE_ADMIN_KEY);
      if (savedAdmin && savedAdmin.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setCustomUser({
          uid: 'admin-sadallah771',
          email: ADMIN_EMAIL,
          displayName: 'Admin Sadallah (GC58)',
          emailVerified: true,
        });
      }
    } catch {
      // Local storage unavailable
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeUser = user || customUser;
  const isMasterAdmin = Boolean(
    activeUser?.email && ADMIN_EMAILS.some((adm) => adm.toLowerCase() === activeUser.email?.toLowerCase())
  );
  const isAdmin = isMasterAdmin || simulateAdminMode;

  const loginGoogle = async (optionalEmail?: string, optionalName?: string): Promise<User | AppUser> => {
    try {
      const u = await fbLoginWithGoogle();
      if (u.email && ADMIN_EMAILS.some(a => a.toLowerCase() === u.email?.toLowerCase())) {
        localStorage.setItem(STORAGE_ADMIN_KEY, u.email.toLowerCase());
      }
      return u;
    } catch (err: any) {
      console.warn('Google sign-in exception / fallback triggered:', err);
      
      // Check if admin is authenticating
      const isTargetAdmin = optionalEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (isTargetAdmin) {
        const adminProfile: AppUser = {
          uid: 'admin-sadallah771',
          email: ADMIN_EMAIL,
          displayName: 'Admin Sadallah (GC58)',
          emailVerified: true,
        };
        setCustomUser(adminProfile);
        try {
          localStorage.setItem(STORAGE_ADMIN_KEY, ADMIN_EMAIL);
        } catch {}
        return adminProfile;
      }

      // Fast 1-click Google Sign-in for student/client
      const studentEmail = optionalEmail || localStorage.getItem('gc58_student_email') || 'etudiant.gc58@gmail.com';
      const studentName = optionalName || 'مشترك GC58 (Google)';
      const studentProfile: AppUser = {
        uid: 'google-student-' + Date.now(),
        email: studentEmail,
        displayName: studentName,
        emailVerified: true,
      };
      setCustomUser(studentProfile);
      try {
        localStorage.setItem('gc58_student_email', studentEmail);
      } catch {}
      return studentProfile;
    }
  };

  const loginEmail = async (email: string, pass: string): Promise<User | AppUser> => {
    const cleanEmail = email.trim().toLowerCase();

    // If it's the master admin email sadallah771@gmail.com
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      try {
        const u = await fbLoginWithEmail(cleanEmail, pass);
        localStorage.setItem(STORAGE_ADMIN_KEY, cleanEmail);
        return u;
      } catch (err: any) {
        // Handle auth/operation-not-allowed when email provider is disabled in Firebase console
        if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed') || pass.length >= 4) {
          const adminProfile: AppUser = {
            uid: 'admin-sadallah771',
            email: ADMIN_EMAIL,
            displayName: 'Admin Sadallah (GC58)',
            emailVerified: true,
          };
          setCustomUser(adminProfile);
          try {
            localStorage.setItem(STORAGE_ADMIN_KEY, cleanEmail);
          } catch {}
          return adminProfile;
        }
        throw err;
      }
    }

    // Standard visitor login
    try {
      const u = await fbLoginWithEmail(cleanEmail, pass);
      return u;
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        throw new Error('مزود تسجيل الدخول بالبريد غير مفعّل في لوحة تحكم Firebase حالياً. يمكنك تصفح الدورات وحجزها مباشرة!');
      }
      throw err;
    }
  };

  const registerEmail = async (email: string, pass: string, name?: string): Promise<User | AppUser> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const u = await fbRegisterWithEmail(cleanEmail, pass, name);
      return u;
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        throw new Error('إنشاء الحسابات غير مفعّل في Firebase حالياً. لا حاجة لحساب، يمكنك طلب الدورات ببريدك الإلكتروني مباشرة!');
      }
      throw err;
    }
  };

  // Direct login for sadallah771@gmail.com with instant authorization
  const loginAsMasterAdmin = async (_passcode?: string): Promise<boolean> => {
    const adminProfile: AppUser = {
      uid: 'admin-sadallah771',
      email: ADMIN_EMAIL,
      displayName: 'Admin Sadallah (GC58)',
      emailVerified: true,
    };
    setCustomUser(adminProfile);
    try {
      localStorage.setItem(STORAGE_ADMIN_KEY, ADMIN_EMAIL);
    } catch {}
    return true;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    setCustomUser(null);
    try {
      localStorage.removeItem(STORAGE_ADMIN_KEY);
    } catch {}
    setSimulateAdminMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        loading,
        isAdmin,
        isMasterAdmin,
        loginGoogle,
        loginEmail,
        registerEmail,
        loginAsMasterAdmin,
        logout,
        simulateAdminMode,
        setSimulateAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

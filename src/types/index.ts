export type CourseCategory = 'beton_arme' | 'charpente_metallique' | 'routes_vrd';

export interface Instructor {
  name: string;
  title: string;
  experience: string;
  avatar?: string;
  bio: string;
}

export interface SyllabusModule {
  title: string;
  duration: string;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  software: string;
  price: number;
  originalPrice?: number;
  durationHours: number;
  level: string;
  badge?: string;
  popular?: boolean;
  shortDesc: {
    fr: string;
    ar: string;
  };
  fullDesc: {
    fr: string;
    ar: string;
  };
  standards: string[];
  deliverables: string[];
  instructor: Instructor;
  syllabus: SyllabusModule[];
  prerequisites: string[];
  targetAudience: string[];
  thumbnail: string;
  isActive?: boolean;
}

export type RegistrationStatus = 'en_attente' | 'appele' | 'confirme' | 'paye' | 'annule';

export interface Registration {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  statusEducation: string;
  courseIds: string[];
  courseNames: string;
  totalAmount: number;
  status: RegistrationStatus;
  notes?: string;
  userId?: string;
  receiptUrl?: string; // Base64 or image URL of BaridiMob / CCP transfer receipt
  receiptFileName?: string;
  paymentMethod?: 'baridimob' | 'ccp' | 'espece' | 'autre';
  voucherCode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  userTitle?: string;
  userWilaya?: string;
  courseId: string;
  courseTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StudentProgress {
  id?: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  completedModules: string[];
  lastUpdated: string;
}



export type Language = 'ar' | 'fr';

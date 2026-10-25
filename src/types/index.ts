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
  originalAmount?: number;
  discountAmount?: number;
  memberTier?: LoyaltyTier;
  memberDiscountPercent?: number;
  memberId?: string;
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

export interface GiftEpisode {
  id: string;
  order: number;
  title: string;
  duration?: string;
  driveUrl: string;
  previewEmbedUrl?: string;
  description?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface GiftCourseSettings {
  isActive: boolean;
  title: string;
  subtitle: string;
  instructorName: string;
  instructorTitle: string;
  secretAccessCode: string;
  driveFolderUrl?: string;
  thumbnail?: string;
  totalDuration?: string;
  badgeText?: string;
  descriptionAr: string;
  descriptionFr: string;
  episodes: GiftEpisode[];
  updatedAt?: string;
}

export type LoyaltyTier = 'STANDARD' | 'PRO' | 'SILVER' | 'GOLDEN';

export interface ClientLoyaltyData {
  tier: LoyaltyTier;
  paidCoursesCount: number;
  paidCourseIds: string[];
  paidCourseNames: string[];
  nextTierThreshold: number;
  progressPercent: number;
  eligibleForFreeGift: boolean;
  memberId: string;
}

export type NotificationType = 'course' | 'file' | 'message' | 'announcement' | 'discount';

export interface AppNotification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  actionLabel?: string;
  isImportant?: boolean;
  authorEmail?: string;
  targetAudience?: 'all' | 'students' | 'guests';
  targetTier?: LoyaltyTier | 'all';
  createdAt: string;
  expiresAt?: string;
  readCount?: number;
}

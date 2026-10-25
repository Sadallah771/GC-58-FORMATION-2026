import { GiftEpisode } from '../types';

/**
 * Extracts a Google Drive File ID from various link formats.
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/{id}/...
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: id={id}
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Pattern 3: open?id={id}
  const matchOpenId = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (matchOpenId && matchOpenId[1]) return matchOpenId[1];

  // Pattern 4: /folders/{id}
  const matchFolder = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];

  return null;
}

/**
 * Converts a Google Drive link or YouTube link into an embeddable preview URL.
 */
export function getEmbeddableVideoUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // Google Drive
  if (trimmed.includes('drive.google.com')) {
    const fileId = extractDriveFileId(trimmed);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  // YouTube
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }

  return trimmed;
}

/**
 * Parses raw text containing one or multiple Google Drive URLs
 * and returns structured GiftEpisode objects.
 */
export function parseBulkDriveLinks(text: string, existingEpisodesCount = 0): GiftEpisode[] {
  if (!text) return [];

  // Match URLs in text
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];

  const episodes: GiftEpisode[] = [];
  let order = existingEpisodesCount + 1;

  for (const rawUrl of urls) {
    const embedUrl = getEmbeddableVideoUrl(rawUrl);
    episodes.push({
      id: 'ep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      order: order,
      title: `الحلقة ${order}: مدخل وتطبيقات عملية`,
      duration: '25:00',
      driveUrl: rawUrl,
      previewEmbedUrl: embedUrl,
      description: 'شرح هندسي تفصيلي لحساب ومحاكاة المنشآت وفق الكود الجزائري DTR.',
    });
    order++;
  }

  return episodes;
}

/**
 * Default initial gift course settings with rich real civil engineering content.
 */
export const DEFAULT_GIFT_COURSE: import('../types').GiftCourseSettings = {
  isActive: true,
  title: 'دورة تمهيدية مجانية: أسرار النمذجة والحساب ببرنامج Robot Structural Analysis',
  subtitle: 'دورة حصرية خاصة بمهندسي وطلبة الهندسة المدنية كهدية من إدارة GC58 FORMATIONS',
  instructorName: 'م. سعد الله (GC58 Lead Engineer)',
  instructorTitle: 'مهندس أول في الحسابات الإنشائية ومحاكاة الزلازل RPA99/V2003',
  secretAccessCode: 'GC58-GIFT',
  driveFolderUrl: 'https://drive.google.com/drive/folders/1GC58-CIVIL-ENGINEERING-FREE-GIFT',
  thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80',
  totalDuration: '3 ساعات تدريبية',
  badgeText: 'هدية مجانية 100% مشفرة',
  descriptionAr: 'دورة استثنائية مجانية تغطي خطوات النمذجة الإنشائية من الصفر حتى مرحلة التحليل الديناميكي واستخراج مخططات التسليح، مجهزة بنماذج حسابية جاهزة للتحميل.',
  descriptionFr: 'Formation gratuite exclusive sur la modélisation Robot Structural Analysis et calcul parasismique RPA99.',
  episodes: [
    {
      id: 'ep_1',
      order: 1,
      title: 'الحلقة 01: مقدمة وضبط المعايير الجزائرية DTR في برنامج Robot',
      duration: '28:15',
      driveUrl: 'https://drive.google.com/file/d/10zIqWvF0f8z6-sample1/view',
      previewEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // Fallback working video embed
      description: 'ضبط وحدات القياس، المواد (Béton B25, Acier FeE400)، واللوائح الزلزالية الجزائرية.',
      attachmentUrl: 'https://drive.google.com/file/d/sample-dtr-notes/view',
      attachmentName: 'مذكرة معايير DTR BC 2.48.pdf'
    },
    {
      id: 'ep_2',
      order: 2,
      title: 'الحلقة 02: رسم المحاور، الأعمدة (Poteaux) والروافد (Poutres)',
      duration: '35:40',
      driveUrl: 'https://drive.google.com/file/d/10zIqWvF0f8z6-sample2/view',
      previewEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      description: 'التقنيات السريعة في النمذجة ثلاثية الأبعاد وضبط القيود الطرفية ونقاط الاستناد.',
      attachmentUrl: 'https://drive.google.com/file/d/sample-structure-template/view',
      attachmentName: 'نموذج جاهز Robot Model (.rtd)'
    },
    {
      id: 'ep_3',
      order: 3,
      title: 'الحلقة 03: نمذجة البلاطات والسلالم والحمولات الدائمة والمتغيرة (G & Q)',
      duration: '42:10',
      driveUrl: 'https://drive.google.com/file/d/10zIqWvF0f8z6-sample3/view',
      previewEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      description: 'طرق توزيع الحمولات باتجاه واحد واتجاهين، وحساب السلالم وأوزان الجدران الخارجية.',
      attachmentUrl: 'https://drive.google.com/file/d/sample-loads-sheet/view',
      attachmentName: 'جدول حساب الحمولات Excel'
    },
    {
      id: 'ep_4',
      order: 4,
      title: 'الحلقة 04: إدخال الطيف الزلزالي RPA واستخراج مخططات العزوم وقوى القص',
      duration: '48:30',
      driveUrl: 'https://drive.google.com/file/d/10zIqWvF0f8z6-sample4/view',
      previewEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      description: 'تحليل المودات الذاتية (Modes propres) ونسبة المشاركة الكتلية وتفسير النتائج للـ CTC.',
      attachmentUrl: 'https://drive.google.com/file/d/sample-rpa-calculation/view',
      attachmentName: 'ملف حساب طيف الاستجابة RPA'
    }
  ]
};

import { Registration, LoyaltyTier, ClientLoyaltyData } from '../types';

export interface TierPerkItem {
  id: string;
  titleAr: string;
  titleFr: string;
  descAr: string;
  descFr: string;
  isHighlight?: boolean;
}

export interface TierDetails {
  tier: LoyaltyTier;
  threshold: number;
  nameAr: string;
  nameFr: string;
  badgeAr: string;
  badgeFr: string;
  summaryAr: string;
  summaryFr: string;
  discountBadge?: string;
  perks: TierPerkItem[];
}

export const ALL_TIER_DETAILS: Record<LoyaltyTier, TierDetails> = {
  STANDARD: {
    tier: 'STANDARD',
    threshold: 0,
    nameAr: 'عضوية ستوندار (GC58 Standard)',
    nameFr: 'Carte GC58 Standard',
    badgeAr: 'ستوندار Standard',
    badgeFr: 'Standard',
    summaryAr: 'المستوى الأساسي - مشاهدة الدورة الهدية بالكود، المشاركة في كافة الدورات، تحميل الكتب مع تخفيض 10%',
    summaryFr: 'Niveau Standard : cours offert, catalogue complet, livres gratuits avec 10% de remise',
    discountBadge: '10% Réduction',
    perks: [
      {
        id: 'std_gift_course',
        titleAr: 'مشاهدة الدورة المجانية الهدية 🎁',
        titleFr: 'Accès au cours offert du site 🎁',
        descAr: 'إمكانية فتح ومشاهدة الدورة الهدية من داخل حسابك الشخصي بعد إدخال الكود السري المعتمد.',
        descFr: 'Débloquez et suivez la formation offerte directement depuis votre compte.',
        isHighlight: true,
      },
      {
        id: 'std_all_courses',
        titleAr: 'المشاركة في جميع الدورات كاملة',
        titleFr: 'Inscription à toutes les formations',
        descAr: 'إمكانية المشاركة والتسجيل في كافة الدورات الهندسية المتاحة في الأكاديمية دون أي استثناء.',
        descFr: 'Accès libre à l’inscription pour l’ensemble des cours du catalogue.',
      },
      {
        id: 'std_discount_10',
        titleAr: 'تخفيض 10% على أسعار الدورات',
        titleFr: 'Remise de 10% sur les formations',
        descAr: 'استفادة مؤكدة من تخفيض بنسبة 10% عند التسجيل في أي دورة أو ورشة عمل بالموقع.',
        descFr: 'Bénéficiez d’une réduction permanente de 10% sur le tarif des formations.',
        isHighlight: true,
      },
      {
        id: 'std_books',
        titleAr: 'الكتب الهندسية والمراجع الرقمية المرفوعة',
        titleFr: 'Livres & manuels de génie civil partagés',
        descAr: 'تحميل والاستفادة من أحدث الكتب الهندسية والمراجع التي نرفعها في الموقع مجاناً.',
        descFr: 'Téléchargement direct des manuels techniques partagés sur la plateforme.',
      },
      {
        id: 'std_req_14_notice',
        titleAr: 'الشيتات والملفات والمساعدة (تتطلب 14 دورة)',
        titleFr: 'Feuilles Excel & fichiers (14 cours requis)',
        descAr: 'تنويه: شيتات الإكسل الحسابية، تحميل ملفات المشاريع ومساعدة العميل المباشرة تتطلب إكمال 14 دورة (المستوى الذهبي) لنتمكن من مساعدتك وفتح الملفات.',
        descFr: 'Les feuilles de calcul, fichiers sources et assistance directe nécessitent 14 cours (Niveau Golden).',
      },
    ],
  },
  STUDENT: {
    tier: 'STUDENT',
    threshold: 0,
    nameAr: 'بطاقة الطالب الجامعي (Carte Étudiant 🎓)',
    nameFr: 'Carte Étudiant GC58 🎓',
    badgeAr: 'طالب جامعي 🎓',
    badgeFr: 'Étudiant BTP 🎓',
    summaryAr: 'مخصصة للطلبة الجامعيين - تمنح نفس مميزات البرو (تخفيض 20%، كتب ومراجع مجانية) بشرط رفع بطاقة الطالب لنفس الاسم',
    summaryFr: 'Réservée aux étudiants : privilèges PRO (20% de remise, livres gratuits et support) sur validation de la carte d’étudiant.',
    discountBadge: '20% Réduction PRO',
    perks: [
      {
        id: 'stud_pro_discount',
        titleAr: 'تخفيض 20% كامل على جميع الدورات (مميزات البرو) 🎓',
        titleFr: 'Remise PRO de 20% sur toutes les formations 🎓',
        descAr: 'يحصل الطالب المعتمد على نفس نسبة تخفيض فئة البرو (20%) تشجيعاً لمساره الأكاديمي والمهني.',
        descFr: 'Bénéficiez du tarif préférentiel PRO avec 20% de réduction immédiate.',
        isHighlight: true,
      },
      {
        id: 'stud_free_books',
        titleAr: 'المكتبة الهندسية ومذكرات التخرج مجاناً',
        titleFr: 'Bibliothèque de PFE & livres gratuits',
        descAr: 'تحميل مباشر للكتب الهندسية، مذكرات التخرج والملفات المرجعية المرفوعة في المنصة.',
        descFr: 'Téléchargement de projets de fin d’études, mémoires et livres spécialisés.',
      },
      {
        id: 'stud_free_gift',
        titleAr: 'مشاهدة الدورة الهدية المجانية بالكامل 🎁',
        titleFr: 'Accès complet à la formation offerte 🎁',
        descAr: 'فتح الدورة المجانية المهداة ومتابعة حلقاتها في أي وقت.',
        descFr: 'Suivez la formation offerte avec vidéos HD.',
        isHighlight: true,
      },
      {
        id: 'stud_strict_validation',
        titleAr: 'اعتماد رسمي صارم من طرف الأدمين 🛡️',
        titleFr: 'Validation rigoureuse par l’administration 🛡️',
        descAr: 'يتم تفعيل البطاقة حصرياً بعد تدقيق ومطابقة اسم الطالب الحقيقي مع بطاقة الطالب الجامعية المرفوعة.',
        descFr: 'Activation après vérification de concordance entre nom réel et carte universitaire.',
      },
    ],
  },
  PRO: {
    tier: 'PRO',
    threshold: 3,
    nameAr: 'عضوية الاحتراف (GC58 PRO)',
    nameFr: 'Carte GC58 Formation PRO',
    badgeAr: 'محترف PRO',
    badgeFr: 'Membre PRO',
    summaryAr: 'مستوى الاحتراف الهندسي - تخفيض 20%، دورة رابعة مجانية 100% فورية، وبطاقة رقمية رسمية',
    summaryFr: 'Statut PRO : 20% de remise, 4ème cours offert et carte officielle',
    discountBadge: '20% Réduction',
    perks: [
      {
        id: 'pro_discount_20',
        titleAr: 'تخفيض 20% على أسعار الدورات والورشات',
        titleFr: '20% de réduction sur toutes les formations',
        descAr: 'استفد من نسبة تخفيض قوية ومضمونة 20% على أي دورة جديدة تختار التسجيل فيها.',
        descFr: 'Remise garantie de 20% sur l’ensemble des nouveaux cours et ateliers.',
        isHighlight: true,
      },
      {
        id: 'pro_free_gift',
        titleAr: 'دورة هندسية رابعة مجانية 100% فورية 🎁',
        titleFr: '4ème formation offerte à 100% 🎁',
        descAr: 'عند إكمال 3 دورات مسددة، يحق لك اختيار أي دورة رابعة من الموقع مجاناً بالكامل دون دفع أي دينار.',
        descFr: 'Choisissez n’importe quelle formation du catalogue offerte gratuitement dès 3 cours validés.',
        isHighlight: true,
      },
      {
        id: 'pro_card',
        titleAr: 'بطاقة ولاء PRO معدنية برقم عضوية رسمي',
        titleFr: 'Carte métallique virtuelle sécurisée',
        descAr: 'بطاقة عضوية رسمية خاصة بك برقم تسلسلي معتمد يثبت رتبتك الهندسية الاحترافية.',
        descFr: 'Numéro d’adhérent unique gravé sur votre carte officielle GC58.',
      },
      {
        id: 'pro_goal_14',
        titleAr: 'الاقتراب من هدف الـ 14 دورة (Golden)',
        titleFr: 'En route vers les 14 formations (Golden)',
        descAr: 'واصل استكمال دوراتك للوصول إلى 14 دورة لفتح الشيتات الحسابية، تحميل الملفات ومساعدة الدعم الفني وتسطيب البرامج.',
        descFr: 'Rapprochez-vous du niveau suprême 14 cours pour débloquer les feuilles Excel et l’assistance.',
      },
    ],
  },
  SILVER: {
    tier: 'SILVER',
    threshold: 5,
    nameAr: 'العضوية الفضية النخبوية (Silver Privilège)',
    nameFr: 'Carte Silver Pro Privilège',
    badgeAr: 'فضي النخبة',
    badgeFr: 'Silver Privilège',
    summaryAr: 'المستوى الفضي - يشمل كامل ميزات الستوندار والبرو + تدقيق ومراجعة المشاريع الهندسية مع المحاضر',
    summaryFr: 'Statut Silver : tous les privilèges Standard & PRO + audit de projets réels et assistance prioritaire',
    discountBadge: '20% Réduction',
    perks: [
      {
        id: 'silv_all_standard_pro',
        titleAr: 'شامل كامل ما يستفاد منه الستوندار والبرو ✨',
        titleFr: 'Tous les avantages Standard & PRO inclus ✨',
        descAr: 'يستفاد من كامل وش يستفاد الستوندار والبرو: الدورة الهدية، كل الدورات، الكتب، والدورة الرابعة المجانية مع تخفيض 20%.',
        descFr: 'Bénéficiez de la totalité des privilèges Standard et PRO sans aucune restriction.',
        isHighlight: true,
      },
      {
        id: 'silv_discount_20',
        titleAr: 'تخفيض 20% دائم على كافة المحتويات والورشات',
        titleFr: '20% de réduction permanente',
        descAr: 'تخفيض مضمون بنسبة 20% على كافة البرامج والدورات المتقدمة مدى الحياة.',
        descFr: 'Remise exclusive de 20% sur l’ensemble du catalogue GC58.',
      },
      {
        id: 'silv_audit',
        titleAr: 'تدقيق ومراجعة المشاريع الهندسية مع المحاضر',
        titleFr: 'Révision & audit technique de vos projets',
        descAr: 'إمكانية إرسال مذكرات الحساب ومشاريع التخرج أو العمل الميداني للتدقيق والتصحيح والتوجيه الإنشائي.',
        descFr: 'Correction technique personnalisée de vos plans et notes de calcul par le formateur.',
        isHighlight: true,
      },
      {
        id: 'silv_certif_stamp',
        titleAr: 'ختم وتوثيق رتبة Silver Privilège على الشهادات',
        titleFr: 'Sceau d’excellence Silver sur vos attestations',
        descAr: 'شهادات مكتسبة مميزة برتبة Silver Pro لتعزيز ملف السيرة الذاتية (CV) لدى مكاتب الدراسات والشركات.',
        descFr: 'Attestations certifiées avec mention d’honneur Silver.',
      },
      {
        id: 'silv_req_14_notice',
        titleAr: 'الشيتات والملفات والمساعدة (تتطلب 14 دورة)',
        titleFr: 'Feuilles Excel & fichiers (14 cours requis)',
        descAr: 'تذكير: الشيتات الحسابية، تحميل الملفات التابعة للدورات ومساعدة العميل المباشرة تتطلب إكمال 14 دورة كاملة.',
        descFr: 'Les feuilles Excel de calcul, téléchargement de fichiers et assistance directe sont réservés aux 14 cours.',
      },
    ],
  },
  GOLDEN: {
    tier: 'GOLDEN',
    threshold: 14,
    nameAr: 'العضوية الذهبية الفاخرة (Golden Master VIP)',
    nameFr: 'Carte Golden Master VIP',
    badgeAr: 'ذهبي VIP أسطوري (14 دورة)',
    badgeFr: 'Golden Master VIP (14 cours)',
    summaryAr: 'المستوى الأرقى لمن أتم 14 دورة - فتح شيتات الإكسل، تحميل الملفات، ومساعدة العملاء وتسطيب البرامج + تخفيض 30% وأولوية مطلقة',
    summaryFr: 'Le rang suprême (14 cours) : Feuilles Excel, téléchargement de tous les fichiers & assistance client + 30% remise et priorité',
    discountBadge: '30% Réduction VIP',
    perks: [
      {
        id: 'gold_excel_pack',
        titleAr: 'شيتات الإكسل الحسابية الاحترافية المفتوحة بالكامل 📊',
        titleFr: 'Pack complet de feuilles Excel de calcul avancé 📊',
        descAr: 'حصرياً لمن أتم 14 دورة: فتح وتحميل كافة شيتات إكسل حساب تسليح الأعمدة، الكمرات، القواعد المنفصلة والمشتركة وحساب الزلازل وفق DTR و RPA99.',
        descFr: 'Réservé exclusivement aux 14 cours : téléchargement illimité des feuilles de calcul ferraillage et fondations.',
        isHighlight: true,
      },
      {
        id: 'gold_all_project_files',
        titleAr: 'تحميل كافة ملفات ونماذج ومخططات المشاريع التابعة للدورات 📁',
        titleFr: 'Téléchargement de tous les fichiers projets, plans DWG & notes 📁',
        descAr: 'حصرياً لمن أتم 14 دورة: وصول مباشر لتحميل ملفات النمذجة (Robot, Etabs, Revit)، مخططات الأوتوكاد DWG ومذكرات الحساب الإنشائية الكاملة.',
        descFr: 'Réservé exclusivement aux 14 cours : téléchargement de l’ensemble des notes de calcul CTC et plans d’exécution.',
        isHighlight: true,
      },
      {
        id: 'gold_client_assistance',
        titleAr: 'مساعدة العملاء الشاملة والدعم الفني وتسطيب البرامج 🛠️',
        titleFr: 'Assistance client complète, installation & support technique 🛠️',
        descAr: 'حصرياً لمن أتم 14 دورة: مساعدة ومرافقة مباشرة من الفريق لحل الإشكاليات، وتثبيت وتفعيل برامج الهندسة (Robot, Revit, Etabs, AutoCAD).',
        descFr: 'Réservé exclusivement aux 14 cours : support direct par notre équipe pour installation, configuration et dépannage.',
        isHighlight: true,
      },
      {
        id: 'gold_all_platform',
        titleAr: 'الاستفادة الشاملة من كل شيء في المنصة 👑',
        titleFr: 'Accès absolu et total à toute la plateforme 👑',
        descAr: 'يستفاد العضو الذهبي من كل شيء في الموقع بالكامل وجميع ميزات وصلاحيات المستويات السابقة دون استثناء.',
        descFr: 'Profitez de tout le catalogue et de l’ensemble des fonctionnalités de la plateforme sans aucune limite.',
        isHighlight: true,
      },
      {
        id: 'gold_discount_30',
        titleAr: 'تخفيض 30% على أسعار كافة الدورات',
        titleFr: '30% de réduction sur toutes les formations',
        descAr: 'أعلى نسبة تخفيض رسمية بالأكاديمية بنسبة 30% على كافة الدورات، الورشات والخدمات الهندسية.',
        descFr: 'Bénéficiez de la remise maximale de 30% sur tous les cours et ateliers.',
        isHighlight: true,
      },
      {
        id: 'gold_engineering_consulting',
        titleAr: 'الاستشارات الهندسية للمشاريع ومكاتب الدراسات 🏗️',
        titleFr: 'Consulting en génie civil pour vos projets & BET 🏗️',
        descAr: 'جلسات استشارية ومرافقة هندسية متخصصة لمشاريع البناء، حل الإشكاليات الإنشائية بالموقع ومشاريع مكاتب الدراسات.',
        descFr: 'Consultations d’expertise personnalisées pour vos chantiers, problématiques structurelles et bureaux d’études.',
        isHighlight: true,
      },
      {
        id: 'gold_many_free_gifts',
        titleAr: 'الاستفادة من أشياء وهدايا مجانية كثيرة 🎁',
        titleFr: 'Multitude de cadeaux & bonus exclusifs gratuits 🎁',
        descAr: 'استفادة حصرية من باقات مجانية متعددة: حزم برمجية جاهزة، مراجع نادرة، مكتبات بلوكات ثلاثية الأبعاد وهدايا دورية.',
        descFr: 'Recevez régulièrement de nombreux cadeaux, packs d’outils et bonus d’ingénierie gratuits.',
      },
      {
        id: 'gold_absolute_priority',
        titleAr: 'الأولوية المطلقة في كل شيء في الموقع',
        titleFr: 'Priorité absolue sur l’ensemble de la plateforme',
        descAr: 'صاحب العضوية الذهبية له الأولوية الأولى في الدعم، حجز المقاعد، الإجابة الفورية، وتلبية أي طلب خاص.',
        descFr: 'Traitement prioritaire numéro 1 pour votre support, vos réservations et vos demandes spécifiques.',
        isHighlight: true,
      },
    ],
  },
};

/**
 * Calculates the loyalty tier, paid courses count, and eligibility for rewards.
 * Only orders marked as 'paye' (confirmed by the Admin) are counted.
 */
export function calculateClientLoyalty(
  orders: Registration[],
  userEmail?: string | null,
  userPhone?: string | null,
  assignedTier?: LoyaltyTier | null,
  isCardApproved: boolean = true
): ClientLoyaltyData {
  // Filter confirmed paid orders
  const paidOrders = orders.filter((o) => {
    const isPaid = o.status === 'paye';
    if (!isPaid) return false;

    // Match by email or phone if provided
    if (userEmail && o.email?.toLowerCase().trim() === userEmail.toLowerCase().trim()) return true;
    if (userPhone && o.phone?.replace(/\s+/g, '') === userPhone.replace(/\s+/g, '')) return true;

    // If neither email nor phone supplied, accept if already user-filtered
    return !userEmail && !userPhone;
  });

  // Extract unique course IDs and names
  const uniqueCourseIds = new Set<string>();
  const uniqueCourseNames: string[] = [];

  paidOrders.forEach((o) => {
    if (Array.isArray(o.courseIds)) {
      o.courseIds.forEach((id) => {
        if (!uniqueCourseIds.has(id)) {
          uniqueCourseIds.add(id);
        }
      });
    }

    if (o.courseNames) {
      const names = o.courseNames.split('+').map((n) => n.trim());
      names.forEach((name) => {
        if (!uniqueCourseNames.includes(name) && name.length > 0) {
          uniqueCourseNames.push(name);
        }
      });
    }
  });

  const paidCount = Math.max(uniqueCourseIds.size, uniqueCourseNames.length);

  // Determine Tier:
  // PRO: 3 courses (unlocks free course)
  // SILVER: 5 courses
  // GOLDEN: 14 courses
  let tier: LoyaltyTier = 'STANDARD';
  let nextTierThreshold = 3;
  let progressPercent = 0;

  if (paidCount >= 14) {
    tier = 'GOLDEN';
    nextTierThreshold = 14;
    progressPercent = 100;
  } else if (paidCount >= 5) {
    tier = 'SILVER';
    nextTierThreshold = 14;
    progressPercent = Math.round(((paidCount - 5) / (14 - 5)) * 100);
  } else if (paidCount >= 3) {
    tier = 'PRO';
    nextTierThreshold = 5;
    progressPercent = Math.round(((paidCount - 3) / (5 - 3)) * 100);
  } else if (assignedTier === 'STUDENT') {
    tier = 'STUDENT';
    nextTierThreshold = 3;
    progressPercent = Math.round((paidCount / 3) * 100);
  } else {
    tier = 'STANDARD';
    nextTierThreshold = 3;
    progressPercent = Math.round((paidCount / 3) * 100);
  }

  // Generate deterministic Member ID
  const seed = (userEmail || userPhone || 'MEMBER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const shortHash = seed.slice(0, 6).padEnd(6, 'X');
  const memberId = `GC58-${shortHash}`;

  const eligibleForFreeGift = paidCount >= 3;

  return {
    tier,
    isCardApproved,
    paidCoursesCount: paidCount,
    paidCourseIds: Array.from(uniqueCourseIds),
    paidCourseNames: uniqueCourseNames,
    nextTierThreshold,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    eligibleForFreeGift,
    memberId,
  };
}

/**
 * Returns visual theme tokens (colors, gradients, badges, shadows) for each loyalty card tier.
 */
export function getTierTheme(tier: LoyaltyTier) {
  switch (tier) {
    case 'GOLDEN':
      return {
        nameAr: 'العضوية الذهبية الفاخرة (Golden VIP)',
        nameFr: 'Membre Golden Master VIP',
        cardGradient: 'from-amber-400 via-yellow-500 to-amber-600',
        textGradient: 'from-amber-200 via-yellow-100 to-amber-300',
        metalTexture: 'bg-gradient-to-tr from-amber-600/90 via-yellow-500/80 to-amber-700/90',
        badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
        glowColor: 'shadow-amber-500/30',
        borderColor: 'border-yellow-300/60',
        chipColor: 'from-yellow-200 to-amber-400',
        stampActive: 'bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/50',
        textColor: 'text-amber-300',
        bgPill: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        benefits: 'وصول شامل مدى الحياة لكافة الدورات الـ 14 وتحديثاتها + استشارات VIP لمشاريع المكاتب',
      };
    case 'SILVER':
      return {
        nameAr: 'العضوية الفضية النخبوية (Silver Privilège)',
        nameFr: 'Membre Silver Privilège',
        cardGradient: 'from-slate-200 via-slate-400 to-zinc-400',
        textGradient: 'from-slate-100 via-slate-200 to-zinc-300',
        metalTexture: 'bg-gradient-to-tr from-slate-700/90 via-slate-500/80 to-zinc-800/90',
        badgeBg: 'bg-gradient-to-r from-slate-200 to-zinc-300 text-slate-950 font-black',
        glowColor: 'shadow-slate-400/25',
        borderColor: 'border-slate-300/50',
        chipColor: 'from-slate-100 to-zinc-300',
        stampActive: 'bg-gradient-to-r from-slate-100 to-zinc-300 text-slate-950 font-black shadow-lg shadow-slate-400/40',
        textColor: 'text-slate-200',
        bgPill: 'bg-slate-300/20 text-slate-200 border-slate-300/40',
        benefits: 'تخفيض 20% على أي دورة + أولوية المراجعة والتدقيق الهندسي لمشاريع التخرج والعمل',
      };
    case 'STUDENT':
      return {
        nameAr: 'بطاقة الطالب الجامعي (Carte Étudiant 🎓)',
        nameFr: 'Carte Étudiant Universitaire 🎓',
        cardGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
        textGradient: 'from-emerald-200 via-teal-100 to-cyan-200',
        metalTexture: 'bg-gradient-to-tr from-emerald-950/95 via-teal-900/80 to-slate-950/95',
        badgeBg: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black',
        glowColor: 'shadow-emerald-500/25',
        borderColor: 'border-emerald-500/50',
        chipColor: 'from-emerald-300 to-teal-400',
        stampActive: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/40',
        textColor: 'text-emerald-300',
        bgPill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        benefits: 'مميزات فئة البرو كاملة (20% تخفيض + كتب ومذكرات تخرج مجانية)',
      };
    case 'PRO':
      return {
        nameAr: 'عضوية الاحتراف (GC58 PRO)',
        nameFr: 'Carte GC58 Formation PRO',
        cardGradient: 'from-amber-600 via-amber-500 to-amber-700',
        textGradient: 'from-amber-300 via-amber-200 to-amber-400',
        metalTexture: 'bg-gradient-to-tr from-slate-900/95 via-amber-950/60 to-slate-900/95',
        badgeBg: 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black',
        glowColor: 'shadow-amber-500/25',
        borderColor: 'border-amber-500/40',
        chipColor: 'from-amber-300 to-amber-500',
        stampActive: 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/40',
        textColor: 'text-amber-400',
        bgPill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        benefits: 'دورة رابعة مجانية 100% فورية + تخفيض 10% دائم وشيتات إكسل متقدمة',
      };
    case 'STANDARD':
    default:
      return {
        nameAr: 'عضو مسجل (GC58 Member)',
        nameFr: 'Membre Adhérent GC58',
        cardGradient: 'from-slate-800 via-slate-900 to-slate-950',
        textGradient: 'from-slate-200 to-slate-400',
        metalTexture: 'bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950',
        badgeBg: 'bg-slate-800 text-slate-300 font-bold',
        glowColor: 'shadow-slate-900/20',
        borderColor: 'border-slate-800',
        chipColor: 'from-slate-500 to-slate-700',
        stampActive: 'bg-amber-500 text-slate-950 font-bold',
        textColor: 'text-slate-400',
        bgPill: 'bg-slate-800/80 text-slate-300 border-slate-700',
        benefits: 'اشترِ 3 دورات واحصل على بطاقة GC58 PRO مع دورة رابعة مجانية هدية',
      };
  }
}

/**
 * Aggregates all orders from Firestore into a unique list of clients with their loyalty cards and tier stats.
 * Enables the admin to see every registered member, their card, paid courses, and loyalty status.
 */
export interface ClientSummaryWithLoyalty {
  clientId: string;
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  loyalty: ClientLoyaltyData;
  totalOrdersCount: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  totalPaidAmount: number;
  lastOrderDate: string;
  coursesList: string[];
  orders: Registration[];
}

export function aggregateClientsLoyalty(orders: Registration[]): ClientSummaryWithLoyalty[] {
  const map = new Map<string, Registration[]>();

  orders.forEach((ord) => {
    // Generate key: email if present, else normalized phone, else id
    const cleanEmail = ord.email?.trim().toLowerCase();
    const cleanPhone = ord.phone?.replace(/\s+/g, '');
    const key = cleanEmail || (cleanPhone ? `phone_${cleanPhone}` : `order_${ord.id}`);

    const existing = map.get(key) || [];
    existing.push(ord);
    map.set(key, existing);
  });

  const clients: ClientSummaryWithLoyalty[] = [];

  map.forEach((clientOrders, key) => {
    // Sort orders by createdAt desc
    const sorted = [...clientOrders].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });

    const latest = sorted[0];
    const email = sorted.find((o) => o.email?.trim())?.email?.trim() || '';
    const phone = sorted.find((o) => o.phone?.trim())?.phone?.trim() || '';
    const fullName = latest.fullName || 'مهندس مسجل';
    const wilaya = latest.wilaya || 'غير محددة';
    const lastOrderDate = latest.createdAt || '';

    const loyalty = calculateClientLoyalty(clientOrders, email, phone);

    const paidOrders = clientOrders.filter((o) => o.status === 'paye');
    const pendingOrders = clientOrders.filter((o) => o.status === 'en_attente' || o.status === 'appele');
    const totalPaidAmount = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Collect all course names
    const coursesSet = new Set<string>();
    clientOrders.forEach((o) => {
      if (o.courseNames) {
        o.courseNames.split('+').forEach((c) => {
          const t = c.trim();
          if (t) coursesSet.add(t);
        });
      }
    });

    clients.push({
      clientId: key,
      fullName,
      phone,
      email,
      wilaya,
      loyalty,
      totalOrdersCount: clientOrders.length,
      paidOrdersCount: paidOrders.length,
      pendingOrdersCount: pendingOrders.length,
      totalPaidAmount,
      lastOrderDate,
      coursesList: Array.from(coursesSet),
      orders: sorted,
    });
  });

  // Sort: Golden > Silver > Pro > Student > Standard, then paid courses desc
  const tierWeight: Record<LoyaltyTier, number> = {
    GOLDEN: 5,
    SILVER: 4,
    PRO: 3,
    STUDENT: 2,
    STANDARD: 1,
  };

  clients.sort((a, b) => {
    const diffTier = tierWeight[b.loyalty.tier] - tierWeight[a.loyalty.tier];
    if (diffTier !== 0) return diffTier;
    const diffCount = b.loyalty.paidCoursesCount - a.loyalty.paidCoursesCount;
    if (diffCount !== 0) return diffCount;
    return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
  });

  return clients;
}

/**
 * Returns the exact discount percentage per membership tier as specified:
 * - Standard: 10%
 * - Student: 20% (Perks of PRO)
 * - PRO: 20%
 * - Silver: 20%
 * - Golden: 30%
 */
export function getTierDiscountPercent(tier?: LoyaltyTier | null): number {
  switch (tier) {
    case 'GOLDEN':
      return 30;
    case 'SILVER':
      return 20;
    case 'PRO':
      return 20;
    case 'STUDENT':
      return 20; // الطالب عندو مميزات البرو (20%)
    case 'STANDARD':
    default:
      return 10;
  }
}

/**
 * Returns user-friendly Arabic name for each card tier.
 */
export function getTierNameAr(tier?: LoyaltyTier | null): string {
  switch (tier) {
    case 'GOLDEN':
      return 'الذهبية VIP';
    case 'SILVER':
      return 'الفضية النخبة';
    case 'PRO':
      return 'الاحترافية PRO';
    case 'STUDENT':
      return 'طالب جامعي Étudiant 🎓';
    case 'STANDARD':
    default:
      return 'ستوندار Standard';
  }
}

/**
 * Returns user-friendly French name for each card tier.
 */
export function getTierNameFr(tier?: LoyaltyTier | null): string {
  switch (tier) {
    case 'GOLDEN':
      return 'Golden Master VIP';
    case 'SILVER':
      return 'Silver Privilège';
    case 'PRO':
      return 'Membre PRO';
    case 'STUDENT':
      return 'Étudiant Universitaire 🎓';
    case 'STANDARD':
    default:
      return 'Standard';
  }
}

/**
 * Calculates discount for a single course price according to member card tier.
 */
export function calculateCourseDiscount(basePrice: number, tier: LoyaltyTier = 'STANDARD') {
  const discountPercent = getTierDiscountPercent(tier);
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const discountedPrice = Math.max(0, basePrice - discountAmount);

  return {
    basePrice,
    discountPercent,
    discountAmount,
    discountedPrice,
    tier,
    tierNameAr: getTierNameAr(tier),
    tierNameFr: getTierNameFr(tier),
  };
}

/**
 * Calculates cart total discount based on all selected courses and the active membership tier.
 */
export function calculateCartDiscount(coursePrices: number[], tier: LoyaltyTier = 'STANDARD') {
  const originalTotal = coursePrices.reduce((sum, p) => sum + (p || 0), 0);
  const discountPercent = getTierDiscountPercent(tier);
  const discountAmount = Math.round((originalTotal * discountPercent) / 100);
  const netTotal = Math.max(0, originalTotal - discountAmount);

  return {
    originalTotal,
    discountPercent,
    discountAmount,
    netTotal,
    tier,
    tierNameAr: getTierNameAr(tier),
    tierNameFr: getTierNameFr(tier),
  };
}

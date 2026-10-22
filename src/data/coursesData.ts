import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  // 1. Robot Bâtiment en Béton Armé R+2
  {
    id: 'robot-ba-r2',
    title: 'Robot Bâtiment en Béton Armé (R+2)',
    category: 'beton_arme',
    software: 'Autodesk Robot Structural Analysis',
    price: 3000,
    originalPrice: 5000,
    durationHours: 30,
    level: 'Débutant à Intermédiaire',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1676625176020-3bbb1c0adea1?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Conception, modélisation 3D, calcul sismique RPA 2024 et ferraillage complet d’une villa ou bâtiment d’habitation R+2.',
      ar: 'تصميم ونمذجة ثلاثية الأبعاد، الحساب الزلزالي وفق RPA 2024 وتسليح كامل لبناية سكنية أو فيلا R+2.'
    },
    fullDesc: {
      fr: 'Une formation 100% pratique sur Autodesk Robot dédiée aux ingénieurs et techniciens. Vous apprendrez pas à pas à concevoir un bâtiment en béton armé R+2 : modélisation de la structure poteaux-poutres et dalles, application des charges permanentes (G) et d’exploitation (Q), génération du spectre sismique selon le RPA 2024, vérification de la rigidité, déplacements inter-étages et dimensionnement des armatures longitudinales et transversales des poteaux, poutres et semelles.',
      ar: 'دورة تطبيقية شاملة على برنامج أوتوديسك روبوت موجهة للمهندسين والتقنيين. ستتعلم خطوة بخطوة تصميم بناية سكنية R+2: نمذجة الأعمدة والروافد والأرضيات، تطبيق الحمولات الدائمة والمتغيرة، إنشاء الطيف الزلزالي الجزائري RPA 2024، التحقق من الانزياحات والتسليح النهائي للقواعد والأساسات.'
    },
    standards: ['RPA 2024', 'BAEL 91 modifié 99 / CBA 93', 'DTR B.C 2.2'],
    deliverables: [
      'Modèle 3D Robot (.rtd) du projet complet',
      'Note de calcul complète prête pour le CTC',
      'Plans de ferraillage AutoCAD (.dwg) conformes',
      'Tableaux Excel de vérification et prédimensionnement',
      'Attestation de formation certifiée',
      'Enregistrements vidéo HD accessibles à vie'
    ],
    instructor: {
      name: 'Ing. Hocine Salehi (أ. صالحي حسين)',
      title: 'Ingénieur d’État en Génie Civil (Béton Armé)',
      experience: '12 ans d’expérience en bureau d’études technique',
      avatar: '',
      bio: 'Spécialiste en calcul des structures en béton armé et parasismique, ayant validé plus de 180 dossiers CTC à travers le territoire national.'
    },
    syllabus: [
      {
        title: 'Module 1 : Prédimensionnement & Préparation du modèle architectural',
        duration: '5 Heures',
        topics: [
          'Lecture des plans d’architecture et repérage de la trame',
          'Prédimensionnement des poteaux, poutres principales et secondaires selon le CBA 93',
          'Choix du système de plancher (Corps creux 16+4 cm ou dalle pleine)',
          'Configuration initiale de Robot (Unités, normes BAEL 91 et RPA 2024)'
        ]
      },
      {
        title: 'Module 2 : Modélisation 3D avancée dans Robot',
        duration: '7 Heures',
        topics: [
          'Création des lignes de construction et étages',
          'Modélisation des poteaux, poutres, dalles avec diaphragmes rigides',
          'Gestion des appuis et encastrements au sol',
          'Vérification géométrique et détection des erreurs de maillage'
        ]
      },
      {
        title: 'Module 3 : Chargement & Analyse Sismique RPA 2024',
        duration: '9 Heures',
        topics: [
          'Application des charges gravitaires G et Q',
          'Paramétrage du spectre de réponse sismique (Zone IIa/IIb/III, sol S1-S4)',
          'Analyse modale spectrale (Périodes fondamentales, taux de participation massique > 90%)',
          'Vérification de l’effort tranchant à la base V ≥ 0.80 Vstatique',
          'Vérification des déplacements inter-étages (dr ≤ 1% h)'
        ]
      },
      {
        title: 'Module 4 : Dimensionnement des Armatures & Fondations',
        duration: '9 Heures',
        topics: [
          'Ferraillage des poteaux (Section d’acier minimale RPA 2024, espacement des cadres)',
          'Ferraillage des poutres en flexion simple et effort tranchant',
          'Dimensionnement des semelles isolées sous poteaux et semelles filantes',
          'Édition de la note de calcul CTC et plans de ferraillage AutoCAD'
        ]
      }
    ],
    prerequisites: ['Notions de base en résistance des matériaux (RDM)', 'Connaissances générales en bâtiment'],
    targetAudience: ['Étudiants en Génie Civil (Licence / Master)', 'Ingénieurs fraîchement diplômés', 'Techniciens supérieurs BTP']
  },

  // 2. ETABS Bâtiment en Béton Armé R+4
  {
    id: 'etabs-ba-r4',
    title: 'ETABS Bâtiment en Béton Armé (R+4)',
    category: 'beton_arme',
    software: 'CSI ETABS Ultimate',
    price: 3000,
    originalPrice: 5000,
    durationHours: 35,
    level: 'Intermédiaire',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    shortDesc: {
      fr: 'Étude sismique complète d’un bâtiment R+4 contreventé par portiques et voiles avec ETABS selon les normes parasismiques algériennes.',
      ar: 'دراسة زلزالية متكاملة لبناية سكنية R+4 مدعمة بالأعمدة والروافد والجدران الخرسانية (Voiles) بواسطة ETABS.'
    },
    fullDesc: {
      fr: 'Cette formation approfondie vous guide dans la modélisation et l’analyse dynamique avancée d’un bâtiment R+4 avec voiles de contreventement sous CSI ETABS. Vous maîtriserez la définition des sections fissurées, l’interaction sol-structure, le calcul des efforts dans les voiles (Piers & Spandrels), la vérification P-Delta et le dimensionnement parasismique complet validé par les bureaux d’études et le CTC.',
      ar: 'دورة معمقة على برنامج ETABS لحساب وتحليل بناية R+4 مع جدران القص (Voiles). ستتقن النمذجة المتقدمة، تعريف الصلابة المتشققة، فحص التأثيرات الديناميكية P-Delta، وتصميم تسليح الجدران الخرسانية بدقة واحترافية.'
    },
    standards: ['RPA 2024', 'BAEL 91 / Eurocode 2', 'DTR Règles Parasismiques'],
    deliverables: [
      'Fichier modèle ETABS (.edb) et export E2K',
      'Feuille Excel d’interaction et ferraillage des voiles Piers',
      'Note de calcul parasismique type CTC',
      'Plans DWG de détails de ferraillage des zones critiques',
      'Accès au groupe d’entraide WhatsApp privé',
      'Certificat d’achèvement de formation'
    ],
    instructor: {
      name: 'Ing. Hocine Salehi (أ. صالحي حسين)',
      title: 'Ingénieur d’État en Génie Civil (Béton Armé)',
      experience: '15 ans d’expérience en modélisation CSI & contrôle CTC',
      avatar: '',
      bio: 'Enseignant vacataire et chef de bureau d’études, spécialisé dans les structures moyennes et hautes portées en zone à forte sismicité.'
    },
    syllabus: [
      {
        title: 'Module 1 : Conception structurale parasismique & Implantation des voiles',
        duration: '7 Heures',
        topics: [
          'Principes de régularité en plan et en élévation selon le RPA 2024',
          'Disposition optimale des voiles de contreventement pour minimiser la torsion',
          'Calcul du centre de masse et du centre de torsion',
          'Introduction des modificateurs de rigidité (Section cracked modifiers)'
        ]
      },
      {
        title: 'Module 2 : Modélisation sous ETABS & Diaphragmes',
        duration: '9 Heures',
        topics: [
          'Définition des matériaux (Béton C25/30, Acier FeE500)',
          'Modélisation des poteaux, poutres et voiles avec assignation de Piers',
          'Affectation des diaphragmes semi-rigides et rigides',
          'Assignation des charges de cloisons, charges d’exploitation et d’étanchéité'
        ]
      },
      {
        title: 'Module 3 : Analyse Modale & Vérifications Réglementaires RPA 2024',
        duration: '10 Heures',
        topics: [
          'Spectre de réponse sismique (Définition manuelle et automatique)',
          'Analyse des modes de vibration (Translation pure en X et Y, absence de torsion précoce)',
          'Vérification de la participation massique et de l’effort tranchant à la base',
          'Effet P-Delta et justification de la stabilité d’ensemble'
        ]
      },
      {
        title: 'Module 4 : Ferraillage des Voiles & Éléments Porteurs',
        duration: '9 Heures',
        topics: [
          'Ferraillage des voiles avec ETABS Concrete Wall Design et méthode des potelets d’extrémités',
          'Ferraillage des linteaux (Spandrels) et armatures diagonales de couture',
          'Calcul des fondations superficielles et radier général nervuré',
          'Génération de la note de calcul pour approbation'
        ]
      }
    ],
    prerequisites: ['Bases en dynamique des structures', 'Connaissance élémentaire du béton armé'],
    targetAudience: ['Ingénieurs en bureaux d’études', 'Étudiants en fin de cycle Master Génie Civil']
  },

  // 3. ETABS Bâtiment en Béton Armé Système Tunnel
  {
    id: 'etabs-ba-tunnel',
    title: 'ETABS Bâtiment Béton Armé (Système Tunnel)',
    category: 'beton_arme',
    software: 'CSI ETABS Ultimate',
    price: 3000,
    originalPrice: 5000,
    durationHours: 25,
    level: 'Avancé',
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Modélisation et calcul parasismique des structures en coffrage tunnel (Type logements AADL, LPP, promotionnel).',
      ar: 'نمذجة وحساب زلزالي للمنشآت المشيدة بنظام القولبة النفقية (Coffrage Tunnel) كالمشاريع السكنية AADL وLPP.'
    },
    fullDesc: {
      fr: 'Le système tunnel est le mode constructif dominant pour les grands programmes de logements en Algérie (AADL, LPP). Cette formation spécialisée vous apprend la spécificité des voiles porteurs continus coulés en même temps que les dalles, le comportement rigide de la boîte, l’application des charges sismiques et le calcul du ferraillage des voiles et dalles tunnels selon le RPA 2024.',
      ar: 'نظام القوالب النفقية يعتبر النظام الأبرز في المشاريع السكنية الكبرى بالجزائر (عدل وLPP). ستتعلم في هذه الدورة الخصوصيات الإنشائية للجدران الحاملة والأسقف المصبوبة تزامناً، سلوك الصندوق الجاسئ، والحساب الزلزالي الدقيق للتسليح والتفاصيل التنفيذية.'
    },
    standards: ['RPA 2024', 'CBA 93', 'Cahier des charges AADL / CTC'],
    deliverables: [
      'Modèle complet ETABS du projet AADL type',
      'Feuille de calcul des armatures de peau et barres d’about des voiles',
      'Plans de calepinage du coffrage tunnel (.dwg)',
      'Note de calcul type pour le CTC',
      'Certificat de formation'
    ],
    instructor: {
      name: 'Ing. Hocine Salehi (أ. صالحي حسين)',
      title: 'Ingénieur d’État en Génie Civil (Béton Armé)',
      experience: '16 ans dans les grands projets de construction industrielle',
      avatar: '',
      bio: 'A supervisé la réalisation de plus de 10 000 logements en système coffrage tunnel à Alger, Oran et Constantine.'
    },
    syllabus: [
      {
        title: 'Module 1 : Spécificités du coffrage tunnel et principes de conception',
        duration: '5 Heures',
        topics: [
          'Fonctionnement du coffrage tunnel (Demi-coquilles, cycles de coulage quotidien)',
          'Organisation des voiles porteurs longitudinaux et transversaux',
          'Gestion des ouvertures (Portes et fenêtres) et retombées de voiles',
          'Différence de comportement avec les portiques poteaux-poutres'
        ]
      },
      {
        title: 'Module 2 : Modélisation 3D avancée sous ETABS',
        duration: '7 Heures',
        topics: [
          'Modélisation des voiles et des dalles pleines interconnectées',
          'Maillage fin (Auto Area Mesh) pour une transmission réaliste des contraintes',
          'Définition des matériaux et des conditions d’encastrement',
          'Charges permanentes de cloisons légères et revêtements'
        ]
      },
      {
        title: 'Module 3 : Comportement Dynamique et Sismique',
        duration: '7 Heures',
        topics: [
          'Périodes très courtes des structures tunnel (Rigidité élevée)',
          'Vérification de la participation massique et de l’effort sismique à la base',
          'Absence de torsion et régularité structurale',
          'Contraintes de compression et traction dans les parois'
        ]
      },
      {
        title: 'Module 4 : Ferraillage & Détails Constructifs',
        duration: '6 Heures',
        topics: [
          'Ferraillage en treillis soudés et armatures de renfort d’angle',
          'Calcul des fondations (Radier général avec réservations pour gaines)',
          'Plans de coffrage et ferraillage conformes aux exigences de chantier'
        ]
      }
    ],
    prerequisites: ['Maîtrise élémentaire d’ETABS ou Robot', 'Notions de base en béton armé'],
    targetAudience: ['Ingénieurs conducteurs de travaux', 'Ingénieurs d’études logements', 'Bureaux d’études AADL']
  },

  // 4. ETABS Bâtiment en Béton Armé Système LECCY (Voiles Porteurs)
  {
    id: 'etabs-ba-leccy',
    title: 'ETABS Bâtiment Béton Armé Système LECCY',
    category: 'beton_arme',
    software: 'CSI ETABS Ultimate',
    price: 3000,
    originalPrice: 5000,
    durationHours: 25,
    level: 'Intermédiaire à Avancé',
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    shortDesc: {
      fr: 'Étude des bâtiments à voiles porteurs type LECCY : descente de charges, contreventement par voiles et détails constructifs.',
      ar: 'دراسة المنشآت بنظام الجدران الحاملة LECCY: توزيع الأحمال، التدعيم بالجدران الخرسانية والتفاصيل الإنشائية.'
    },
    fullDesc: {
      fr: 'Le système constructif LECCY à voiles porteurs en béton armé offre une excellente rigidité pour les bâtiments collectifs. Dans cette formation sur ETABS, vous apprendrez la descente de charges spécifique, la prise en compte des ouvertures décalées, le comportement en flexion composée des trumeaux et le ferraillage rigoureux selon le RPA 2024.',
      ar: 'نظام LECCY القائم على الجدران الخرسانية الحاملة يوفر متانة ممتازة للعمارات السكنية. ستتعلم في هذه الدورة كيفية توزيع الحمولات، ونمذجة الفتحات غير المنتظمة، وحساب الانعطاف المركب وتسليح المقاطع بدقة متناهية.'
    },
    standards: ['RPA 2024', 'BAEL 91 / Eurocode 2', 'DTR Règles de calcul des voiles'],
    deliverables: [
      'Modèle complet ETABS du système LECCY',
      'Tableaux d’interaction efforts normaux - moments N-M',
      'Détails AutoCAD des zones d’about et armatures verticales',
      'Attestation de suivi certifiée'
    ],
    instructor: {
      name: 'Ing. Hocine Salehi (أ. صالحي حسين)',
      title: 'Ingénieur d’État en Génie Civil (Béton Armé)',
      experience: '12 ans d’expérience en bureau d’études technique',
      avatar: '',
      bio: 'Expert en structures voiles et réhabilitation d’immeubles d’habitation.'
    },
    syllabus: [
      {
        title: 'Module 1 : Principes du système LECCY',
        duration: '5 Heures',
        topics: [
          'Analyse architecturale et organisation des trumeaux de refend',
          'Critères de résistance au feu et isolation acoustique',
          'Hypothèses de calcul et conditions aux limites'
        ]
      },
      {
        title: 'Module 2 : Modélisation sous ETABS',
        duration: '7 Heures',
        topics: [
          'Création des parois minces avec maillage adapté',
          'Gestion des couplages entre voiles via les linteaux',
          'Application des charges climatiques et sismiques'
        ]
      },
      {
        title: 'Module 3 : Vérifications Dynamiques & Stabilité',
        duration: '7 Heures',
        topics: [
          'Comportement dynamique et périodes',
          'Calcul des contraintes normales et de cisaillement aux jonctions',
          'Vérification du non-glissement à l’interface dalle-voile'
        ]
      },
      {
        title: 'Module 4 : Ferraillage & Note de Calcul',
        duration: '6 Heures',
        topics: [
          'Ferraillage longitudinal des trumeaux et armatures transversales',
          'Dimensionnement des fondations (Semelles sous voiles ou radier)',
          'Finalisation du rapport technique pour contrôle CTC'
        ]
      }
    ],
    prerequisites: ['Bases en béton armé', 'Initiation à ETABS recommandée'],
    targetAudience: ['Ingénieurs calculateurs', 'Architectes et techniciens BTP']
  },

  // 5. Robot Bâtiment Métallique
  {
    id: 'robot-batiment-metal',
    title: 'Robot Bâtiment Métallique Multi-Étages',
    category: 'charpente_metallique',
    software: 'Autodesk Robot Structural Analysis',
    price: 5000,
    originalPrice: 10000,
    durationHours: 35,
    level: 'Intermédiaire à Avancé',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 5000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1693966067602-9ca1f56695c0?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Calcul complet d’un bâtiment à étages en charpente métallique avec planchers collaborants, contreventements et profilés laminés/PRS selon l’Eurocode 3 & CCM97.',
      ar: 'حساب وتصميم بناية متعددة الطوابق من الهياكل المعدنية مع الأرضيات المركبة وأنظمة التدعيم وفق Eurocode 3 وCCM97.'
    },
    fullDesc: {
      fr: 'Une formation de référence pour maîtriser la conception des bâtiments multi-étages en charpente métallique sous Autodesk Robot. Vous y aborderez la conception des planchers collaborants acier-béton, le dimensionnement des poteaux (HEA, HEB, HD), des poutres principales et secondaires (IPE), la vérification du déversement, du flambement, ainsi que l’analyse des contreventements en croix de Saint-André ou en V inversé sous séisme RPA 2024 et Eurocode 3.',
      ar: 'دورة مرجعية لإتقان تصميم البنايات متعددة الطوابق بالهياكل المعدنية على برنامج روبوت. ستتعلم تصميم الأسقف المركبة (Planchers Collaborants)، واختيار المقاطع المناسبة (HEA, HEB, IPE, PRS)، وفحص الاستقرار ومقاومة الانبعاج (Flambement) والالتواء الجانبي (Déversement) والتأثيرات الزلزالية وفق RPA 2024.'
    },
    standards: ['CCM 97 (Algérie)', 'Eurocode 3 (NF EN 1993)', 'RPA 2024 (Chapitre Métal)'],
    deliverables: [
      'Modèle complet Robot (.rtd) du bâtiment métallique multi-étages',
      'Tableau comparatif des ratios d’acier et optimisation des profilés',
      'Feuille Excel de calcul des connecteurs goujons Nelson pour plancher collaborant',
      'Note de calcul complète certifiée CTC',
      'Accès au support technique et attestation'
    ],
    instructor: {
      name: 'Ing. Aymen Saadallah (أ. أيمن سعد الله)',
      title: 'Spécialiste Charpente Métallique & Calcul des Structures',
      experience: '18 ans en calcul d’ouvrages d’art et structures métalliques',
      avatar: '',
      bio: 'Ingénieur concepteur de structures complexes, hangars de grande portée et plateformes pétrolières pour Sonatrach et grands groupes industriels.'
    },
    syllabus: [
      {
        title: 'Module 1 : Conception générale et choix de la structure métallique',
        duration: '7 Heures',
        topics: [
          'Trame structurale et transmission des efforts',
          'Système de plancher collaborant (Bacs acier, connecteurs, dalle de compression)',
          'Choix des contreventements verticaux et horizontaux',
          'Normes de calcul : CCM 97 et Eurocode 3'
        ]
      },
      {
        title: 'Module 2 : Modélisation 3D avancée dans Robot',
        duration: '9 Heures',
        topics: [
          'Création de la structure poteaux-poutres et solives',
          'Définition des relâchements et liaisons articulées/encastrées',
          'Modélisation des contreventements en cornières ou tubes carrés',
          'Assignation des charges et combinaisons ELU / ELS / Sismiques'
        ]
      },
      {
        title: 'Module 3 : Vérification des Profilés & Instabilités Élastiques',
        duration: '10 Heures',
        topics: [
          'Vérification des contraintes normales et de cisaillement',
          'Calcul du flambement des poteaux (Longueurs d’épure, inerties)',
          'Vérification du déversement des poutres (Maintien latéral par la dalle)',
          'Flèches limites sous charges d’exploitation (ELS)'
        ]
      },
      {
        title: 'Module 4 : Descente de Charges sur Fondations & Assemblages',
        duration: '9 Heures',
        topics: [
          'Calcul des efforts aux appuis (Traction et cisaillement au vent/séisme)',
          'Conception des pieds de poteaux encastrés ou articulés',
          'Optimisation du poids d’acier total du projet (Gain économique)',
          'Élaboration du dossier technique pour validation CTC'
        ]
      }
    ],
    prerequisites: ['Bases en résistance des matériaux (RDM)', 'Connaissances en construction métallique'],
    targetAudience: ['Ingénieurs en bureaux d’études métalliques', 'Chefs de projets BTP & Industrie']
  },

  // 6. Robot Hangar Métallique
  {
    id: 'robot-hangar-metal',
    title: 'Robot Hangar Métallique Industriel',
    category: 'charpente_metallique',
    software: 'Autodesk Robot Structural Analysis',
    price: 5000,
    originalPrice: 10000,
    durationHours: 35,
    level: 'Tous niveaux',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 5000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1661963747336-44ac33c19145?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Dimensionnement complet d’un hangar industriel : portiques, pannes, liernes, vent selon RNV 2013 et pont roulant avec Robot.',
      ar: 'تصميم وحساب هناجر صناعية متكاملة: إطارات Portiques، مدادات Pannes، حساب الرياح RNV 2013 والرافعة الشوكية (Pont Roulant).'
    },
    fullDesc: {
      fr: 'Le hangar métallique est le projet le plus fréquent en bureau d’études en Algérie. Cette formation complète sur Autodesk Robot couvre l’intégralité du cycle de calcul : étude des pannes en ZED ou IPE soumises à la flexion déviée, calcul des liernes et suspentes, calcul manuel et automatique du vent selon le RNV 2013, dimensionnement des portiques à traverses brisées, stabilités longitudinales en palées, et intégration des charges dynamiques d’un pont roulant.',
      ar: 'الهناجر المعدنية هي الأكثر طلباً في سوق العمل الهندسي بالجزائر. تغطي هذه الدورة على برنامج أوتوديسك روبوت جميع مراحل الحساب: حساب المدادات (Pannes) تحت الانعطاف المنحرف، تأثيرات الرياح وفق النظام الجزائري RNV 2013، تصميم الإطارات، أنظمة التدعيم، وإضافة أحمال الرافعات الجسرية (Pont Roulant).'
    },
    standards: ['RNV 2013 (Vent & Neige)', 'CCM 97 / Eurocode 3', 'RPA 2024'],
    deliverables: [
      'Fichier modèle Robot (.rtd) du hangar industriel complet avec pont roulant',
      'Feuille Excel automatisée de calcul du vent selon le RNV 2013',
      'Feuille de calcul des pannes en flexion déviée',
      'Plans types AutoCAD de détails de bardage et toiture',
      'Note de calcul prête pour le CTC',
      'Certificat de formation'
    ],
    instructor: {
      name: 'Ing. Aymen Saadallah (أ. أيمن سعد الله)',
      title: 'Spécialiste Charpente Métallique & Calcul des Structures',
      experience: '18 ans en calcul d’ouvrages d’art et structures métalliques',
      avatar: '',
      bio: 'Formateur certifié Autodesk, ayant conçu plus de 250 hangars industriels et plateformes logistiques.'
    },
    syllabus: [
      {
        title: 'Module 1 : Conception du Hangar & Éléments Secondaires',
        duration: '8 Heures',
        topics: [
          'Choix de la portée, entraxe des portiques et pente de toiture',
          'Dimensionnement des pannes de toiture (IPE ou profilés formés à froid C / Z)',
          'Calcul des liernes de toiture et échantignolles',
          'Dimensionnement des lisses de bardage et potelets de pignon'
        ]
      },
      {
        title: 'Module 2 : Actions Climatiques selon le RNV 2013',
        duration: '9 Heures',
        topics: [
          'Pression dynamique de référence qref par zone de vent (Zone I à V)',
          'Coefficients de pression extérieure Cpe et intérieure Cpi',
          'Cas de charge de vent (Longitudinal V1/V2, transversal V3/V4)',
          'Charges de neige et combinaisons réglementaires selon CCM 97'
        ]
      },
      {
        title: 'Module 3 : Modélisation 3D du Hangar & Pont Roulant',
        duration: '10 Heures',
        topics: [
          'Modélisation du portique courant (Poteaux et traverses avec jarrets)',
          'Poutres de roulement pour pont roulant (Efforts verticaux et transversaux de freinage)',
          'Palées de stabilité en croix de Saint-André (Poutre au vent et stabilités verticales)',
          'Analyse des instabilités : Flambement et déversement'
        ]
      },
      {
        title: 'Module 4 : Optimisation, Pieds de Poteaux & Note CTC',
        duration: '8 Heures',
        topics: [
          'Optimisation du poids d’acier et ratios kg/m²',
          'Dimensionnement des pieds de poteaux articulés et encastrés (Tiges d’ancrage et platines)',
          'Génération automatique de la note de calcul complète pour le CTC'
        ]
      }
    ],
    prerequisites: ['Notions en calcul des structures métalliques'],
    targetAudience: ['Ingénieurs génie civil et mécanique', 'Bureaux d’études et fabricants de charpente']
  },

  // 7. ETABS Hangar Métallique
  {
    id: 'etabs-hangar-metal',
    title: 'ETABS Hangar Métallique Industriel',
    category: 'charpente_metallique',
    software: 'CSI ETABS Ultimate',
    price: 5000,
    originalPrice: 10000,
    durationHours: 30,
    level: 'Intermédiaire',
    badge: 'بروموسيون 50 ساعة - 5000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1661963747336-44ac33c19145?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Modélisation 3D, analyse spatiale, charges de vent RNV 2013 et vérification des profilés métalliques sous CSI ETABS.',
      ar: 'نمذجة ثلاثية الأبعاد، تحليل فضاءي، أحمال الرياح RNV 2013 وفحص المقاطع الفولاذية ببرنامج CSI ETABS.'
    },
    fullDesc: {
      fr: 'Maîtrisez la conception des hangars et structures industrielles en acier avec CSI ETABS. Cette formation vous montre comment exploiter les puissantes fonctionnalités de calcul spatial d’ETABS : définition des sections non-prismatiques (Jarrets), assignation des charges de surface pour le vent, vérification des sections selon l’Eurocode 3 et AISC 360, et extraction des réactions aux appuis pour le dimensionnement des massifs de fondation.',
      ar: 'احترف تصميم الهناجر والمنشآت الصناعية الفولاذية باستخدام برنامج CSI ETABS. تغطي هذه الدورة النمذجة المتقدمة للمقاطع المتغيرة، أحمال الرياح، التحقق من المقاطع وفق Eurocode 3 وAISC 360، واستخراج ردود الأفعال لحساب قواعد التأسيس.'
    },
    standards: ['Eurocode 3 (EC3)', 'AISC 360-16', 'RNV 2013'],
    deliverables: [
      'Modèle spatial ETABS (.edb) du hangar',
      'Fichier de sections non-prismatiques pour jarrets',
      'Tableaux des ratios d’interaction D/C (Demand/Capacity)',
      'Note de calcul des réactions et ancrages',
      'Certificat de fin de formation'
    ],
    instructor: {
      name: 'Ing. Aymen Saadallah (أ. أيمن سعد الله)',
      title: 'Spécialiste Charpente Métallique & Calcul des Structures',
      experience: '15 ans d’expérience en modélisation CSI & contrôle CTC',
      avatar: '',
      bio: 'Spécialiste de la suite CSI (ETABS, SAP2000, SAFE) pour les ouvrages en béton armé et charpente métallique.'
    },
    syllabus: [
      {
        title: 'Module 1 : Géométrie et Profilés Métalliques dans ETABS',
        duration: '7 Heures',
        topics: [
          'Création de la grille spatiale du hangar',
          'Importation et création des sections de profilés européens (IPE, HEA, UPN)',
          'Définition des sections avec jarrets (Nonprismatic sections)'
        ]
      },
      {
        title: 'Module 2 : Chargement et Conditions aux Limites',
        duration: '8 Heures',
        topics: [
          'Génération des charges surfaciques de vent via des panneaux factices (Cladding)',
          'Charges gravitaires et combinaisons automatiques Eurocode 3',
          'Conditions d’appuis aux pieds de poteaux'
        ]
      },
      {
        title: 'Module 3 : Steel Frame Design sous ETABS',
        duration: '8 Heures',
        topics: [
          'Paramétrage des facteurs de longueur de flambement Ky, Kz',
          'Vérification des ratios D/C et codes de couleurs',
          'Optimisation automatique des profilés de traverses et poteaux'
        ]
      },
      {
        title: 'Module 4 : Réactions aux Appuis & Rapport',
        duration: '7 Heures',
        topics: [
          'Extraction des efforts de soulèvement et d’arrachement',
          'Dimensionnement des fondations isolées en béton armé avec SAFE / Excel',
          'Génération du rapport de calcul structuré'
        ]
      }
    ],
    prerequisites: ['Notions en charpente métallique', 'Connaissances générales de l’interface CSI'],
    targetAudience: ['Ingénieurs structures', 'Bureaux d’études industriels']
  },

  // 8. Tekla Structures Bâtiment Métallique
  {
    id: 'tekla-batiment-metal',
    title: 'Tekla Structures Bâtiment Métallique (BIM)',
    category: 'charpente_metallique',
    software: 'Trimble Tekla Structures',
    price: 5000,
    originalPrice: 10000,
    durationHours: 40,
    level: 'Intermédiaire à Expert',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 5000 دج',
    thumbnail: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Modélisation BIM 3D intégrale, gestion des assemblages, génération automatique des plans de fabrication, montage et nomenclatures de boulonnerie.',
      ar: 'نمذجة BIM ثلاثية الأبعاد متكاملة، إدارة الوصلات والبراغي، واستخراج المخططات التنفيذية والتركيبية وجداول الكميات تلقائياً.'
    },
    fullDesc: {
      fr: 'Trimble Tekla Structures est le logiciel BIM mondial incontournable pour l’ingénierie et la fabrication des structures en acier. Cette formation d’excellence vous apprend à modéliser un bâtiment métallique complexe de A à Z : création des profils, insertion des assemblages paramétriques, gestion des soudures et boulons, détection des clashs 3D, numérotation automatique (Repérage pièces et éléments), et extraction des plans d’atelier (Shop Drawings) et plans de montage (General Arrangement).',
      ar: 'برنامج تيكلا ستركشرز هو الرائد عالمياً في تفصيل وتصنيع الهياكل الفولاذية (BIM Detailing). ستتعلم نمذجة بناية معدنية متكاملة، وإدراج الوصلات التلقائية، واختيار اللحامات والبراغي، وكشف التعارضات 3D، واستخراج مخططات الورشة للتصنيع ومخططات التركيب وجداول أوزان الحديد بدقة متناهية.'
    },
    standards: ['BIM ISO 19650', 'Eurocode 3', 'Normes de fabrication en atelier'],
    deliverables: [
      'Modèle complet Tekla (.db1) du bâtiment',
      'Plans de débit et fabrication au format DWG et PDF',
      'Fichiers de commande numérique CNC / DSTV pour machines de découpe',
      'Nomenclatures complètes des profilés, plats et boulons (Excel)',
      'Certificat de formation professionnelle BIM'
    ],
    instructor: {
      name: 'Ing. Aymen Saadallah (أ. أيمن سعد الله)',
      title: 'Spécialiste Charpente Métallique & Calcul des Structures',
      experience: '14 ans en modélisation et fabrication d’usines et grands centres commerciaux',
      avatar: '',
      bio: 'Consultant pour les plus grands ateliers de construction métallique en Algérie et dans le Golfe.'
    },
    syllabus: [
      {
        title: 'Module 1 : Prise en main & Environnement Tekla Structures',
        duration: '8 Heures',
        topics: [
          'Interface, système de coordonnées, vues 3D et plans de travail',
          'Création des maillages et grilles tridimensionnelles',
          'Modélisation des poteaux, poutres, solives et contreventements',
          'Gestion des catalogues de profilés et matériaux d’acier'
        ]
      },
      {
        title: 'Module 2 : Composants & Assemblages Paramétriques',
        duration: '12 Heures',
        topics: [
          'Utilisation de la bibliothèque d’assemblages (Attaches articulées, encastrées, pannes)',
          'Modélisation des pieds de poteaux avec platines et tiges d’ancrage',
          'Assemblages de contreventement avec goussets',
          'Personnalisation des composants sur mesure'
        ]
      },
      {
        title: 'Module 3 : Vérification 3D, Clashes & Numérotation',
        duration: '10 Heures',
        topics: [
          'Contrôle des collisions (Clash check) entre boulons, profilés et plats',
          'Processus de repérage et numérotation automatique des pièces',
          'Génération des nomenclatures d’expédition, de découpe et de boulons'
        ]
      },
      {
        title: 'Module 4 : Production des Plans d’Exécution & Export CNC',
        duration: '10 Heures',
        topics: [
          'Plans de pièces uniques (W-drawings) et plans d’éléments assemblés (A-drawings)',
          'Plans d’ensemble et de montage sur chantier (GA-drawings)',
          'Exportation des fichiers NC (DSTV) et IFC pour la coordination BIM'
        ]
      }
    ],
    prerequisites: ['Connaissance de la terminologie de charpente métallique'],
    targetAudience: ['Projeteurs BIM', 'Dessinateurs industriels', 'Responsables d’ateliers de fabrication']
  },

  // 9. Tekla Structures Hangar Métallique
  {
    id: 'tekla-hangar-metal',
    title: 'Tekla Structures Hangar Métallique Industriel',
    category: 'charpente_metallique',
    software: 'Trimble Tekla Structures',
    price: 5000,
    originalPrice: 10000,
    durationHours: 35,
    level: 'Tous niveaux',
    badge: 'بروموسيون 50 ساعة - 5000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1666788168089-3142e8471488?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Modélisation complète d’un hangar industriel sous Tekla : portiques avec jarrets, pannes, bardage, platines et plans d’atelier.',
      ar: 'نمذجة تفصيلية كاملة لهنجر صناعي ببرنامج تيكلا: الإطارات مع الجاريهات، المدادات، التغطية، والمخططات التنفيذية للتصنيع.'
    },
    fullDesc: {
      fr: 'Apprenez à produire les dossiers de fabrication complets d’un hangar métallique avec Trimble Tekla Structures. Cette formation vous enseigne la modélisation des portiques à traverses composées, les jarrets de faîtage et de jarret de rive, les attaches de pannes avec échantignolles, les corbeaux pour pont roulant, et l’édition des plans pour les équipes de chaudronnerie et de montage sur site.',
      ar: 'تعلم كيفية استخراج الملف التنفيذي الكامل لتصنيع هنجر صناعي ببرنامج تيكلا ستركشرز. تشمل الدورة نمذجة الإطارات، وصلات الركبة والقمة، وصلات المدادات، كوابل الرافعة الشوكية، ومخططات التجميع والتركيب لورشات الحدادة والإنشاء.'
    },
    standards: ['Normes de fabrication BTP / Métal', 'Eurocode 3'],
    deliverables: [
      'Projet modèle Tekla (.db1) du hangar industriel',
      'Pack complet de plans d’atelier PDF & DWG (Plats, goussets, fers)',
      'Liste de débit matière et récapitulatif des poids',
      'Fichiers d’exportation pour la découpe laser/plasma',
      'Attestation certifiée'
    ],
    instructor: {
      name: 'Ing. Aymen Saadallah (أ. أيمن سعد الله)',
      title: 'Spécialiste Charpente Métallique & Calcul des Structures',
      experience: '14 ans en modélisation et fabrication d’usines et grands centres commerciaux',
      avatar: '',
      bio: 'Expert en automatisation des dessins d’atelier et réduction des coûts de fabrication.'
    },
    syllabus: [
      {
        title: 'Module 1 : Modélisation des Portiques et Ossature Secondaire',
        duration: '8 Heures',
        topics: [
          'Grille modulaire et pentes de toiture',
          'Modélisation des poteaux PRS ou profilés laminés et traverses',
          'Ajout des pannes de toiture, lisses de bardage et cornières de maintien'
        ]
      },
      {
        title: 'Module 2 : Assemblages Spécifiques aux Hangars',
        duration: '10 Heures',
        topics: [
          'Assemblages faîtage et rives avec jarrets de renfort',
          'Attaches de pannes avec échantignolles soudées ou boulonnées',
          'Pieds de poteaux articulés avec chevilles à scellement'
        ]
      },
      {
        title: 'Module 3 : Palées de Stabilité & Potelets de Pignon',
        duration: '8 Heures',
        topics: [
          'Contreventements de toiture et verticaux avec barres rondes ou cornières',
          'Ossature de pignon et lisses de retour',
          'Contrôle dimensionnel et détection des interférences'
        ]
      },
      {
        title: 'Module 4 : Génération des Plans d’Atelier & Listes de Débit',
        duration: '9 Heures',
        topics: [
          'Repérage général du projet',
          'Création des plans de fabrication par phase de chantier',
          'Extraction du bon de commande matière (Nuances d’acier S235 / S275 / S355)'
        ]
      }
    ],
    prerequisites: ['Initiation à la DAO ou aux plans de charpente'],
    targetAudience: ['Techniciens de bureaux d’études', 'Constructeurs et chaudronniers']
  },

  // 10. IDEA StatiCa pour les Assemblages Métalliques
  {
    id: 'idea-statica-assemblages',
    title: 'IDEA StatiCa pour les Assemblages Métalliques',
    category: 'charpente_metallique',
    software: 'IDEA StatiCa Steel',
    price: 5000,
    originalPrice: 10000,
    durationHours: 30,
    level: 'Avancé',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 5000 دج',
    thumbnail: 'https://images.unsplash.com/photo-1651611790023-53bd5b6fb59b?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Calcul avancé des nœuds et assemblages métalliques par éléments finis (CBFEM), vérification des soudures, boulons HR et rigidité rotationnelle selon l’Eurocode 3.',
      ar: 'الحساب المتقدم للوصلات والعقد الفولاذية بالعناصر المنتهية (CBFEM)، فحص اللحامات، براغي الشد العالي والصلابة وفق Eurocode 3.'
    },
    fullDesc: {
      fr: 'IDEA StatiCa est la référence mondiale révolutionnaire pour le calcul et la justification des assemblages métalliques de toute géométrie grâce à la méthode CBFEM (Component-Based Finite Element Method). Vous apprendrez à modéliser et vérifier tous les types de liaisons : encastrements poteau-poutre avec jarrets, pieds de poteaux complexes avec bêche de cisaillement, nœuds de treillis tubulaires, attaches articulées par cornières, et à justifier la plastification des plaques, la résistance des cordons de soudure et le comportement des boulons précontraints HR.',
      ar: 'برنامج IDEA StatiCa هو المعيار العالمي الأول لحساب وتبرير الوصلات المعدنية المعقدة باستخدام تقنية العناصر المنتهية المتطورة CBFEM. ستتعلم نمذجة واختبار كافة أنواع الوصلات: التقاء الأعمدة بالروافد، قواعد الأعمدة المعقدة، عقد التثبيت الأنبوبية، فحص إجهادات اللحام والبراغي عالية المقاومة، وتحليل الصلابة الدورانية لتقييم السلوك الإنشائي.'
    },
    standards: ['Eurocode 3 (EN 1993-1-8)', 'AISC 360', 'Méthode CBFEM certifiée'],
    deliverables: [
      'Plus de 20 modèles types IDEA StatiCa (.ideacon) de liaisons prêtes à l’emploi',
      'Notes de calcul d’assemblages avec cartographie des contraintes et déformations von Mises',
      'Guide de classification de la rigidité des liaisons (Rigide / Semi-rigide / Articulé)',
      'Attestation certifiée d’aptitude au calcul CBFEM'
    ],
    instructor: {
      name: 'Ing. Aymen Saadallah (أ. أيمن سعد الله)',
      title: 'Spécialiste Charpente Métallique & Calcul des Structures',
      experience: '18 ans en calcul d’ouvrages d’art et structures métalliques',
      avatar: '',
      bio: 'Formateur agréé IDEA StatiCa et pionnier de l’analyse par éléments finis des assemblages en Afrique du Nord.'
    },
    syllabus: [
      {
        title: 'Module 1 : Principes fondamentaux de la méthode CBFEM',
        duration: '6 Heures',
        topics: [
          'Limites de la méthode traditionnelle des composantes de l’Eurocode 3',
          'Modélisation des plaques en éléments finis et loi de comportement élasto-plastique (5% strain limit)',
          'Modélisation des boulons (Tension, cisaillement, interaction) et des cordons de soudure',
          'Interface générale et flux de travail IDEA StatiCa'
        ]
      },
      {
        title: 'Module 2 : Assemblages Poteau-Poutre & Continuité',
        duration: '9 Heures',
        topics: [
          'Encastrement par platine d’about étendue avec et sans jarret',
          'Raidisseurs d’âme, de semelle et plaques de doublage (Web doubler plates)',
          'Analyse des contraintes, déformations plastiques et état limite d’utilisation',
          'Analyse de rigidité rotationnelle et classification de la liaison'
        ]
      },
      {
        title: 'Module 3 : Pieds de Poteaux & Sollicitations Mixtes',
        duration: '8 Heures',
        topics: [
          'Pied de poteau encastré soumis à fort moment et effort normal de compression/traction',
          'Contact acier-mortier de calage-béton et vérification au poinçonnement',
          'Dimensionnement des tiges d’ancrage et bêches de cisaillement sous séisme'
        ]
      },
      {
        title: 'Module 4 : Nœuds Spéciaux, Flambement Local & Note CTC',
        duration: '7 Heures',
        topics: [
          'Liaisons de contreventement tubulaire et treillis CHS / RHS',
          'Analyse de flambement local des plaques (Buckling analysis & facteur de charge critique alpha)',
          'Édition du rapport de calcul complet et conformité CTC'
        ]
      }
    ],
    prerequisites: ['Bonne compréhension de la construction métallique selon l’Eurocode 3'],
    targetAudience: ['Ingénieurs calculateurs métalliques', 'Bureaux d’études et contrôleurs techniques']
  },

  // 11. AutoCAD Génie Civil
  {
    id: 'autocad-genie-civil',
    title: 'AutoCAD Génie Civil (Coffrage, Ferraillage & Plans d’Exécution)',
    category: 'routes_vrd',
    software: 'Autodesk AutoCAD',
    price: 3000,
    originalPrice: 5000,
    durationHours: 30,
    level: 'Tous niveaux',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://images.unsplash.com/photo-1761213230327-d89a8cc9cc63?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Production professionnelle de tous les plans de génie civil : coffrage, ferraillage des poutres/poteaux/voiles, fondations et cartouches normalisés.',
      ar: 'إنتاج احترافي لمخططات الهندسة المدنية: قوالب الخرسانة، تفاصيل تسليح الأعمدة والروافد والجدران والأساسات وفق المعايير الجزائرية.'
    },
    fullDesc: {
      fr: 'AutoCAD est la compétence de base indispensable pour tout ingénieur et technicien en génie civil. Cette formation axée 100% métier vous apprend les règles de l’art du dessin de structure : conventions graphiques, gestion rigoureuse des calques, blocs dynamiques de ferraillage, cotation automatique, élaboration des plans de coffrage et ferraillage conformes aux exigences du CTC et impression à l’échelle sur papier et PDF.',
      ar: 'برنامج أوتوكاد هو الأداة الأساسية لكل مهندس وتقني في الهندسة المدنية. ستتعلم في هذه الدورة التطبيقية قواعد الرسم الإنشائي: معايير الطبقات (Layers)، إنشاء البلوكات الديناميكية لحديد التسليح، مخططات القوالب، تفاصيل حديد الأعمدة والروافد والجدران، والطباعة بمقاييس رسم احترافية مقبولة لدى CTC.'
    },
    standards: ['Normes de dessin technique BTP', 'Conventions CTC Algérie'],
    deliverables: [
      'Bibliothèque complète de blocs dynamiques de ferraillage (.dwg)',
      'Gabarit professionnel DWT paramétré avec styles de cotes et calques CTC',
      'Exemples de dossiers complets d’exécution (Projets réels validés)',
      'Attestation de formation'
    ],
    instructor: {
      name: 'Ing. Hocine Salehi (أ. صالحي حسين)',
      title: 'Ingénieur d’État en Génie Civil (Agréé CTC)',
      experience: '12 ans d’expérience en bureau d’études technique',
      avatar: '',
      bio: 'Formateur expérimenté en dessin technique assisté par ordinateur et méthodes de chantier.'
    },
    syllabus: [
      {
        title: 'Module 1 : Fondamentaux du dessin de structure sur AutoCAD',
        duration: '7 Heures',
        topics: [
          'Configuration de l’espace de travail, calques normalisés CTC, types de lignes et épaisseurs',
          'Outils de dessin et modification rapide avec raccourcis clavier professionnels',
          'Gestion des échelles d’annotation et styles de texte'
        ]
      },
      {
        title: 'Module 2 : Plans de Coffrage & Fondations',
        duration: '8 Heures',
        topics: [
          'Établissement du plan de fondation (Semelles isolées, semelles filantes, longrines)',
          'Plan de coffrage des planchers hauts (Poutres principales, secondaires, nervures)',
          'Coupes transversales et détails de réservation'
        ]
      },
      {
        title: 'Module 3 : Plans de Ferraillage Détaillés',
        duration: '9 Heures',
        topics: [
          'Ferraillage complet des poteaux (Armatures longitudinales, cadres, épingles et recouvrements)',
          'Ferraillage des poutres avec schémas de façonnage des aciers et crossage',
          'Ferraillage des voiles avec trumeaux d’about et linteaux',
          'Tableaux de nomenclature des aciers (Poids, diamètres)'
        ]
      },
      {
        title: 'Module 4 : Mise en Page & Impression Professionnelle',
        duration: '6 Heures',
        topics: [
          'Gestion des présentations (Layouts), fenêtres multiples et cartouches normalisés',
          'Configuration des tables de styles de tracé (CTB noir et blanc CTC)',
          'Exportation en PDF haute définition et archivage'
        ]
      }
    ],
    prerequisites: ['Aucun prérequis technique exigé'],
    targetAudience: ['Étudiants en génie civil et architecture', 'Dessinateurs projeteurs', 'Ingénieurs de suivi de chantier']
  },

  // 12. Piste pour Calcul des Routes
  {
    id: 'piste-routes',
    title: 'Piste pour Calcul des Routes & Tracé Routier',
    category: 'routes_vrd',
    software: 'SETRA Piste 5.05',
    price: 3000,
    originalPrice: 6000,
    durationHours: 30,
    level: 'Intermédiaire',
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1664547606209-fb31ec979c85?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Calcul géométrique complet des routes : axe en plan, profil en long, profils en travers types et cubatures de terrassement déblai/remblai avec Piste.',
      ar: 'الحساب الهندسي المتكامل للطرقات: المسار الأفقي، المقطع الطولي، المقاطع العرضية النموذجية وحساب كميات الحفر والردم ببرنامج Piste.'
    },
    fullDesc: {
      fr: 'Le logiciel PISTE du SETRA est le standard historique incontournable dans les directions des travaux publics (DTP) et bureaux d’études routiers en Algérie. Vous apprendrez la méthodologie complète du tracé routier : intégration du semis de points topographiques, conception de l’axe en plan avec clothoïdes et arcs de cercle, profil en long optimisé respectant les vitesses de référence, création des profils en travers types, dévers en courbe, et calcul précis des cubatures de déblais et remblais.',
      ar: 'برنامج PISTE يعتبر المرجع الأساسي المعتمد لدى مديريات الأشغال العمومية ومكاتب دراسات الطرق في الجزائر. ستتعلم التصميم الهندسي الكامل للطريق: إدخال النقاط الطبوغرافية، رسم المحور الأفقي مع المنحنيات الانتقالية، تصميم البروفيل الطولي مع مراعاة السرعة المرجعية، إعداد المقاطع العرضية وحساب مكعبات الحفر والردم بدقة.'
    },
    standards: ['B40 / ICTAARN (Instruction sur les conditions techniques d’aménagement des autoroutes et routes nationales)', 'Normes DTP Algérie'],
    deliverables: [
      'Fichiers sources complets du projet de route (.seg, .rep)',
      'Listings des cubatures détaillées (Déblais, remblais, couches de chaussée)',
      'Profils en travers imprimables prêts pour le dossier d’appel d’offres',
      'Certificat de formation professionnelle'
    ],
    instructor: {
      name: 'Ing. Djamel Hamidi',
      title: 'Ingénieur Principal des Travaux Publics & VRD',
      experience: '16 ans en conception d’autoroutes et voies express en Algérie',
      avatar: '',
      bio: 'Chef de projet ayant mené les études techniques de nombreux tronçons routiers et déviations de villes.'
    },
    syllabus: [
      {
        title: 'Module 1 : Données Topographiques & Axe en Plan',
        duration: '8 Heures',
        topics: [
          'Récupération du semis de points topographiques et création du modèle numérique',
          'Tracé de l’axe en plan (Alignements droits, courbes circulaires, raccordements progressifs clothoïdes)',
          'Respect des rayons minimaux selon la vitesse de référence (V80, V100)',
          'Génération des tabulations et bornage du tracé'
        ]
      },
      {
        title: 'Module 2 : Profil en Long & Ligne Rouge',
        duration: '8 Heures',
        topics: [
          'Extraction du profil du terrain naturel (TN)',
          'Conception de la ligne rouge projet (Pentes, rampes et raccordements paraboliques convexes et concaves)',
          'Optimisation pour équilibrer les mouvements de terre déblais/remblais',
          'Vérification de la visibilité d’arrêt et de dépassement'
        ]
      },
      {
        title: 'Module 3 : Profils en Travers Types (PTT) & Dévers',
        duration: '8 Heures',
        topics: [
          'Définition de la plateforme : Voies de circulation, bande d’arrêt d’urgence (BAU), accotements, fossés',
          'Calcul et introduction de la loi de dévers en courbe',
          'Définition des pentes de talus de déblai et de remblai',
          'Application des PTT tout le long du tracé'
        ]
      },
      {
        title: 'Module 4 : Cubatures, Listings & Sorties Graphiques',
        duration: '6 Heures',
        topics: [
          'Calcul des volumes par la méthode des profils en travers',
          'Génération des tableaux de cubatures terrassement et corps de chaussée (BB, GB, GNT)',
          'Exportation des plans vers AutoCAD pour l’impression finale'
        ]
      }
    ],
    prerequisites: ['Notions en topographie et géométrie routière'],
    targetAudience: ['Ingénieurs en travaux publics', 'Topographes', 'Techniciens DTP et entreprises de réalisation']
  },

  // 13. Covadis pour Calcul des Routes & VRD
  {
    id: 'covadis-routes',
    title: 'Covadis pour Calcul des Routes & VRD',
    category: 'routes_vrd',
    software: 'Geomedia Covadis (AutoCAD)',
    price: 3000,
    originalPrice: 6000,
    durationHours: 35,
    level: 'Intermédiaire à Avancé',
    popular: true,
    badge: 'بروموسيون 50 ساعة - 3000 دج',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1664547606209-fb31ec979c85?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    shortDesc: {
      fr: 'Modélisation numérique de terrain (MNT), calcul de projets routiers, carrefours, giratoires, plateformes et réseaux d’assainissement avec Covadis.',
      ar: 'تصميم الطرقات والتهيئة الحضرية VRD ببرنامج كوفاديس: النمذجة الرقمية للأرض الطبيعية MNT، المفترقات، المنصات، وشبكات الصرف الصحي.'
    },
    fullDesc: {
      fr: 'Covadis est le progiciel complet de topographie et de conception d’infrastructures le plus utilisé en Algérie. Dans cette formation de pointe, vous explorerez l’ensemble des modules indispensables : création du Modèle Numérique de Terrain (MNT) par triangulation Delaunay, calcul du projet routier par profils en travers et méthode par axe, conception des carrefours en T et carrefours giratoires normalisés, calcul des terrassements de plateformes par la méthode des prismes, et dimensionnement hydraulique des réseaux d’assainissement et eaux pluviales.',
      ar: 'يعتبر برنامج Covadis الأقوى في مجال الطبوغرافيا وتصميم شبكات الطرق والتهيئة الحضرية (VRD) بالجزائر. تغطي هذه الدورة الاحترافية: إنشاء نموذج الأرض الطبيعية MNT، تصميم الطرق عبر المقاطع العرضية، رسم المفترقات الدائرية (Giratoires)، حساب تسوية الأراضي والمنصات الصناعية والسكنية، وتصميم شبكات التطهير وصرف مياه الأمطار.'
    },
    standards: ['Normes VRD & Assainissement', 'ICTAARN', 'Règles de l’art travaux publics Algérie'],
    deliverables: [
      'Projet complet Covadis (.dwg) avec MNT et tracé routier 3D',
      'Tableaux de cubatures détaillées et devis quantitatif estimatif',
      'Profils en long et profils en travers habillés aux normes',
      'Fichiers de dimensionnement des réseaux hydrauliques',
      'Attestation certifiée'
    ],
    instructor: {
      name: 'Ing. Djamel Hamidi',
      title: 'Ingénieur Principal des Travaux Publics & VRD',
      experience: '16 ans en conception d’autoroutes et voies express en Algérie',
      avatar: '',
      bio: 'Expert certifié Geomedia Covadis, intervenant sur les grands projets d’aménagement urbain et pôles universitaires.'
    },
    syllabus: [
      {
        title: 'Module 1 : Topographie & Modèle Numérique de Terrain (MNT)',
        duration: '8 Heures',
        topics: [
          'Importation du semis de points géoréférencés (Coordonnées Lambert Nord Algérie / UTM)',
          'Filtrage des points et gestion des lignes de rupture de pente (Talus, bordures, crêtes)',
          'Génération du MNT par triangulation et création des courbes de niveau',
          'Analyse des pentes et coupes géologiques de surface'
        ]
      },
      {
        title: 'Module 2 : Projet Linéaire & Tracé Routier',
        duration: '10 Heures',
        topics: [
          'Définition de l’axe en plan et calcul automatique des clothoïdes',
          'Extraction du profil en long TN et dessin du profil projet avec tabulations',
          'Conception des profils en travers types par points ou couches géologiques',
          'Calcul du projet routier et visualisation 3D en temps réel'
        ]
      },
      {
        title: 'Module 3 : Carrefours, Giratoires & Plateformes',
        duration: '9 Heures',
        topics: [
          'Conception assistée des carrefours en T et en croix',
          'Tracé des carrefours giratoires (Rayons d’îlot, voies d’entrée/sortie, dévers)',
          'Conception et nivellement des plateformes de lotissements et zones industrielles',
          'Calcul précis des terrassements et cubatures par prismes'
        ]
      },
      {
        title: 'Module 4 : Assainissement & Réseaux Divers (VRD)',
        duration: '8 Heures',
        topics: [
          'Tracé en plan des réseaux d’eaux usées et eaux pluviales',
          'Calcul des débits par la méthode rationnelle (Pluviométrie locale)',
          'Génération automatique des profils en long hydrauliques (Pentes, diamètres de buses, regards)',
          'Métré des tranchées et volumes de remblaiement'
        ]
      }
    ],
    prerequisites: ['Bonne maîtrise d’AutoCAD'],
    targetAudience: ['Ingénieurs et techniciens VRD', 'Géomètres topographes', 'Entreprises de voirie et réseaux']
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    userId: 'u1',
    userName: 'Abderrahmane Belkacemi',
    userTitle: 'Ingénieur Génie Civil à l’USTHB',
    userWilaya: 'Alger (16)',
    courseId: 'etabs-ba-r4',
    courseTitle: 'ETABS Bâtiment en Béton Armé (R+4)',
    rating: 5,
    comment: 'دورة ممتازة جداً ومفيدة لأقصى درجة. المهندس شرح بالتفصيل المعقد التحقق من الـ RPA 2024 وتوزيع الـ Voiles. مباشرة بعد إتمام الدورة استطعت تقديم أول ملف CTC بدون أي ملاحظات رفض. بارك الله فيكم!',
    createdAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'rev-2',
    userId: 'u2',
    userName: 'Sofiane Mansouri',
    userTitle: 'Ingénieur en bureau d’études',
    userWilaya: 'Sétif (19)',
    courseId: 'robot-hangar-metal',
    courseTitle: 'Robot Hangar Métallique Industriel',
    rating: 5,
    comment: 'Formation exceptionnelle sur Robot et le vent RNV 2013. Les feuilles de calcul Excel et le suivi par téléphone pour confirmer l’inscription étaient très professionnels. Le formateur répond à toutes les questions techniques.',
    createdAt: '2026-09-28T10:15:00Z'
  },
  {
    id: 'rev-3',
    userId: 'u3',
    userName: 'Khaled Dahmani',
    userTitle: 'Étudiant Master 2 Structures',
    userWilaya: 'Oran (31)',
    courseId: 'idea-statica-assemblages',
    courseTitle: 'IDEA StatiCa pour les Assemblages Métalliques',
    rating: 5,
    comment: 'IDEA StatiCa هو المستقبل في الجزائر! الدورة سهلة ومبسطة جداً والشرح يركز على التطبيق العملي. مكنتني من إتقان حساب الوصلات المعقدة في مذكرة تخرجي ونلت علامة ممتازة.',
    createdAt: '2026-10-02T18:00:00Z'
  },
  {
    id: 'rev-4',
    userId: 'u4',
    userName: 'Amine Zitouni',
    userTitle: 'Ingénieur Travaux Publics',
    userWilaya: 'Constantine (25)',
    courseId: 'covadis-routes',
    courseTitle: 'Covadis pour Calcul des Routes & VRD',
    rating: 5,
    comment: 'Très satisfait de la formation Covadis. On a appris à manipuler les MNT et faire les carrefours giratoires de manière concrète. Support technique réactif et excellente pédagogie.',
    createdAt: '2026-10-10T11:45:00Z'
  }
];

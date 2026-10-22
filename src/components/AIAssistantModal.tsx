import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Building, 
  User, 
  ArrowRight, 
  CreditCard, 
  CheckCircle, 
  PhoneCall, 
  RefreshCw,
  HelpCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { Course, Language } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  suggestedCourseId?: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  courses: Course[];
  onSelectCourseForEnroll: (course: Course) => void;
  sitePhone?: string;
}

const QUICK_PROMPTS_AR = [
  '💡 أنصحني بأفضل دورة في الخرسانة المسلحة؟',
  '🏗️ حاب نتخصص في الشاربونت ميتاليك واش تنصحني؟',
  '💳 كيفاش نخلص ببريدي موب وكيفاش نستلم القسيمة؟',
  '⚡ واش هو الفرق بين برنامج Robot و ETABS؟',
  '📄 هل الملفات والمشاريع مقبولة لدى CTC؟',
];

const QUICK_PROMPTS_FR = [
  '💡 Quelle est la meilleure formation en Béton Armé ?',
  '🏗️ Comment débuter en Charpente Métallique ?',
  '💳 Comment payer par BaridiMob et obtenir le bon ?',
  '⚡ Quelle est la différence entre Robot et ETABS ?',
  '📄 Les attestations et notes sont-elles valides CTC ?',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  courses,
  onSelectCourseForEnroll,
  sitePhone = '0797034244',
}) => {
  const isAr = language === 'ar';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: 'msg-welcome',
    sender: 'bot',
    text: isAr
      ? `مرحباً بك في **GC58 FORMATIONS**! 🏗️🇩🇿\n\nأنا **وكيل الذكاء الاصطناعي GC58 AI**. أنا هنا باش نعاونك تختار الدورة الأنسب لمستواك ومشروعك المهني، ونشرحلك كل التفاصيل بخصوص:\n\n• **دورات الخرسانة المسلحة** (بإشراف أ. صالحي حسين) بـ 3000 دج فقط.\n• **دورات الشاربونت ميتاليك** (بإشراف أ. أيمن سعد الله) بـ 5000 دج فقط.\n• **حساب الطرقات والـ VRD** بـ 5000 دج.\n• طريقة الدفع المباشر بـ **بريدي موب** (00799999002361295068) أو **CCP**، وكيفاش تستلم قسيمة الاشتراك وتتواصل مع الأدمن.\n\nواش راك حاب تستفسر اليوم؟ يمكنك الضغط على الأسئلة المقترحة أو كتابة سؤالك مباشرة!`
      : `Bienvenue sur **GC58 FORMATIONS** ! 🏗️🇩🇿\n\nJe suis **GC58 AI**, votre conseiller technique virtuel. Je suis à votre service pour vous orienter vers la formation idéale selon votre profil :\n\n• **Formations Béton Armé** (animées par Ing. Hocine Salehi) à 3 000 DA.\n• **Formations Charpente Métallique** (animées par Ing. Aymen Saadallah) à 5 000 DA.\n• **Calcul Routier & VRD** à 5 000 DA.\n• Paiement rapide par **BaridiMob** (00799999002361295068) ou **CCP**, réception du bon de souscription et contact admin.\n\nQue souhaitez-vous savoir aujourd'hui ?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Local knowledge generator fallback in case backend is offline or slow
  const generateOfflineAdvice = (query: string): { reply: string; suggestedCourseId?: string } => {
    const q = query.toLowerCase();

    if (q.includes('بريدي موب') || q.includes('ccp') || q.includes('دفع') || q.includes('payer') || q.includes('خلص') || q.includes('وصل') || q.includes('قسيم')) {
      return {
        reply: isAr
          ? `💳 **طريقة الدفع واستلام قسيمة الاشتراك في GC58:**\n\n1. عند الضغط على "طلب الدورة" وتسجيل معلوماتك، يظهر لك مباشرة:\n   • **رقم بريدي موب (BaridiMob RIP):** \`00799999002361295068\`\n   • **أو حساب CCP:** \`0023612950\` المفتاح \`68\`\n\n2. قم بإجراء التحويل وارفع صورة الوصل (Reçu) في الموقع.\n\n3. فور تأكيد الطلب، يُنشئ الموقع **قسيمة اشتراك رسمية** خاصة بك.\n\n4. ⚠️ **ملاحظة مهمة:** اضغط على زر "مراسلة الأدمن عبر واتساب" وأرسل له القسيمة فقط، لأن وصل الدفع يكون محفوظاً ومسجلاً تلقائياً في قاعدة بيانات الموقع للتحقق منه فورياً!`
          : `💳 **Modalités de paiement & Bon de souscription GC58 :**\n\n1. Lors de la commande, les coordonnées sont affichées directement :\n   • **RIP BaridiMob :** \`00799999002361295068\`\n   • **CCP :** Compte \`0023612950\` Clé \`68\`\n\n2. Effectuez le virement et téléversez votre reçu sur le site.\n\n3. Le site génère automatiquement votre **bon de souscription officiel**.\n\n4. ⚠️ Envoyez uniquement le bon à l'administrateur sur WhatsApp, car votre reçu est déjà enregistré sur la plateforme !`,
      };
    }

    if (q.includes('شاربونت') || q.includes('metal') || q.includes('معدني') || q.includes('هانغار') || q.includes('ايمن') || q.includes('aymen') || q.includes('tekla') || q.includes('idea')) {
      const rec = courses.find((c) => c.category === 'charpente_metallique') || courses[4];
      return {
        reply: isAr
          ? `🏗️ **دورات الشاربونت ميتاليك (الهياكل المعدنية):**\n\nيشرف على هذه الدورات **المهندس أيمن سعد الله (Ing. Aymen Saadallah)**، خبير معتمد في الحساب الإنشائي للمباني والهناغر المعدنية.\n\nالدورات تشمل:\n• **Robot Hangar Métallique** (دراسة الهانغار مع أحمال الرياح والثلج RNV 2013).\n• **Tekla Structures** (النمذجة ثلاثية الأبعاد ومخططات الورشة والتصنيع CNC).\n• **IDEA StatiCa** (حساب الوصلات المعقدة والعقد CBFEM).\n\n💰 السعر في العرض الترويجي: **5000 دج فقط** بدل 10000 دج!`
          : `🏗️ **Formations Charpente Métallique :**\n\nAnimées par l'ingénieur **Aymen Saadallah**, expert en calcul des structures métalliques.\n\nAu programme : Robot Bâtiment & Hangar (actions RNV 2013), Tekla Structures (BIM & plans d'atelier), et IDEA StatiCa (assemblages CBFEM).\n\n💰 Tarif promotionnel : **5 000 DA** au lieu de 10 000 DA !`,
        suggestedCourseId: rec?.id,
      };
    }

    if (q.includes('خرسانة') || q.includes('بيطون') || q.includes('beton') || q.includes('صالحي') || q.includes('hocine') || q.includes('r+2') || q.includes('r+4') || q.includes('tunnel') || q.includes('نفق')) {
      const rec = courses.find((c) => c.category === 'beton_arme') || courses[0];
      return {
        reply: isAr
          ? `🏢 **دورات الخرسانة المسلحة (Béton Armé):**\n\nيشرف عليها **المهندس صالحي حسين (Ing. Hocine Salehi)**، مهندس دولة في الهندسة المدنية وخبير في الدراسات الإنشائية والمصادقة لدى CTC.\n\nتشمل دراسة المشاريع الحقيقية:\n• **Robot R+2:** سكنات فردية وفيلات مع الأساسات والروافد والأعمدة.\n• **ETABS R+4:** دراسة ديناميكية زلزالية للعمارات وفق RPA 2024.\n• **ETABS Système Tunnel:** القوالب النفقية المعتمدة في سكنات عدل AADL و LPP.\n\n💰 السعر: **3000 دج فقط** لكل دورة بدل 5000 دج!`
          : `🏢 **Formations Béton Armé :**\n\nAnimées par l'ingénieur **Hocine Salehi**, expert en calcul sismique et conformité CTC.\n\nComprend Robot R+2, ETABS R+4 parasismique (RPA 2024) et ETABS Système Tunnel AADL/LPP.\n\n💰 Tarif promotionnel : **3 000 DA** au lieu de 5 000 DA !`,
        suggestedCourseId: rec?.id,
      };
    }

    if (q.includes('طرق') || q.includes('route') || q.includes('vrd') || q.includes('covadis') || q.includes('piste') || q.includes('autocad')) {
      const rec = courses.find((c) => c.category === 'routes_vrd') || courses[10];
      return {
        reply: isAr
          ? `🛣️ **دورات حساب الطرقات والـ VRD و AutoCAD:**\n\nيشرف عليها **المهندس جمال حميدي (Ing. Djamel Hamidi)**.\n\nتتعلم فيها:\n• **Piste:** التخطيط الطولي، المقاطع العرضية PTT، حساب كميات الردم والحفر.\n• **Covadis:** الـ MNT والمفترقات والمنصات وشبكات الصرف الصحي والـ VRD.\n• **AutoCAD Génie Civil:** إخراج مخططات القوالب والتسليح التنفيذية المطابقة لمعايير CTC.\n\n💰 السعر: **5000 دج فقط**!`
          : `🛣️ **Calcul Routier, VRD & AutoCAD :**\n\nAnimées par l'ingénieur **Djamel Hamidi** (Piste, Covadis et AutoCAD d'exécution).\n\n💰 Tarif promo : **5 000 DA** !`,
        suggestedCourseId: rec?.id,
      };
    }

    if (q.includes('ctc') || q.includes('شهادة') || q.includes('certificat') || q.includes('معتمد')) {
      return {
        reply: isAr
          ? `✅ **بخصوص الاعتماد و CTC:**\n\nكافة الدورات مبنية على مشاريع حقيقية ومصادق عليها من طرف **الهيئة الوطنية للرقابة التقنية للبناء (CTC)** في مختلف ولايات الوطن. النوتات الحسابية والمخططات تتوافق 100% مع القوانين الجزائرية: RPA 2024، CBA 93، و RNV 2013.\n\nكما يحصل كل مسجل على **شهادة تكوين موثقة** وملفات العمل الأصلية (Modèles .rtd و .edb وملفات إكسل).`
          : `✅ **Conformité CTC & Attestation :**\n\nTous nos cours sont basés sur des projets réels validés CTC, respectant scrupuleusement les normes algériennes (RPA 2024, CBA 93, RNV 2013). Une attestation de formation certifiée est remise à la fin du cursus.`,
      };
    }

    // Default polite comprehensive response
    return {
      reply: isAr
        ? `أهلاً بك! في **GC58 FORMATIONS** نوفر لك تكويناً عملياً وتطبيقياً 100%:\n\n1. دورات **الخرسانة المسلحة** (Robot و ETABS) مع أ. صالحي حسين بـ 3000 دج فقط.\n2. دورات **الشاربونت ميتاليك** (Robot, Tekla, IDEA StatiCa) مع أ. أيمن سعد الله بـ 5000 دج فقط.\n3. دورات **الطرقات والـ VRD** (Piste, Covadis) بـ 5000 دج.\n\nللدفع، تتوفر وسيلة **بريدي موب** السريعة (\`00799999002361295068\`) أو **CCP**. فور التسجيل، تستلم قسيمتك وترسلها للأدمن على الواتساب (\`${sitePhone}\`).\n\nهل ترغب في ترشيح دورة معينة لك؟`
        : `Sur GC58 FORMATIONS, nous vous accompagnons vers la maîtrise technique avec nos experts (Ing. Hocine Salehi pour le Béton Armé et Ing. Aymen Saadallah pour la Charpente Métallique). Paiement direct par BaridiMob (00799999002361295068) ou CCP. Souhaitez-vous une recommandation spécifique ?`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Attempt backend proxy to Gemini API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userMessage: query,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          // Identify if a specific course should be recommended
          let matchedCourse: Course | undefined;
          const lowerReply = data.reply.toLowerCase();
          const lowerQuery = query.toLowerCase();
          if (lowerQuery.includes('شاربونت') || lowerQuery.includes('metal') || lowerReply.includes('شاربونت')) {
            matchedCourse = courses.find((c) => c.category === 'charpente_metallique');
          } else if (lowerQuery.includes('خرسانة') || lowerQuery.includes('بيطون') || lowerReply.includes('خرسانة')) {
            matchedCourse = courses.find((c) => c.category === 'beton_arme');
          } else if (lowerQuery.includes('طرق') || lowerQuery.includes('vrd')) {
            matchedCourse = courses.find((c) => c.category === 'routes_vrd');
          }

          setMessages((prev) => [
            ...prev,
            {
              id: 'msg-bot-' + Date.now(),
              sender: 'bot',
              text: data.reply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              suggestedCourseId: matchedCourse?.id,
            },
          ]);
          setIsLoading(false);
          return;
        }
      }
      throw new Error('API offline, using intelligent fallback');
    } catch {
      // Fallback to intelligent local reasoning engine
      const { reply, suggestedCourseId } = generateOfflineAdvice(query);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-bot-' + Date.now(),
            sender: 'bot',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedCourseId,
          },
        ]);
        setIsLoading(false);
      }, 450);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickPrompts = isAr ? QUICK_PROMPTS_AR : QUICK_PROMPTS_FR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  GC58 AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  {isAr ? 'مستشار مباشر' : 'En ligne'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'مستشارك الهندسي 24/7 حول الدورات، الأسعار وطرق الدفع' : 'Conseils techniques, formations et paiement BaridiMob'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isAr ? 'إغلاق' : 'Fermer'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300 overflow-x-auto gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">{isAr ? 'خرسانة مسلحة:' : 'Béton Armé :'}</span>
            <span className="text-amber-400 font-mono font-bold">3 000 DA</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">{isAr ? 'شاربونت ميتاليك:' : 'Charpente :'}</span>
            <span className="text-amber-400 font-mono font-bold">5 000 DA</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">{isAr ? 'بريدي موب و CCP متوفر' : 'BaridiMob & CCP'}</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const recCourse = msg.suggestedCourseId ? courses.find((c) => c.id === msg.suggestedCourseId) : undefined;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? (isAr ? 'flex-row' : 'flex-row-reverse') : (isAr ? 'flex-row-reverse' : 'flex-row')}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2.5 ${isUser ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-none'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* If the bot recommends a course, show a 1-click order card inside the chat */}
                  {recCourse && !isUser && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg">
                      <div className="truncate text-left">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">
                          {isAr ? 'دورة مقترحة لك' : 'Formation suggérée'}
                        </span>
                        <h4 className="font-bold text-white text-xs truncate">{recCourse.title}</h4>
                        <span className="text-xs font-mono font-black text-amber-300">
                          {recCourse.price.toLocaleString()} DA
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectCourseForEnroll(recCourse);
                        }}
                        className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <span>{isAr ? 'طلب الدورة الآن' : 'Commander'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 block px-1">{msg.time}</span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className={`flex gap-3 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs">{isAr ? 'المهندس المستشار يكتب الرد الآن...' : 'L’assistant formule sa réponse...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="py-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:text-amber-300 text-[11px] text-slate-300 font-medium shrink-0 transition-colors border border-slate-700/60"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isAr ? 'اكتب سؤالك هنا بخصوص الدورات، البرامج، أو الدفع ببريدي موب...' : 'Posez votre question sur les cours, prix ou paiement...'}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0"
          >
            <span>{isAr ? 'إرسال' : 'Envoyer'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

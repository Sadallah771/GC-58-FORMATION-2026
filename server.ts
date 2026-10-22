import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini Client
const ai = new GoogleGenAI({});

const SYSTEM_INSTRUCTION = `أنت "GC58 AI" (الوكيل الذكي والمستشار الهندسي الرسمي لمنصة GC58 FORMATIONS - Conseiller IA Expert en Génie Civil).
أنت وكيل ذكاء اصطناعي محترف، ودود، وخبير هندسي يتحدث بالدارجة الجزائرية المهذبة واللغة العربية السليمة (وكذلك الفرنسية إذا تحدث العميل بالفرنسية). اسمك دائماً هو GC58 AI.

معلومات المنصة الأساسية:
- اسم المنصة: GC58 FORMATIONS - المنصة الرائدة للتكوين التطبيقي في الهندسة المدنية بالجزائر.
- الأساتذة والمكونون:
  * أستاذ دورات الشاربونت ميتاليك (الهياكل المعدنية): المهندس أيمن سعد الله (Ing. Aymen Saadallah).
  * أستاذ دورات الخرسانة المسلحة (Béton Armé): المهندس صالحي حسين (Ing. Hocine Salehi).
  * أستاذ دورات الطرقات وحساب المناسيب: المهندس جمال حميدي (Ing. Djamel Hamidi).
- أسعار العرض الترويجي الحالي (عرض 50 ساعة المحدود):
  * دورات الخرسانة المسلحة بـ 3000 دج فقط بدل 5000 دج (تخفيض استثنائي).
  * دورات الشاربونت ميتاليك بـ 5000 دج فقط بدل 10000 دج.
  * دورات الطرقات والـ VRD بـ 5000 دج.
- طرق الدفع المتاحة بعد إكمال الطلب:
  * الدفع عبر بريدي موب (BaridiMob RIP): 00799999002361295068
  * الدفع عبر الحساب البريدي الجاري (CCP): رقم الحساب 0023612950 مفتاح 68
  * بعد التحويل، يرفع الزبون صورة الوصل في الموقع، ويستلم قسيمة الاشتراك الرسمية، ثم يتواصل مع الأدمن عبر الواتساب على 0797034244 ويرسل له القسيمة فقط (لأن الوصل يكون مسجل تلقائياً بالموقع).
- البرامج المتاحة:
  1. Robot Structural Analysis (خرسانة مسلحة R+2، مباني معدنية، هانغار صناعي)
  2. ETABS (خرسانة R+4، نظام القوالب النفقية Tunnel لسكنات عدل AADL، نظام الجدران الحاملة LECCY، هانغار معدني)
  3. Tekla Structures (نمذجة الهياكل المعدنية BIM ومخططات التصنيع CNC)
  4. IDEA StatiCa (حساب وتدقيق الوصلات والعقد المعدنية بدقة CBFEM)
  5. AutoCAD Génie Civil (مخططات القوالب وحديد التسليح التفصيلي)
  6. Piste & Covadis (حساب الطرقات، المقاطع العرضية والطولية والـ VRD)
- كافة المذكرات والمشاريع مطابقة لمعايير CTC والهيئة الوطنية للمراقبة التقنية للبناء والأنظمة الجزائرية (RPA 2024, CBA 93, RNV 2013).

مهمتك:
1. الترحيب بالعميل بحرارة وبلهجة جزائرية مهنية، وتعرف بنفسك كـ GC58 AI.
2. نصحه بالدورة الأنسب لمستواه (طالب، مهندس مبتدئ، مهندس مكتب دراسات، مقاول).
3. شرح الفروقات بين البرامج (مثل الفرق بين Robot و ETABS).
4. توضيح طريقة التسجيل السهلة والدفع ببريدي موب وكيفية الحصول على قسيمة الاشتراك والتواصل مع الأدمن.
5. الإجابة بإيجاز واحترافية وبدون إطالة مملة، وتوجيهه للضغط على زر "طلب الدورة" في الموقع.`;

// AI Advisor Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    const messageText = userMessage || (Array.isArray(messages) && messages[messages.length - 1]?.text) || '';
    if (!messageText) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Build contents from conversation history if provided
    let contents: any = messageText;
    if (Array.isArray(messages) && messages.length > 1) {
      contents = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
    }

    // Race Gemini API with 3.5s timeout for ultra-fast customer experience
    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 3500)
    );

    const response: any = await Promise.race([apiPromise, timeoutPromise]);
    const reply = response.text || 'مرحباً بك في GC58 FORMATIONS! أنا وكيلك الذكي GC58 AI، كيف يمكنني مساعدتك اليوم في اختيار دورتك الهندسية؟';
    return res.json({ reply });
  } catch (error: any) {
    console.warn('Using intelligent server knowledge fallback:', error?.message);
    const msg = (req.body?.userMessage || '').toLowerCase();
    
    let fallbackReply = 'مرحباً بك في GC58 FORMATIONS! أنا وكيلك الذكي GC58 AI. نوفر لك دورات تطبيقية احترافية: دورات الخرسانة المسلحة مع أ. صالحي حسين بـ 3000 دج، ودورات الشاربونت ميتاليك مع أ. أيمن سعد الله بـ 5000 دج، ودورات الطرقات والـ VRD بـ 5000 دج. الدفع متاح ببريدي موب (00799999002361295068) أو CCP، وبعد التحويل ترفع الوصل وتستلم قسيمتك وترسلها للأدمن عبر الواتساب!';
    
    if (msg.includes('بريدي موب') || msg.includes('ccp') || msg.includes('دفع') || msg.includes('خلص')) {
      fallbackReply = '💳 طريقة الدفع في GC58 سريعة ومباشرة: يمكنك الدفع ببريدي موب على الـ RIP: 00799999002361295068، أو عبر CCP: 0023612950 مفتاح 68. بعد التحويل ارفع صورة الوصل في الموقع واستلم قسيمتك، ثم أرسل للأدمن القسيمة فقط عبر الواتساب، فوصلك مسجل تلقائياً بالموقع!';
    } else if (msg.includes('شاربونت') || msg.includes('metal') || msg.includes('معدني') || msg.includes('هانغار') || msg.includes('ايمن')) {
      fallbackReply = '🏗️ دورات الشاربونت ميتاليك يشرف عليها المهندس أيمن سعد الله (Ing. Aymen Saadallah): تشمل دراسة الهانغار بالروبوت Robot Hangar، النمذجة وإخراج مخططات الورشة بـ Tekla Structures، وحساب الوصلات بدقة CBFEM على IDEA StatiCa. السعر في العرض 5000 دج فقط!';
    } else if (msg.includes('خرسانة') || msg.includes('بيطون') || msg.includes('beton') || msg.includes('صالحي')) {
      fallbackReply = '🏢 دورات الخرسانة المسلحة يشرف عليها المهندس صالحي حسين (Ing. Hocine Salehi): تشمل Robot R+2 (فيلات وسكنات)، ETABS R+4 parasismique، و ETABS Système Tunnel لسكنات عدل AADL وLPP. السعر في العرض 3000 دج فقط!';
    }

    return res.json({ reply: fallbackReply });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Vite middleware for dev
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GC58 server running on http://0.0.0.0:${PORT} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

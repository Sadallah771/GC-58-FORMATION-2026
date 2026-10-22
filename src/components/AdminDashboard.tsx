import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Search, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Download, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw, 
  Plus, 
  Layers, 
  User, 
  AlertCircle,
  Settings,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Image,
  TrendingUp,
  MapPin,
  FileCheck,
  LogIn,
  X
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, ADMIN_EMAIL } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Course, Language, Registration, RegistrationStatus } from '../types';
import { COURSES_DATA } from '../data/coursesData';

interface AdminDashboardProps {
  language: Language;
  courses: Course[];
  onUpdateCourses: (updatedCourses: Course[]) => void;
  sitePhone: string;
  onUpdateSitePhone: (newPhone: string) => void;
  onCloseAdmin: () => void;
  onOpenAuth: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  courses,
  onUpdateCourses,
  sitePhone,
  onUpdateSitePhone,
  onCloseAdmin,
  onOpenAuth,
}) => {
  const { user, isAdmin, isMasterAdmin, loginGoogle, loginAsMasterAdmin } = useAuth();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'courses' | 'settings'>('analytics');
  const [orders, setOrders] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RegistrationStatus>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Course editing state including image
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [photoModalCourse, setPhotoModalCourse] = useState<Course | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhoneInput, setNewPhoneInput] = useState(sitePhone);

  // Receipt modal viewer state
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<Registration | null>(null);

  // Real-time Firestore sync for registrations
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: Registration[] = [];
          snapshot.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as Registration) });
          });
          setOrders(loaded);
          setLoading(false);
        },
        () => setLoading(false)
      );
    } catch {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // If user is not logged in as the master admin sadallah771@gmail.com, show access denied / login prompt
  if (!isAdmin) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'منطقة مخصصة للأدمين فقط' : 'Accès réservé à l’Administrateur'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {isAr ? (
                <>
                  هذه اللوحة محمية وخاصة بصاحب الموقع:
                  <br />
                  <span className="font-mono text-amber-400 font-bold block mt-1">{ADMIN_EMAIL}</span>
                  العملاء والزوار لا يمكنهم الوصول أو التعديل. سجل دخولك بهذا البريد لفتح اللوحة.
                </>
              ) : (
                <>
                  Cette section est strictement réservée au propriétaire du site : <strong>{ADMIN_EMAIL}</strong>.
                </>
              )}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Direct 1-Click Login for sadallah771@gmail.com */}
            <button
              onClick={() => loginAsMasterAdmin()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span>{isAr ? 'فتح لوحة التحكم فوراً (sadallah771@gmail.com)' : 'Ouvrir l’administration (sadallah771@gmail.com)'}</span>
            </button>

            <button
              onClick={async () => {
                try {
                  await loginGoogle();
                } catch {
                  await loginAsMasterAdmin();
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isAr ? 'دخول بحساب Google (المالك)' : 'Connexion Google (Admin)'}</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              {isAr ? 'العودة للموقع الرئيسي' : 'Retour au site'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const updateOrderStatus = async (orderId: string, newStatus: RegistrationStatus) => {
    try {
      const orderRef = doc(db, 'registrations', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      showNotification(isAr ? 'تم تحديث حالة الطلب بنجاح' : 'Statut mis à jour avec succès');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `registrations/${orderId}`);
    }
  };

  const saveNotes = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'registrations', orderId);
      await updateDoc(orderRef, {
        notes: tempNotes,
        updatedAt: new Date().toISOString(),
      });
      setEditingNotesId(null);
      showNotification(isAr ? 'تم حفظ الملاحظات' : 'Note sauvegardée');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `registrations/${orderId}`);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب نهائياً من السجل؟' : 'Supprimer définitivement cette commande ?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'registrations', orderId));
      showNotification(isAr ? 'تم حذف الطلب بنجاح' : 'Commande supprimée avec succès');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `registrations/${orderId}`);
    }
  };

  // Bulk delete completed / paid orders ("باش يفرغ و ينحي لي شراو")
  const deletePaidOrders = async () => {
    const paidOrders = orders.filter((o) => o.status === 'paye');
    if (paidOrders.length === 0) {
      alert(isAr ? 'لا توجد طلبات مسددة (Payé) في السجل حالياً لحذفها' : 'Aucune commande payée à supprimer');
      return;
    }
    if (!window.confirm(isAr 
      ? `هل أنت متأكد من حذف وإفراغ جميع الطلبات التي تم تسديدها وشراؤها (${paidOrders.length} طلب) لتنظيف السجل؟` 
      : `Supprimer et archiver toutes les commandes payées (${paidOrders.length}) ?`)) {
      return;
    }
    try {
      for (const ord of paidOrders) {
        if (ord.id) {
          await deleteDoc(doc(db, 'registrations', ord.id));
        }
      }
      showNotification(isAr ? `تم إفراغ وحذف ${paidOrders.length} طلب تم شراؤه بنجاح` : `${paidOrders.length} commandes supprimées`);
    } catch (err) {
      console.error('Error deleting paid orders:', err);
    }
  };

  const deleteCancelledOrders = async () => {
    const cancelled = orders.filter((o) => o.status === 'annule');
    if (cancelled.length === 0) {
      alert(isAr ? 'لا توجد طلبات ملغاة لحذفها' : 'Aucune commande annulée');
      return;
    }
    if (!window.confirm(isAr ? `حذف ${cancelled.length} طلب ملغى نهائياً؟` : `Supprimer ${cancelled.length} commandes annulées ?`)) {
      return;
    }
    try {
      for (const ord of cancelled) {
        if (ord.id) {
          await deleteDoc(doc(db, 'registrations', ord.id));
        }
      }
      showNotification(isAr ? 'تم حذف الطلبات الملغاة بنجاح' : 'Commandes annulées supprimées');
    } catch (err) {
      console.error('Error deleting cancelled orders:', err);
    }
  };

  // Dedicated Course Photo Changer
  const openPhotoModal = (course: Course) => {
    setPhotoModalCourse(course);
    setNewPhotoUrl(course.thumbnail);
  };

  const saveCoursePhoto = async () => {
    if (!photoModalCourse || !newPhotoUrl.trim()) return;
    const targetId = photoModalCourse.id;
    const cleanUrl = newPhotoUrl.trim();
    const updated = courses.map((c) => (c.id === targetId ? { ...c, thumbnail: cleanUrl } : c));
    onUpdateCourses(updated);

    try {
      await setDoc(doc(db, 'site_courses', targetId), {
        thumbnail: cleanUrl,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      showNotification(isAr ? 'تم تغيير صورة الدورة وتحديثها فوراً في الموقع!' : 'Photo de la formation mise à jour');
    } catch (err) {
      console.warn('Firestore photo update note:', err);
    }

    setPhotoModalCourse(null);
  };

  // Save modified course including image
  const handleSaveCourseChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const updated = courses.map((c) => (c.id === editingCourse.id ? editingCourse : c));
    onUpdateCourses(updated);

    try {
      await setDoc(doc(db, 'site_courses', editingCourse.id), {
        title: editingCourse.title,
        price: editingCourse.price,
        software: editingCourse.software,
        durationHours: editingCourse.durationHours,
        category: editingCourse.category,
        thumbnail: editingCourse.thumbnail,
        isActive: editingCourse.isActive ?? true,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Saved in state, Firestore sync note:', err);
    }

    setEditingCourse(null);
    showNotification(isAr ? 'تم تحديث بيانات الدورة وصورتها بنجاح في الموقع' : 'Formation et image mises à jour');
  };

  const toggleCourseActive = async (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    if (!target) return;
    const newActiveState = target.isActive === false ? true : false;
    const updated = courses.map((c) => (c.id === courseId ? { ...c, isActive: newActiveState } : c));
    onUpdateCourses(updated);

    try {
      await setDoc(doc(db, 'site_courses', courseId), {
        isActive: newActiveState,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn(err);
    }

    showNotification(newActiveState ? (isAr ? 'تم إظهار الدورة' : 'Activée') : (isAr ? 'تم إخفاء الدورة' : 'Masquée'));
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhoneInput.trim().replace(/\s+/g, '');
    onUpdateSitePhone(cleanPhone);
    try {
      await setDoc(doc(db, 'site_settings', 'general'), {
        phone: cleanPhone,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn(e);
    }
    showNotification(isAr ? `تم تحديث رقم الهاتف والواتساب إلى ${cleanPhone}` : `Numéro mis à jour : ${cleanPhone}`);
  };

  // Professional Excel Export for Registrations
  const exportToExcel = () => {
    if (orders.length === 0) {
      showNotification(isAr ? 'لا توجد طلبات لتصديرها حالياً' : 'Aucune commande à exporter');
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const tableRows = orders.map((o, idx) => {
      const formattedDate = o.createdAt ? new Date(o.createdAt).toLocaleString('fr-FR') : '';
      const statusLabel = 
        o.status === 'paye' ? 'تم الدفع (Payé)' :
        o.status === 'confirme' ? 'مؤكد (Confirmé)' :
        o.status === 'appele' ? 'تم الاتصال (Appelé)' :
        o.status === 'annule' ? 'ملغى (Annulé)' : 'في الانتظار (En attente)';
      const payMethod = o.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob)' : 'حساب CCP';
      const hasReceipt = o.receiptUrl ? 'نعم (مرفق بالموقع)' : 'لا';
      const voucher = o.voucherCode || (o.id ? `GC58-${o.id.slice(0, 6).toUpperCase()}` : `GC58-${idx + 1}`);

      return `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold; background-color: #f8fafc;">${voucher}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${formattedDate}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${o.fullName}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@'; font-family: monospace;">${o.phone}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${o.email}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${o.wilaya}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${o.courseNames}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: bold; color: #b45309;">${o.totalAmount.toLocaleString()} DZD</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${payMethod}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: ${o.receiptUrl ? '#15803d' : '#64748b'}; font-weight: bold;">${hasReceipt}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${statusLabel}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${o.notes || ''}</td>
        </tr>
      `;
    }).join('');

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Inscriptions GC58</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          th { background-color: #0f172a; color: #f59e0b; font-weight: bold; padding: 10px; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <h2 style="color: #0f172a; font-family: Arial, sans-serif;">GC58 FORMATIONS - سجل المسجلين والطلبات (${dateStr})</h2>
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px;">
          <thead>
            <tr>
              <th>رمز القسيمة (Code Bon)</th>
              <th>تاريخ التسجيل (Date)</th>
              <th>الاسم واللقب (Nom & Prénom)</th>
              <th>رقم الهاتف (Téléphone)</th>
              <th>البريد الإلكتروني (Email)</th>
              <th>الولاية (Wilaya)</th>
              <th>الدورات المختارة (Formations)</th>
              <th>المبلغ الإجمالي (Montant DZD)</th>
              <th>طريقة الدفع (Mode de Paiement)</th>
              <th>وصل التحويل (Reçu)</th>
              <th>الحالة (Statut)</th>
              <th>ملاحظات الأدمين (Notes)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GC58_FORMATIONS_Inscriptions_${dateStr}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(isAr ? 'تم تصدير ملف الإكسل الاحترافي بنجاح!' : 'Fichier Excel exporté avec succès !');
  };

  // KPIs
  const totalOrders = orders.length;
  const pendingCalls = orders.filter((o) => o.status === 'en_attente').length;
  const confirmedOrders = orders.filter((o) => o.status === 'confirme' || o.status === 'paye').length;
  const totalRevenuePotential = orders.reduce((acc, o) => acc + (o.status !== 'annule' ? o.totalAmount : 0), 0);
  const totalRevenuePaid = orders.filter((o) => o.status === 'paye').reduce((acc, o) => acc + o.totalAmount, 0);

  // Group by Wilaya
  const wilayaCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const w = o.wilaya.split('-')[0].trim() || 'Inconnue';
    wilayaCounts[w] = (wilayaCounts[w] || 0) + 1;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = 
      searchQuery.trim() === '' ||
      o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.wilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.courseNames.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Preset Civil Engineering Images for quick selection
  const imagePresets = [
    { label: 'Chantier Béton Armé', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tour R+4 Béton', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { label: 'Hangar Charpente', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Structure Métallique', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' },
    { label: 'BIM / Tekla Steel', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80' },
    { label: 'Assemblages & Usinage', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
    { label: 'Routes & Voirie Piste', url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Plans & Dessin AutoCAD', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin: {ADMIN_EMAIL}</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              {isAr ? 'صلاحيات المالك مفعلة' : 'Accès Master Propriétaire'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            {isAr ? 'لوحة تحكم الموقع الشاملة وإدارة الدورات' : 'Tableau de Bord & Gestion Générale'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr
              ? 'متابعة كل ما يجري في موقعك: الطلبات الواردة، قسائم الطلاب، تعديل الدورات والأسعار والصور مباشرة'
              : 'Supervisez l’activité en direct, gérez les bons de commande et personnalisez les cours et images'}
          </p>
        </div>

        <button
          onClick={onCloseAdmin}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs"
        >
          {isAr ? 'العودة للموقع الرئيسي' : 'Retour au site'}
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-fit">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isAr ? 'إحصائيات الموقع والنشاط' : 'Activité & Statistiques'}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{isAr ? `قسائم وطلبات الطلاب (${totalOrders})` : `Commandes & Reçus (${totalOrders})`}</span>
          {pendingCalls > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
              {pendingCalls}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{isAr ? `تعديل الدورات والأسعار والصور (${courses.length})` : `Éditer Cours, Prix & Photos (${courses.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{isAr ? 'رقم الهاتف والواتساب' : 'Téléphone & Contact'}</span>
        </button>
      </div>

      {/* TAB 1: SITE ANALYTICS & ACTIVITY LOG */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">{isAr ? 'إجمالي الطلبات' : 'Total Inscriptions'}</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                <span dir="ltr" className="font-mono inline-block">{totalOrders}</span>
              </div>
              <span className="text-[11px] text-slate-500">{isAr ? 'طالب مسجل بقسيمة رسمية' : 'Dossiers enregistrés'}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 ring-1 ring-amber-500/20">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                {isAr ? 'في انتظار التأكيد عبر الواتساب' : 'En attente de finalisation'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                <span dir="ltr" className="font-mono inline-block">{pendingCalls}</span>
              </div>
              <span className="text-[11px] text-slate-400">{isAr ? 'قسائم قيد الاستقبال' : 'Bons de commande en attente'}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">{isAr ? 'المداخيل المؤكدة والمسددة' : 'Revenu Encaissé'}</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                <span dir="ltr" className="font-mono inline-block">{totalRevenuePaid.toLocaleString()}</span>{' '}
                <span className="text-xs text-slate-400 font-bold">دج</span>
              </div>
              <span className="text-[11px] text-emerald-500/80">BaridiMob, CCP, Espèces</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">{isAr ? 'إجمالي المداخيل المتوقعة' : 'Potentiel Total'}</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                <span dir="ltr" className="font-mono inline-block">{totalRevenuePotential.toLocaleString()}</span>{' '}
                <span className="text-xs text-slate-400 font-bold">دج</span>
              </div>
              <span className="text-[11px] text-slate-400">{confirmedOrders} {isAr ? 'طلب مؤكد ومسجل' : 'commandes validées'}</span>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Registrations stream */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'آخر النشاطات والطلبات المسجلة' : 'Dernières inscriptions en direct'}</span>
              </h3>
              <div className="space-y-2.5">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{ord.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{ord.courseNames}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-amber-400 font-bold">
                        <span dir="ltr" className="inline-block">{ord.totalAmount.toLocaleString()}</span> دج
                      </span>
                      <span className="block text-[10px] text-slate-500">{ord.wilaya.split('-')[1] || ord.wilaya}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats by wilaya */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'توزيع الطلبات حسب الولايات' : 'Répartition des étudiants'}</span>
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {Object.entries(wilayaCounts).map(([wCode, count]) => (
                  <div key={wCode} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/50">
                    <span className="text-slate-300 font-medium">Wilaya {wCode}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
                      {count} {isAr ? 'طلب' : 'dossiers'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT & VOUCHERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'all', labelFr: 'Tous', labelAr: 'الكل', count: orders.length },
                { id: 'en_attente', labelFr: 'En attente', labelAr: 'في انتظار التأكيد', count: pendingCalls },
                { id: 'appele', labelFr: 'Appelé', labelAr: 'تم الاتصال به', count: orders.filter(o => o.status === 'appele').length },
                { id: 'confirme', labelFr: 'Confirmé', labelAr: 'مؤكد', count: orders.filter(o => o.status === 'confirme').length },
                { id: 'paye', labelFr: 'Payé', labelAr: 'تم الدفع', count: orders.filter(o => o.status === 'paye').length },
                { id: 'annule', labelFr: 'Annulé', labelAr: 'ملغى', count: orders.filter(o => o.status === 'annule').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{isAr ? tab.labelAr : tab.labelFr}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-mono">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث بالاسم، الهاتف...' : 'Recherche nom, tél...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Delete Paid Orders (تنظيف وإفراغ من اشتروا) */}
              <button
                onClick={deletePaidOrders}
                className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                title={isAr ? 'إفراغ وحذف جميع الطلبات التي تم تسديدها وشراؤها لتنظيف السجل' : 'Supprimer les commandes payées'}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAr ? 'إفراغ من اشتروا (Payé)' : 'Vider Payés'}</span>
              </button>

              {/* Delete Cancelled */}
              <button
                onClick={deleteCancelledOrders}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                title={isAr ? 'إفراغ الطلبات الملغاة' : 'Vider Annulés'}
              >
                <Trash2 className="w-3 h-3 text-slate-500" />
                <span>{isAr ? 'إفراغ الملغاة' : 'Annulés'}</span>
              </button>

              <button
                onClick={exportToExcel}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                title="تصدير السجل الكامل إلى ملف إكسل احترافي منسق"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تصدير Excel (احترافي)' : 'Exporter Excel'}</span>
              </button>
            </div>
          </div>

          {/* Orders Cards */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                <span>{isAr ? 'جاري تحميل الطلبات...' : 'Chargement...'}</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <User className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-300">
                  {isAr ? 'لا توجد طلبات تطابق الفلتر' : 'Aucune inscription'}
                </h4>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isEditingNotes = editingNotesId === order.id;
                const algerianIntPhone = order.phone.replace(/^0/, '213');
                const voucherCode = order.id ? `GC-${order.id.slice(0, 6).toUpperCase()}` : 'GC-2026';

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      order.status === 'en_attente'
                        ? 'bg-slate-900/95 border-amber-500/50 shadow-lg shadow-amber-500/5'
                        : 'bg-slate-900/70 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Student Info & Voucher Badge */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono font-black text-xs">
                            #{voucherCode}
                          </span>
                          <span className="font-extrabold text-base text-white">{order.fullName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {order.statusEducation}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10">
                            {order.wilaya}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-medium flex items-start gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{order.courseNames}</span>
                        </div>

                        {/* Payment Method & Receipt Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            💳 {order.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob)' : 'حساب CCP'}
                          </span>

                          {order.receiptUrl ? (
                            <button
                              onClick={() => {
                                setViewingReceiptUrl(order.receiptUrl || null);
                                setViewingReceiptOrder(order);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="عرض صورة وصل التحويل المرفقة"
                            >
                              <Image className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isAr ? 'عرض وصل الدفع (📷)' : 'Voir le reçu (📷)'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">
                              {isAr ? 'لم يرفق وصل بعد' : 'Pas de reçu joint'}
                            </span>
                          )}
                        </div>

                        {order.notes && (
                          <p className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 inline-block">
                            <strong className="text-slate-300">{isAr ? 'ملاحظة الطالب:' : 'Note :'}</strong> {order.notes}
                          </p>
                        )}
                      </div>

                      {/* Pricing, Status & Direct Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-black text-amber-400">
                            <span dir="ltr" className="font-mono inline-block">{order.totalAmount.toLocaleString()}</span>{' '}
                            <span className="text-xs text-slate-400">دج</span>
                          </div>
                        </div>

                        <select
                          value={order.status}
                          onChange={(e) => order.id && updateOrderStatus(order.id, e.target.value as RegistrationStatus)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                            order.status === 'en_attente'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : order.status === 'appele'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : order.status === 'confirme'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : order.status === 'paye'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <option value="en_attente" className="bg-slate-900 text-amber-400">
                            {isAr ? 'في انتظار التأكيد' : 'En attente'}
                          </option>
                          <option value="appele" className="bg-slate-900 text-blue-400">
                            {isAr ? 'تم الاتصال به' : 'Appelé'}
                          </option>
                          <option value="confirme" className="bg-slate-900 text-purple-400">
                            {isAr ? 'مؤكد' : 'Confirmé'}
                          </option>
                          <option value="paye" className="bg-slate-900 text-emerald-400">
                            {isAr ? 'مدفوع ومسجل' : 'Payé'}
                          </option>
                          <option value="annule" className="bg-slate-900 text-rose-400">
                            {isAr ? 'ملغى' : 'Annulé'}
                          </option>
                        </select>

                        {/* Call with LTR phone */}
                        <a
                          href={`tel:${order.phone}`}
                          className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20 flex items-center gap-1.5 text-xs"
                          title={`Appeler le ${order.phone}`}
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span dir="ltr" className="font-mono inline-block">{order.phone}</span>
                        </a>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
                            `Salam ${order.fullName}, c'est l'administration de GC58 FORMATIONS concernant votre bon de commande #${voucherCode} pour la formation : ${order.courseNames}. Êtes-vous disponible ?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors flex items-center justify-center shadow-md shadow-[#25D366]/20"
                          title="WhatsApp direct"
                        >
                          <MessageSquare className="w-4 h-4 fill-white" />
                        </a>

                        <button
                          onClick={() => order.id && deleteOrder(order.id)}
                          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/60 hover:bg-rose-950/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
                          title={isAr ? 'حذف هذا التسجيل نهائياً من السجل' : 'Supprimer'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>{isAr ? 'حذف' : 'Supprimer'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      {isEditingNotes ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder={isAr ? 'اكتب ملاحظة المكالمة...' : 'Note de suivi...'}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={() => order.id && saveNotes(order.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center gap-1 text-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isAr ? 'حفظ' : 'Sauvegarder'}</span>
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
                          >
                            {isAr ? 'إلغاء' : 'Annuler'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] text-slate-500 italic">
                            {order.notes ? (
                              <>
                                <span className="text-amber-400/90 font-semibold">{isAr ? 'ملاحظة الأدمين:' : 'Note :'}</span> {order.notes}
                              </>
                            ) : (
                              isAr ? 'لا توجد ملاحظة للمكالمة بعد' : 'Aucune note enregistrée'
                            )}
                          </span>
                          <button
                            onClick={() => {
                              setEditingNotesId(order.id || null);
                              setTempNotes(order.notes || '');
                            }}
                            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{isAr ? 'تعديل الملاحظة' : 'Modifier la note'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EDIT COURSES, PRICES & IMAGES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white">
              {isAr ? 'تعديل الدورات والأسعار والصور المعروضة في الموقع' : 'Édition des Formations, Tarifs & Photos'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'يمكنك تغيير سعر أي دورة، تغيير صورتها عبر الرابط أو اختيار صورة هندسية من القائمة، وإخفاء أو إظهار الدورات.'
                : 'Modifiez les prix, changez l’image de chaque cours, et contrôlez l’affichage sur le site.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const isHidden = course.isActive === false;

              return (
                <div
                  key={course.id}
                  className={`p-4 rounded-2xl border transition-all flex gap-4 ${
                    isHidden
                      ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {/* Thumbnail Preview */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setEditingCourse({ ...course })}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 hover:opacity-100 flex items-center justify-center text-amber-400 transition-opacity"
                      title="Changer l'image"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-400">
                          {course.software}
                        </span>
                        <div className="text-base font-black text-amber-400">
                          <span dir="ltr" className="font-mono inline-block">{course.price.toLocaleString()}</span>{' '}
                          <span className="text-xs text-slate-400">دج</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white mt-1 line-clamp-1">{course.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{course.durationHours} Heures • {course.instructor.name}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => openPhotoModal(course)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[11px] font-bold flex items-center gap-1"
                        title={isAr ? 'تغيير صورة الدورة' : 'Modifier la photo'}
                      >
                        <Image className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isAr ? 'تغيير الصورة' : 'Photo'}</span>
                      </button>

                      <button
                        onClick={() => setEditingCourse({ ...course })}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تعديل السعر' : 'Modifier'}</span>
                      </button>

                      <button
                        onClick={() => toggleCourseActive(course.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                          isHidden
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isHidden ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>{isAr ? 'إظهار' : 'Afficher'}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>{isAr ? 'إخفاء' : 'Masquer'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Course & Image Dialog */}
          {editingCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-400" />
                    <span>{isAr ? 'تعديل الدورة والصورة' : 'Modifier cours & image'}</span>
                  </h3>
                  <button
                    onClick={() => setEditingCourse(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveCourseChanges} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'عنوان الدورة' : 'Titre de la formation'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {isAr ? 'السعر بالدينار (دج) *' : 'Prix (DZD) *'}
                      </label>
                      <input
                        type="number"
                        required
                        dir="ltr"
                        value={editingCourse.price}
                        onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono font-extrabold text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {isAr ? 'عدد الساعات' : 'Durée (Heures)'}
                      </label>
                      <input
                        type="number"
                        required
                        dir="ltr"
                        value={editingCourse.durationHours}
                        onChange={(e) => setEditingCourse({ ...editingCourse, durationHours: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Course Image URL & Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'رابط صورة الدورة (URL de l’image)' : 'Image de la formation (URL)'}
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={editingCourse.thumbnail}
                      onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                    />

                    {/* Image Preview */}
                    <div className="mt-2 h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                      <img
                        src={editingCourse.thumbnail}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute bottom-1 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-slate-300">
                        معاينة الصورة
                      </span>
                    </div>

                    {/* Presets */}
                    <div className="mt-3">
                      <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                        {isAr ? 'أو اختر صورة جاهزة من المكتبة الهندسية:' : 'Ou choisissez une photo prédéfinie :'}
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {imagePresets.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setEditingCourse({ ...editingCourse, thumbnail: preset.url })}
                            className="text-[10px] p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 truncate"
                            title={preset.label}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                    >
                      {isAr ? 'إلغاء' : 'Annuler'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                    >
                      {isAr ? 'حفظ وتطبيق في الموقع' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DEDICATED PHOTO CHANGER DIALOG */}
          {photoModalCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
              <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Image className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        {isAr ? 'تغيير صورة الدورة' : 'Changer l’image de la formation'}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{photoModalCourse.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPhotoModalCourse(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Current Preview */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'معاينة الصورة الحالية:' : 'Aperçu actuel :'}
                    </label>
                    <div className="h-40 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 relative">
                      <img
                        src={newPhotoUrl || photoModalCourse.thumbnail}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-xs font-bold text-white drop-shadow">
                          {photoModalCourse.software} • {photoModalCourse.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAr ? 'أدخل رابط الصورة (URL مباشر):' : 'URL de la nouvelle photo :'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Civil Engineering Curated Presets */}
                  <div>
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      {isAr ? 'أو اختر صورة احترافية من مكتبة الهندسة المدنية:' : 'Ou choisissez une photo dans la galerie BTP :'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {[
                        { label: 'Béton Armé R+2 Villa', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80' },
                        { label: 'ETABS Voiles R+4', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Coffrage Tunnel AADL', url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Système LECCY Voiles', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Charpente Bâtiment Métallique', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Hangar Métallique Industriel', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' },
                        { label: 'ETABS Hangar Spécialisé', url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Tekla Structures BIM Detailing', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Tekla Atelier & Usinage', url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80' },
                        { label: 'IDEA StatiCa Nœuds & Boulons', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
                        { label: 'AutoCAD Plans CTC & Ferraillage', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Piste 5 Tracé Routier', url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Covadis VRD & Assainissement', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewPhotoUrl(preset.url)}
                          className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                            newPhotoUrl === preset.url
                              ? 'bg-blue-500/20 border-blue-500 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <span className="truncate text-[11px]">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPhotoModalCourse(null)}
                      className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                    >
                      {isAr ? 'إلغاء' : 'Annuler'}
                    </button>
                    <button
                      type="button"
                      onClick={saveCoursePhoto}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20"
                    >
                      {isAr ? 'حفظ الصورة وتطبيقها فوراً في الموقع' : 'Appliquer l’image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isAr ? 'إعدادات رقم الهاتف والواتساب' : 'Numéro Officiel & WhatsApp'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'الرقم الذي يستقبل اتصالات ورسائل الواتساب وقسائم الطلاب' : 'Numéro d’envoi des bons de commande'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePhone} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'رقم الهاتف (0797034244) *' : 'Numéro de téléphone *'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={newPhoneInput}
                onChange={(e) => setNewPhoneInput(e.target.value)}
                placeholder="0797034244"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-base focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr
                  ? 'يتم تطبيق هذا الرقم تلقائياً في قسائم الطلبات، زر الواتساب، وأزرار الاتصال في كامل الموقع.'
                  : 'Ce numéro est utilisé sur tous les bons de commande et le bouton WhatsApp.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20"
            >
              {isAr ? 'حفظ وتحديث الرقم في الموقع' : 'Enregistrer le nouveau numéro'}
            </button>
          </form>
        </div>
      )}

      {/* High-Resolution Receipt Viewer Modal */}
      {viewingReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {isAr ? 'وصل التحويل المرفق' : 'Reçu de paiement'} - {viewingReceiptOrder?.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {viewingReceiptOrder?.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob)' : 'حساب CCP'} • {viewingReceiptOrder?.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setViewingReceiptUrl(null);
                  setViewingReceiptOrder(null);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 border border-slate-800/80 p-3 flex items-center justify-center min-h-[300px]">
              <img
                src={viewingReceiptUrl}
                alt="Reçu de virement"
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                {viewingReceiptOrder?.totalAmount.toLocaleString()} DZD • {viewingReceiptOrder?.wilaya}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={viewingReceiptUrl}
                  download={`recu_${viewingReceiptOrder?.phone || 'client'}.jpg`}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تحميل الصورة' : 'Télécharger'}</span>
                </a>

                <button
                  onClick={() => {
                    setViewingReceiptUrl(null);
                    setViewingReceiptOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {isAr ? 'إغلاق' : 'Fermer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

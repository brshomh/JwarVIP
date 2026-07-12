
export type Language = 'ar' | 'en';

const translations = {
  ar: {
    // Auth
    login_title: "تسجيل الدخول",
    create_account: "إنشاء حساب جديد",
    welcome_subtitle: "انضم إلى أقوى شبكة تواصل فيديو P2P حقيقية",
    full_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    age: "العمر",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    login_btn: "دخول",
    register_btn: "إنشاء حساب",
    no_account: "ليس لديك حساب؟ سجل الآن",
    have_account: "لديك حساب؟ تسجيل الدخول",
    
    // Home / Search
    searching: "جاري البحث...",
    next: "التالي",
    start_search: "بدء البحث",
    reconnect: "إعادة الاتصال بـ",
    any: "الكل",
    stop: "إنهاء",
    
    // Tabs
    home: "الرئيسية",
    messages: "الدردشات",
    profile: "الملف الشخصي",
    
    // Chat
    no_messages: "لا توجد محادثات سابقة",
    type_message: "اكتب رسالة...",
    online: "متصل الآن",
    
    // Profile & Store
    logout: "تسجيل خروج",
    buy_gems: "شحن مجوهرات",
    language: "اللغة / Language",
    store: "متجر المجوهرات",
    popular: "الأكثر طلباً",
    bonus: "مجوهرة إضافية",
    gems: "مجوهرة",
    cancel: "إلغاء",
    switch_free: "تحويل للبحث المجاني (الكل)",
    
    // Connection Status
    init_network: "جاري تهيئة الشبكة...",
    scanning: "مسح المستخدمين القريبين...",
    connected: "تم الاتصال",
    disconnected: "منقطع",
  },
  en: {
    // Auth
    login_title: "Login",
    create_account: "Create Account",
    welcome_subtitle: "Join the ultimate P2P video network",
    full_name: "Full Name",
    email: "Email Address",
    password: "Password",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    login_btn: "Login",
    register_btn: "Sign Up",
    no_account: "No account? Sign up",
    have_account: "Have an account? Login",
    
    // Home / Search
    searching: "Searching...",
    next: "Next",
    start_search: "Start Search",
    reconnect: "Reconnect with",
    any: "Any",
    stop: "End Call",
    
    // Tabs
    home: "Home",
    messages: "Chats",
    profile: "Profile",
    
    // Chat
    no_messages: "No chat history yet",
    type_message: "Type a message...",
    online: "Online",
    
    // Profile & Store
    logout: "Logout",
    buy_gems: "Buy Gems",
    language: "Language / اللغة",
    store: "Gem Store",
    popular: "Most Popular",
    bonus: "Bonus Gems",
    gems: "Gems",
    cancel: "Cancel",
    switch_free: "Switch to Free Search (Any)",
    
    // Connection Status
    init_network: "Initializing Network...",
    scanning: "Scanning nearby users...",
    connected: "Connected",
    disconnected: "Disconnected",
  }
};

export const i18n = {
  t: (key: string, lang: Language = 'ar'): string => {
    // @ts-ignore
    return translations[lang][key] || key;
  },
  
  getDir: (lang: Language): 'rtl' | 'ltr' => {
    return lang === 'ar' ? 'rtl' : 'ltr';
  }
};

import { create } from 'zustand';
import { Language } from '../types';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
];

const translations = {
  en: {
    'welcome': 'Welcome to AwakNow',
    'emotional_wellness': 'Your Journey to Emotional Wellness',
    'ai_video_sessions': 'AI Video Sessions',
    'personalized_conversations': 'Experience personalized conversations that understand and respond to your emotions',
    'start_journey': 'Start Your Journey',
    'reflect_alone': 'Reflect Alone',
    'resolve_together': 'Resolve With Someone',
    'settings': 'Settings',
    'sign_out': 'Sign Out'
  },
  es: {
    'welcome': 'Bienvenido a AwakNow',
    'emotional_wellness': 'Tu Viaje hacia el Bienestar Emocional',
    'ai_video_sessions': 'Sesiones de Video con IA',
    'personalized_conversations': 'Experimenta conversaciones personalizadas que entienden y responden a tus emociones',
    'start_journey': 'Comienza tu Viaje',
    'reflect_alone': 'Reflexionar Solo',
    'resolve_together': 'Resolver Juntos',
    'settings': 'Configuración',
    'sign_out': 'Cerrar Sesión'
  },
  fr: {
    'welcome': 'Bienvenue sur AwakNow',
    'emotional_wellness': 'Votre Voyage vers le Bien-être Émotionnel',
    'ai_video_sessions': 'Sessions Vidéo IA',
    'personalized_conversations': 'Découvrez des conversations personnalisées qui comprennent et répondent à vos émotions',
    'start_journey': 'Commencez votre Voyage',
    'reflect_alone': 'Réfléchir Seul',
    'resolve_together': 'Résoudre Ensemble',
    'settings': 'Paramètres',
    'sign_out': 'Se Déconnecter'
  },
  de: {
    'welcome': 'Willkommen bei AwakNow',
    'emotional_wellness': 'Ihre Reise zum emotionalen Wohlbefinden',
    'ai_video_sessions': 'KI-Video-Sitzungen',
    'personalized_conversations': 'Erleben Sie personalisierte Gespräche, die Ihre Emotionen verstehen und darauf reagieren',
    'start_journey': 'Beginnen Sie Ihre Reise',
    'reflect_alone': 'Allein Reflektieren',
    'resolve_together': 'Gemeinsam Lösen',
    'settings': 'Einstellungen',
    'sign_out': 'Abmelden'
  },
  it: {
    'welcome': 'Benvenuto su AwakNow',
    'emotional_wellness': 'Il Tuo Viaggio verso il Benessere Emotivo',
    'ai_video_sessions': 'Sessioni Video IA',
    'personalized_conversations': 'Sperimenta conversazioni personalizzate che comprendono e rispondono alle tue emozioni',
    'start_journey': 'Inizia il Tuo Viaggio',
    'reflect_alone': 'Rifletti da Solo',
    'resolve_together': 'Risolvi Insieme',
    'settings': 'Impostazioni',
    'sign_out': 'Disconnetti'
  },
  pt: {
    'welcome': 'Bem-vindo ao AwakNow',
    'emotional_wellness': 'Sua Jornada para o Bem-estar Emocional',
    'ai_video_sessions': 'Sessões de Vídeo com IA',
    'personalized_conversations': 'Experimente conversas personalizadas que entendem e respondem às suas emoções',
    'start_journey': 'Comece sua Jornada',
    'reflect_alone': 'Refletir Sozinho',
    'resolve_together': 'Resolver Juntos',
    'settings': 'Configurações',
    'sign_out': 'Sair'
  },
  zh: {
    'welcome': '欢迎来到 AwakNow',
    'emotional_wellness': '您的情感健康之旅',
    'ai_video_sessions': 'AI 视频会话',
    'personalized_conversations': '体验理解并回应您情感的个性化对话',
    'start_journey': '开始您的旅程',
    'reflect_alone': '独自反思',
    'resolve_together': '共同解决',
    'settings': '设置',
    'sign_out': '退出登录'
  },
  ja: {
    'welcome': 'AwakNowへようこそ',
    'emotional_wellness': '感情的ウェルネスへの旅',
    'ai_video_sessions': 'AIビデオセッション',
    'personalized_conversations': 'あなたの感情を理解し、応答するパーソナライズされた会話を体験してください',
    'start_journey': '旅を始める',
    'reflect_alone': '一人で振り返る',
    'resolve_together': '一緒に解決する',
    'settings': '設定',
    'sign_out': 'サインアウト'
  },
  ko: {
    'welcome': 'AwakNow에 오신 것을 환영합니다',
    'emotional_wellness': '감정적 웰빙으로의 여정',
    'ai_video_sessions': 'AI 비디오 세션',
    'personalized_conversations': '당신의 감정을 이해하고 반응하는 개인화된 대화를 경험하세요',
    'start_journey': '여정 시작하기',
    'reflect_alone': '혼자 성찰하기',
    'resolve_together': '함께 해결하기',
    'settings': '설정',
    'sign_out': '로그아웃'
  },
  ar: {
    'welcome': 'مرحباً بك في AwakNow',
    'emotional_wellness': 'رحلتك نحو العافية العاطفية',
    'ai_video_sessions': 'جلسات فيديو بالذكاء الاصطناعي',
    'personalized_conversations': 'اختبر محادثات شخصية تفهم وتستجيب لمشاعرك',
    'start_journey': 'ابدأ رحلتك',
    'reflect_alone': 'تأمل بمفردك',
    'resolve_together': 'حل المشاكل معاً',
    'settings': 'الإعدادات',
    'sign_out': 'تسجيل الخروج'
  },
  hi: {
    'welcome': 'AwakNow में आपका स्वागत है',
    'emotional_wellness': 'भावनात्मक कल्याण की आपकी यात्रा',
    'ai_video_sessions': 'AI वीडियो सत्र',
    'personalized_conversations': 'व्यक्तिगत बातचीत का अनुभव करें जो आपकी भावनाओं को समझती और प्रतिक्रिया देती है',
    'start_journey': 'अपनी यात्रा शुरू करें',
    'reflect_alone': 'अकेले चिंतन करें',
    'resolve_together': 'मिलकर समाधान करें',
    'settings': 'सेटिंग्स',
    'sign_out': 'साइन आउट'
  },
  gu: {
    'welcome': 'AwakNow માં તમારું સ્વાગત છે',
    'emotional_wellness': 'ભાવનાત્મક સુખાકારી તરફની તમારી યાત્રા',
    'ai_video_sessions': 'AI વિડિયો સત્રો',
    'personalized_conversations': 'વ્યક્તિગત વાતચીતનો અનુભવ કરો જે તમારી લાગણીઓને સમજે અને પ્રતિક્રિયા આપે',
    'start_journey': 'તમારી યાત્રા શરૂ કરો',
    'reflect_alone': 'એકલા ચિંતન કરો',
    'resolve_together': 'સાથે મળીને ઉકેલ કરો',
    'settings': 'સેટિંગ્સ',
    'sign_out': 'સાઇન આઉટ'
  },
  ta: {
    'welcome': 'AwakNow இல் உங்களை வரவேற்கிறோம்',
    'emotional_wellness': 'உணர்ச்சி நல்வாழ்வுக்கான உங்கள் பயணம்',
    'ai_video_sessions': 'AI வீடியோ அமர்வுகள்',
    'personalized_conversations': 'உங்கள் உணர்வுகளைப் புரிந்துகொண்டு பதிலளிக்கும் தனிப்பட்ட உரையாடல்களை அனுபவிக்கவும்',
    'start_journey': 'உங்கள் பயணத்தைத் தொடங்குங்கள்',
    'reflect_alone': 'தனியாக சிந்திக்கவும்',
    'resolve_together': 'ஒன்றாக தீர்க்கவும்',
    'settings': 'அமைப்புகள்',
    'sign_out': 'வெளியேறு'
  },
  te: {
    'welcome': 'AwakNow కు మీకు స్వాగతం',
    'emotional_wellness': 'భావోద్వేగ సంక్షేమం కోసం మీ ప్రయాణం',
    'ai_video_sessions': 'AI వీడియో సెషన్లు',
    'personalized_conversations': 'మీ భావోద్వేగాలను అర్థం చేసుకుని స్పందించే వ్యక్తిగత సంభాషణలను అనుభవించండి',
    'start_journey': 'మీ ప్రయాణాన్ని ప్రారంభించండి',
    'reflect_alone': 'ఒంటరిగా ఆలోచించండి',
    'resolve_together': 'కలిసి పరిష్కరించండి',
    'settings': 'సెట్టింగ్లు',
    'sign_out': 'సైన్ అవుట్'
  },
  kn: {
    'welcome': 'AwakNow ಗೆ ನಿಮಗೆ ಸ್ವಾಗತ',
    'emotional_wellness': 'ಭಾವನಾತ್ಮಕ ಯೋಗಕ್ಷೇಮಕ್ಕಾಗಿ ನಿಮ್ಮ ಪ್ರಯಾಣ',
    'ai_video_sessions': 'AI ವೀಡಿಯೊ ಸೆಷನ್‌ಗಳು',
    'personalized_conversations': 'ನಿಮ್ಮ ಭಾವನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ಪ್ರತಿಕ್ರಿಯಿಸುವ ವೈಯಕ್ತಿಕ ಸಂಭಾಷಣೆಗಳನ್ನು ಅನುಭವಿಸಿ',
    'start_journey': 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    'reflect_alone': 'ಏಕಾಂತದಲ್ಲಿ ಚಿಂತಿಸಿ',
    'resolve_together': 'ಒಟ್ಟಿಗೆ ಪರಿಹರಿಸಿ',
    'settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'sign_out': 'ಸೈನ್ ಔಟ್'
  },
  ml: {
    'welcome': 'AwakNow ലേക്ക് സ്വാഗതം',
    'emotional_wellness': 'വൈകാരിക ക്ഷേമത്തിനായുള്ള നിങ്ങളുടെ യാത്ര',
    'ai_video_sessions': 'AI വീഡിയോ സെഷനുകൾ',
    'personalized_conversations': 'നിങ്ങളുടെ വികാരങ്ങൾ മനസ്സിലാക്കുകയും പ്രതികരിക്കുകയും ചെയ്യുന്ന വ്യക്തിഗത സംഭാഷണങ്ങൾ അനുഭവിക്കുക',
    'start_journey': 'നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക',
    'reflect_alone': 'ഒറ്റയ്ക്ക് ചിന്തിക്കുക',
    'resolve_together': 'ഒരുമിച്ച് പരിഹരിക്കുക',
    'settings': 'ക്രമീകരണങ്ങൾ',
    'sign_out': 'സൈൻ ഔട്ട്'
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  currentLanguage: languages[0],
  translations,
  setLanguage: (language) => set({ currentLanguage: language }),
  t: (key: string) => {
    const { currentLanguage, translations } = get();
    return translations[currentLanguage.code]?.[key] || translations['en'][key] || key;
  },
}));
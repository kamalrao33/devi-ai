// DEVI AI - Multilingual Localization (English & Hindi)

export const TRANSLATIONS = {
  en: {
    appName: 'DEVI',
    appTagline: 'AI CARE',
    tabs: {
      companion: 'AI Companion',
      companionShort: 'Chat',
      health: 'Health & Cycle',
      healthShort: 'Cycle',
      wellness: 'Mind & Breathing',
      wellnessShort: 'Mind',
      sos: 'Safety & SOS',
      sosShort: 'SOS',
      doctors: 'Book Doctor',
      doctorsShort: 'Doctors',
      library: 'Health Library',
      libraryShort: 'Library',
      privacy: 'Privacy Vault',
      privacyShort: 'Vault'
    },
    status: {
      speaking: 'DEVI Speaking...',
      listening: 'Listening to you...',
      online: 'Voice AI Active'
    },
    actions: {
      stealth: 'Stealth',
      stealthFull: 'Stealth Mode',
      sos: 'SOS 24/7',
      muteVoice: 'Mute AI Voice',
      enableVoice: 'Enable AI Voice',
      lockVault: 'Lock Vault with PIN',
      autoListenOn: 'Auto-Listen: ON',
      autoListenOff: 'Auto-Listen: OFF',
      voiceSettings: 'Voice',
      memory: 'Memory',
      testVoice: 'Test Voice Sample',
      speakVoice: 'Speak Natural Voice',
      copy: 'Copy',
      copied: 'Copied'
    },
    chat: {
      placeholder: 'Talk to DEVI in English or हिंदी...',
      welcomePrefix: 'Hey',
      welcomeDefault: "I'm **DEVI** 🌸 I'm always here for your health, emotional wellness, and safety. What's on your mind today?",
      orbTapToSpeak: 'Tap Orb to Speak with DEVI',
      orbListening: 'Listening to your voice... Speak now',
      orbSpeaking: 'DEVI is speaking...',
      liveAI: 'OpenRouter Live AI'
    },
    suggestedPrompts: [
      { label: '🌸 Cramps Relief', query: 'Can coffee make my period cramps worse?' },
      { label: '🩺 Book a Doctor', query: 'I want to book an appointment with a gynecologist' },
      { label: '🧘 Calm Anxiety', query: 'How can I stop a panic attack fast?' },
      { label: '🚨 Test Emergency SOS', query: 'What happens when I trigger DEVI emergency SOS?' },
      { label: '🌿 Foods for PCOS', query: 'What are the best foods to eat for PCOS?' },
      { label: '🩸 Late Period', query: 'Why is my period late if my pregnancy test is negative?' }
    ]
  },
  hi: {
    appName: 'देवी',
    appTagline: 'महिला AI साथी',
    tabs: {
      companion: 'AI साथी (चैट)',
      companionShort: 'चैट',
      health: 'मासिक धर्म व स्वास्थ्य',
      healthShort: 'पीरियड्स',
      wellness: 'मानसिक शांति व योग',
      wellnessShort: 'मन',
      sos: 'आपातकालीन SOS',
      sosShort: 'SOS',
      doctors: 'डॉक्टर परामर्श',
      doctorsShort: 'डॉक्टर',
      library: 'स्वास्थ्य ज्ञान',
      libraryShort: 'ज्ञान',
      privacy: 'प्राइवेट वॉल्ट',
      privacyShort: 'वॉल्ट'
    },
    status: {
      speaking: 'देवी बोल रही है...',
      listening: 'सुन रही हूँ... बोलिए',
      online: 'वॉइस AI सक्रिय है'
    },
    actions: {
      stealth: 'सीक्रेट',
      stealthFull: 'सीक्रेट मोड (Esc)',
      sos: 'SOS 24/7',
      muteVoice: 'आवाज़ बंद करें',
      enableVoice: 'आवाज़ चालू करें',
      lockVault: 'पिन से लॉक करें',
      autoListenOn: 'ऑटो-लिसन: चालू',
      autoListenOff: 'ऑटो-लिसन: बंद',
      voiceSettings: 'आवाज़ सेटिंग',
      memory: 'मेमोरी',
      testVoice: 'आवाज़ टेस्ट करें',
      speakVoice: 'हिंदी आवाज़ में सुनें',
      copy: 'कॉपी',
      copied: 'कॉपी हो गया'
    },
    chat: {
      placeholder: 'देवी से हिंदी या English में बेझिझक बात करें...',
      welcomePrefix: 'नमस्ते',
      welcomeDefault: "मैं हूँ **DEVI (देवी)** 🌸 आपकी सेहत, मानसिक सुकून और सुरक्षा की साथी। आज आप कैसा महसूस कर रही हैं?",
      orbTapToSpeak: 'देवी से बोलने के लिए टैप करें',
      orbListening: 'आपकी आवाज़ सुन रही हूँ... बोलिए',
      orbSpeaking: 'देवी बोल रही है...',
      liveAI: 'OpenRouter लाइव AI'
    },
    suggestedPrompts: [
      { label: '🌸 पीरियड्स दर्द में राहत', query: 'पीरियड्स के तेज दर्द और क्रैम्प्स से तुरंत राहत कैसे पाएं?' },
      { label: '🧘 घबराहट और एंग्जायटी', query: 'अचानक घबराहट या पैनिक अटैक आने पर क्या करें?' },
      { label: '🌿 PCOS में क्या खाएं?', query: 'PCOS और हार्मोनल संतुलन के लिए सही डाइट क्या है?' },
      { label: '🩺 गायनेकोलॉजिस्ट से बात', query: 'मुझे महिला डॉक्टर (Gynecologist) से परामर्श लेना है' },
      { label: '🩸 पीरियड्स लेट होने का कारण', query: 'पीरियड्स लेट क्यों हो जाते हैं?' },
      { label: '🚨 आपातकालीन SOS सुरक्षा', query: 'इमरजेंसी में SOS कैसे काम करता है?' }
    ]
  }
};

class I18nManager {
  constructor() {
    this.language = localStorage.getItem('devi_language') || 'en';
    this.listeners = [];
  }

  getLanguage() {
    return this.language;
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'hi') lang = 'en';
    this.language = lang;
    localStorage.setItem('devi_language', lang);
    this.listeners.forEach(cb => cb(lang));
  }

  toggleLanguage() {
    const next = this.language === 'en' ? 'hi' : 'en';
    this.setLanguage(next);
    return next;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  t(path) {
    const keys = path.split('.');
    let current = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = TRANSLATIONS.en;
        for (const fbKey of keys) {
          if (fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  }
}

export const i18n = new I18nManager();

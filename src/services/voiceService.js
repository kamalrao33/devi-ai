// DEVI & DEVA AI - Ultra-Realistic Fluent Human Voice & Speech Synthesis Engine
// Supports Natural Male (DEVA - Boys Mode) and Female (DEVI - Girls Mode) voices in English & Hindi

import { i18n } from './i18n.js';

const MALE_VOICE_NAMES = [
  'david', 'guy', 'christopher', 'ryan', 'mark', 'george', 'eric', 'stefan',
  'richard', 'tom', 'alex', 'fred', 'daniel', 'oliver', 'rishi', 'ravi',
  'hemant', 'madhur', 'pradeep', 'ajay', 'anil', 'rahul', 'tarun', 'neel',
  'deep', 'male', 'boy', 'man', 'mr', 'google uk english male', 'google us english male'
];

const FEMALE_VOICE_NAMES = [
  'zira', 'aria', 'jenny', 'sonia', 'samantha', 'victoria', 'karen', 'susan',
  'catherine', 'fiona', 'moira', 'heera', 'swara', 'kalpana', 'neerja',
  'priya', 'ananya', 'female', 'girl', 'woman', 'mrs', 'ms',
  'google uk english female', 'google us english female'
];

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.selectedVoice = null;
    this.onResultCallback = null;
    this.onStateChangeCallback = null;
    this.onVoicesLoadedCallback = null;
    this.voices = [];
    
    // Default mode: detect from localStorage or fallback to girls
    this.appMode = typeof window !== 'undefined' ? (localStorage.getItem('devi_app_mode') || 'girls') : 'girls';

    // Tone, rate and pitch tailored for gender
    if (this.appMode === 'boys') {
      this.voiceTone = 'wingman';
      this.speechRate = 1.0;
      this.speechPitch = 0.92; // Deep, confident, masculine resonance
    } else {
      this.voiceTone = 'warm';
      this.speechRate = 0.98;
      this.speechPitch = 1.03; // Warm, friendly, soothing feminine resonance
    }

    this.currentLanguage = i18n.getLanguage();
    this.activeUtterances = [];
    this.speechCancelRequested = false;

    i18n.subscribe((lang) => {
      this.setLanguage(lang);
    });

    this.initVoices();
    this.initRecognition();
  }

  // Switch between Boys Mode (DEVA - Male Voice) and Girls Mode (DEVI - Female Voice)
  setAppMode(mode) {
    if (this.appMode === mode) return;
    this.appMode = mode;

    if (mode === 'boys') {
      this.voiceTone = 'wingman';
      this.speechRate = 1.0;
      this.speechPitch = 0.92; // Male resonance
    } else {
      this.voiceTone = 'warm';
      this.speechRate = 0.98;
      this.speechPitch = 1.03; // Female resonance
    }

    this.autoSelectBestVoice();

    if (this.onVoicesLoadedCallback) {
      this.onVoicesLoadedCallback(this.voices, this.selectedVoice);
    }
  }

  classifyVoiceGender(voice) {
    if (!voice || !voice.name) return 'neutral';
    const name = voice.name.toLowerCase();

    // Check male indicators
    for (const kw of MALE_VOICE_NAMES) {
      if (name.includes(kw)) return 'male';
    }

    // Check female indicators
    for (const kw of FEMALE_VOICE_NAMES) {
      if (name.includes(kw)) return 'female';
    }

    return 'neutral';
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    }
    this.autoSelectBestVoice();
  }

  initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      const available = this.synth.getVoices();
      if (!available || available.length === 0) return;

      this.voices = available.filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi') || v.lang.startsWith('es'));
      this.autoSelectBestVoice();

      if (this.onVoicesLoadedCallback) {
        this.onVoicesLoadedCallback(this.voices, this.selectedVoice);
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  // Intelligent ranking based on appMode (Male vs Female) and Language
  autoSelectBestVoice(isHindiText = false) {
    if (!this.synth) return;
    const available = this.synth.getVoices();
    if (!available || available.length === 0) return;

    const isHindi = isHindiText || this.currentLanguage === 'hi';
    const isBoys = this.appMode === 'boys';

    const rankVoice = (v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const gender = this.classifyVoiceGender(v);
      let score = 0;

      // 1. GENDER MATCHING (Crucial Requirement)
      if (isBoys) {
        if (gender === 'male') score += 400;
        else if (gender === 'female') score -= 350; // Strong penalty for female voice in Boys Mode
      } else {
        if (gender === 'female') score += 400;
        else if (gender === 'male') score -= 350; // Strong penalty for male voice in Girls Mode
      }

      // 2. LANGUAGE MATCHING
      if (isHindi) {
        if (lang.startsWith('hi')) score += 300;
        if (lang.startsWith('en-in')) score += 120;
      } else {
        if (lang.startsWith('en')) score += 60;
        if (lang === 'en-in' || lang === 'en-us' || lang === 'en-gb') score += 40;
      }

      // 3. VOICE ENGINE QUALITY (Prioritize Natural, Neural, Online & Google voices)
      if (name.includes('natural') || name.includes('neural') || name.includes('online')) {
        score += 250;
      }
      if (name.includes('google')) {
        score += 150;
      }

      // 4. SPECIFIC CURATED VOICE PROFILES
      if (isBoys) {
        // High quality Male voices
        if (name.includes('christopher') || name.includes('guy') || name.includes('ryan')) score += 200;
        if (name.includes('madhur') || name.includes('hemant')) score += 200;
        if (name.includes('google uk english male')) score += 180;
        if (name.includes('david')) score += 160;
        if (name.includes('ravi') || name.includes('pradeep') || name.includes('mark')) score += 140;
      } else {
        // High quality Female voices
        if (name.includes('aria') || name.includes('jenny') || name.includes('sonia')) score += 200;
        if (name.includes('swara') || name.includes('kalpana') || name.includes('neerja')) score += 200;
        if (name.includes('google uk english female')) score += 180;
        if (name.includes('zira') || name.includes('samantha') || name.includes('heera')) score += 160;
      }

      return score;
    };

    const sorted = [...available].sort((a, b) => rankVoice(b) - rankVoice(a));
    if (sorted[0]) {
      this.selectedVoice = sorted[0];
    }
  }

  // Preprocess text into natural, fluent, spoken phrasing without robotic stumbles
  formatForHumanSpeech(rawText) {
    if (!rawText) return '';

    let text = rawText;

    // 1. Remove markdown links, keep anchor text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // 2. Remove emojis and special unicode symbols
    text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    text = text.replace(/[*_#`~>]/g, '');

    // 3. Fitness, Medical & General Acronym Expansions for Fluent Phonetics
    text = text.replace(/\bPPL\b/g, 'Push, Pull, Legs');
    text = text.replace(/\bDHT\b/g, 'D-H-T');
    text = text.replace(/\bPRP\b/g, 'P-R-P');
    text = text.replace(/\bPCOS\b/gi, 'P-C-O-S');
    text = text.replace(/\bPCOD\b/gi, 'P-C-O-D');
    text = text.replace(/\bOb-Gyn\b/gi, 'Gynecologist');
    text = text.replace(/\bGPS\b/gi, 'G-P-S');
    text = text.replace(/\bSOS\b/gi, 'S-O-S');
    text = text.replace(/\bDr\./gi, 'Doctor');
    text = text.replace(/\bMD\b/g, 'Doctor');
    text = text.replace(/\bMBBS\b/g, 'Doctor');
    text = text.replace(/\bPh\.?D\b/gi, 'Doctor');
    text = text.replace(/\bapprox\./gi, 'approximately');
    text = text.replace(/\be\.g\.,?\b/gi, 'for example,');
    text = text.replace(/\bi\.e\.,?\b/gi, 'that is,');
    text = text.replace(/\bvs\.?\b/gi, 'versus');
    text = text.replace(/\b1g\/lb\b/gi, 'one gram per pound');
    text = text.replace(/\b(\d+)\s*g\b/gi, '$1 grams');
    text = text.replace(/\b(\d+)\s*kg\b/gi, '$1 kilograms');
    text = text.replace(/\b(\d+)\s*lbs\b/gi, '$1 pounds');
    text = text.replace(/\b(\d+)\s*mins?\b/gi, '$1 minutes');
    text = text.replace(/\b(\d+)\s*secs?\b/gi, '$1 seconds');
    text = text.replace(/\b(\d+)\s*hrs?\b/gi, '$1 hours');
    text = text.replace(/\b4-4-4-4\b/g, 'four, four, four, four');
    text = text.replace(/\b4-7-8\b/g, 'four, seven, eight');
    text = text.replace(/\b1-10\b/g, 'one to ten');

    // 4. Transform bullet points and numbered lists into smooth spoken conversational transitions
    text = text.replace(/^\s*1\.\s+/gm, 'First, ');
    text = text.replace(/^\s*2\.\s+/gm, 'Second, ');
    text = text.replace(/^\s*3\.\s+/gm, 'Third, ');
    text = text.replace(/^\s*4\.\s+/gm, 'Fourth, ');
    text = text.replace(/^\s*[•\-*]\s+/gm, ', ');

    // 5. Clean punctuation slashes and duplicate marks
    text = text.replace(/\//g, ' or ');
    text = text.replace(/[:;]/g, ', ');
    text = text.replace(/\n+/g, '. ');
    text = text.replace(/,\s*,/g, ',');
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/^[,\s\.\-]+/, ''); // Trim leading punctuation

    return text;
  }

  initRecognition() {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback({ isListening: true });
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (this.onResultCallback) {
        this.onResultCallback({
          final: finalTranscript.trim(),
          interim: interimTranscript.trim(),
          isFinal: finalTranscript.length > 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback({ isListening: false, error: event.error });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback({ isListening: false });
    };
  }

  startListening(onResult, onStateChange) {
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;

    if (!this.recognition) {
      if (onStateChange) onStateChange({ isListening: false, unsupported: true });
      return;
    }

    try {
      this.stopSpeaking();
      this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      this.recognition.start();
    } catch (e) {
      console.warn('Error starting recognition:', e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
  }

  // Split long sentences into fluent, natural conversational breath units
  splitIntoFluentSentences(text) {
    if (!text) return [];
    // Split on periods, exclamation points, question marks
    const rawSentences = text.split(/(?<=[.?!])\s+/);
    const cleaned = [];

    for (let s of rawSentences) {
      s = s.trim();
      if (!s) continue;
      // If a sentence is very long (> 120 chars), split at commas or conjunctions for natural human breath pause
      if (s.length > 120 && s.includes(',')) {
        const parts = s.split(/,\s*/);
        let curr = '';
        for (const p of parts) {
          if ((curr + ', ' + p).length < 100) {
            curr = curr ? curr + ', ' + p : p;
          } else {
            if (curr) cleaned.push(curr);
            curr = p;
          }
        }
        if (curr) cleaned.push(curr);
      } else {
        cleaned.push(s);
      }
    }

    return cleaned.length > 0 ? cleaned : [text];
  }

  // Continuous, fluent, natural human speech synthesis with gender-adaptive modulation
  speak(text, options = {}) {
    if (!this.synth) return Promise.resolve();

    this.stopSpeaking();
    this.speechCancelRequested = false;

    const clean = this.formatForHumanSpeech(text);
    if (!clean) return Promise.resolve();

    const isBoys = this.appMode === 'boys';
    const hasHindiChars = /[\u0900-\u097F]/.test(clean);

    // Auto-select best voice if not locked or if language/gender mismatch
    this.autoSelectBestVoice(hasHindiChars);

    // Base pitch & rate tailored for gender and persona
    let baseRate = this.speechRate;
    let basePitch = this.speechPitch;

    // Apply persona tuning
    if (isBoys) {
      if (this.voiceTone === 'coach') {
        baseRate = 1.04;
        basePitch = 0.93; // Driven, motivating masculine
      } else if (this.voiceTone === 'calm' || this.voiceTone === 'stoic') {
        baseRate = 0.94;
        basePitch = 0.88; // Deep, calm, measured masculine
      } else {
        // default wingman
        baseRate = 1.0;
        basePitch = 0.92;
      }
    } else {
      if (this.voiceTone === 'gentle') {
        baseRate = 0.94;
        basePitch = 1.06; // Soft, caring feminine
      } else if (this.voiceTone === 'natural') {
        baseRate = 1.0;
        basePitch = 1.02; // Crisp, clear feminine
      } else {
        // default warm friend
        baseRate = 0.98;
        basePitch = 1.04;
      }
    }

    if (options.rate) baseRate = options.rate;
    if (options.pitch) basePitch = options.pitch;

    // Check if current selected voice gender matches mode; if only opposite gender voice available, pitch shift!
    if (this.selectedVoice) {
      const voiceGender = this.classifyVoiceGender(this.selectedVoice);
      if (isBoys && voiceGender === 'female') {
        basePitch = 0.80; // Shift female voice down into masculine range
      } else if (!isBoys && voiceGender === 'male') {
        basePitch = 1.15; // Shift male voice up into feminine range
      }
    }

    const sentences = this.splitIntoFluentSentences(clean);
    this.isSpeaking = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback({ isSpeaking: true });

    return new Promise((resolve) => {
      let index = 0;

      const speakNextChunk = () => {
        if (this.speechCancelRequested || index >= sentences.length) {
          this.isSpeaking = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback({ isSpeaking: false });
          resolve();
          return;
        }

        const sentence = sentences[index];
        index++;

        const utterance = new SpeechSynthesisUtterance(sentence);
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        if (hasHindiChars) {
          utterance.lang = 'hi-IN';
        }

        // Add subtle human micro-inflections based on sentence ending
        let chunkPitch = basePitch;
        let chunkRate = baseRate;

        if (sentence.endsWith('?')) {
          chunkPitch += 0.04; // Natural inquisitive human inflection at question end
        } else if (sentence.endsWith('!')) {
          chunkRate += 0.02; // Energetic emphasis
        }

        utterance.rate = Math.max(0.7, Math.min(1.4, chunkRate));
        utterance.pitch = Math.max(0.5, Math.min(1.5, chunkPitch));

        utterance.onend = () => {
          if (index < sentences.length && !this.speechCancelRequested) {
            // Natural 90ms breath pause between sentences for fluent cadence
            setTimeout(speakNextChunk, 90);
          } else {
            this.isSpeaking = false;
            if (this.onStateChangeCallback) this.onStateChangeCallback({ isSpeaking: false });
            resolve();
          }
        };

        utterance.onerror = () => {
          this.isSpeaking = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback({ isSpeaking: false });
          resolve();
        };

        this.synth.speak(utterance);
      };

      speakNextChunk();
    });
  }

  stopSpeaking() {
    this.speechCancelRequested = true;
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback({ isSpeaking: false });
    }
  }

  setVoice(voice) {
    this.selectedVoice = voice;
  }

  setTone(tone) {
    this.voiceTone = tone;
  }

  setRate(rate) {
    this.speechRate = rate;
  }

  setPitch(pitch) {
    this.speechPitch = pitch;
  }
}

export const voiceEngine = new VoiceEngine();

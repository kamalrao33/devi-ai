import { memoryService } from './memoryService.js';
import { SPECIFIC_QA_DATABASE } from './aiKnowledgeEngine.js';

export const DEFAULT_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const EMERGENCY_KEYWORDS = [
  'help', 'emergency', 'danger', 'attack', 'stalker', 'stalking', 'following me',
  'threat', 'unsafe', 'hurt me', 'call ambulance', 'ambulance', 'severe pain',
  'severe bleeding', 'unconscious', 'suicide', 'kill myself', 'domestic violence',
  'abuse', 'harassed', 'save me', 'sos', 'hospital now', 'accident',
  // Hindi & Hinglish emergency terms
  'madad', 'bachao', 'khatra', 'dard', 'khoon', 'hospital', 'chhedkhani',
  'picha kar raha hai', 'police bulao', 'ambulance bulao', 'sahayata', 'suraksha'
];

export const SUGGESTED_PROMPTS = [
  { label: '🌸 Cramps Relief', query: 'Can coffee make my period cramps worse?' },
  { label: '🩺 Book a Doctor', query: 'I want to book an appointment with a gynecologist' },
  { label: '🧘 Calm Anxiety', query: 'How can I stop a panic attack fast?' },
  { label: '🚨 Test Emergency SOS', query: 'What happens when I trigger DEVI emergency SOS?' },
  { label: '🌿 Foods for PCOS', query: 'What are the best foods to eat for PCOS?' },
  { label: '🩸 Late Period', query: 'Why is my period late if my pregnancy test is negative?' }
];

export const BOYS_SUGGESTED_PROMPTS = [
  { label: '⚡ Testosterone & Vitality', query: 'What natural daily habits increase free testosterone and morning drive?' },
  { label: '💪 Muscle & Protein Split', query: 'What is the optimal protein target and recovery routine for muscle gain?' },
  { label: '🧠 Stoic Mental Reset', query: 'How can I quickly manage overwhelming stress, burnout, and mental fatigue?' },
  { label: '💈 Hair Loss & DHT Science', query: 'What are the most effective science-backed ways to stop male hair thinning?' },
  { label: '🩺 Book Men\'s Specialist', query: 'I want to consult an andrologist or sports medicine physician' },
  { label: '🚗 Roadside Safety SOS', query: 'How does DEVA emergency dispatch handle vehicle breakdowns and nighttime road safety?' }
];

export const BOYS_DOCTORS_DATA = [
  {
    id: 'bdoc-1',
    name: 'Dr. Kabir Mehta, MD',
    specialty: 'Senior Andrologist & Men\'s Health Specialist',
    experience: '15+ Years Experience',
    rating: 4.9,
    reviews: 460,
    hospital: 'Apollo Men\'s Health & Vitality Center',
    fee: '$50 / Consultation',
    availableToday: true,
    slots: ['10:00 AM', '01:30 PM', '04:00 PM', '06:30 PM'],
    avatar: '/images/boys/doctor-kabir.jpg',
    languages: 'English, Hindi, Spanish',
    bio: 'Pioneer in testosterone optimization, male hormonal balance, reproductive vitality, and discrete urological care.'
  },
  {
    id: 'bdoc-2',
    name: 'Dr. Rohan Verma, MBBS, MS',
    specialty: 'Sports Medicine & Orthopedic Recovery Physician',
    experience: '12+ Years Experience',
    rating: 5.0,
    reviews: 380,
    hospital: 'Apex Sports Science & Rehab Clinic',
    fee: '$45 / Consultation',
    availableToday: true,
    slots: ['11:00 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
    avatar: '/images/boys/doctor-rohan.jpg',
    languages: 'English, Punjabi, Hindi',
    bio: 'Dedicated to athletic injury prevention, joint longevity, muscle recovery protocols, and hypertrophy optimization.'
  },
  {
    id: 'bdoc-3',
    name: 'Dr. Arjun Sen, Ph.D.',
    specialty: 'Men\'s Mental Health & Performance Psychologist',
    experience: '14+ Years Experience',
    rating: 4.9,
    reviews: 510,
    hospital: 'Stoic Focus & Executive Resilience Institute',
    fee: '$60 / Session',
    availableToday: true,
    slots: ['09:30 AM', '12:00 PM', '03:15 PM', '05:45 PM'],
    avatar: '/images/boys/doctor-arjun.jpg',
    languages: 'English, Bengali, German',
    bio: 'Specialist in male burnout, imposter syndrome, high-pressure anxiety, relationship communication, and stoic mindset coaching.'
  },
  {
    id: 'bdoc-4',
    name: 'Dr. Vikram Malhotra, MD',
    specialty: 'Hair Restoration & Metabolic Lifestyle Physician',
    experience: '10+ Years Experience',
    rating: 4.8,
    reviews: 290,
    hospital: 'Regenesis Hair & Endocrine Institute',
    fee: '$40 / Consultation',
    availableToday: false,
    slots: ['Tomorrow 10:00 AM', 'Tomorrow 01:00 PM', 'Tomorrow 04:30 PM'],
    avatar: '/images/boys/doctor-vikram.jpg',
    languages: 'English, Hindi, Marathi',
    bio: 'Expert in non-surgical DHT prevention, PRP therapy, metabolic health, circadian sleep cycles, and micronutrient optimization.'
  }
];

export const DOCTORS_DATA = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma, MD',
    specialty: 'Senior Gynecologist & Obstetrician',
    experience: '14+ Years Experience',
    rating: 4.9,
    reviews: 420,
    hospital: 'Apollo Women\'s Health Center',
    fee: '$45 / Consultation',
    availableToday: true,
    slots: ['10:30 AM', '02:00 PM', '04:30 PM', '06:15 PM'],
    avatar: '/images/doctor-ananya.jpg',
    languages: 'English, Hindi, Spanish',
    bio: 'Specializes in high-risk pregnancy, PCOS hormonal therapy, and minimally invasive gynecological care.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Meera Nambiar, Ph.D.',
    specialty: 'Women\'s Mental Health & Trauma Therapist',
    experience: '11+ Years Experience',
    rating: 5.0,
    reviews: 310,
    hospital: 'Mind Sanctuary & Emotional Clinic',
    fee: '$55 / Session',
    availableToday: true,
    slots: ['11:00 AM', '01:30 PM', '03:45 PM', '05:30 PM'],
    avatar: '/images/doctor-meera.jpg',
    languages: 'English, French',
    bio: 'Dedicated to postpartum anxiety, relationship healing, workplace burnout, and somatic stress release.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Sunita Deshmukh, MS, DGO',
    specialty: 'Reproductive Endocrinologist & Fertility Specialist',
    experience: '18+ Years Experience',
    rating: 4.8,
    reviews: 580,
    hospital: 'Fertility & Hormonal Wellness Institute',
    fee: '$60 / Consultation',
    availableToday: false,
    slots: ['Tomorrow 09:30 AM', 'Tomorrow 12:00 PM', 'Tomorrow 03:00 PM'],
    avatar: '/images/doctor-sunita.jpg',
    languages: 'English, Marathi, German',
    bio: 'Leading expert in ovarian health, IVF counseling, cycle regulation, and endometriosis management.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Kavita Reddy, MBBS, MD',
    specialty: 'Holistic Women\'s Nutritionist & Lifestyle Physician',
    experience: '9+ Years Experience',
    rating: 4.9,
    reviews: 240,
    hospital: 'Vitality Integrative Health',
    fee: '$35 / Consultation',
    availableToday: true,
    slots: ['09:00 AM', '11:45 AM', '02:15 PM', '05:00 PM'],
    avatar: '/images/doctor-kavita.jpg',
    languages: 'English, Telugu, Hindi',
    bio: 'Specialist in gut health, anti-inflammatory nutrition for PCOS, thyroid balance, and prenatal wellness.'
  }
];

class AiService {
  constructor() {
    this.conversationHistory = [];
    this.apiKey = localStorage.getItem('devi_openrouter_api_key') || DEFAULT_OPENROUTER_KEY;
    this.primaryModel = 'google/gemini-2.5-flash';
    this.fallbackModels = ['deepseek/deepseek-chat', 'meta-llama/llama-3.3-70b-instruct:free'];
  }

  getApiKey() {
    return localStorage.getItem('devi_openrouter_api_key') || this.apiKey;
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem('devi_openrouter_api_key', this.apiKey);
  }

  detectEmergency(text) {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
  }

  // Exact Match against offline Knowledge Base
  findSpecificAnswer(text) {
    for (const item of SPECIFIC_QA_DATABASE) {
      for (const pattern of item.patterns) {
        if (text.includes(pattern)) {
          return item;
        }
      }
    }
    return null;
  }

  // Build tailored system prompt with memory & empathetic bilingual persona
  buildSystemPrompt(memory, mode = 'girls') {
    const isBoys = mode === 'boys' || (typeof window !== 'undefined' && localStorage.getItem('devi_app_mode') === 'boys');
    const userName = memory.userName ? `The user's name is ${memory.userName}. ` : '';
    const healthInterests = memory.healthInterests.length > 0
      ? `Health interests: ${memory.healthInterests.join(', ')}. `
      : '';
    const favoriteRemedies = memory.favoriteRemedies.length > 0
      ? `Favorite comforts: ${memory.favoriteRemedies.join(', ')}. `
      : '';

    if (isBoys) {
      return `You are DEVA (देवा) ⚡, a loyal, high-energy, reliable, and knowledgeable AI wingman and men's health, fitness, mental fortitude & safety expert.

LANGUAGE & VOICE RULES:
- You are 100% fluent in English, Hindi (हिंदी), and Hinglish.
- If the user writes or speaks in Hindi or Hinglish, respond in brotherly, motivating, natural Hindi/Hinglish (addressing them as "भाई", "bro", "yaar", or their name).
- If the user speaks in English, respond in clear, motivating, supportive English.
- STRICT LENGTH LIMIT: Keep your reply to 2 to 3 short sentences (under 45 words total).
- Speak naturally and reassuringly like a trusted gym partner, brother, or wingman.
- NEVER write long essays, large lists, or robotic lectures.
- Give 1 or 2 sharp practical tips, and end with an energizing question or encouragement.
- ${userName}${healthInterests}${favoriteRemedies}
- Core expertise: Testosterone & hormonal vitality, muscle building splits, protein & recovery, stoic stress management & burnout, hair loss prevention (DHT/scalp), and road/personal safety protocols.`;
    }

    return `You are DEVI (देवी), a compassionate, certified, warm, and highly knowledgeable AI voice companion and women's health & emergency safety expert.

LANGUAGE & VOICE RULES:
- You are 100% fluent in English, Hindi (हिंदी), and Hinglish.
- If the user writes or speaks in Hindi or Hinglish, ALWAYS respond in warm, natural, spoken Hindi or Hinglish.
- If the user speaks in English, respond in English.
- STRICT LENGTH LIMIT: Keep your reply to 2 to 3 short sentences (under 45 words total).
- Speak naturally and warmly like a caring best friend on a voice call.
- NEVER write long essays, large lists, or robotic lectures.
- Give 1 or 2 immediate practical tips, and end with a warm check-in question.
- ${userName}${healthInterests}${favoriteRemedies}
- Core expertise: Menstrual cramps (पीरियड्स का दर्द), cycle tracking, PCOS hormone balance, fertility & pregnancy, anxiety calming (घबराहट व शांति), and safety protocols.`;
  }

  // Query OpenRouter API with model fallback
  async queryOpenRouter(messages, modelIndex = 0) {
    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    const currentModel = modelsToTry[modelIndex] || this.primaryModel;
    const apiKey = this.getApiKey();

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin || 'http://localhost:5173',
          'X-Title': 'DEVI AI Women Companion'
        },
        body: JSON.stringify({
          model: currentModel,
          messages: messages,
          max_tokens: 140,
          temperature: 0.65
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.warn(`OpenRouter API error with ${currentModel}:`, errData);

        // Try next fallback model if available
        if (modelIndex + 1 < modelsToTry.length) {
          return await this.queryOpenRouter(messages, modelIndex + 1);
        }
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        throw new Error('Empty response from model');
      }

      return reply;
    } catch (err) {
      console.warn('OpenRouter fetch failed:', err);
      if (modelIndex + 1 < modelsToTry.length) {
        return await this.queryOpenRouter(messages, modelIndex + 1);
      }
      throw err;
    }
  }

  // Main processing pipeline
  async processMessage(userMessage, mode = 'girls') {
    const isBoys = mode === 'boys' || (typeof window !== 'undefined' && localStorage.getItem('devi_app_mode') === 'boys');
    if (!userMessage || !userMessage.trim()) {
      return {
        reply: isBoys 
          ? "I'm right here with you, bro! Ready to crush your goals today? ⚡"
          : "I'm right here with you! What's on your mind today? 🌸",
        action: null,
        urgency: 'normal',
        sentiment: 'warm',
        memoryUpdated: false
      };
    }

    const raw = userMessage.trim();
    const text = raw.toLowerCase();
    const isEmergency = this.detectEmergency(text);

    // Learn from user interaction
    const memory = memoryService.learnFromMessage(userMessage);
    const namePrefix = memory.userName ? `${memory.userName}` : '';

    this.conversationHistory.push({ role: 'user', content: userMessage });

    // 1. HIGH-PRIORITY EMERGENCY: Trigger immediate safety response
    if (isEmergency) {
      const reply = isBoys
        ? `I've got your back, ${namePrefix || 'brother'}. Locking your live GPS coordinates now and priming roadside assistance and emergency dispatch. Stay alert and in a safe position.`
        : `I'm right here with you, ${namePrefix || 'sweetie'}. I am initiating our Emergency Sentinel protocol now to lock your live GPS and prepare ambulance and doctor dispatch. Are you in a safe position right now?`;
      this.conversationHistory.push({ role: 'assistant', content: reply });
      return {
        reply,
        action: 'OPEN_EMERGENCY_MODAL',
        urgency: 'critical',
        isEmergency: true,
        sentiment: 'distressed',
        memoryUpdated: true
      };
    }

    // Determine smart UI action trigger
    let action = null;
    if (text.includes('report') || text.includes('pdf') || text.includes('docx') || text.includes('download summary') || text.includes('medical summary')) {
      action = 'DOWNLOAD_HEALTH_REPORT';
    } else if (text.includes('book') || text.includes('doctor') || text.includes('appointment') || text.includes('gynecologist') || text.includes('andrologist') || text.includes('consult') || text.includes('therapist') || text.includes('specialist')) {
      action = 'SWITCH_TAB_DOCTORS';
    } else if (text.includes('panic') || text.includes('anxiety') || text.includes('breathe') || text.includes('breathing') || text.includes('overwhelmed') || text.includes('grounding') || text.includes('box breath')) {
      action = 'OPEN_BREATHING_TOOL';
    } else if (text.includes('cramp') || text.includes('period') || text.includes('pcos') || text.includes('ovulat') || text.includes('symptom') || text.includes('flow') || text.includes('testosterone') || text.includes('vitality') || text.includes('workout') || text.includes('protein')) {
      action = 'SHOW_CYCLE_CARD';
    }

    // 2. OPENROUTER LIVE LLM GENERATION
    try {
      const systemPrompt = this.buildSystemPrompt(memory, mode);

      // Prepare message history (last 6 context turns)
      const contextMessages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-6)
      ];

      const llmReply = await this.queryOpenRouter(contextMessages);

      this.conversationHistory.push({ role: 'assistant', content: llmReply });

      return {
        reply: llmReply,
        action: action,
        urgency: 'normal',
        sentiment: 'supportive',
        memoryUpdated: true,
        source: 'openrouter'
      };
    } catch (llmError) {
      console.log('Falling back to local knowledge engine:', llmError);

      // 3. OFFLINE KNOWLEDGE ENGINE FALLBACK
      const specificMatch = this.findSpecificAnswer(text);
      let reply = "";

      if (specificMatch) {
        reply = `${specificMatch.answer} ${specificMatch.followUp}`;
      } else if (action === 'SWITCH_TAB_DOCTORS') {
        reply = isBoys
          ? `I can get you booked with our top men's health specialists immediately. Dr. Kabir (Andrology) and Dr. Rohan (Sports Medicine) have open slots today. Shall I open the booking directory?`
          : `I can help you schedule an appointment right away. We have Dr. Ananya for gynecology and Dr. Meera for therapy available today. Would you like a private video call or an in-clinic visit?`;
      } else if (action === 'OPEN_BREATHING_TOOL') {
        reply = isBoys
          ? `Reset your autonomic nervous system with me right now, bro. 4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 hold. Let's do a tactical box breathing cycle.`
          : `Take a slow, deep breath with me right now. You are safe. Would you like to do our guided 4-7-8 breathing relaxation together to soothe your nervous system?`;
      } else if (text.includes('why') || text.includes('cause') || text.includes('reason')) {
        reply = isBoys
          ? `That usually comes down to sleep recovery, hydration, circadian sunlight, or training volume. Tracking your daily morning energy and sleep score pinpoints the exact driver.`
          : `That is often influenced by hormonal fluctuations, lifestyle stress, or shifts in nutrition and sleep. Tracking your daily cycle signals helps uncover your body's rhythm. Does this occur during a specific time of your month?`;
      } else {
        reply = isBoys
          ? `I'm with you, ${namePrefix || 'bro'}. Focus on high-quality sleep, 1g protein per lb, and consistent training. How are you feeling overall today?`
          : `I'm listening closely, ${namePrefix || 'dear'}. Prioritizing warm hydration, rest, and gentle self-care will support your wellness. Tell me a bit more about how you're feeling right now!`;
      }

      this.conversationHistory.push({ role: 'assistant', content: reply });

      return {
        reply,
        action,
        urgency: 'normal',
        sentiment: 'supportive',
        memoryUpdated: true,
        source: 'local-knowledge'
      };
    }
  }
}

export const aiService = new AiService();

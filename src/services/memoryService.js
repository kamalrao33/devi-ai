// DEVI AI - Adaptive Conversational Memory & Learning Engine

const DEFAULT_MEMORY = {
  userName: '',
  healthInterests: [], // ['PCOS', 'Cramps', 'Pregnancy', 'Anxiety', etc.]
  recentMoods: [],     // ['anxious', 'happy', 'exhausted']
  favoriteRemedies: [], // ['Chamomile tea', 'Heating pad']
  symptomNotes: [],
  relationshipLevel: 1, // 1: New Friend, 2: Trusted Confidante, 3: Soul Sister
  totalConversations: 0,
  lastInteraction: null,
  customInsights: []
};

class MemoryService {
  constructor() {
    this.storageKey = 'devi_ai_memory';
  }

  getMemory() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? { ...DEFAULT_MEMORY, ...JSON.parse(saved) } : DEFAULT_MEMORY;
    } catch {
      return DEFAULT_MEMORY;
    }
  }

  saveMemory(mem) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(mem));
    } catch (e) {
      console.warn('Failed to save memory:', e);
    }
  }

  // Learn from user query in real time
  learnFromMessage(userMessage) {
    const mem = this.getMemory();
    const text = userMessage.toLowerCase();
    const words = userMessage.trim();

    mem.totalConversations += 1;
    mem.lastInteraction = new Date().toLocaleDateString();

    // 1. Learn User Name
    const nameMatch = words.match(/(?:my name is|i am|call me|i'm)\s+([A-Za-z]+)/i);
    if (nameMatch && nameMatch[1] && !['feeling', 'having', 'so', 'just', 'very', 'not', 'here', 'hurting', 'bleeding'].includes(nameMatch[1].toLowerCase())) {
      mem.userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    }

    // 2. Learn Health Topics
    if (text.includes('pcos') || text.includes('pcod')) {
      if (!mem.healthInterests.includes('PCOS / Hormone Balance')) mem.healthInterests.push('PCOS / Hormone Balance');
    }
    if (text.includes('cramp') || text.includes('period pain') || text.includes('bleed')) {
      if (!mem.healthInterests.includes('Menstrual Cramps')) mem.healthInterests.push('Menstrual Cramps');
    }
    if (text.includes('pregnant') || text.includes('pregnancy') || text.includes('baby')) {
      if (!mem.healthInterests.includes('Pregnancy & Maternity')) mem.healthInterests.push('Pregnancy & Maternity');
    }
    if (text.includes('anxious') || text.includes('panic') || text.includes('stress') || text.includes('depress') || text.includes('overwhelm')) {
      if (!mem.healthInterests.includes('Anxiety & Emotional Care')) mem.healthInterests.push('Anxiety & Emotional Care');
    }

    // 3. Learn Moods
    if (text.includes('happy') || text.includes('great') || text.includes('good')) {
      mem.recentMoods = ['Happy & Positive', ...mem.recentMoods.slice(0, 4)];
    } else if (text.includes('sad') || text.includes('cry') || text.includes('down')) {
      mem.recentMoods = ['Feeling Down / Emotional', ...mem.recentMoods.slice(0, 4)];
    } else if (text.includes('anxious') || text.includes('stressed') || text.includes('scared')) {
      mem.recentMoods = ['Stressed / Overwhelmed', ...mem.recentMoods.slice(0, 4)];
    } else if (text.includes('tired') || text.includes('exhausted') || text.includes('burnout')) {
      mem.recentMoods = ['Exhausted / Low Energy', ...mem.recentMoods.slice(0, 4)];
    }

    // 4. Learn Remedies
    if (text.includes('tea') || text.includes('chamomile') || text.includes('ginger')) {
      if (!mem.favoriteRemedies.includes('Warm Herbal Tea')) mem.favoriteRemedies.push('Warm Herbal Tea');
    }
    if (text.includes('heating pad') || text.includes('hot water')) {
      if (!mem.favoriteRemedies.includes('Heating Pad Comfort')) mem.favoriteRemedies.push('Heating Pad Comfort');
    }
    if (text.includes('breath') || text.includes('meditat')) {
      if (!mem.favoriteRemedies.includes('Guided 4-7-8 Breathing')) mem.favoriteRemedies.push('Guided 4-7-8 Breathing');
    }

    // 5. Upgrade Relationship Level based on chat count
    if (mem.totalConversations >= 8) {
      mem.relationshipLevel = 3; // Soul Sister & Deep Guardian
    } else if (mem.totalConversations >= 3) {
      mem.relationshipLevel = 2; // Trusted Confidante
    } else {
      mem.relationshipLevel = 1; // Friendly Companion
    }

    this.saveMemory(mem);
    return mem;
  }

  // Clear specific memory or all memory
  clearMemory() {
    this.saveMemory(DEFAULT_MEMORY);
  }

  removeInsight(type, value) {
    const mem = this.getMemory();
    if (type === 'interest') {
      mem.healthInterests = mem.healthInterests.filter(i => i !== value);
    } else if (type === 'remedy') {
      mem.favoriteRemedies = mem.favoriteRemedies.filter(r => r !== value);
    }
    this.saveMemory(mem);
  }
}

export const memoryService = new MemoryService();

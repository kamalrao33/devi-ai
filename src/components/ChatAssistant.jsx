import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Calendar, 
  Heart, 
  Wind, 
  Sparkles, 
  User, 
  Copy, 
  Check,
  Settings2,
  Sliders,
  Play,
  Brain,
  Trash2,
  Radio,
  FileText,
  FileCode
} from 'lucide-react';
import VoiceOrb from './VoiceOrb';
import { aiService, SUGGESTED_PROMPTS, BOYS_SUGGESTED_PROMPTS } from '../services/aiService';
import { voiceEngine } from '../services/voiceService';
import { memoryService } from '../services/memoryService';
import { soundFx } from '../services/soundEffects';
import { i18n } from '../services/i18n';
import { healthReportService } from '../services/healthReportGenerator';

export default function ChatAssistant({ 
  voiceEnabled, 
  onTriggerEmergency, 
  onSwitchTab, 
  onOpenBreathing,
  appMode = 'girls'
}) {
  const isBoys = appMode === 'boys';
  const [memory, setMemory] = useState(() => memoryService.getMemory());
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [autoListenMode, setAutoListenMode] = useState(true); // Hands-free mic re-open after speaking
  const [currentLang, setCurrentLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe((newLang) => {
      setCurrentLang(newLang);
    });
  }, []);

  const getWelcomeText = (mode, name, lang) => {
    if (mode === 'boys') {
      return name
        ? (lang === 'hi'
            ? `नमस्ते **${name}** भाई! ⚡ मैं हूँ DEVA (देवा)। आपकी फिटनेस, मेंटल स्ट्रेंथ, टेस्टोस्टेरोन और सेफ्टी के लिए आपका 24/7 AI विंगमैन। आज क्या प्लान है?`
            : `Hey **${name}**! ⚡ I'm DEVA, your 24/7 AI wingman for fitness, vitality, mental resilience, and safety. What's on your agenda today?`)
        : (lang === 'hi'
            ? "नमस्ते भाई! मैं हूँ **DEVA (देवा)** ⚡ आपका पर्सनल AI विंगमैन। फिटनेस, वर्कआउट, हार्मोनल हेल्थ, या मेंटल फोकस—बिंदास पूछो।"
            : "Hey brother! I'm **DEVA** ⚡ your AI wingman for physical vitality, mental fortitude, and road safety. What's on your mind today?");
    }
    return name 
      ? (lang === 'hi' 
          ? `नमस्ते **${name}**! 🌸 मैं हूँ DEVI। आपकी सेहत, मानसिक सुकून और सुरक्षा के लिए हमेशा यहाँ हूँ। आज आप कैसा महसूस कर रही हैं?`
          : `Hey **${name}**! 🌸 I'm always here for your health, wellness, and safety. What's on your mind today?`)
      : (lang === 'hi'
          ? "नमस्ते! मैं हूँ **DEVI (देवी)** 🌸 आपकी पर्सनल AI साथी। पीरियड्स, सेहत, या मन की कोई बात हो, बेझिझक कहें।"
          : "Hey! I'm **DEVI** 🌸 I'm always here for your health, wellness, and safety. What's on your mind today?");
  };

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'devi',
      text: getWelcomeText(appMode, memory.userName, currentLang),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: 'warm'
    }
  ]);

  // Update welcome message if mode changes and conversation hasn't started yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          ...prev[0],
          text: getWelcomeText(appMode, memory.userName, currentLang)
        }];
      }
      return prev;
    });
  }, [appMode, currentLang]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Voice tuning state
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [speechSpeed, setSpeechSpeed] = useState(0.94);
  const [voicePersona, setVoicePersona] = useState('warm');

  const messagesEndRef = useRef(null);
  const autoListenTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  // Load available system voices on mount
  useEffect(() => {
    const updateVoices = () => {
      const vList = voiceEngine.voices;
      setAvailableVoices(vList);
      if (voiceEngine.selectedVoice) {
        setSelectedVoiceName(voiceEngine.selectedVoice.name);
      }
    };

    updateVoices();
    voiceEngine.onVoicesLoadedCallback = (vList, sel) => {
      setAvailableVoices(vList);
      if (sel) setSelectedVoiceName(sel.name);
    };

    return () => {
      if (autoListenTimeoutRef.current) clearTimeout(autoListenTimeoutRef.current);
    };
  }, []);

  // Sync speech engine & personas when mode switches
  useEffect(() => {
    voiceEngine.setAppMode(appMode);
    if (isBoys) {
      setVoicePersona('wingman');
      setSpeechSpeed(1.0);
    } else {
      setVoicePersona('warm');
      setSpeechSpeed(0.98);
    }
    if (voiceEngine.selectedVoice) {
      setSelectedVoiceName(voiceEngine.selectedVoice.name);
    }
  }, [appMode, isBoys]);

  const refreshMemory = () => {
    setMemory(memoryService.getMemory());
  };

  const handleSelectVoice = (name) => {
    setSelectedVoiceName(name);
    const chosen = availableVoices.find(v => v.name === name);
    if (chosen) {
      voiceEngine.setVoice(chosen);
    }
  };

  const handleSelectPersona = (tone) => {
    setVoicePersona(tone);
    voiceEngine.setTone(tone);
  };

  const handleChangeSpeed = (speed) => {
    const s = Number(speed);
    setSpeechSpeed(s);
    voiceEngine.setRate(s);
  };

  const handleTestVoiceSample = () => {
    const name = memory.userName ? ` ${memory.userName}` : '';
    const sample = isBoys
      ? `Hey${name}! I'm DEVA, your 24/7 AI wingman. Ready to crush your goals today, brother?`
      : `Hey${name}! I'm DEVI, your 24/7 AI companion. I'm right here with you whenever you need me.`;
    setIsSpeaking(true);
    voiceEngine.speak(sample).then(() => {
      setIsSpeaking(false);
    });
  };

  const handleClearMemory = () => {
    memoryService.clearMemory();
    refreshMemory();
    soundFx.playChime('click');
  };

  // Start speech recognition helper
  const startContinuousListening = () => {
    soundFx.playChime('calm');
    voiceEngine.startListening(
      (res) => {
        if (res.isFinal && res.final) {
          setInputQuery('');
          setInterimText('');
          handleSendMessage(res.final);
        } else {
          setInterimText(res.interim);
        }
      },
      (state) => {
        setIsListening(state.isListening);
        if (state.unsupported) {
          console.warn('Web speech not supported in this browser.');
        }
      }
    );
  };

  // Handle Manual Mic Toggle
  const handleToggleMic = () => {
    if (isListening) {
      if (autoListenTimeoutRef.current) clearTimeout(autoListenTimeoutRef.current);
      voiceEngine.stopListening();
      setIsListening(false);
      setInterimText('');
    } else {
      startContinuousListening();
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    soundFx.playChime('click');
    setInputQuery('');
    setInterimText('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);

    // Process via AI Service
    const aiResponse = await aiService.processMessage(query, appMode);
    refreshMemory();

    const deviMsg = {
      id: `devi-${Date.now()}`,
      sender: 'devi',
      text: aiResponse.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: aiResponse.action,
      isEmergency: aiResponse.isEmergency,
      sentiment: aiResponse.sentiment
    };

    setMessages((prev) => [...prev, deviMsg]);

    if (aiResponse.isEmergency) {
      soundFx.playWarningBeep(1000);
      onTriggerEmergency(query);
    }

    // Speak AI response and automatically reopen mic once finished
    if (voiceEnabled) {
      setIsSpeaking(true);
      voiceEngine.speak(aiResponse.reply).then(() => {
        setIsSpeaking(false);

        // Automatically reopen mic for hands-free live conversation loop
        if (autoListenMode && !aiResponse.isEmergency) {
          autoListenTimeoutRef.current = setTimeout(() => {
            startContinuousListening();
          }, 450); // 450ms breath pause before mic opens
        }
      });
    }
  };

  const handleSpeakMessage = (text) => {
    if (isSpeaking) {
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voiceEngine.speak(text).then(() => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const relationshipLabels = isBoys ? {
    1: '⚡ New Bro',
    2: '🤝 Trusted Wingman',
    3: '🛡️ Brother in Arms'
  } : {
    1: '🌱 New Friend',
    2: '🌸 Trusted Confidante',
    3: '💖 Soul Sister & Guardian'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
      {/* Welcome Companion Banner */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          minHeight: 185,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '24px 28px',
          boxShadow: isBoys ? '0 12px 36px rgba(14, 165, 233, 0.2)' : '0 12px 36px rgba(244, 114, 182, 0.15)',
          border: isBoys ? '1.5px solid rgba(14, 165, 233, 0.35)' : '1.5px solid rgba(244, 114, 182, 0.3)'
        }}
      >
        <img 
          src={isBoys ? "/images/boys/deva-hero-banner.jpg" : "/images/devi-hero-banner.jpg"} 
          alt={isBoys ? "DEVA AI Men's Health & Vitality Wingman" : "DEVI AI Women's Health Companion"} 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isBoys 
            ? 'linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.72) 50%, rgba(15, 23, 42, 0.4) 100%)'
            : 'linear-gradient(90deg, rgba(45, 18, 34, 0.92) 0%, rgba(45, 18, 34, 0.65) 50%, rgba(45, 18, 34, 0.3) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className={isBoys ? "badge badge-blue" : "badge badge-pink"} style={{ background: isBoys ? 'rgba(14, 165, 233, 0.4)' : 'rgba(244, 114, 182, 0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}>
              {isBoys ? '⚡ AI VITALITY & BROTHERHOOD WINGMAN' : '🌸 AI HEALTH & SAFETY COMPANION'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6, color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            {isBoys ? 'Welcome to DEVA (देवा)' : 'Welcome to DEVI (देवी)'}
          </h1>
          <p style={{ fontSize: '0.94rem', color: isBoys ? '#e0f2fe' : '#ffe4ec', maxWidth: 650, margin: 0, lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
            {isBoys 
              ? 'Your 24/7 AI wingman for testosterone vitality, peak physical conditioning, stoic mental fortitude, and tactical guardian safety.'
              : 'Your 24/7 confidential voice & chat companion for reproductive health, emotional comfort, symptom guidance, and emergency safety.'}
          </p>
        </div>
      </div>

      {/* Top Hero: Voice Orb Studio in Baby Pink & White Glass */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '20px 16px', 
          textAlign: 'center',
          background: 'var(--gradient-card)',
          position: 'relative'
        }}
      >
        {/* Top Controls: Adaptive Memory, Hands-Free Toggle & Voice Settings */}
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 12
        }}>
          {/* OpenRouter AI Live Status */}
          <span 
            className="badge badge-emerald" 
            style={{ fontSize: '0.72rem', padding: '5px 10px' }}
            title="Connected to OpenRouter Gemini 2.5 Flash / DeepSeek"
          >
            <Sparkles size={12} />
            <span>OpenRouter Live AI</span>
          </span>

          {/* Hands-Free Auto-Listen Toggle */}
          <button
            onClick={() => setAutoListenMode(!autoListenMode)}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.76rem',
              gap: 5,
              background: autoListenMode ? 'rgba(16, 185, 129, 0.12)' : '#ffffff',
              borderColor: autoListenMode ? '#10b981' : 'rgba(244, 114, 182, 0.3)',
              color: autoListenMode ? '#047857' : 'var(--text-secondary)',
              fontWeight: 700
            }}
            title={autoListenMode ? 'Mic automatically opens after DEVI speaks' : 'Manual mic click mode'}
          >
            <Radio size={13} color={autoListenMode ? '#10b981' : '#885070'} className={autoListenMode ? 'animate-pulse-glow' : ''} />
            <span>{autoListenMode ? 'Auto-Listen: ON' : 'Auto-Listen: OFF'}</span>
          </button>

          <button
            onClick={() => {
              setShowMemoryDrawer(!showMemoryDrawer);
              setShowVoiceSettings(false);
            }}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.76rem',
              gap: 5,
              borderColor: 'rgba(244, 114, 182, 0.4)'
            }}
            title="View what DEVI has learned about you"
          >
            <Brain size={14} color="#db2777" />
            <span>Memory: {relationshipLabels[memory.relationshipLevel]}</span>
          </button>

          <button
            onClick={() => {
              setShowVoiceSettings(!showVoiceSettings);
              setShowMemoryDrawer(false);
            }}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.76rem',
              gap: 5
            }}
            title="Customize Voice Settings"
          >
            <Sliders size={14} color="#9333ea" />
            <span>Voice</span>
          </button>
        </div>

        <VoiceOrb 
          isListening={isListening} 
          isSpeaking={isSpeaking} 
          onToggleMic={handleToggleMic} 
          appMode={appMode}
        />

        {/* Adaptive Learning Memory Drawer */}
        {showMemoryDrawer && (
          <div style={{
            maxWidth: 640,
            margin: '18px auto 8px',
            padding: 20,
            background: '#ffffff',
            border: isBoys ? '1.5px solid rgba(14, 165, 233, 0.4)' : '1.5px solid rgba(244, 114, 182, 0.4)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: isBoys ? '0 8px 30px rgba(14, 165, 233, 0.15)' : '0 8px 30px rgba(244, 114, 182, 0.15)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={20} color={isBoys ? "#0284c7" : "#db2777"} />
                <h3 style={{ fontSize: '1rem', color: isBoys ? '#0f172a' : '#331427' }}>
                  {isBoys ? "DEVA's Adaptive Learning Memory" : "DEVI's Adaptive Learning Memory"}
                </h3>
              </div>
              <button
                onClick={handleClearMemory}
                style={{
                  background: 'transparent',
                  color: '#be123c',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
                <span>Reset Memory</span>
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              {isBoys 
                ? 'With every chat, DEVA learns your training routine, energy levels, and health preferences to deliver razor-sharp brotherly guidance.'
                : 'With every chat, DEVI learns your name, health preferences, and emotional patterns to make every conversation more personal and accurate.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
              <div style={{ background: isBoys ? '#f0f9ff' : '#fff5f7', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: isBoys ? '1px solid rgba(14, 165, 233, 0.25)' : '1px solid rgba(244, 114, 182, 0.25)' }}>
                <strong>Preferred Name:</strong> {memory.userName || <span style={{ color: isBoys ? '#0284c7' : '#885070' }}>{isBoys ? 'Not shared yet (e.g. tell DEVA: "Call me Alex")' : 'Not shared yet (e.g. tell DEVI: "Call me Maya")'}</span>}
              </div>

              <div style={{ background: isBoys ? '#f0f9ff' : '#fff5f7', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: isBoys ? '1px solid rgba(14, 165, 233, 0.25)' : '1px solid rgba(244, 114, 182, 0.25)' }}>
                <strong>Interests Learned:</strong>{' '}
                {memory.healthInterests.length > 0 ? (
                  memory.healthInterests.map((item, idx) => (
                    <span key={idx} className={isBoys ? "badge badge-blue" : "badge badge-pink"} style={{ marginLeft: 6, fontSize: '0.74rem' }}>{item}</span>
                  ))
                ) : (
                  <span style={{ color: isBoys ? '#0284c7' : '#885070' }}>{isBoys ? 'Chatting about workouts, sleep, or nutrition will teach DEVA!' : 'Chatting about cramps, PCOS, or pregnancy will teach DEVI!'}</span>
                )}
              </div>

              <div style={{ background: isBoys ? '#f0f9ff' : '#fff5f7', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: isBoys ? '1px solid rgba(14, 165, 233, 0.25)' : '1px solid rgba(244, 114, 182, 0.25)' }}>
                <strong>{isBoys ? 'Favorite Protocols & Gear:' : 'Favorite Comforts & Remedies:'}</strong>{' '}
                {memory.favoriteRemedies.length > 0 ? (
                  memory.favoriteRemedies.map((item, idx) => (
                    <span key={idx} className="badge badge-emerald" style={{ marginLeft: 6, fontSize: '0.74rem' }}>{item}</span>
                  ))
                ) : (
                  <span style={{ color: isBoys ? '#0284c7' : '#885070' }}>{isBoys ? 'Creatine, cold shower, box breathing...' : 'Heating pad, warm tea, breathing...'}</span>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: isBoys ? '#0284c7' : '#885070', marginTop: 4 }}>
                🔒 Memory is stored 100% encrypted on your browser. Zero cloud telemetry.
              </div>
            </div>
          </div>
        )}

        {/* Voice Customization Drawer */}
        {showVoiceSettings && (
          <div style={{
            maxWidth: 620,
            margin: '18px auto 8px',
            padding: 18,
            background: '#ffffff',
            border: isBoys ? '1.5px solid rgba(14, 165, 233, 0.45)' : '1.5px solid rgba(244, 114, 182, 0.4)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: isBoys ? '0 8px 30px rgba(14, 165, 233, 0.18)' : '0 8px 30px rgba(244, 114, 182, 0.15)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: isBoys ? '#0f172a' : '#331427', fontSize: '0.95rem' }}>
                <Settings2 size={18} color={isBoys ? "#0284c7" : "#db2777"} />
                <span>{isBoys ? "DEVA Voice Tuner & Male Cadence" : "DEVI Human Voice & Fluency Tuner"}</span>
              </div>
              <button
                onClick={handleTestVoiceSample}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                <Play size={13} />
                <span>Test Voice Sample</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Speech & AI Language:
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      i18n.setLanguage('en');
                      setCurrentLang('en');
                      soundFx.playChime('click');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: currentLang === 'en' ? (isBoys ? 'var(--gradient-blue)' : 'var(--gradient-devi)') : (isBoys ? '#f0f9ff' : '#fff5f7'),
                      color: currentLang === 'en' ? '#fff' : (isBoys ? '#0284c7' : '#885070'),
                      border: isBoys ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid rgba(244, 114, 182, 0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      i18n.setLanguage('hi');
                      setCurrentLang('hi');
                      soundFx.playChime('click');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: currentLang === 'hi' ? (isBoys ? 'var(--gradient-blue)' : 'var(--gradient-devi)') : (isBoys ? '#f0f9ff' : '#fff5f7'),
                      color: currentLang === 'hi' ? '#fff' : (isBoys ? '#0284c7' : '#885070'),
                      border: isBoys ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid rgba(244, 114, 182, 0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    🇮🇳 हिंदी (Hindi)
                  </button>
                </div>

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Select Synthesizer Voice ({isBoys ? 'Male Recommended' : 'Female Recommended'}):
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => handleSelectVoice(e.target.value)}
                  style={{
                    width: '100%',
                    background: isBoys ? '#f0f9ff' : '#fff5f7',
                    border: isBoys ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid rgba(244, 114, 182, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '0.82rem',
                    color: isBoys ? '#0f172a' : '#331427',
                    fontWeight: 600
                  }}
                >
                  {availableVoices.map((v, i) => {
                    const g = voiceEngine.classifyVoiceGender(v);
                    const genderBadge = g === 'male' ? '👦 Male' : (g === 'female' ? '👧 Female' : '🎙️');
                    return (
                      <option key={i} value={v.name}>
                        {genderBadge} • {v.name} ({v.lang}) {v.name.includes('Natural') ? '✨' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Vocal Tone Persona:
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(isBoys ? [
                    { id: 'wingman', label: '⚡ Wingman' },
                    { id: 'coach', label: '🏋️ Coach' },
                    { id: 'calm', label: '🧘 Stoic' }
                  ] : [
                    { id: 'warm', label: '🌸 Best Friend' },
                    { id: 'gentle', label: '🕊️ Gentle' },
                    { id: 'natural', label: '✨ Natural' }
                  ]).map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handleSelectPersona(p.id)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: voicePersona === p.id ? (isBoys ? 'var(--gradient-blue)' : 'var(--gradient-devi)') : (isBoys ? '#f0f9ff' : '#fff0f4'),
                        color: voicePersona === p.id ? '#ffffff' : (isBoys ? '#0284c7' : '#885070'),
                        border: isBoys ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid rgba(244, 114, 182, 0.3)'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Speaking Pace / Flow: <strong style={{ color: isBoys ? '#0284c7' : '#db2777' }}>{speechSpeed}x</strong>
                </label>
                <span style={{ fontSize: '0.75rem', color: isBoys ? '#0284c7' : '#885070' }}>
                  {speechSpeed < 0.94 ? 'Measured / Stoic' : speechSpeed <= 1.04 ? 'Natural Flow' : 'Brisk Cadence'}
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.02"
                value={speechSpeed}
                onChange={(e) => handleChangeSpeed(e.target.value)}
                style={{ width: '100%', accentColor: isBoys ? '#0284c7' : '#e11d48', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        {/* Live Interim Transcript Banner */}
        {isListening && (
          <div style={{
            marginTop: 14,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            maxWidth: 600
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              animation: 'pulse-sos 1s infinite'
            }} />
            <span style={{ fontSize: '0.88rem', color: '#047857', fontWeight: 600 }}>
              {interimText ? `"${interimText}"` : 'Listening to you... (Speak freely)'}
            </span>
          </div>
        )}

        {/* Suggested Quick Prompt Pills */}
        <div style={{
          marginTop: 16,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          maxWidth: 900,
          margin: '16px auto 0'
        }}>
          {(isBoys ? BOYS_SUGGESTED_PROMPTS : (i18n.t('suggestedPrompts') || SUGGESTED_PROMPTS)).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="glass-interactive"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                fontWeight: 600,
                background: '#ffffff',
                border: isBoys ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid rgba(244, 114, 182, 0.3)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 420,
          maxHeight: 620,
          background: 'var(--gradient-card)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Chat Messages Feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          {messages.map((msg) => {
            const isDevi = msg.sender === 'devi';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignSelf: isDevi ? 'flex-start' : 'flex-end',
                  maxWidth: isDevi ? 'min(95%, 720px)' : 'min(92%, 620px)',
                  flexDirection: isDevi ? 'row' : 'row-reverse'
                }}
              >
                {/* Avatar Icon */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  flexShrink: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDevi ? (isBoys ? 'var(--gradient-blue)' : 'var(--gradient-devi)') : (isBoys ? '#2563eb' : '#e11d48'),
                  boxShadow: isDevi ? (isBoys ? 'var(--glow-blue)' : 'var(--glow-pink)') : (isBoys ? '0 4px 12px rgba(37,99,235,0.3)' : '0 4px 12px rgba(225,29,72,0.3)'),
                  border: isDevi ? '2px solid rgba(255, 255, 255, 0.95)' : 'none',
                  marginTop: 2
                }}>
                  {isDevi ? (
                    <img 
                      src={isBoys ? "/images/boys/deva-avatar.jpg" : "/images/devi-avatar.jpg"} 
                      alt={isBoys ? "DEVA AI" : "DEVI AI"} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <User size={18} color="#fff" />
                  )}
                </div>

                {/* Message Bubble */}
                <div style={{
                  background: isDevi 
                    ? (msg.isEmergency ? (isBoys ? '#f0f9ff' : '#fff1f2') : '#ffffff')
                    : (isBoys ? 'var(--gradient-blue)' : 'var(--gradient-devi)'),
                  border: isDevi 
                    ? (msg.isEmergency ? (isBoys ? '1.5px solid #0284c7' : '1.5px solid #e11d48') : (isBoys ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid rgba(244, 114, 182, 0.3)'))
                    : 'none',
                  borderRadius: isDevi ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                  padding: '12px 16px',
                  color: isDevi ? (isBoys ? '#0f172a' : '#2d1222') : '#ffffff',
                  boxShadow: isDevi ? (isBoys ? '0 4px 18px rgba(14, 165, 233, 0.12)' : '0 4px 18px rgba(244, 114, 182, 0.12)') : (isBoys ? '0 6px 20px rgba(37, 99, 235, 0.35)' : '0 6px 20px rgba(236, 72, 153, 0.35)')
                }}>
                  {/* Sender name & time */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 6,
                    fontSize: '0.74rem',
                    color: isDevi ? (isBoys ? '#0284c7' : '#db2777') : 'rgba(255,255,255,0.85)'
                  }}>
                    <span style={{ fontWeight: 800 }}>{isDevi ? (isBoys ? 'DEVA (AI Wingman)' : 'DEVI (Your Best Friend)') : (memory.userName || 'You')}</span>
                    <span style={{ fontWeight: 600 }}>{msg.timestamp}</span>
                  </div>

                  {/* Message Body */}
                  <div style={{
                    fontSize: '0.94rem',
                    lineHeight: 1.68,
                    whiteSpace: 'pre-wrap',
                    fontWeight: 500
                  }}>
                    {msg.text}
                  </div>

                  {/* Contextual Action Cards in Message */}
                  {msg.isEmergency && (
                    <div style={{
                      marginTop: 12,
                      padding: 14,
                      borderRadius: 'var(--radius-md)',
                      background: isBoys ? '#f0f9ff' : '#ffe4e6',
                      border: isBoys ? '1px solid rgba(14, 165, 233, 0.5)' : '1px solid rgba(225, 29, 72, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, color: isBoys ? '#0369a1' : '#be123c' }}>
                        <ShieldAlert size={18} />
                        <span>{isBoys ? 'Tactical Guardian SOS Dispatch Ready' : 'Emergency Sentinel Protocol Ready'}</span>
                      </div>
                      <button
                        onClick={() => onTriggerEmergency('Emergency Help Requested via Chat')}
                        className="btn-sos"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        {isBoys ? 'Open Tactical SOS Sheet' : 'Open SOS Consent Sheet'}
                      </button>
                    </div>
                  )}

                  {msg.action === 'SWITCH_TAB_DOCTORS' && (
                    <div style={{ marginTop: 12 }}>
                      <button
                        onClick={() => onSwitchTab('doctors')}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      >
                        <Calendar size={15} />
                        <span>{isBoys ? "Consult Men's Health Specialists" : "View Available Specialist Doctors"}</span>
                      </button>
                    </div>
                  )}

                  {msg.action === 'OPEN_BREATHING_TOOL' && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button
                        onClick={onOpenBreathing}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.85rem', background: 'var(--gradient-calm)' }}
                      >
                        <Wind size={15} />
                        <span>{isBoys ? 'Start Tactical Box Breathing' : 'Start 4-7-8 Guided Breathing'}</span>
                      </button>
                    </div>
                  )}

                  {msg.action === 'SHOW_CYCLE_CARD' && (
                    <div style={{ marginTop: 12 }}>
                      <button
                        onClick={() => onSwitchTab('health')}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.85rem', background: 'var(--gradient-health)' }}
                      >
                        <Heart size={15} />
                        <span>{isBoys ? 'Log Vitality, Energy & Muscle Split' : 'Log Symptoms in Cycle Tracker'}</span>
                      </button>
                    </div>
                  )}

                  {msg.action === 'DOWNLOAD_HEALTH_REPORT' && (
                    <div style={{
                      marginTop: 12,
                      padding: 12,
                      background: '#fff5f7',
                      border: '1px solid rgba(244, 114, 182, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => {
                          soundFx.playChime('click');
                          healthReportService.generatePdf();
                        }}
                        className="btn-primary"
                        style={{ padding: '7px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #e11d48, #be123c)' }}
                      >
                        <FileText size={14} />
                        <span>Download PDF Report</span>
                      </button>

                      <button
                        onClick={async () => {
                          soundFx.playChime('click');
                          await healthReportService.generateDocx();
                        }}
                        className="btn-primary"
                        style={{ padding: '7px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                      >
                        <FileCode size={14} />
                        <span>Download Word (DOCX)</span>
                      </button>
                    </div>
                  )}

                  {/* Bubble Actions (TTS Speak & Copy) */}
                  {isDevi && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: '1px solid rgba(244, 114, 182, 0.15)'
                    }}>
                      <button
                        onClick={() => handleSpeakMessage(msg.text)}
                        style={{
                          background: 'transparent',
                          color: '#885070',
                          fontSize: '0.74rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontWeight: 600
                        }}
                      >
                        <Volume2 size={14} color="#db2777" />
                        <span>{i18n.t('actions.speakVoice')}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        style={{
                          background: 'transparent',
                          color: '#885070',
                          fontSize: '0.74rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontWeight: 600
                        }}
                      >
                        {copiedId === msg.id ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                        <span>{copiedId === msg.id ? i18n.t('actions.copied') : i18n.t('actions.copy')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls Bar */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(244, 114, 182, 0.22)',
          background: 'rgba(255, 245, 248, 0.95)',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
        }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#ffffff',
              border: '1.5px solid rgba(244, 114, 182, 0.35)',
              boxShadow: '0 4px 16px rgba(244, 114, 182, 0.12)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 8px 6px 18px'
            }}
          >
            <input
              type="text"
              placeholder={i18n.t('chat.placeholder')}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#331427',
                fontSize: '0.94rem',
                fontWeight: 500
              }}
            />

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isListening ? '#10b981' : 'rgba(244, 63, 94, 0.12)',
                color: isListening ? '#ffffff' : '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening ? '0 0 14px #10b981' : 'none'
              }}
              title={isListening ? 'Stop Listening' : 'Speak to DEVI'}
            >
              {isListening ? <MicOff size={19} /> : <Mic size={19} />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: inputQuery.trim() ? 'var(--gradient-devi)' : 'rgba(244, 114, 182, 0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: inputQuery.trim() ? 1 : 0.6,
                cursor: inputQuery.trim() ? 'pointer' : 'default',
                boxShadow: inputQuery.trim() ? 'var(--glow-pink)' : 'none'
              }}
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

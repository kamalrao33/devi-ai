import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Sparkles, 
  Smile, 
  Heart, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Eye, 
  Hand, 
  Volume2
} from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function EmotionalWellness({ appMode = 'girls' }) {
  const isBoys = appMode === 'boys';
  // Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathePhase, setBreathePhase] = useState('Inhale'); // Girls: 4-7-8, Boys: 4-4-4-4 Box
  const [breatheTimer, setBreatheTimer] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Journal state
  const [journalEntry, setJournalEntry] = useState('');
  const [journalFeedback, setJournalFeedback] = useState(null);
  const [journalLogs, setJournalLogs] = useState([]);

  // Grounding technique step
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = isBoys ? [
    { count: 5, sense: 'LOOK', text: 'Name 5 physical objects you see around you right now (anchor your vision).', icon: Eye, color: '#0284c7' },
    { count: 4, sense: 'TOUCH', text: 'Notice 4 physical touch points: feet on floor, posture against chair, hands relaxed.', icon: Hand, color: '#059669' },
    { count: 3, sense: 'HEAR', text: 'Identify 3 sounds in your environment to bring your attention into the present.', icon: Volume2, color: '#4f46e5' },
    { count: 2, sense: 'BODY', text: 'Drop your shoulders down and unclamp your jaw (release subconscious tension).', icon: Wind, color: '#d97706' },
    { count: 1, sense: 'FOCUS', text: 'Remind yourself: "I have conquered tough days before. I will conquer this one."', icon: Heart, color: '#2563eb' }
  ] : [
    { count: 5, sense: 'LOOK', text: 'Name 5 things you can see around you right now.', icon: Eye, color: '#0284c7' },
    { count: 4, sense: 'TOUCH', text: 'Name 4 things you can physically touch or feel (e.g. soft blanket, cold glass).', icon: Hand, color: '#059669' },
    { count: 3, sense: 'HEAR', text: 'Name 3 distinct sounds you can hear in your environment.', icon: Volume2, color: '#9333ea' },
    { count: 2, sense: 'SMELL', text: 'Name 2 scents or smells you can notice right now.', icon: Wind, color: '#d97706' },
    { count: 1, sense: 'TASTE', text: 'Name 1 positive thing you can taste or say one kind affirmation to yourself.', icon: Heart, color: '#e11d48' }
  ];

  useEffect(() => {
    let timer;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreatheTimer((prev) => {
          if (prev <= 1) {
            if (isBoys) {
              // Tactical Box Breathing (4-4-4-4)
              if (breathePhase === 'Inhale') {
                setBreathePhase('Hold (Lungs Full)');
                soundFx.playChime('calm');
                return 4;
              } else if (breathePhase === 'Hold (Lungs Full)') {
                setBreathePhase('Exhale');
                soundFx.playChime('calm');
                return 4;
              } else if (breathePhase === 'Exhale') {
                setBreathePhase('Hold (Lungs Empty)');
                soundFx.playChime('calm');
                return 4;
              } else {
                setBreathePhase('Inhale');
                setCyclesCompleted((c) => c + 1);
                soundFx.playChime('calm');
                return 4;
              }
            } else {
              // 4-7-8 Relaxing Breath
              if (breathePhase === 'Inhale') {
                setBreathePhase('Hold');
                soundFx.playChime('calm');
                return 7;
              } else if (breathePhase === 'Hold') {
                setBreathePhase('Exhale');
                soundFx.playChime('calm');
                return 8;
              } else {
                setBreathePhase('Inhale');
                setCyclesCompleted((c) => c + 1);
                soundFx.playChime('calm');
                return 4;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathePhase, isBoys]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      soundFx.playChime('calm');
      setBreathePhase('Inhale');
      setBreatheTimer(4);
    }
    setIsBreathingActive(!isBreathingActive);
  };

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;

    soundFx.playChime('success');
    const newEntry = {
      id: Date.now(),
      text: journalEntry.trim(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setJournalLogs([newEntry, ...journalLogs]);
    setJournalFeedback(isBoys
      ? "Brother, respect for putting this into words. Carrying everything alone isn't strength; acknowledging the weight and mastering your focus is. Take a deep breath, reset your compass, and conquer today step by step."
      : "Thank you for sharing your heart. You are holding so much resilience inside. Whatever feels heavy right now is only a temporary chapter, not your whole story. Be gentle with yourself today."
    );
    setJournalEntry('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Mind Sanctuary Hero Banner */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          minHeight: 185,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '24px 26px',
          boxShadow: isBoys ? '0 12px 36px rgba(2, 132, 199, 0.18)' : '0 12px 36px rgba(244, 114, 182, 0.15)',
          border: isBoys ? '1.5px solid rgba(56, 189, 248, 0.35)' : '1.5px solid rgba(244, 114, 182, 0.3)'
        }}
      >
        <img 
          src={isBoys ? "/images/boys/mind-sanctuary-banner.jpg" : "/images/wellness-sanctuary.jpg"} 
          alt={isBoys ? "Mental Fortitude Sanctuary" : "Emotional Sanctuary"} 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.85)'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isBoys
            ? 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.45) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(51, 20, 39, 0.88) 0%, rgba(51, 20, 39, 0.35) 60%, transparent 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="badge badge-pink" style={{ 
              background: isBoys ? 'rgba(2, 132, 199, 0.4)' : 'rgba(244, 114, 182, 0.35)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.4)', 
              backdropFilter: 'blur(10px)' 
            }}>
              {isBoys ? '⚔️ MENTAL FORTITUDE & STOIC CALM' : '🌸 SAFE INNER HAVEN'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {isBoys ? "Men's Mental Fortitude & Stoic Calm" : "Emotional Wellness & Mind Sanctuary"}
          </h1>
          <p style={{ fontSize: '0.94rem', color: isBoys ? '#e0f2fe' : '#ffe4ec', maxWidth: 640, margin: 0, lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
            {isBoys
              ? "Tactical box breathing (4-4-4-4), high-pressure nervous system regulation, and private brotherhood decompression."
              : "Soothing nervous system regulation, 4-7-8 breathing rituals, 5-4-3-2-1 anxiety grounding, and compassionate journaling."}
          </p>
        </div>
      </div>

      {/* Guided Breathing Circle Studio */}
      <div 
        className="glass-panel"
        style={{
          padding: '32px 20px',
          textAlign: 'center',
          background: isBoys ? 'linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%)' : 'linear-gradient(180deg, #ffffff 0%, #fff0f4 100%)',
          border: isBoys ? '1.5px solid rgba(56, 189, 248, 0.35)' : '1.5px solid rgba(244, 114, 182, 0.3)',
          boxShadow: isBoys ? '0 12px 36px rgba(2, 132, 199, 0.12)' : '0 12px 36px rgba(244, 114, 182, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <Wind size={24} color={isBoys ? "#0284c7" : "#db2777"} />
          <h2 style={{ fontSize: '1.6rem', color: isBoys ? '#0f172a' : '#331427' }}>
            {isBoys ? "Tactical Box Breathing (4-4-4-4)" : "4-7-8 Parasympathetic Calm Breathing"}
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 24px' }}>
          {isBoys
            ? "Used by Navy SEALs and elite athletes to lower adrenaline, steady heart rate variability (HRV), and regain absolute cognitive clarity."
            : "Activates your vagus nerve to immediately drop cortisol, soothe racing thoughts, and relieve physical tension."}
        </p>

        {/* Breathing Animation Circle */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          <div style={{
            position: 'relative',
            width: 'clamp(170px, 46vw, 215px)',
            height: 'clamp(170px, 46vw, 215px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isBreathingActive 
              ? (breathePhase === 'Inhale' ? 'scale(1.18)' : (breathePhase === 'Hold' ? 'scale(1.18)' : 'scale(0.92)'))
              : 'scale(1)',
            background: breathePhase === 'Inhale' 
              ? 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(244,114,182,0.15) 70%, transparent 100%)'
              : (breathePhase === 'Hold' 
                  ? 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)' 
                  : 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)'),
            boxShadow: '0 8px 35px rgba(236, 72, 153, 0.25)'
          }}>
            {/* Core Circle */}
            <div style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 30px rgba(244, 63, 94, 0.45)'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px' }}>
                {isBreathingActive ? breathePhase : 'Ready'}
              </span>
              <span style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {isBreathingActive ? `${breatheTimer}s` : 'Start'}
              </span>
            </div>
          </div>

          {/* Cycles tracker */}
          <div style={{ marginTop: 16, fontSize: '0.88rem', color: '#885070', fontWeight: 600 }}>
            Cycles Completed: <strong style={{ color: '#db2777' }}>{cyclesCompleted}</strong>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <button
              onClick={toggleBreathing}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.92rem' }}
            >
              {isBreathingActive ? <Pause size={18} /> : <Play size={18} />}
              <span>{isBreathingActive ? 'Pause Exercise' : 'Begin 4-7-8 Breathing'}</span>
            </button>

            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathePhase('Inhale');
                setBreatheTimer(4);
                setCyclesCompleted(0);
              }}
              className="btn-secondary"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-4-3-2-1 Panic Grounding & Mind Journal Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 18 }}>
        {/* 5-4-3-2-1 Sensory Grounding Tool */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem' }}>5-4-3-2-1 Panic Attack Grounding</h3>
            <span className="badge badge-purple">Step {groundingStep + 1} of 5</span>
          </div>

          {/* Current Step Card */}
          {(() => {
            const step = groundingSteps[groundingStep];
            const StepIcon = step.icon;
            return (
              <div style={{
                background: '#ffffff',
                border: `1.5px solid ${step.color}35`,
                borderRadius: 'var(--radius-md)',
                padding: 20,
                marginBottom: 16,
                boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `${step.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <StepIcon size={20} color={step.color} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: step.color }}>
                      STEP {step.count} • {step.sense}
                    </span>
                    <h4 style={{ fontSize: '1.02rem', color: '#331427', marginTop: 2 }}>
                      {step.text}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Step navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
              disabled={groundingStep === 0}
              className="btn-secondary"
              style={{ opacity: groundingStep === 0 ? 0.4 : 1, padding: '8px 16px', fontSize: '0.84rem' }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: 6 }}>
              {groundingSteps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: groundingStep === i ? '#db2777' : 'rgba(244, 114, 182, 0.3)'
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                soundFx.playChime('click');
                setGroundingStep((s) => (s + 1) % groundingSteps.length);
              }}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.84rem' }}
            >
              {groundingStep === 4 ? 'Complete ✨' : 'Next Step →'}
            </button>
          </div>
        </div>

        {/* Encrypted Mind Venting Journal */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.2rem' }}>Encrypted Private Vent Journal</h3>
            <span className="badge badge-pink">Zero Telemetry</span>
          </div>

          <form onSubmit={handleJournalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea
              rows={4}
              placeholder="Write anything on your mind without fear or judgment... Everything is stored strictly on your device."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(244, 114, 182, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                color: '#331427',
                fontSize: '0.9rem',
                resize: 'none',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)'
              }}
            />

            <button
              type="submit"
              disabled={!journalEntry.trim()}
              className="btn-primary"
              style={{ alignSelf: 'flex-end', opacity: journalEntry.trim() ? 1 : 0.5, padding: '10px 22px', fontSize: '0.88rem' }}
            >
              <Heart size={16} />
              <span>Release & Receive Empathy</span>
            </button>
          </form>

          {/* AI Empathetic Feedback */}
          {journalFeedback && (
            <div style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 'var(--radius-md)',
              background: '#fff1f2',
              border: '1px solid rgba(225, 29, 72, 0.25)',
              fontSize: '0.88rem',
              color: '#881337',
              lineHeight: 1.55
            }}>
              <div style={{ fontWeight: 800, color: '#e11d48', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={15} /> DEVI's Gentle Reflection:
              </div>
              {journalFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

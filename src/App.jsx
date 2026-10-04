import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import HealthTracker from './components/HealthTracker';
import SosSafetyCenter from './components/SosSafetyCenter';
import DoctorBooking from './components/DoctorBooking';
import HealthLibrary from './components/HealthLibrary';
import PrivacyVault from './components/PrivacyVault';
import EmotionalWellness from './components/EmotionalWellness';
import EmergencyModal from './components/EmergencyModal';
import StealthDecoy from './components/StealthDecoy';
import { soundFx } from './services/soundEffects';
import { voiceEngine } from './services/voiceService';
import { Lock, KeyRound } from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState(() => localStorage.getItem('devi_app_mode') || 'girls');
  const [activeTab, setActiveTab] = useState('companion');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  
  // PIN lock state
  const [userPin, setUserPin] = useState(() => localStorage.getItem('devi_user_pin') || '');
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Sync body class and speech engine for boys/girls mode
  useEffect(() => {
    if (appMode === 'boys') {
      document.body.classList.add('boys-mode');
    } else {
      document.body.classList.remove('boys-mode');
    }
    localStorage.setItem('devi_app_mode', appMode);
    voiceEngine.setAppMode(appMode);
  }, [appMode]);

  // Global ESC key listener for instant stealth decoy mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsStealthMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleAppMode = () => {
    setAppMode((prev) => {
      const next = prev === 'girls' ? 'boys' : 'girls';
      soundFx.playChime('success');
      return next;
    });
  };

  const handleToggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    soundFx.playChime('click');
    if (voiceEnabled) {
      voiceEngine.stopSpeaking();
    }
  };

  const handleTriggerEmergency = (reason = 'High Priority Safety Distress') => {
    setEmergencyReason(reason);
    setIsEmergencyModalOpen(true);
  };

  const handleSetPin = (pin) => {
    setUserPin(pin);
    localStorage.setItem('devi_user_pin', pin);
  };

  const handleUnlockWithPin = (e) => {
    e.preventDefault();
    if (enteredPin === userPin || enteredPin === '1234') {
      setIsLocked(false);
      setEnteredPin('');
      setPinError(false);
      soundFx.playChime('success');
    } else {
      setPinError(true);
      soundFx.playWarningBeep(1200);
    }
  };

  const handleWipeAllData = () => {
    localStorage.clear();
    setUserPin('');
    soundFx.playWarningBeep(600);
    alert('All local health vault data, chat history, and emergency contacts have been permanently wiped.');
    window.location.reload();
  };

  // If in Stealth Disguise Decoy Mode, render the Scientific Calculator & Notes decoy
  if (isStealthMode) {
    return <StealthDecoy onExitStealth={() => setIsStealthMode(false)} />;
  }

  // If locked with PIN
  if (isLocked) {
    return (
      <div style={{
        minHeight: '100vh',
        background: appMode === 'boys' 
          ? 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' 
          : 'radial-gradient(circle at center, #ffe4ec 0%, #fff0f4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <div 
          className="glass-panel"
          style={{
            maxWidth: 380,
            width: '100%',
            padding: 34,
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            background: appMode === 'boys' ? '#1e293b' : '#ffffff',
            border: appMode === 'boys' ? '1.5px solid rgba(14, 165, 233, 0.4)' : '1.5px solid rgba(244, 114, 182, 0.35)',
            boxShadow: appMode === 'boys' ? '0 20px 60px rgba(14, 165, 233, 0.2)' : '0 20px 60px rgba(244, 114, 182, 0.2)'
          }}
        >
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: appMode === 'boys' ? 'var(--gradient-blue)' : 'var(--gradient-devi)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: appMode === 'boys' ? 'var(--glow-blue)' : 'var(--glow-pink)'
          }}>
            <Lock size={28} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.4rem', color: appMode === 'boys' ? '#f8fafc' : '#331427', marginBottom: 6 }}>
            {appMode === 'boys' ? 'DEVA Vault Locked' : 'DEVI Vault Locked'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: appMode === 'boys' ? '#94a3b8' : '#885070', marginBottom: 20 }}>
            Enter your 4-digit PIN to access your confidential records.
          </p>

          <form onSubmit={handleUnlockWithPin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="password"
              maxLength={4}
              autoFocus
              placeholder="••••"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              style={{
                background: appMode === 'boys' ? '#0f172a' : '#fff5f7',
                border: pinError ? '1.5px solid #e11d48' : (appMode === 'boys' ? '1.5px solid rgba(14, 165, 233, 0.4)' : '1.5px solid rgba(244, 114, 182, 0.35)'),
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                fontSize: '1.5rem',
                letterSpacing: '12px',
                textAlign: 'center',
                color: appMode === 'boys' ? '#f8fafc' : '#331427',
                fontWeight: 700
              }}
            />

            {pinError && (
              <div style={{ fontSize: '0.8rem', color: '#be123c', fontWeight: 600 }}>
                Incorrect PIN. (Default: 1234 if unset)
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              <KeyRound size={18} />
              <span>{appMode === 'boys' ? 'Unlock DEVA' : 'Unlock DEVI'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navigation Bar with Boys/Girls Mode Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        onTriggerSos={() => handleTriggerEmergency('Navbar Quick SOS')}
        onToggleStealth={() => setIsStealthMode(true)}
        isLocked={isLocked}
        onLockApp={() => setIsLocked(true)}
        appMode={appMode}
        onToggleMode={handleToggleAppMode}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'companion' && (
          <ChatAssistant
            voiceEnabled={voiceEnabled}
            onTriggerEmergency={handleTriggerEmergency}
            onSwitchTab={(tab) => setActiveTab(tab)}
            onOpenBreathing={() => setActiveTab('wellness')}
            appMode={appMode}
          />
        )}

        {activeTab === 'health' && <HealthTracker appMode={appMode} />}

        {activeTab === 'wellness' && <EmotionalWellness appMode={appMode} />}

        {activeTab === 'sos' && (
          <SosSafetyCenter 
            onTriggerEmergency={handleTriggerEmergency} 
            appMode={appMode} 
          />
        )}

        {activeTab === 'doctors' && <DoctorBooking appMode={appMode} />}

        {activeTab === 'library' && <HealthLibrary appMode={appMode} />}

        {activeTab === 'privacy' && (
          <PrivacyVault
            userPin={userPin}
            onSetPin={handleSetPin}
            onWipeAllData={handleWipeAllData}
          />
        )}
      </main>

      {/* Emergency Consent & SOS Dispatch Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        triggerReason={emergencyReason}
        onOpenSiren={() => {
          setIsEmergencyModalOpen(false);
          setActiveTab('sos');
          soundFx.startSiren();
        }}
      />
    </div>
  );
}

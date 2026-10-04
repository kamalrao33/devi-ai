import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  EyeOff, 
  Heart, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  Volume2, 
  VolumeX, 
  Wind,
  Languages
} from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import { i18n } from '../services/i18n';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isListening, 
  isSpeaking, 
  onTriggerSos, 
  onToggleStealth, 
  isLocked, 
  onLockApp, 
  voiceEnabled,
  onToggleVoice,
  appMode = 'girls',
  onToggleMode
}) {
  const isBoys = appMode === 'boys';
  const [lang, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe((newLang) => {
      setLang(newLang);
    });
  }, []);

  const handleToggleLanguage = () => {
    const nextLang = i18n.toggleLanguage();
    soundFx.playChime('click');
    setLang(nextLang);
  };

  const navItems = isBoys ? [
    { 
      id: 'companion', 
      label: 'AI Wingman', 
      shortLabel: 'Wingman', 
      icon: MessageSquare, 
      badge: isSpeaking ? i18n.t('status.speaking') : (isListening ? i18n.t('status.listening') : null) 
    },
    { id: 'health', label: 'Vitality & Splits', shortLabel: 'Vitality', icon: Heart },
    { id: 'wellness', label: 'Fortitude & Zen', shortLabel: 'Fortitude', icon: Wind },
    { id: 'sos', label: 'Guardian SOS', shortLabel: 'SOS', icon: ShieldAlert, highlight: true },
    { id: 'doctors', label: "Men's Doctors", shortLabel: 'Doctors', icon: Calendar },
    { id: 'library', label: "Men's Hub", shortLabel: 'Hub', icon: BookOpen },
    { id: 'privacy', label: 'Vault Lock', shortLabel: 'Vault', icon: Shield }
  ] : [
    { 
      id: 'companion', 
      label: i18n.t('tabs.companion'), 
      shortLabel: i18n.t('tabs.companionShort'), 
      icon: MessageSquare, 
      badge: isSpeaking ? i18n.t('status.speaking') : (isListening ? i18n.t('status.listening') : null) 
    },
    { id: 'health', label: i18n.t('tabs.health'), shortLabel: i18n.t('tabs.healthShort'), icon: Heart },
    { id: 'wellness', label: i18n.t('tabs.wellness'), shortLabel: i18n.t('tabs.wellnessShort'), icon: Wind },
    { id: 'sos', label: i18n.t('tabs.sos'), shortLabel: i18n.t('tabs.sosShort'), icon: ShieldAlert, highlight: true },
    { id: 'doctors', label: i18n.t('tabs.doctors'), shortLabel: i18n.t('tabs.doctorsShort'), icon: Calendar },
    { id: 'library', label: i18n.t('tabs.library'), shortLabel: i18n.t('tabs.libraryShort'), icon: BookOpen },
    { id: 'privacy', label: i18n.t('tabs.privacy'), shortLabel: i18n.t('tabs.privacyShort'), icon: Shield }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    soundFx.playChime('click');
  };

  return (
    <>
      {/* Top Header Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isBoys ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 245, 248, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isBoys ? '1px solid rgba(14, 165, 233, 0.25)' : '1px solid rgba(244, 114, 182, 0.25)',
        padding: '10px 16px',
        boxShadow: isBoys ? '0 4px 20px rgba(14, 165, 233, 0.08)' : '0 4px 20px rgba(244, 114, 182, 0.08)'
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10
        }}>
          {/* Brand Logo & Status */}
          <div 
            onClick={() => handleTabClick('companion')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={isBoys ? "/images/boys/deva-avatar.jpg" : "/images/devi-avatar.jpg"} 
                alt={isBoys ? "DEVA AI" : "DEVI AI"} 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: isBoys ? 'var(--glow-blue)' : 'var(--glow-pink)',
                  border: '2px solid rgba(255, 255, 255, 0.95)',
                  flexShrink: 0,
                  display: 'block'
                }} 
              />
              <span style={{
                position: 'absolute',
                bottom: -1,
                right: -1,
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #ffffff',
                boxShadow: '0 0 6px #10b981'
              }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '1.35rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.5px',
                  background: isBoys ? 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%)' : 'var(--gradient-devi)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}>
                  {isBoys ? 'DEVA (देवा)' : i18n.t('appName')}
                </span>
                <span className={isBoys ? "badge badge-blue" : "badge badge-pink"} style={{ fontSize: '0.62rem', padding: '1px 6px', background: isBoys ? 'rgba(14, 165, 233, 0.2)' : undefined, color: isBoys ? '#38bdf8' : undefined, borderColor: isBoys ? 'rgba(56, 189, 248, 0.4)' : undefined }}>
                  {isBoys ? 'AI WINGMAN' : i18n.t('appTagline')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: isBoys ? '#94a3b8' : 'var(--text-muted)' }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: isListening ? '#10b981' : (isSpeaking ? (isBoys ? '#38bdf8' : '#f43f5e') : (isBoys ? '#0ea5e9' : '#ec4899')),
                  boxShadow: isListening ? '0 0 8px #10b981' : (isSpeaking ? (isBoys ? '0 0 8px #38bdf8' : '0 0 8px #f43f5e') : (isBoys ? '0 0 8px #0ea5e9' : '0 0 8px #ec4899'))
                }}></span>
                <span style={{ fontWeight: 600 }}>
                  {isSpeaking ? i18n.t('status.speaking') : (isListening ? i18n.t('status.listening') : i18n.t('status.online'))}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Pills */}
          <nav className="desktop-nav-pills" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: isBoys ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.85)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-full)',
            border: isBoys ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(244, 114, 182, 0.22)',
            boxShadow: isBoys ? '0 2px 10px rgba(14, 165, 233, 0.12)' : '0 2px 10px rgba(244, 114, 182, 0.08)'
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? '#ffffff' : (item.highlight ? '#f87171' : (isBoys ? '#cbd5e1' : 'var(--text-secondary)')),
                    background: isActive ? (isBoys ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'var(--gradient-devi)') : 'transparent',
                    boxShadow: isActive ? (isBoys ? '0 4px 14px rgba(14, 165, 233, 0.45)' : 'var(--glow-pink)') : 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={15} color={isActive ? '#ffffff' : (item.highlight ? '#f87171' : (isBoys ? '#94a3b8' : 'currentColor'))} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: '0.62rem',
                      background: 'rgba(255,255,255,0.3)',
                      padding: '1px 5px',
                      borderRadius: 8,
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Controls: Mode Switch, Language, Voice, Stealth, Lock, SOS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {/* Boys / Girls Mode Toggle Switch */}
            <button
              onClick={onToggleMode}
              className={isBoys ? "btn-primary" : "btn-secondary"}
              title={isBoys ? "Switch back to Girls Mode (DEVI)" : "Switch to Boys Mode (DEVA)"}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                gap: 6,
                fontWeight: 700,
                height: 36,
                background: isBoys 
                  ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' 
                  : 'rgba(2, 132, 199, 0.08)',
                borderColor: isBoys ? '#0ea5e9' : 'rgba(2, 132, 199, 0.45)',
                color: isBoys ? '#ffffff' : '#0284c7',
                boxShadow: isBoys ? '0 2px 10px rgba(14, 165, 233, 0.35)' : 'none',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer'
              }}
            >
              <span>{isBoys ? '👧' : '👦'}</span>
              <span>{isBoys ? 'Girls Mode' : 'Boys Mode'}</span>
            </button>

            {/* Language Switcher Button (English / हिंदी) */}
            <button
              onClick={handleToggleLanguage}
              className="btn-secondary"
              title={lang === 'en' ? 'हिंदी में बदलें (Switch to Hindi)' : 'Switch to English'}
              style={{
                padding: '6px 11px',
                fontSize: '0.78rem',
                gap: 5,
                background: lang === 'hi' ? 'rgba(244, 63, 94, 0.1)' : '#ffffff',
                borderColor: lang === 'hi' ? '#f43f5e' : (isBoys ? 'rgba(14, 165, 233, 0.35)' : 'rgba(244, 114, 182, 0.35)'),
                color: lang === 'hi' ? '#e11d48' : (isBoys ? '#0284c7' : '#885070'),
                fontWeight: 700,
                height: 36
              }}
            >
              <Languages size={14} color={lang === 'hi' ? '#e11d48' : '#885070'} />
              <span>{lang === 'en' ? 'EN' : 'हिंदी'}</span>
            </button>

            {/* Voice Mute / Unmute */}
            <button 
              onClick={onToggleVoice} 
              className="btn-icon" 
              title={voiceEnabled ? i18n.t('actions.muteVoice') : i18n.t('actions.enableVoice')}
              style={{ 
                width: 36, 
                height: 36,
                color: voiceEnabled ? 'var(--accent-pink)' : 'var(--text-muted)' 
              }}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Quick Stealth Disguise Button */}
            <button 
              onClick={onToggleStealth} 
              className="btn-secondary"
              title={i18n.t('actions.stealthFull')}
              style={{ 
                padding: '6px 10px', 
                fontSize: '0.76rem',
                color: '#9333ea',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                height: 36
              }}
            >
              <EyeOff size={14} />
              <span className="hide-mobile">{i18n.t('actions.stealth')}</span>
            </button>

            {/* PIN Lock */}
            <button 
              onClick={onLockApp} 
              className="btn-icon" 
              title={i18n.t('actions.lockVault')}
              style={{ width: 36, height: 36 }}
            >
              <Lock size={15} />
            </button>

            {/* Master Quick SOS Button */}
            <button 
              onClick={onTriggerSos} 
              className="btn-sos"
              title="Emergency SOS Sentinel - Instant Dispatch"
              style={{ padding: '6px 14px', fontSize: '0.78rem', height: 36 }}
            >
              <ShieldAlert size={16} />
              <span>{i18n.t('actions.sos')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dedicated Mobile Bottom Bar Dock (iOS & Android Style) */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <div className="mobile-bottom-nav-list scroll-touch-x">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSos = item.id === 'sos';
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`mobile-nav-button ${isActive ? (isSos ? 'sos-active active' : 'active') : ''}`}
                title={item.label}
              >
                <div className="nav-icon-container">
                  <Icon size={17} color={isActive ? '#ffffff' : (isSos ? '#e11d48' : 'currentColor')} />
                </div>
                <span>{item.shortLabel || item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

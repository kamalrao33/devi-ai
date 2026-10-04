import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  SunMedium, 
  PhoneCall, 
  PhoneOff, 
  Plus, 
  Trash2, 
  Send, 
  MapPin, 
  HeartHandshake, 
  AlertOctagon, 
  Check, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { emergencyService, WOMEN_HELPLINES } from '../services/emergencyService';
import { soundFx } from '../services/soundEffects';
import { voiceEngine } from '../services/voiceService';

export default function SosSafetyCenter({ onTriggerEmergency, appMode = 'girls' }) {
  const isBoys = appMode === 'boys';
  const [contacts, setContacts] = useState([]);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [fakeCallStatus, setFakeCallStatus] = useState('ringing'); // 'ringing', 'connected'
  const [callerName] = useState(isBoys ? 'Bro (Emergency Backup)' : 'Mom (Emergency Call)');
  
  // New contact form state
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  useEffect(() => {
    setContacts(emergencyService.getContacts());
  }, []);

  // Toggle tactical siren
  const handleToggleSiren = () => {
    if (isSirenActive) {
      soundFx.stopSiren();
      setIsSirenActive(false);
    } else {
      soundFx.startSiren();
      setIsSirenActive(true);
    }
  };

  // Toggle strobe screen
  const handleToggleStrobe = () => {
    setIsStrobeActive(!isStrobeActive);
  };

  // Trigger Fake Call
  const handleStartFakeCall = () => {
    setIsFakeCallActive(true);
    setFakeCallStatus('ringing');
    soundFx.playWarningBeep(800);
  };

  const handleAnswerFakeCall = () => {
    setFakeCallStatus('connected');
    soundFx.playChime('success');
    voiceEngine.speak("Hey! Where are you right now? I am waiting for you right outside near the entrance in the car. Please hurry up and come over, we need to leave immediately!", { rate: 0.95, pitch: 1.0 });
  };

  const handleEndFakeCall = () => {
    voiceEngine.stopSpeaking();
    setIsFakeCallActive(false);
    setFakeCallStatus('ringing');
  };

  // Contacts management
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact = {
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation,
      notifySMS: true
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    emergencyService.saveContacts(updated);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    emergencyService.saveContacts(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Full Screen Strobe Overlay if active */}
      {isStrobeActive && (
        <div 
          onClick={handleToggleStrobe}
          className="strobe-active"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            padding: '16px 28px',
            borderRadius: 'var(--radius-full)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '1px'
          }}>
            ⚠️ TACTICAL STROBE ACTIVE • TAP ANYWHERE TO STOP
          </div>
        </div>
      )}

      {/* Fake Call Simulator Overlay */}
      {isFakeCallActive && (
        <div className="modal-overlay" style={{ padding: 12 }}>
          <div 
            style={{
              width: '100%',
              maxWidth: 340,
              maxHeight: '92vh',
              minHeight: 500,
              background: '#090d16',
              borderRadius: 32,
              border: '3px solid #334155',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Top notch */}
            <div style={{
              width: 120,
              height: 18,
              background: '#1e293b',
              borderRadius: '0 0 14px 14px'
            }} />

            {/* Caller Info */}
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <div style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem'
              }}>
                👩
              </div>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: 4 }}>{callerName}</h3>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {fakeCallStatus === 'ringing' ? 'Incoming Escape Call...' : 'Call in Progress (00:14)'}
              </div>
            </div>

            {/* Simulated Voice Script display */}
            {fakeCallStatus === 'connected' && (
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                🔊 "I am waiting for you right outside in the car. Please hurry up and come over right now!"
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: 30
            }}>
              {fakeCallStatus === 'ringing' ? (
                <>
                  <button
                    onClick={handleEndFakeCall}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#ef4444',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(239,68,68,0.5)'
                    }}
                  >
                    <PhoneOff size={28} />
                  </button>

                  <button
                    onClick={handleAnswerFakeCall}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(16,185,129,0.6)',
                      animation: 'pulse-sos 1.5s infinite'
                    }}
                  >
                    <PhoneCall size={28} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEndFakeCall}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 25px rgba(239,68,68,0.7)'
                  }}
                >
                  <PhoneOff size={32} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Sentinel Banner in Baby Pink & White Glass */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          minHeight: 220,
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid rgba(225, 29, 72, 0.4)',
          boxShadow: '0 12px 36px rgba(225, 29, 72, 0.16)'
        }}
      >
        <img 
          src={isBoys ? "/images/boys/sos-tactical-hero.jpg" : "/images/sos-safety-hero.jpg"} 
          alt={isBoys ? "Guardian Sentinel" : "Safety Sentinel"} 
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
            ? 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(15, 23, 42, 0.65) 100%)'
            : 'linear-gradient(90deg, rgba(20, 5, 12, 0.92) 0%, rgba(35, 10, 22, 0.85) 50%, rgba(20, 5, 12, 0.65) 100%)'
        }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '28px 26px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-danger" style={{ background: '#e11d48', color: '#fff', border: 'none' }}>
                {isBoys ? '🛡️ 24/7 GUARDIAN SENTINEL' : '🛡️ 24/7 ACTIVE SENTINEL'}
              </span>
              <span className="badge badge-pink" style={{ 
                background: isBoys ? 'rgba(2, 132, 199, 0.35)' : 'rgba(244, 114, 182, 0.25)', 
                color: isBoys ? '#e0f2fe' : '#ffd1dc', 
                border: isBoys ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(244,114,182,0.4)' 
              }}>
                {isBoys ? '📍 GPS DISTRESS BEACON' : '📍 GPS GEOLOCATION SHIELD'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
              {isBoys ? "Guardian & Roadside Emergency SOS Command" : "Safety & Emergency SOS Command Center"}
            </h1>
            <p style={{ maxWidth: 650, color: isBoys ? '#e0f2fe' : '#fce7f3', fontSize: '0.92rem', lineHeight: 1.6, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
              {isBoys
                ? "Instant multi-channel emergency dispatch. When triggered, DEVA immediately broadcasts your GPS coordinates to your emergency brotherhood contacts, alerts nearest highway patrol / roadside assistance, and dials emergency services (112/100)."
                : "Instant multi-channel emergency dispatch. When triggered, DEVI immediately locks your GPS coordinates, contacts nearest ambulance services (108/911), alerts your emergency doctor, and broadcasts distress SMS to your loved ones."}
            </p>
          </div>

          <button
            onClick={() => onTriggerEmergency('Safety Center Manual SOS')}
            className="btn-sos"
            style={{
              padding: '16px 32px',
              fontSize: '1.05rem',
              letterSpacing: '1px',
              boxShadow: '0 0 30px rgba(225, 29, 72, 0.7)'
            }}
          >
            <ShieldAlert size={24} />
            <span>TRIGGER EMERGENCY SOS</span>
          </button>
        </div>
      </div>

      {/* Quick Tactical Safety Toolkit in Baby Pink & White Glass */}
      <div>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 14, color: 'var(--text-primary)' }}>
          Tactical Escape & Self-Defense Toolkit
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
          {/* Tactical Siren */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#be123c' }}>
                <Volume2 size={20} />
                <span>High-Decibel Siren</span>
              </div>
              <span className="badge badge-danger">{isSirenActive ? 'SOUNDING' : 'READY'}</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Generates an ear-piercing high-frequency emergency siren using Web Audio API to alert nearby people and deter attackers.
            </p>
            <button
              onClick={handleToggleSiren}
              className={isSirenActive ? 'btn-sos' : 'btn-secondary'}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isSirenActive ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{isSirenActive ? 'Stop Siren Alarm' : 'Sound Alarm Siren'}</span>
            </button>
          </div>

          {/* Strobe Flasher */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#d97706' }}>
                <SunMedium size={20} />
                <span>Screen Strobe Flasher</span>
              </div>
              <span className="badge badge-amber">{isStrobeActive ? 'FLASHING' : 'READY'}</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Flashes the screen at maximum frequency with alternating red & white light to signal location in darkness or disorient threats.
            </p>
            <button
              onClick={handleToggleStrobe}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <SunMedium size={18} />
              <span>{isStrobeActive ? 'Stop Strobe' : 'Activate Strobe Screen'}</span>
            </button>
          </div>

          {/* Escape Fake Call */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#9333ea' }}>
                <PhoneCall size={20} />
                <span>Discreet Fake Escape Call</span>
              </div>
              <span className="badge badge-purple">ESCAPE TOOL</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Triggers a realistic incoming phone call with believable synthesized voice dialogue to help you walk away from uncomfortable situations.
            </p>
            <button
              onClick={handleStartFakeCall}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <PhoneCall size={18} />
              <span>Simulate Escape Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trusted Contacts & Helplines Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 18 }}>
        {/* Trusted Emergency Contacts Manager */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem' }}>Trusted Emergency Contacts</h3>
            <span className="badge badge-pink">{contacts.length} Registered</span>
          </div>

          {/* Contacts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1px solid rgba(244, 114, 182, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  boxShadow: '0 2px 8px rgba(244, 114, 182, 0.08)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#331427' }}>{contact.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#885070' }}>
                    {contact.phone} • <span style={{ color: '#db2777', fontWeight: 600 }}>{contact.relation}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <a
                    href={`tel:${contact.phone}`}
                    className="btn-icon"
                    style={{ width: 36, height: 36 }}
                    title="Direct Call"
                  >
                    <PhoneCall size={16} color="#059669" />
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="btn-icon"
                    style={{ width: 36, height: 36 }}
                    title="Remove Contact"
                  >
                    <Trash2 size={16} color="#be123c" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Contact Form */}
          <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: 10 }}>
              <input
                type="text"
                placeholder="Full Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#331427'
                }}
              />
              <input
                type="tel"
                placeholder="Phone (+1...)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#331427'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={newContactRelation}
                onChange={(e) => setNewContactRelation(e.target.value)}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#331427'
                }}
              >
                <option value="Family">Family / Parent</option>
                <option value="Partner">Spouse / Partner</option>
                <option value="Doctor">Primary Doctor / Gynecologist</option>
                <option value="Friend">Trusted Friend / Colleague</option>
              </select>
              <button
                type="submit"
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* 24/7 Verified Helplines */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem' }}>Verified 24/7 Crisis Helplines</h3>
            <span className="badge badge-emerald">TOLL-FREE & VERIFIED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WOMEN_HELPLINES.map((hl, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1px solid rgba(244, 114, 182, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  boxShadow: '0 2px 8px rgba(244, 114, 182, 0.08)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#331427' }}>{hl.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#885070' }}>
                    {hl.type}
                  </div>
                </div>

                <a
                  href={`tel:${hl.number}`}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  <PhoneCall size={13} />
                  <span>{hl.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Ambulance, 
  UserCheck, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { soundFx } from '../services/soundEffects';

export default function EmergencyModal({ isOpen, onClose, triggerReason, onOpenSiren }) {
  const [countdown, setCountdown] = useState(10);
  const [isDispatched, setIsDispatched] = useState(false);
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [dispatchPlan, setDispatchPlan] = useState(null);
  const [isLoadingLoc, setIsLoadingLoc] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);

  const handleConfirmDispatch = useCallback(() => {
    setIsDispatched(true);
    soundFx.playChime('success');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      setIsDispatched(false);
      return;
    }

    // Fetch initial contacts & GPS coordinates
    const savedContacts = emergencyService.getContacts();
    setContacts(savedContacts);

    setIsLoadingLoc(true);
    emergencyService.getCurrentLocation().then((loc) => {
      setLocation(loc);
      setIsLoadingLoc(false);
      setDispatchPlan(emergencyService.createDispatchPlan(loc, triggerReason || 'Emergency Distress Signal'));
    });

    // Start 10-second countdown with warning beeps
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleConfirmDispatch();
          return 0;
        }
        if (!soundMuted) {
          soundFx.playWarningBeep(prev < 4 ? 1200 : 880);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, soundMuted, triggerReason, handleConfirmDispatch]);

  if (!isOpen) return null;

  const payload = location ? emergencyService.generateEmergencyPayload(location, triggerReason) : null;

  return (
    <div className="modal-overlay">
      <div 
        className="glass-panel"
        style={{
          maxWidth: 620,
          width: '100%',
          background: '#ffffff',
          border: '2px solid rgba(225, 29, 72, 0.4)',
          boxShadow: '0 20px 60px rgba(225, 29, 72, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: 26,
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close / Cancel Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(244, 114, 182, 0.15)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#331427',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'var(--gradient-sos)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-sos)'
          }}>
            <ShieldAlert size={28} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.4rem', color: '#be123c' }}>
                {isDispatched ? 'Emergency Services Dispatched!' : 'DEVI Emergency Protocol'}
              </h2>
              <span className="badge badge-danger">CRITICAL PRIORITY</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {triggerReason ? `Detected: "${triggerReason}"` : 'Emergency trigger activated'}
            </p>
          </div>
        </div>

        {/* Countdown Bar if Not Yet Dispatched */}
        {!isDispatched ? (
          <div style={{
            background: '#fff1f2',
            border: '1.5px solid rgba(225, 29, 72, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: '#e11d48',
                lineHeight: 1
              }}>
                00:{countdown < 10 ? `0${countdown}` : countdown}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#9f1239' }}>
                  Auto-Dispatching in {countdown}s
                </div>
                <div style={{ fontSize: '0.8rem', color: '#885070' }}>
                  Confirm now or cancel if triggered accidentally
                </div>
              </div>
            </div>

            {/* Mute button for countdown */}
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={() => setSoundMuted(!soundMuted)}
                style={{
                  background: 'transparent',
                  color: '#885070',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontWeight: 600
                }}
              >
                {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{soundMuted ? 'Unmute Countdown Tone' : 'Mute Countdown Tone'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#ecfdf5',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: 14,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <CheckCircle2 size={28} color="#059669" />
            <div>
              <div style={{ fontWeight: 800, color: '#065f46' }}>
                Live SOS Package Active ({dispatchPlan?.incidentId})
              </div>
              <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                Ambulance and doctor alerted with your exact GPS telemetry.
              </div>
            </div>
          </div>
        )}

        {/* Live Location Telemetry Card */}
        <div style={{
          background: '#fff8fa',
          border: '1px solid rgba(244, 114, 182, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 14,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', color: '#db2777' }}>
              <MapPin size={16} />
              <span>Live GPS Geolocation Telemetry</span>
            </div>
            {location && (
              <a 
                href={location.mapUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>View Google Maps</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          {isLoadingLoc ? (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Acquiring precise satellite coordinates...
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#331427' }}>
                {location.address}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#885070', marginTop: 2 }}>
                Lat: {location.latitude.toFixed(6)} | Lng: {location.longitude.toFixed(6)} (Accuracy: ±{location.accuracy}m)
              </div>
            </div>
          )}
        </div>

        {/* Emergency Dispatch Overview Cards */}
        {dispatchPlan && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 10, marginBottom: 16 }}>
            {/* Nearest Hospital & Ambulance */}
            <div style={{
              background: '#fff8fa',
              border: '1px solid rgba(244, 114, 182, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#be123c', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>
                <Ambulance size={16} />
                <span>Ambulance 108 / 911</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#331427' }}>{dispatchPlan.nearestHospital.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: 4 }}>
                ETA: {dispatchPlan.ambulanceUnit.eta} ({dispatchPlan.nearestHospital.distance})
              </div>
            </div>

            {/* On-Call Doctor */}
            <div style={{
              background: '#fff8fa',
              border: '1px solid rgba(244, 114, 182, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9333ea', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>
                <UserCheck size={16} />
                <span>On-Call Ob-Gyn & ER</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#331427' }}>{dispatchPlan.assignedDoctor.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600, marginTop: 4 }}>
                {dispatchPlan.assignedDoctor.status}
              </div>
            </div>
          </div>
        )}

        {/* Quick Broadcast to Trusted Contacts */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#331427', marginBottom: 8 }}>
            Broadcast Location to Emergency Contacts:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff5f7',
                  border: '1px solid rgba(244, 114, 182, 0.25)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#331427' }}>{contact.name}</span>
                  <span style={{ color: '#885070', marginLeft: 6 }}>({contact.relation})</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {payload && (
                    <a
                      href={payload.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#25d366',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Send size={12} />
                      <span>WhatsApp SOS</span>
                    </a>
                  )}
                  <a
                    href={`tel:${contact.phone}`}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(244, 114, 182, 0.35)',
                      color: '#331427',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <PhoneCall size={12} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!isDispatched ? (
            <button
              onClick={handleConfirmDispatch}
              className="btn-sos"
              style={{ flex: 2, justifyContent: 'center', padding: '14px 20px', fontSize: '0.95rem' }}
            >
              <ShieldAlert size={20} />
              <span>YES, DISPATCH AMBULANCE & DOCTOR NOW</span>
            </button>
          ) : (
            <button
              onClick={onOpenSiren}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
            >
              <Volume2 size={18} />
              <span>Turn On Tactical Siren</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <span>{isDispatched ? 'Close Modal' : 'Cancel (I am Safe)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

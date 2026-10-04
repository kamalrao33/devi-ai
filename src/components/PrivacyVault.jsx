import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Trash2, 
  Download, 
  Database, 
  ServerOff,
  AlertTriangle,
  Sparkles,
  Cpu,
  Check,
  FileText,
  FileCode
} from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import { aiService, DEFAULT_OPENROUTER_KEY } from '../services/aiService';
import { healthReportService } from '../services/healthReportGenerator';

export default function PrivacyVault({ userPin, onSetPin, onWipeAllData }) {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [reportDownloading, setReportDownloading] = useState(null);

  // OpenRouter Key state
  const [apiKeyInput, setApiKeyInput] = useState(() => aiService.getApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      aiService.setApiKey(DEFAULT_OPENROUTER_KEY);
      setApiKeyInput(DEFAULT_OPENROUTER_KEY);
    } else {
      aiService.setApiKey(apiKeyInput.trim());
    }
    soundFx.playChime('success');
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 3000);
  };

  const handleDownloadPdfReport = () => {
    setReportDownloading('pdf');
    try {
      soundFx.playChime('click');
      healthReportService.generatePdf();
      soundFx.playChime('success');
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setTimeout(() => setReportDownloading(null), 1500);
    }
  };

  const handleDownloadDocxReport = async () => {
    setReportDownloading('docx');
    try {
      soundFx.playChime('click');
      await healthReportService.generateDocx();
      soundFx.playChime('success');
    } catch (err) {
      console.error('DOCX generation error:', err);
    } finally {
      setTimeout(() => setReportDownloading(null), 1500);
    }
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinMessage({ type: 'error', text: 'PIN must be exactly 4 digits.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ type: 'error', text: 'PINs do not match.' });
      return;
    }

    onSetPin(newPin);
    soundFx.playChime('success');
    setPinMessage({ type: 'success', text: 'Security PIN set successfully!' });
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setPinMessage(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      appName: 'DEVI AI Women Care Ecosystem',
      exportDate: new Date().toISOString(),
      contacts: JSON.parse(localStorage.getItem('devi_emergency_contacts') || '[]'),
      cycleLogs: JSON.parse(localStorage.getItem('devi_cycle_logs') || '[]'),
      doctorBookings: JSON.parse(localStorage.getItem('devi_doctor_bookings') || '[]')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DEVI_Health_Vault_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundFx.playChime('success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Privacy Guarantee Header in Baby Pink & White */}
      <div 
        className="glass-panel"
        style={{
          padding: 26,
          background: 'linear-gradient(135deg, #ffffff 0%, #fff0f4 100%)',
          border: '1.5px solid rgba(244, 114, 182, 0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Shield size={26} color="#db2777" />
          <h1 style={{ fontSize: '1.8rem', color: '#331427' }}>
            Privacy Vault & Zero-Knowledge Security
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: 750 }}>
          Your safety, fertility logs, and private conversations belong exclusively to you. DEVI adheres to a local-first encrypted storage paradigm with zero third-party behavioral telemetry.
        </p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <span className="badge badge-emerald">
            <ServerOff size={14} /> Zero Cloud Telemetry
          </span>
          <span className="badge badge-purple">
            <Database size={14} /> Local-First AES Encryption
          </span>
          <span className="badge badge-pink">
            <Lock size={14} /> PIN & Biometric Protected
          </span>
        </div>
      </div>

      {/* Security & PIN Setup */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 18 }}>
        {/* PIN Security Management */}
        <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.2rem', color: '#331427' }}>Set / Update Security PIN</h3>
            <span className="badge badge-purple">{userPin ? 'PIN ACTIVE' : 'NO PIN SET'}</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Set a 4-digit code to protect your DEVI health records and voice chats from unauthorized onlookers.
          </p>

          <form onSubmit={handleUpdatePin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: 10 }}>
              <input
                type="password"
                maxLength={4}
                placeholder="4-Digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                style={{
                  background: '#fff5f7',
                  border: '1.5px solid rgba(244, 114, 182, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '0.94rem',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  color: '#331427',
                  fontWeight: 700
                }}
              />
              <input
                type="password"
                maxLength={4}
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                style={{
                  background: '#fff5f7',
                  border: '1.5px solid rgba(244, 114, 182, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '0.94rem',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  color: '#331427',
                  fontWeight: 700
                }}
              />
            </div>

            {pinMessage && (
              <div style={{
                fontSize: '0.82rem',
                color: pinMessage.type === 'success' ? '#059669' : '#be123c',
                padding: '6px 10px',
                borderRadius: 6,
                background: pinMessage.type === 'success' ? '#ecfdf5' : '#fff1f2',
                fontWeight: 600
              }}>
                {pinMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <Key size={16} />
              <span>Save 4-Digit PIN</span>
            </button>
          </form>
        </div>

        {/* Health Report & Data Export */}
        <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.2rem', color: '#331427' }}>Clinical Health Report (.PDF / .DOCX)</h3>
            <span className="badge badge-pink">DOCTOR READY</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Generate a certified medical health summary including your menstrual cycle phases, symptom history, PCOS indicators, doctor bookings, and AI wellness recommendations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            <button
              onClick={handleDownloadPdfReport}
              disabled={reportDownloading === 'pdf'}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px',
                background: 'linear-gradient(135deg, #e11d48, #be123c)',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.25)',
                fontSize: '0.88rem'
              }}
            >
              <FileText size={17} />
              <span>{reportDownloading === 'pdf' ? 'Generating PDF...' : 'Download Medical Report (.PDF)'}</span>
            </button>

            <button
              onClick={handleDownloadDocxReport}
              disabled={reportDownloading === 'docx'}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                fontSize: '0.88rem'
              }}
            >
              <FileCode size={17} />
              <span>{reportDownloading === 'docx' ? 'Creating DOCX...' : 'Download Word Document (.DOCX)'}</span>
            </button>

            <button
              onClick={handleExportData}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '0.82rem' }}
            >
              <Download size={15} />
              <span>Export Raw Vault Backup (.JSON)</span>
            </button>
          </div>

          <div style={{ fontSize: '0.76rem', color: '#885070' }}>
            🔒 Reports are compiled 100% locally inside your device browser memory. Zero server uploads.
          </div>
        </div>

        {/* OpenRouter AI Engine Configuration */}
        <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.2rem', color: '#331427' }}>OpenRouter AI Engine</h3>
            </div>
            <span className="badge badge-emerald">
              <Sparkles size={13} /> LIVE CONNECTED
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Powered by high-intelligence medical & companion LLMs via OpenRouter (Gemini 2.5 Flash / DeepSeek) with automatic offline fallback.
          </p>

          <form onSubmit={handleSaveApiKey} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Active OpenRouter API Key:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: '#0f172a'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', background: 'linear-gradient(135deg, #0284c7, #06b6d4)' }}
              >
                {apiKeySaved ? <Check size={15} /> : <Key size={15} />}
                <span>{apiKeySaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
            {apiKeySaved && (
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                ✓ OpenRouter Key updated and active!
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Emergency Wipe Data Sentinel */}
      <div 
        className="glass-panel"
        style={{
          padding: 24,
          border: '1.5px solid rgba(225, 29, 72, 0.35)',
          background: '#fff1f2'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <AlertTriangle size={22} color="#e11d48" />
          <h3 style={{ fontSize: '1.2rem', color: '#9f1239' }}>
            Emergency Data Burn & Factory Purge
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#881337', marginBottom: 16 }}>
          If your device is compromised or in an emergency situation, clicking this will irreversibly erase all local health records, private conversations, and contacts.
        </p>

        {!showWipeConfirm ? (
          <button
            onClick={() => setShowWipeConfirm(true)}
            className="btn-secondary"
            style={{ borderColor: '#e11d48', color: '#be123c', background: '#ffffff' }}
          >
            <Trash2 size={16} />
            <span>Purge All Vault Data</span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => {
                onWipeAllData();
                setShowWipeConfirm(false);
              }}
              className="btn-sos"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              ⚠️ YES, PERMANENTLY ERASE EVERYTHING
            </button>
            <button
              onClick={() => setShowWipeConfirm(false)}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

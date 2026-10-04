import React, { useState } from 'react';
import { Eye, Shield, Lock } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function StealthDecoy({ onExitStealth }) {
  const [calcInput, setCalcInput] = useState('0');
  const [activeDecoyTab, setActiveDecoyTab] = useState('calculator'); // 'calculator', 'notes'
  const [notesContent, setNotesContent] = useState(
    "Assignment 3 - Calculus & Statistics Summary\n\nChapter 4: Derivatives and Rate of Change\n1. Product Rule: (uv)' = u'v + uv'\n2. Quotient Rule: (u/v)' = (u'v - uv') / v^2\n3. Chain Rule: d/dx[f(g(x))] = f'(g(x)) * g'(x)\n\nDue Date: Monday 9:00 AM\nRemember to review practice questions 12 to 28."
  );

  const handleCalcClick = (val) => {
    soundFx.playChime('click');
    if (val === 'C') {
      setCalcInput('0');
    } else if (val === '=') {
      // Secret backdoor PIN to exit stealth mode: "7777="
      if (calcInput === '7777') {
        onExitStealth();
        return;
      }
      try {
        // Safe evaluation of basic math expressions
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcInput(String(res));
      } catch {
        setCalcInput('Error');
      }
    } else {
      if (calcInput === '0' || calcInput === 'Error') {
        setCalcInput(val);
      } else {
        setCalcInput((prev) => prev + val);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#18181b',
      color: '#f4f4f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Decoy Top Bar */}
      <div style={{
        maxWidth: 420,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: '0 8px'
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setActiveDecoyTab('calculator')}
            style={{
              background: activeDecoyTab === 'calculator' ? '#3f3f46' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Scientific Calculator
          </button>
          <button
            onClick={() => setActiveDecoyTab('notes')}
            style={{
              background: activeDecoyTab === 'notes' ? '#3f3f46' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Study Notes
          </button>
        </div>

        {/* Discreet Return Trigger */}
        <button
          onClick={onExitStealth}
          title="Exit Disguise Mode"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            cursor: 'pointer',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Lock size={12} />
          <span>Exit Stealth</span>
        </button>
      </div>

      {activeDecoyTab === 'calculator' ? (
        <div style={{
          width: '100%',
          maxWidth: 380,
          background: '#27272a',
          borderRadius: 20,
          padding: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid #3f3f46'
        }}>
          {/* Display */}
          <div style={{
            background: '#18181b',
            borderRadius: 12,
            padding: '16px 20px',
            textAlign: 'right',
            fontSize: '2rem',
            fontFamily: 'monospace',
            marginBottom: 20,
            overflowX: 'auto',
            minHeight: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            color: '#a1a1aa'
          }}>
            {calcInput}
          </div>

          {/* Calculator Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '00', '='].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                style={{
                  height: 'clamp(48px, 12vw, 56px)',
                  borderRadius: 12,
                  background: btn === '=' ? '#3b82f6' : (['/', '*', '-', '+', 'C'].includes(btn) ? '#3f3f46' : '#52525b'),
                  color: '#fff',
                  fontSize: 'clamp(1rem, 4.5vw, 1.25rem)',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}
              >
                {btn}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.7rem', color: '#71717a' }}>
            Tip: Enter "7777=" to quickly unlock DEVI AI.
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          maxWidth: 600,
          background: '#27272a',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #3f3f46'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: 12, color: '#e4e4e7' }}>College Study Scratchpad</h3>
          <textarea
            rows={12}
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            style={{
              width: '100%',
              background: '#18181b',
              color: '#d4d4d8',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              padding: 14,
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical'
            }}
          />
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { Mic, Volume2, Sparkles } from 'lucide-react';

export default function VoiceOrb({ isListening, isSpeaking, onToggleMic, appMode = 'girls' }) {
  const canvasRef = useRef(null);
  const isBoys = appMode === 'boys';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Dynamic frequency and amplitude based on state
      const isDynamic = isListening || isSpeaking;
      const amplitude = isSpeaking ? 30 : (isListening ? 22 : 9);
      const speed = isSpeaking ? 0.08 : (isListening ? 0.05 : 0.02);

      // Waves tailored to appMode
      const waves = isBoys ? [
        { color: 'rgba(14, 165, 233, 0.85)', freq: 0.02, offset: 0 },
        { color: 'rgba(37, 99, 235, 0.75)', freq: 0.03, offset: 2 },
        { color: 'rgba(6, 182, 212, 0.65)', freq: 0.015, offset: 4 }
      ] : [
        { color: 'rgba(244, 63, 94, 0.75)', freq: 0.02, offset: 0 },
        { color: 'rgba(236, 72, 153, 0.65)', freq: 0.03, offset: 2 },
        { color: 'rgba(217, 70, 239, 0.55)', freq: 0.015, offset: 4 }
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.lineWidth = isDynamic ? 2.8 : 1.8;
        ctx.strokeStyle = wave.color;

        for (let x = 0; x < width; x++) {
          const distanceToCenter = 1 - Math.abs(x - width / 2) / (width / 2);
          const dynamicAmp = amplitude * Math.pow(distanceToCenter, 1.5);
          const y = centerY + Math.sin(x * wave.freq + phase + wave.offset) * dynamicAmp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      phase += speed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, isBoys]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px 0 6px'
    }}>
      {/* Dynamic Luminous Voice Orb Container */}
      <div 
        onClick={onToggleMic}
        style={{
          position: 'relative',
          width: 'clamp(115px, 28vw, 145px)',
          height: 'clamp(115px, 28vw, 145px)',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Outer Pulsing Glow Rings */}
        <div style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          background: isBoys 
            ? (isSpeaking 
                ? 'radial-gradient(circle, rgba(14,165,233,0.55) 0%, rgba(37,99,235,0.2) 70%, transparent 100%)'
                : (isListening 
                    ? 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(6,182,212,0.2) 70%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(2,132,199,0.45) 0%, rgba(224,242,254,0.15) 70%, transparent 100%)'))
            : (isSpeaking 
                ? 'radial-gradient(circle, rgba(244,63,94,0.45) 0%, rgba(236,72,153,0.15) 70%, transparent 100%)'
                : (isListening 
                    ? 'radial-gradient(circle, rgba(16,185,129,0.45) 0%, rgba(6,182,212,0.15) 70%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(255,228,236,0.1) 70%, transparent 100%)')),
          animation: isListening || isSpeaking ? 'pulse-sos 1.8s infinite ease-in-out' : 'pulse-glow 4s infinite ease-in-out',
          zIndex: 1
        }} />

        {/* Middle Core Orb */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: isBoys
            ? (isSpeaking 
                ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #1d4ed8 100%)'
                : (isListening
                    ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #2563eb 100%)'
                    : 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #1d4ed8 100%)'))
            : (isSpeaking 
                ? 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #d946ef 100%)'
                : (isListening
                    ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)'
                    : 'linear-gradient(135deg, #ff6584 0%, #f43f5e 50%, #ec4899 100%)')),
          boxShadow: isBoys
            ? (isSpeaking 
                ? '0 10px 40px rgba(14, 165, 233, 0.7)' 
                : (isListening 
                    ? '0 10px 40px rgba(16, 185, 129, 0.6)' 
                    : '0 10px 35px rgba(37, 99, 235, 0.5)'))
            : (isSpeaking 
                ? '0 10px 40px rgba(244, 63, 94, 0.65)' 
                : (isListening 
                    ? '0 10px 40px rgba(16, 185, 129, 0.6)' 
                    : '0 10px 35px rgba(244, 63, 94, 0.45)')),
          zIndex: 2,
          transition: 'all 0.3s ease'
        }} />

        {/* Center Icon */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}>
          {isSpeaking ? (
            <Volume2 size={36} className="animate-pulse-glow" />
          ) : isListening ? (
            <Mic size={36} style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
          ) : (
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={isBoys ? "/images/boys/deva-avatar.jpg" : "/images/devi-avatar.jpg"} 
                alt={isBoys ? "DEVA AI" : "DEVI AI"} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Canvas Audio Waveform */}
      <canvas 
        ref={canvasRef} 
        width={360} 
        height={50} 
        style={{
          marginTop: 14,
          maxWidth: '100%'
        }} 
      />

      {/* Voice Status Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#ffffff',
        border: isBoys ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid rgba(244, 114, 182, 0.3)',
        padding: '6px 18px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.84rem',
        boxShadow: isBoys ? '0 2px 10px rgba(14, 165, 233, 0.12)' : '0 2px 10px rgba(244, 114, 182, 0.1)',
        marginTop: 4
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isSpeaking ? (isBoys ? '#0284c7' : '#f43f5e') : (isListening ? '#10b981' : (isBoys ? '#0ea5e9' : '#ec4899')),
          boxShadow: isSpeaking ? (isBoys ? '0 0 8px #0284c7' : '0 0 8px #f43f5e') : (isListening ? '0 0 8px #10b981' : (isBoys ? '0 0 8px #0ea5e9' : '0 0 8px #ec4899'))
        }}></span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
          {isSpeaking 
            ? (isBoys ? 'DEVA is speaking...' : 'DEVI is speaking...') 
            : (isListening 
                ? 'Listening to your voice... Speak now' 
                : (isBoys ? 'Tap Orb to Speak with DEVA' : 'Tap Orb to Speak with DEVI'))}
        </span>
      </div>
    </div>
  );
}

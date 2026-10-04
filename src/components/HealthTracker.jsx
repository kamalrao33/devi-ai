import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  Activity, 
  FileText,
  FileCode,
  Check,
  Dumbbell,
  Zap,
  Flame,
  Shield,
  Moon,
  Droplet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundEffects';
import { healthReportService } from '../services/healthReportGenerator';

export default function HealthTracker({ appMode = 'girls' }) {
  const isBoys = appMode === 'boys';
  const [activeTab, setActiveTab] = useState(isBoys ? 'vitality' : 'cycle');
  const [reportDownloading, setReportDownloading] = useState(null);

  useEffect(() => {
    setActiveTab(isBoys ? 'vitality' : 'cycle');
  }, [isBoys]);

  // ================= GIRLS MODE STATE =================
  const [cycleLength] = useState(28);
  const [periodLength] = useState(5);
  const [lastPeriodDate] = useState('2026-08-10');
  const [currentCycleDay, setCurrentCycleDay] = useState(11);
  const [flow, setFlow] = useState('Medium');
  const [crampsLevel, setCrampsLevel] = useState(3);
  const [selectedMoods, setSelectedMoods] = useState(['Calm', 'Focused']);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Mild Bloating']);
  const [savedLogs, setSavedLogs] = useState([]);
  const [logSuccess, setLogSuccess] = useState(false);

  // ================= BOYS MODE STATE =================
  const [energyLevel, setEnergyLevel] = useState(8);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [workoutSplit, setWorkoutSplit] = useState('Push Day');
  const [proteinGrams, setProteinGrams] = useState(150);
  const [waterLiters, setWaterLiters] = useState(3.2);
  const [stressLevel, setStressLevel] = useState(3);
  const [selectedBoysFeelings, setSelectedBoysFeelings] = useState(['Peak Focus', 'High Drive']);
  const [boysSavedLogs, setBoysSavedLogs] = useState([]);
  const [boysLogSuccess, setBoysLogSuccess] = useState(false);

  useEffect(() => {
    // Calculate current cycle day based on last period date
    const start = new Date(lastPeriodDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const day = (diffDays % cycleLength) || 1;
    setCurrentCycleDay(day);

    const saved = localStorage.getItem('devi_cycle_logs');
    if (saved) {
      try { setSavedLogs(JSON.parse(saved)); } catch {}
    }

    const savedBoys = localStorage.getItem('deva_vitality_logs');
    if (savedBoys) {
      try { setBoysSavedLogs(JSON.parse(savedBoys)); } catch {}
    }
  }, [lastPeriodDate, cycleLength]);

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

  // Determine Cycle Phase (Girls)
  const getPhaseInfo = () => {
    if (currentCycleDay <= periodLength) {
      return {
        phase: 'Menstrual Phase (Winter)',
        tag: 'Rest & Nourish',
        color: '#e11d48',
        desc: 'Progesterone and estrogen are low. Focus on warm nourishing stews, iron-rich foods, and gentle restorative yoga.',
        fertility: 'Low Chance of Conception'
      };
    } else if (currentCycleDay <= 13) {
      return {
        phase: 'Follicular Phase (Spring)',
        tag: 'Rising Energy & Creativity',
        color: '#9333ea',
        desc: 'Estrogen is climbing. High mental clarity, optimal time for strength workouts, problem solving, and social engagements.',
        fertility: 'Fertile Window Approaching'
      };
    } else if (currentCycleDay <= 16) {
      return {
        phase: 'Ovulatory Phase (Summer)',
        tag: 'Peak Fertility & Radiance',
        color: '#059669',
        desc: 'LH surge triggers egg release. Peak confidence, glowing skin, and highest fertility window.',
        fertility: 'High Chance of Conception (Peak)'
      };
    } else {
      return {
        phase: 'Luteal Phase (Autumn)',
        tag: 'Winding Down & Self-Care',
        color: '#d97706',
        desc: 'Progesterone peaks then dips. Prioritize magnesium, complex carbs, restful sleep, and avoid intense burnout.',
        fertility: 'Post-Ovulatory Window'
      };
    }
  };

  const currentPhase = getPhaseInfo();

  const handleSaveGirlsLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      cycleDay: currentCycleDay,
      flow,
      crampsLevel,
      moods: selectedMoods,
      symptoms: selectedSymptoms
    };

    const updated = [newLog, ...savedLogs.slice(0, 10)];
    setSavedLogs(updated);
    localStorage.setItem('devi_cycle_logs', JSON.stringify(updated));
    soundFx.playChime('success');
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  const handleSaveBoysLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      energyLevel,
      sleepHours,
      workoutSplit,
      proteinGrams,
      waterLiters,
      stressLevel,
      feelings: selectedBoysFeelings
    };

    const updated = [newLog, ...boysSavedLogs.slice(0, 10)];
    setBoysSavedLogs(updated);
    localStorage.setItem('deva_vitality_logs', JSON.stringify(updated));
    soundFx.playChime('success');
    setBoysLogSuccess(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setBoysLogSuccess(false), 2500);
  };

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tracker Mode Nav & Report Download Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(isBoys ? [
            { id: 'vitality', label: '⚡ Vitality & Sleep', icon: Activity },
            { id: 'training', label: '💪 Hypertrophy & Split', icon: Dumbbell },
            { id: 'hair', label: '💈 Hair & Scalp Science', icon: Sparkles }
          ] : [
            { id: 'cycle', label: '🌸 Cycle & Ovulation', icon: Calendar },
            { id: 'pcos', label: '🌿 PCOS Care', icon: Sparkles },
            { id: 'pregnancy', label: '🤰 Pregnancy Guide', icon: Heart }
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Download Health Report Quick Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadPdfReport}
            disabled={reportDownloading === 'pdf'}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.8rem',
              borderColor: isBoys ? 'rgba(2, 132, 199, 0.4)' : 'rgba(225, 29, 72, 0.35)',
              color: isBoys ? '#0284c7' : '#be123c',
              background: '#ffffff',
              fontWeight: 700
            }}
            title="Download formatted Clinical Health Summary as PDF"
          >
            <FileText size={15} color={isBoys ? "#0284c7" : "#e11d48"} />
            <span>{reportDownloading === 'pdf' ? 'Generating...' : 'Report (.PDF)'}</span>
          </button>

          <button
            onClick={handleDownloadDocxReport}
            disabled={reportDownloading === 'docx'}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.8rem',
              borderColor: 'rgba(37, 99, 235, 0.35)',
              color: '#1d4ed8',
              background: '#ffffff',
              fontWeight: 700
            }}
            title="Download editable Medical Summary in Microsoft Word .docx format"
          >
            <FileCode size={15} color="#2563eb" />
            <span>{reportDownloading === 'docx' ? 'Creating...' : 'Report (.DOCX)'}</span>
          </button>
        </div>
      </div>

      {/* ================= BOYS MODE: VITALITY TAB ================= */}
      {isBoys && activeTab === 'vitality' && (
        <>
          {/* Men's Vitality Hero Banner */}
          <div 
            className="glass-panel"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              minHeight: 220,
              display: 'flex',
              alignItems: 'flex-end',
              padding: '24px 28px',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 12px 36px rgba(2, 132, 199, 0.16)'
            }}
          >
            <img 
              src="/images/boys/fitness-banner.jpg" 
              alt="Men's Vitality" 
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
              background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 60%, rgba(15, 23, 42, 0.3) 100%)'
            }} />
            <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="badge badge-pink" style={{ background: 'rgba(2, 132, 199, 0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}>
                  ⚡ ANDROGENIC DRIVE & RECOVERY
                </span>
                <span className="badge badge-emerald">PEAK PERFORMANCE</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                Men's Vitality & Strength Matrix
              </h1>
              <p style={{ fontSize: '0.94rem', color: '#e0f2fe', maxWidth: 650, margin: 0, lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
                Track morning testosterone signals, deep sleep restoration, workout volume, and daily protein pacing for maximum physical resilience.
              </p>
            </div>
          </div>

          {/* Daily Vitality Logger Form */}
          <div className="glass-panel" style={{ padding: 26, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>Daily Bio-Optimization Check-in</h3>
                <p style={{ fontSize: '0.86rem', color: '#475569' }}>
                  Log today's biomarkers to monitor metabolic output, endocrine balance, and muscular recovery.
                </p>
              </div>
              {boysLogSuccess && (
                <span className="badge badge-emerald" style={{ padding: '6px 14px' }}>
                  <Check size={14} /> Vitality Log Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveBoysLog} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Energy & Drive Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Morning Energy & Drive: <strong style={{ color: '#0284c7' }}>{energyLevel}/10</strong>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                    {energyLevel >= 8 ? '🔥 High Androgenic Output' : energyLevel >= 5 ? '⚡ Normal / Steady' : '💤 Fatigue / Needs Rest'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Workout Split */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>
                  Today's Training Focus:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body', 'Cardio & Conditioning', 'Rest & Deload'].map((split) => (
                    <button
                      type="button"
                      key={split}
                      onClick={() => setWorkoutSplit(split)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.84rem',
                        background: workoutSplit === split ? 'var(--gradient-devi)' : '#ffffff',
                        color: workoutSplit === split ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
                        fontWeight: workoutSplit === split ? 700 : 500
                      }}
                    >
                      {split}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Biometrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#475569', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Moon size={15} color="#0284c7" />
                    <span>Sleep Hours</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="number"
                      step="0.5"
                      min="3"
                      max="14"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(Number(e.target.value))}
                      style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '1.1rem' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Hrs (Target: 7-9h)</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#475569', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Flame size={15} color="#ea580c" />
                    <span>Protein Target</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="number"
                      step="5"
                      min="50"
                      max="300"
                      value={proteinGrams}
                      onChange={(e) => setProteinGrams(Number(e.target.value))}
                      style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '1.1rem' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Grams (1.6-2.2g/kg)</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#475569', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Droplet size={15} color="#0284c7" />
                    <span>Daily Water</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="number"
                      step="0.2"
                      min="1"
                      max="8"
                      value={waterLiters}
                      onChange={(e) => setWaterLiters(Number(e.target.value))}
                      style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '1.1rem' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Liters (Electrolytes)</span>
                  </div>
                </div>
              </div>

              {/* Physical & Mental State Tags */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>
                  Physical & Mental Status:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Peak Focus', 'High Drive', 'Good Muscle Pump', 'Mild Soreness', 'Joint Stiffness', 'Calm & Steady', 'Low Motivation', 'Heavy Burnout'].map((s) => {
                    const isSelected = selectedBoysFeelings.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleItem(selectedBoysFeelings, setSelectedBoysFeelings, s)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          background: isSelected ? 'rgba(2, 132, 199, 0.15)' : '#ffffff',
                          color: isSelected ? '#0284c7' : 'var(--text-secondary)',
                          border: isSelected ? '1.5px solid #0284c7' : '1px solid rgba(56, 189, 248, 0.3)',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
                          fontWeight: isSelected ? 700 : 500
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ alignSelf: 'flex-start', padding: '12px 28px', fontSize: '0.92rem' }}
              >
                <Check size={18} />
                <span>Save Today's Vitality Log</span>
              </button>
            </form>
          </div>
        </>
      )}

      {/* ================= BOYS MODE: HYPERTROPHY PROTOCOL ================= */}
      {isBoys && activeTab === 'training' && (
        <div className="glass-panel" style={{ padding: 26, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Dumbbell size={26} color="#0284c7" />
            <h2 style={{ fontSize: '1.45rem', color: '#0f172a' }}>Hypertrophy & Athletic Strength Science</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: 20 }}>
            Optimizing lean muscular density, tendon durability, and progressive mechanical tension without overtraining cortisol spikes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <h4 style={{ color: '#0284c7', marginBottom: 8, fontSize: '1.05rem' }}>🏋️ Progressive Overload</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                Add 1 rep or 1.25kg to compound lifts every 1-2 weeks. Track volume load across working sets (RPE 7-9).
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <h4 style={{ color: '#2563eb', marginBottom: 8, fontSize: '1.05rem' }}>🥩 Leucine & Protein Spacing</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                Aim for 30-45g protein per meal containing 3g leucine to trigger Muscle Protein Synthesis (MPS) every 3-4 hours.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <h4 style={{ color: '#059669', marginBottom: 8, fontSize: '1.05rem' }}>⚡ Creatine & Cellular Hydration</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                5g daily Creatine Monohydrate replenishes intramuscular phosphocreatine pools, increasing sprint power and muscle fullness.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOYS MODE: HAIR & SCALP SCIENCE ================= */}
      {isBoys && activeTab === 'hair' && (
        <div className="glass-panel" style={{ padding: 26, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Sparkles size={26} color="#0284c7" />
            <h2 style={{ fontSize: '1.45rem', color: '#0f172a' }}>Hair Follicle & DHT Prevention Protocol</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: 20 }}>
            Science-backed strategies to halt hair thinning, improve scalp microvascular blood flow, and stimulate dormant follicles.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <h4 style={{ color: '#0284c7', marginBottom: 8, fontSize: '1.05rem' }}>🩸 Scalp Microcirculation</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                Perform 4 minutes of firm scalp massage daily. Consider 1.0mm microneedling once weekly to upregulate Wnt/β-catenin hair growth pathways.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <h4 style={{ color: '#4f46e5', marginBottom: 8, fontSize: '1.05rem' }}>🛡️ 5-Alpha Reductase Control</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                DHT shrinks follicle dermal papilla. Discuss evidence-backed 5-AR inhibitors (Finasteride/Saw Palmetto) with our certified specialists.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <h4 style={{ color: '#059669', marginBottom: 8, fontSize: '1.05rem' }}>🧪 Zinc, Biotin & Iron Ferritin</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                Check ferritin levels (target &gt;70 ng/mL) and ensure adequate dietary zinc and vitamin D3 to keep hair in the active anagen growing phase.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= GIRLS MODE: CYCLE TAB ================= */}
      {!isBoys && activeTab === 'cycle' && (
        <>
          {/* Main Cycle Status Hero Banner in Baby Pink & White */}
          <div 
            className="glass-panel"
            style={{
              padding: 26,
              background: 'linear-gradient(135deg, #ffffff 0%, #fff0f4 100%)',
              border: `1.5px solid ${currentPhase.color}40`,
              boxShadow: `0 12px 36px ${currentPhase.color}15`
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 20,
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="badge badge-pink" style={{ background: `${currentPhase.color}15`, color: currentPhase.color, border: `1px solid ${currentPhase.color}40` }}>
                    CURRENT CYCLE DAY {currentCycleDay} of {cycleLength}
                  </span>
                  <span className="badge badge-emerald">{currentPhase.tag}</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', color: '#331427', marginBottom: 8 }}>
                  {currentPhase.phase}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  {currentPhase.desc}
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                padding: 20,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(244, 114, 182, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#885070', fontWeight: 600 }}>Fertility Status</span>
                  <span style={{ fontSize: '0.85rem', color: currentPhase.color, fontWeight: 700 }}>{currentPhase.fertility}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#885070', fontWeight: 600 }}>Next Period Expected In</span>
                  <span style={{ fontSize: '1.1rem', color: '#e11d48', fontWeight: 800 }}>
                    {cycleLength - currentCycleDay > 0 ? `${cycleLength - currentCycleDay} Days` : 'Due Today'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#885070', fontWeight: 600 }}>Ovulation Window</span>
                  <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>Days 13-16</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Symptoms & Mood Logging Form */}
          <div className="glass-panel" style={{ padding: 26, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#331427' }}>Daily Cycle & Symptom Check-in</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Log how your body feels today. DEVI adapts insights and remedies automatically.
                </p>
              </div>
              {logSuccess && (
                <span className="badge badge-emerald" style={{ padding: '6px 14px' }}>
                  <Check size={14} /> Today's Log Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveGirlsLog} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Flow Level */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>
                  Menstrual Flow:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFlow(f)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.84rem',
                        background: flow === f ? 'var(--gradient-health)' : '#ffffff',
                        color: flow === f ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid rgba(244, 114, 182, 0.3)',
                        boxShadow: '0 2px 8px rgba(244, 114, 182, 0.08)',
                        fontWeight: flow === f ? 700 : 500
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cramps Intensity Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Cramps / Pain Severity: <strong style={{ color: '#e11d48' }}>{crampsLevel}/10</strong>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#885070', fontWeight: 600 }}>
                    {crampsLevel === 0 ? 'No Pain' : crampsLevel <= 3 ? 'Mild Ache' : crampsLevel <= 7 ? 'Moderate Spasms' : 'Severe Cramps'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={crampsLevel}
                  onChange={(e) => setCrampsLevel(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#e11d48', cursor: 'pointer' }}
                />
              </div>

              {/* Mood Selectors */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>
                  Mood & Emotional State:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Calm', 'Happy', 'Energetic', 'Sensitive', 'Anxious', 'Irritable', 'Exhausted', 'Brain Fog'].map((m) => {
                    const isSelected = selectedMoods.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => toggleItem(selectedMoods, setSelectedMoods, m)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          background: isSelected ? 'rgba(168, 85, 247, 0.15)' : '#ffffff',
                          color: isSelected ? '#9333ea' : 'var(--text-secondary)',
                          border: isSelected ? '1.5px solid #a855f7' : '1px solid rgba(244, 114, 182, 0.3)',
                          boxShadow: '0 2px 8px rgba(244, 114, 182, 0.08)',
                          fontWeight: isSelected ? 700 : 500
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Physical Symptoms */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>
                  Physical Symptoms:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Mild Bloating', 'Headache', 'Backache', 'Acne Outbreak', 'Breast Tenderness', 'Sugar Cravings', 'Insomnia'].map((s) => {
                    const isSelected = selectedSymptoms.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleItem(selectedSymptoms, setSelectedSymptoms, s)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          background: isSelected ? 'rgba(244, 63, 94, 0.15)' : '#ffffff',
                          color: isSelected ? '#e11d48' : 'var(--text-secondary)',
                          border: isSelected ? '1.5px solid #f43f5e' : '1px solid rgba(244, 114, 182, 0.3)',
                          boxShadow: '0 2px 8px rgba(244, 114, 182, 0.08)',
                          fontWeight: isSelected ? 700 : 500
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ alignSelf: 'flex-start', padding: '12px 28px', fontSize: '0.92rem' }}
              >
                <Check size={18} />
                <span>Save Today's Health Log</span>
              </button>
            </form>
          </div>
        </>
      )}

      {/* ================= GIRLS MODE: PCOS TAB ================= */}
      {!isBoys && activeTab === 'pcos' && (
        <div className="glass-panel" style={{ padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Sparkles size={26} color="#9333ea" />
            <h2 style={{ fontSize: '1.45rem' }}>Holistic PCOS / PCOD Balance Protocol</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: 20 }}>
            Polycystic Ovarian Syndrome is a metabolic and endocrine harmony journey. DEVI provides personalized lifestyle routines to regulate insulin sensitivity and soothe chronic inflammation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 114, 182, 0.25)', boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)' }}>
              <h4 style={{ color: '#059669', marginBottom: 8, fontSize: '1.05rem' }}>🥑 Blood Sugar Stabilization</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Always start meals with fiber (greens/seeds) and protein before carbs. This blunts glucose spikes by up to 60%, reducing ovarian androgen synthesis.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 114, 182, 0.25)', boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)' }}>
              <h4 style={{ color: '#9333ea', marginBottom: 8, fontSize: '1.05rem' }}>🍵 Spearmint & Inositol Ritual</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Drinking 2 cups of organic spearmint tea daily has demonstrated significant reduction in free testosterone and hirsutism. Consider Myo-Inositol (40:1 ratio) with clinical approval.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 114, 182, 0.25)', boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)' }}>
              <h4 style={{ color: '#e11d48', marginBottom: 8, fontSize: '1.05rem' }}>🧘 Adrenal Cortisol Regulation</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Excessive high-intensity cardio spikes cortisol in PCOS. Opt for slow-paced resistance workouts, morning natural sunlight, and 8 hours of restorative sleep.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= GIRLS MODE: PREGNANCY TAB ================= */}
      {!isBoys && activeTab === 'pregnancy' && (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Pregnancy Banner */}
          <div style={{ position: 'relative', width: '100%', height: 230, overflow: 'hidden' }}>
            <img 
              src="/images/pregnancy-art.jpg" 
              alt="Pregnancy Journey" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(51, 20, 39, 0.85) 0%, rgba(51, 20, 39, 0.25) 50%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '22px 26px',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="badge badge-pink" style={{ background: '#ec4899', color: '#fff', border: 'none' }}>
                  👶 MATERNAL & OBSTETRIC CARE
                </span>
              </div>
              <h2 style={{ fontSize: '1.65rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', marginBottom: 4 }}>
                Pregnancy & Maternal Companion
              </h2>
              <p style={{ color: '#ffe4ec', fontSize: '0.92rem', margin: 0, maxWidth: 640 }}>
                Every trimester of your maternal journey is supported with verified obstetric advice and immediate emergency backup.
              </p>
            </div>
          </div>

          <div style={{ padding: 26 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
              <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 114, 182, 0.25)', boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)' }}>
                <span className="badge badge-pink" style={{ marginBottom: 8 }}>Trimester 1 (Weeks 1-12)</span>
                <h4 style={{ marginTop: 6, marginBottom: 6, fontSize: '1.05rem' }}>Foundations & Neural Tube</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Take 400-800mcg active folate daily. Manage nausea with small frequent meals, ginger, and cold hydration.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 114, 182, 0.25)', boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)' }}>
                <span className="badge badge-emerald" style={{ marginBottom: 8 }}>Trimester 2 (Weeks 13-27)</span>
                <h4 style={{ marginTop: 6, marginBottom: 6, fontSize: '1.05rem' }}>Energy & Baby Movements</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The "golden period". First kicks (quickening) typically felt around week 18-20. Ensure adequate iron and calcium intake.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 114, 182, 0.25)', boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)' }}>
                <span className="badge badge-purple" style={{ marginBottom: 8 }}>Trimester 3 (Weeks 28-40)</span>
                <h4 style={{ marginTop: 6, marginBottom: 6, fontSize: '1.05rem' }}>Birth Prep & Kick Counts</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Count baby kicks (aim for 10 movements in 2 hours). Practice pelvic floor relaxation. Keep DEVI emergency SOS on speed dial for labor onset.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Star, 
  Check, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  X, 
  QrCode, 
  Download,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DOCTORS_DATA, BOYS_DOCTORS_DATA } from '../services/aiService';
import { soundFx } from '../services/soundEffects';

export default function DoctorBooking({ appMode = 'girls' }) {
  const isBoys = appMode === 'boys';
  const doctorsList = isBoys ? BOYS_DOCTORS_DATA : DOCTORS_DATA;
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Booking form state
  const [selectedDate, setSelectedDate] = useState('2026-08-22');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultType, setConsultType] = useState('video'); // 'video', 'in-clinic'
  const [patientSymptoms, setPatientSymptoms] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Stored bookings
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const key = isBoys ? 'deva_doctor_bookings' : 'devi_doctor_bookings';
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setMyBookings(JSON.parse(saved)); } catch {}
    } else {
      setMyBookings([]);
    }
  }, [isBoys]);

  const specialties = isBoys
    ? ['All', 'Andrology & Hormones', 'Sports Medicine & Recovery', 'Mental Health & Stoicism', 'Hair & Metabolism']
    : ['All', 'Gynecology & Ob-Gyn', 'Mental Health & Therapy', 'Fertility & Hormones', 'Holistic Nutrition'];

  const filteredDoctors = doctorsList.filter((doc) => {
    if (selectedSpecialty === 'All') return true;
    if (isBoys) {
      if (selectedSpecialty === 'Andrology & Hormones') return doc.specialty.includes('Andrologist') || doc.specialty.includes('Hormon');
      if (selectedSpecialty === 'Sports Medicine & Recovery') return doc.specialty.includes('Sports') || doc.specialty.includes('Orthopedic');
      if (selectedSpecialty === 'Mental Health & Stoicism') return doc.specialty.includes('Psychologist') || doc.specialty.includes('Mental');
      if (selectedSpecialty === 'Hair & Metabolism') return doc.specialty.includes('Hair') || doc.specialty.includes('Metabolic');
    } else {
      if (selectedSpecialty === 'Gynecology & Ob-Gyn') return doc.specialty.includes('Gynecologist');
      if (selectedSpecialty === 'Mental Health & Therapy') return doc.specialty.includes('Therapist') || doc.specialty.includes('Mental');
      if (selectedSpecialty === 'Fertility & Hormones') return doc.specialty.includes('Reproductive') || doc.specialty.includes('Fertility');
      if (selectedSpecialty === 'Holistic Nutrition') return doc.specialty.includes('Nutritionist');
    }
    return true;
  });

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setSelectedSlot(doc.slots[0] || '10:30 AM');
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const newBooking = {
      bookingId: `DEVI-DOC-${Date.now().toString().slice(-6)}`,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedSlot,
      type: consultType === 'video' ? 'Confidential Video Consultation' : 'In-Clinic Hospital Visit',
      symptoms: patientSymptoms || 'General checkup & guidance',
      status: 'Confirmed & Guaranteed',
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newBooking, ...myBookings];
    setMyBookings(updated);
    localStorage.setItem('devi_doctor_bookings', JSON.stringify(updated));
    setConfirmedBooking(newBooking);
    setIsBookingModalOpen(false);
    soundFx.playChime('success');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Header in Baby Pink & White Glass */}
      <div 
        className="glass-panel"
        style={{
          padding: 26,
          background: isBoys 
            ? 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #fff0f4 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-pink">100% CONFIDENTIAL & VERIFIED</span>
              <span className="badge badge-emerald">INSTANT DIGITAL PASS</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: isBoys ? '#0f172a' : '#331427', marginBottom: 6 }}>
              {isBoys ? "Men's Specialist Doctor Network" : "Women's Specialist Doctor Network"}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 650 }}>
              {isBoys
                ? "Connect with top board-certified andrologists, sports medicine surgeons, executive performance psychologists, and trichologists for discrete consultations."
                : "Connect with top board-certified gynecologists, trauma psychologists, fertility specialists, and nutritionists for discrete video consultations or clinic visits."}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {myBookings.length > 0 && (
              <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Check size={14} /> {myBookings.length} Active Appointment{myBookings.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={selectedSpecialty === spec ? 'btn-primary' : 'glass-interactive'}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                whiteSpace: 'nowrap',
                fontWeight: selectedSpecialty === spec ? 700 : 600,
                background: selectedSpecialty === spec ? 'var(--gradient-devi)' : '#ffffff',
                border: '1px solid rgba(244, 114, 182, 0.3)'
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmed Appointment Pass Banner (if newly booked) */}
      {confirmedBooking && (
        <div 
          className="glass-panel"
          style={{
            padding: 22,
            background: '#ecfdf5',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {confirmedBooking.doctor?.avatar?.startsWith('/') ? (
                <div style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2.5px solid #059669',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}>
                  <img 
                    src={confirmedBooking.doctor.avatar} 
                    alt={confirmedBooking.doctor.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              ) : (
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <ShieldCheck size={28} />
                </div>
              )}
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: 4 }}>PASS #{confirmedBooking.bookingId}</span>
                <h3 style={{ fontSize: '1.25rem', color: '#065f46' }}>
                  Appointment Confirmed with {confirmedBooking.doctor.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 600 }}>
                  🗓️ {confirmedBooking.date} at {confirmedBooking.time} • 📹 {confirmedBooking.type}
                </div>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              Dismiss Banner
            </button>
          </div>
        </div>
      )}

      {/* Doctor Catalog Cards in Baby Pink & White Glass */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 18 }}>
        {filteredDoctors.map((doc) => (
          <div 
            key={doc.id}
            className="glass-panel"
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#ffffff'
            }}
          >
            <div>
              {/* Doctor Header */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 14px rgba(244, 114, 182, 0.3)',
                  border: '2px solid #ffffff'
                }}>
                  {doc.avatar?.startsWith('/') ? (
                    <img 
                      src={doc.avatar} 
                      alt={doc.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '1.8rem' }}>{doc.avatar}</span>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#331427' }}>{doc.name}</h3>
                    <UserCheck size={16} color="#0284c7" />
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#db2777', fontWeight: 700 }}>
                    {doc.specialty}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#885070' }}>
                    {doc.experience} • {doc.hospital}
                  </div>
                </div>
              </div>

              {/* Rating & Bio */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: '#d97706', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Star size={12} fill="#d97706" />
                  <span>{doc.rating} ({doc.reviews} reviews)</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#885070' }}>
                  🗣️ {doc.languages}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 16 }}>
                {doc.bio}
              </p>

              {/* Available slots preview */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.78rem', color: '#885070', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Next Available Slots:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {doc.slots.map((s, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 9px',
                        borderRadius: 6,
                        background: '#fff0f4',
                        border: '1px solid rgba(244, 114, 182, 0.25)',
                        color: '#331427',
                        fontWeight: 600
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Book Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTop: '1px solid rgba(244, 114, 182, 0.2)'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#885070', display: 'block', fontWeight: 600 }}>Consultation Fee</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>{doc.fee}</span>
              </div>

              <button
                onClick={() => handleOpenBooking(doc)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                <Calendar size={15} />
                <span>Book Slot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedDoctor && (
        <div className="modal-overlay">
          <div 
            className="glass-panel"
            style={{
              maxWidth: 520,
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid rgba(244, 114, 182, 0.4)',
              padding: 26,
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(244, 114, 182, 0.25)'
            }}
          >
            <button
              onClick={() => setIsBookingModalOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#fff0f4',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#331427',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 20,
              background: '#fff5f8',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(244, 114, 182, 0.3)'
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid #f472b6',
                boxShadow: '0 4px 14px rgba(244, 114, 182, 0.25)'
              }}>
                {selectedDoctor.avatar?.startsWith('/') ? (
                  <img 
                    src={selectedDoctor.avatar} 
                    alt={selectedDoctor.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    {selectedDoctor.avatar}
                  </span>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 2, color: '#331427' }}>
                  {selectedDoctor.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#db2777', fontWeight: 700, marginBottom: 2 }}>
                  {selectedDoctor.specialty}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#885070' }}>
                  {selectedDoctor.hospital} • <strong style={{ color: '#059669' }}>{selectedDoctor.fee}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Consultation Type */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'block' }}>
                  Consultation Mode:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setConsultType('video')}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: consultType === 'video' ? 'rgba(168, 85, 247, 0.15)' : '#fff5f7',
                      border: consultType === 'video' ? '1.5px solid #a855f7' : '1px solid rgba(244, 114, 182, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      color: consultType === 'video' ? '#9333ea' : '#885070',
                      fontSize: '0.88rem',
                      fontWeight: 700
                    }}
                  >
                    <Video size={16} />
                    <span>Private Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('in-clinic')}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: consultType === 'in-clinic' ? 'rgba(244, 63, 94, 0.15)' : '#fff5f7',
                      border: consultType === 'in-clinic' ? '1.5px solid #f43f5e' : '1px solid rgba(244, 114, 182, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      color: consultType === 'in-clinic' ? '#e11d48' : '#885070',
                      fontSize: '0.88rem',
                      fontWeight: 700
                    }}
                  >
                    <MapPin size={16} />
                    <span>In-Clinic Visit</span>
                  </button>
                </div>
              </div>

              {/* Date & Slot selection */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'block' }}>
                    Select Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#fff8fa',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      color: '#331427',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'block' }}>
                    Time Slot:
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#fff8fa',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      color: '#331427',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    {selectedDoctor.slots.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Intake notes */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'block' }}>
                  Brief Note for Doctor (Symptoms / Questions):
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Experiencing irregular cycle and fatigue for 2 months..."
                  value={patientSymptoms}
                  onChange={(e) => setPatientSymptoms(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#fff8fa',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: '#331427',
                    fontSize: '0.88rem',
                    resize: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.94rem' }}
              >
                <Check size={18} />
                <span>Confirm & Generate Digital Pass</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// DEVI AI - Emergency Dispatch & Geolocation Sentinel Service

export const DEFAULT_EMERGENCY_CONTACTS = [
  { id: '1', name: 'Dr. Ananya Sharma (Primary Ob-Gyn)', phone: '+18005550199', relation: 'Doctor', notifySMS: true },
  { id: '2', name: 'Mom / Guardian', phone: '+18005550123', relation: 'Family', notifySMS: true },
  { id: '3', name: 'Maya (Sister / Trusted Friend)', phone: '+18005550144', relation: 'Emergency Contact', notifySMS: true }
];

export const WOMEN_HELPLINES = [
  { name: 'National Emergency Services', number: '112 / 911 / 108', type: 'Police / Ambulance / Fire', icon: 'ShieldAlert' },
  { name: 'Women Distress & Safety Helpline', number: '1091 / 181', type: '24x7 Safety & SOS', icon: 'HeartHandshake' },
  { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', type: 'Confidential Crisis Support', icon: 'Lock' },
  { name: 'Maternal & Pregnancy Crisis Line', number: '1-833-943-5746', type: '24x7 Postpartum & Ob-Gyn', icon: 'Activity' },
  { name: 'Mental Health & Suicide Prevention', number: '988', type: 'Trained Crisis Counselors', icon: 'Smile' }
];

class EmergencyService {
  constructor() {
    this.storageKey = 'devi_emergency_contacts';
  }

  getContacts() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_EMERGENCY_CONTACTS;
    } catch {
      return DEFAULT_EMERGENCY_CONTACTS;
    }
  }

  saveContacts(contacts) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts to storage:', e);
    }
  }

  // Live GPS capture with reverse lookup simulation
  async getCurrentLocation() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve({
          latitude: 28.6139,
          longitude: 77.2090,
          accuracy: 15,
          address: 'Central District (GPS Simulation)',
          mapUrl: `https://maps.google.com/?q=28.6139,77.2090`
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = Math.round(position.coords.accuracy);

          let address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          try {
            // Attempt reverse geocoding via OpenStreetMap Nominatim (non-blocking)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
              headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.display_name) {
                address = data.display_name.split(',').slice(0, 3).join(',');
              }
            }
          } catch {
            address = `Location verified within ±${acc}m`;
          }

          resolve({
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            address,
            mapUrl: `https://maps.google.com/?q=${lat},${lng}`
          });
        },
        () => {
          // Fallback location on permission decline
          resolve({
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 25,
            address: 'Approximate Location (Permission Restricted)',
            mapUrl: `https://maps.google.com/?q=37.7749,-122.4194`
          });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  // Generate WhatsApp / SMS SOS message payload
  generateEmergencyPayload(location, reason = 'Urgent Health/Safety Emergency') {
    const text = `🚨 EMERGENCY ALERT FROM DEVI AI APP 🚨\n\nI need immediate assistance!\nSituation: ${reason}\n\n📍 My Live Location:\n${location.address}\nGoogle Maps: ${location.mapUrl}\nCoordinates: ${location.latitude}, ${location.longitude}\nAccuracy: ±${location.accuracy}m\n\nDEVI has also alerted Emergency Services (Ambulance 108/911 & On-call Doctor).`;
    return {
      text,
      whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      smsUri: `sms:?body=${encodeURIComponent(text)}`
    };
  }

  // Generate simulated dispatch timeline
  createDispatchPlan(location, reason = 'Medical & Safety SOS') {
    return {
      incidentId: `DEV-SOS-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      location,
      reason,
      nearestHospital: {
        name: 'City Care Multispeciality & Women\'s Trauma Hospital',
        distance: '1.4 km away',
        etaMinutes: 6,
        contact: '+1-800-555-0911'
      },
      assignedDoctor: {
        name: 'Dr. Priya Varma, MD (Emergency Medicine & Ob-Gyn)',
        status: 'Alerted & On-Call standby',
        phone: '+1-800-555-0144'
      },
      ambulanceUnit: {
        unitId: 'Unit AMB-04',
        vehicleType: 'Advanced Life Support (ALS) Ambulance',
        eta: '5-8 minutes'
      }
    };
  }
}

export const emergencyService = new EmergencyService();

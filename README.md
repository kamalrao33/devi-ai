# 🌸 DEVI AI — Intelligent Women's Health & Personal Safety Companion

[![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Privacy First](https://img.shields.io/badge/Privacy-Offline--First%20%26%20Encrypted-blueviolet?style=for-the-badge)](https://github.com/kamalrao33/devi-ai)
[![Safety Guard](https://img.shields.io/badge/SOS-Emergency%20Safety%20System-red?style=for-the-badge)](https://github.com/kamalrao33/devi-ai)

> **DEVI AI** is an AI-powered personal health, reproductive wellness, and safety companion designed with an offline-first architecture, privacy-first vault, and rapid SOS emergency response system.

---

## 🌟 Overview

**DEVI AI** bridges the gap between private reproductive healthcare and personal safety. It delivers empathetic, clinically-informed AI guidance, menstrual cycle and symptom forecasting, emotional wellness support, one-touch emergency distress beacons, and an instant **Stealth Decoy Mode** disguised as a calculator for discreet usage in unsafe environments.

---

## ✨ Key Features

### 🤖 1. AI Health & Wellness Companion
- **Empathetic Dialogue Engine**: Provides clinically-informed answers on menstrual hygiene, reproductive biology, PCOS/PCOD, mental wellbeing, and nutrition.
- **Voice-Enabled Interaction**: Hands-free conversation powered by the Web Speech API and an interactive, pulsing **Voice Orb**.
- **Multilingual Support**: Supports English, Hindi, Bengali, Tamil, Telugu, Marathi, and more.
- **Dual-Mode Personalization**: Toggle between **Girls Mode** and **Boys Mode** for inclusive reproductive health education, partner awareness, and customized advice.

### 🌸 2. Menstrual & Symptom Health Tracker
- **Smart Cycle Forecasting**: Calculates next period dates, fertile windows, and ovulation peaks based on cycle history.
- **Holistic Symptom & Mood Logging**: Record flow intensity, cramps, mood shifts, energy levels, bloating, and headache severities.
- **Exportable Medical Reports**: Generate comprehensive health summaries in both **PDF** (`jspdf`) and **DOCX** (`docx`) formats for your gynecologist or healthcare provider.

### 🚨 3. SOS Safety Center & Rapid Response
- **One-Tap Emergency Trigger**: Instantly triggers high-decibel alarm sirens using Web Audio API synthesis.
- **Live Geolocation Sharing**: Transmits current GPS coordinates directly via WhatsApp and SMS to designated emergency contacts.
- **Speed-Dial Helplines**: Instant access to Women Helpline (1091), National Emergency (112), Childline (1098), and Ambulance (108).

### 🕵️ 4. Instant Stealth Decoy Disguise
- **Emergency Panic Concealment**: Press <kbd>Esc</kbd> at any moment to instantaneously camouflage the entire application into a fully functioning **Scientific Calculator & Quick Notes tool**.
- Keeps sensitive personal health conversations and safety tools safe from prying eyes or domestic coercion.

### 🔒 5. Zero-Knowledge Privacy Vault
- **PIN-Protected Security**: Secure local health logs with a custom PIN lock.
- **Panic Data Wipe**: One-click purge mechanism to instantly wipe local logs, chat transcripts, and cached data if your device is compromised.
- **Local-First Storage**: Your health logs, cycle logs, and personal notes remain stored directly on your device.

### 🧘 6. Emotional Wellness Sanctuary
- **Guided Breathing Exercises**: Interactive 4-7-8 and box breathing animations with haptic/visual pacing to reduce anxiety and stress.
- **Mood Journaling & Affirmations**: Daily positive affirmations and mindfulness logs.

### 🩺 7. Doctor & Specialist Consultations
- Browse verified gynecologists, obstetricians, dermatologists, and mental health counselors.
- Schedule consultations, view clinic timings, and attach generated health logs.

### 📚 8. Curated Clinical Health Library
- Clinically reviewed articles on menstrual health, reproductive hygiene, hormone balance, contraception, and maternal care.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Document Generation** | [jsPDF](https://github.com/parallax/jsPDF) & [docx](https://docx.js.org/) |
| **Audio & Voice** | Web Speech API (Synthesis & Recognition) + Web Audio API (Chimes & Sirens) |
| **Animations & Confetti** | CSS3 Transitions, Keyframes, [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## 📁 Project Structure

```
devi-ai-app/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Images and design assets
│   ├── components/
│   │   ├── ChatAssistant.jsx      # AI voice & chat companion interface
│   │   ├── DoctorBooking.jsx      # Specialist consultation booking system
│   │   ├── EmergencyModal.jsx     # High-priority distress overlay
│   │   ├── EmotionalWellness.jsx  # Mindfulness, affirmations & breathing guides
│   │   ├── HealthLibrary.jsx      # Curated medical knowledge base
│   │   ├── HealthLibraryData.js   # Clinical articles & FAQ database
│   │   ├── HealthTracker.jsx      # Menstrual cycle, symptom log & report export
│   │   ├── Navbar.jsx             # Top bar navigation & mode switcher
│   │   ├── PrivacyVault.jsx       # PIN lock & panic data wipe vault
│   │   ├── SosSafetyCenter.jsx    # Emergency SOS beacon, GPS share & siren
│   │   ├── StealthDecoy.jsx       # Calculator disguise mode
│   │   └── VoiceOrb.jsx           # Animated interactive voice assistant orb
│   ├── services/
│   │   ├── aiKnowledgeEngine.js   # Reproductive & health query engine
│   │   ├── aiService.js           # Conversational assistant processor
│   │   ├── emergencyService.js    # Location retrieval & contact dispatcher
│   │   ├── healthReportGenerator.js # PDF & DOCX generator for clinical review
│   │   ├── i18n.js                # Multi-language translations
│   │   ├── memoryService.js       # Local context & memory persistence
│   │   ├── soundEffects.js        # Synthetic Web Audio chimes & sirens
│   │   └── voiceService.js        # Speech recognition & text-to-speech engine
│   ├── App.css                    # Application layout styles
│   ├── App.jsx                    # Root component with state router
│   ├── index.css                  # Global design tokens, themes & resets
│   └── main.jsx                   # React root entry point
├── .gitignore              # Git ignore rules
├── index.html              # HTML5 entry template
├── package.json            # Dependencies & build scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0` or higher recommended)
- [npm](https://www.npmjs.com/) (version `9.0` or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kamalrao33/devi-ai.git
   cd devi-ai
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled production-ready assets will be generated in the `dist/` directory.

---

## ⌨️ Shortcuts & Hotkeys

| Key | Action |
|---|---|
| <kbd>Esc</kbd> | Toggle **Stealth Decoy Mode** (Disguises app as a Scientific Calculator) |
| <kbd>1234</kbd> | Default recovery PIN for the Privacy Vault |

---

## 🔒 Privacy & Safety Statement

- **No Remote Telemetry**: Health metrics, cycle dates, symptoms, and diary notes are stored client-side in your browser's local storage.
- **Discreet Emergency Disguise**: Built specifically to protect users from coercive surveillance.
- **Medical Disclaimer**: DEVI AI provides educational and supportive guidance and is not a substitute for professional clinical diagnosis or medical treatment. Always consult certified healthcare professionals for severe conditions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

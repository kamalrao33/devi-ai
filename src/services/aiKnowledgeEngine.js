// DEVI AI - Real-World Women's Health, Life & Safety Question-Answer Knowledge Base

export const SPECIFIC_QA_DATABASE = [
  // COFFEE & CAFFEINE
  {
    patterns: ['coffee', 'caffeine', 'tea worsen', 'caffeine cramp', 'coffee period'],
    answer: "Yes, caffeine constricts blood vessels and spikes cortisol, which reduces pelvic blood flow and can make menstrual cramps significantly sharper. Switching to decaf, spearmint, or ginger tea during your period brings noticeable relief.",
    followUp: "Have you had coffee today, or are you looking for soothing herbal alternatives?"
  },

  // BROWN DISCHARGE / OLD BLOOD
  {
    patterns: ['brown discharge', 'brown blood', 'dark blood', 'brown spotting'],
    answer: "Brown discharge is almost always just older oxidized blood that took longer to leave the uterus. It's super common right before your period starts or in the final days as your flow tapers off.",
    followUp: "Is the brown spotting happening right around your expected period date?"
  },

  // WHITE / EGG WHITE DISCHARGE & OVULATION
  {
    patterns: ['white discharge', 'clear discharge', 'egg white discharge', 'stretchy discharge', 'milky discharge', 'normal discharge'],
    answer: "Clear, stretchy egg-white discharge is completely normal and indicates you are in your peak fertile ovulation window! Creamy milky discharge is typical in your luteal phase. As long as there is no itching or foul odor, your body is doing its natural self-cleaning.",
    followUp: "Are you tracking this to pinpoint ovulation, or were you wondering if it was normal?"
  },

  // LATE PERIOD WITH NEGATIVE TEST
  {
    patterns: ['late but negative', 'period late negative test', 'missed period not pregnant', 'why period late'],
    answer: "If your pregnancy test is negative, delayed ovulation is the primary reason. Cortisol from stress, travel, poor sleep, sudden diet changes, or thyroid shifts can delay the egg from releasing, which pushes your period back by days or weeks.",
    followUp: "Have you had extra stress, travel, or changes in your sleep routine over the last month?"
  },

  // CAN YOU GET PREGNANT ON PERIOD
  {
    patterns: ['pregnant on period', 'pregnant during period', 'can i get pregnant period', 'sex on period pregnancy'],
    answer: "Yes, it is possible! While the chance is lower, sperm can survive inside the reproductive tract for up to 5 days. If you have a shorter cycle (e.g. 21 to 24 days), you might ovulate soon after your period ends.",
    followUp: "Are you looking into fertility timing or birth control options?"
  },

  // MENSTRUAL HEADACHES / MIGRAINES
  {
    patterns: ['headache before period', 'period migraine', 'head hurts period', 'hormonal headache'],
    answer: "Menstrual headaches are triggered by the sharp drop in estrogen and progesterone right before your period starts. Staying extra hydrated, getting magnesium glycinate, and placing a cool compress on your forehead helps calm the dilated blood vessels.",
    followUp: "Do these headaches usually hit you right before your flow starts?"
  },

  // FOODS FOR PCOS
  {
    patterns: ['pcos food', 'pcos diet', 'what to eat pcos', 'pcos meals', 'pcos nutrition'],
    answer: "For PCOS, the gold standard is meal sequencing: eat your fiber and greens first, proteins and healthy fats second, and carbohydrates last. This cuts insulin spikes by up to 50%. Also, two cups of spearmint tea daily helps lower androgen levels.",
    followUp: "Would you like some easy breakfast ideas that keep your blood sugar steady?"
  },

  // HORMONAL ACNE / JAWLINE BREAKOUTS
  {
    patterns: ['hormonal acne', 'jawline acne', 'chin pimples', 'period breakout', 'acne before period'],
    answer: "Acne along the jawline and chin is driven by androgens stimulating excess sebum before your period. Spearmint tea, zinc, reducing dairy/refined sugar, and gentle salicylic acid washes help calm these hormonal flare-ups.",
    followUp: "Do your breakouts usually flare up during the week before your period?"
  },

  // BLOATING & WATER WEIGHT
  {
    patterns: ['bloating', 'bloat', 'water weight', 'stomach swollen', 'period puffiness'],
    answer: "Progesterone relaxes the digestive tract in your luteal phase, causing fluid retention and slower gut transit. Sipping dandelion or peppermint tea, cutting excess sodium, and light walks help flush out extra water weight quickly.",
    followUp: "Are you feeling mostly abdominal puffiness or digestive sluggishness?"
  },

  // PMS VS PMDD (EXTREME MOOD SWINGS)
  {
    patterns: ['pmdd', 'extreme pms', 'mood swings period', 'crying before period', 'rage before period'],
    answer: "While mild PMS causes mood dips, PMDD (Premenstrual Dysphoric Disorder) causes severe emotional distress, rage, or deep sadness during the 7 to 10 days before your period. It's caused by the brain's heightened sensitivity to normal progesterone shifts.",
    followUp: "Do your emotional symptoms lift completely within a day or two after your period starts?"
  },

  // FAST RELIEF FOR SEVERE CRAMPS
  {
    patterns: ['stop cramps fast', 'cramp relief fast', 'how to stop cramps', 'severe cramps what to do', 'pain relief cramps'],
    answer: "For fast relief: Place a warm heating pad at 40°C on your lower belly, drink hot ginger or chamomile tea to block prostaglandins, and rest in Child's Pose with pillows under your chest to take pressure off uterine nerves.",
    followUp: "Do you have a heating pad or hot water bottle with you right now?"
  },

  // YEAST INFECTION VS BACTERIAL VAGINOSIS (BV)
  {
    patterns: ['yeast infection', 'bacterial vaginosis', 'bv', 'itchy vagina', 'fishy odor', 'clumpy discharge'],
    answer: "A yeast infection typically causes thick, cottage-cheese-like white discharge with intense itching and no strong odor. Bacterial Vaginosis (BV) causes thin grayish-white discharge with a noticeable fishy odor. Both are very treatable with targeted remedies or prescriptions.",
    followUp: "Are you experiencing more itching or an unusual odor?"
  },

  // UTI & URINARY BURNING
  {
    patterns: ['uti', 'urinary burning', 'hurts to pee', 'pee burning', 'bladder infection'],
    answer: "Urinary burning is usually a sign of bladder irritation or a UTI. Drink plenty of water immediately, take D-Mannose or pure unsweetened cranberry extract to prevent bacteria from sticking to the bladder wall. If you develop fever or back pain, see a doctor for antibiotics.",
    followUp: "Have you noticed any fever or lower back pain alongside the burning?"
  },

  // PANIC ATTACK FAST RESET
  {
    patterns: ['panic attack', 'cant breathe', 'hyperventilating', 'freaking out', 'heart racing fast'],
    answer: "Put an ice cube on your wrist or splash ice-cold water on your face right now. This activates your mammalian dive reflex, which forces your heart rate down immediately. Now take a slow breath in for 4 seconds and exhale for 8 seconds.",
    followUp: "Would you like me to guide you through a 2-minute 4-7-8 breathing circle right now?"
  },

  // STALKER / STRANGER FOLLOWING / UNSAFE OUTSIDE
  {
    patterns: ['someone following me', 'stranger following', 'creep following', 'walking alone unsafe', 'scared walking'],
    answer: "Walk directly into the nearest open store, restaurant, or well-lit area with people. Tap 'Fake Call' on DEVI so your phone rings loudly with a realistic voice, or hit the SOS button so I can lock your live GPS and dispatch emergency rescue.",
    followUp: "Are you in a well-lit area near people right now?"
  },

  // WHO ARE YOU / WHAT CAN YOU DO
  {
    patterns: ['who are you', 'what is devi', 'what can you do', 'introduce yourself', 'what do you do'],
    answer: "I'm DEVI, your AI voice companion and safety guardian for women. I'm here 24/7 to give you empathetic health guidance, cycle & PCOS tracking, guided calming exercises, doctor booking, and instant SOS emergency dispatch.",
    followUp: "What would you like to explore or talk about today?"
  },

  // CASUAL CHAT & COMPLIMENTS
  {
    patterns: ['how are you', 'how r u', 'how are you doing', 'whats up', 'what are you doing'],
    answer: "I'm doing wonderfully, thank you for asking! I'm right here keeping watch over your wellness and ready to chat. How are you feeling today?",
    followUp: "How has your day been treating you so far?"
  },
  {
    patterns: ['thank you', 'thanks', 'thx', 'thank u', 'appreciate it', 'dhanyawad', 'shukriya'],
    answer: "You are so welcome! I'm always right here by your side whenever you need comfort, advice, or just a listening ear. / आपका बहुत-बहुत स्वागत है! मैं हमेशा आपके साथ हूँ।",
    followUp: "Is there anything else on your mind that I can help with?"
  },

  // HINDI CRAMPS & PERIODS
  {
    patterns: ['periods dard', 'period me dard', 'cramps me kya kare', 'mahavari dard', 'pet dard period'],
    answer: "पीरियड्स के दर्द में पेट के निचले हिस्से पर गर्म पानी की बोतल से सिकाई करें, गुनगुने पानी में अदरक या अजवाइन की चाय पिएं और हल्का आराम करें।",
    followUp: "क्या आप थोड़ा आराम महसूस कर पा रही हैं?"
  },

  // HINDI PCOS
  {
    patterns: ['pcos kya hai', 'pcos me kya khaye', 'pcod diet hindi', 'pcos diet'],
    answer: "PCOS में प्रोटीन, हरी सब्ज़ियां और साबुत अनाज खाएं। रिफाइंड शुगर व तला-भुना कम करें और रोज़ाना 1-2 कप पुदीने (Spearmint) की चाय पिएं।",
    followUp: "क्या आप अपनी डाइट के बारे में कुछ और जानना चाहती हैं?"
  },

  // HINDI PANIC / ANXIETY
  {
    patterns: ['ghabrahat', 'chinta', 'anxiety hindi', 'panic attack hindi', 'darr lag raha'],
    answer: "गहरी और धीमी सांस लें। चार सेकंड सांस अंदर लें, सात सेकंड रोकें, और आठ सेकंड में बाहर छोड़ें। आप पूरी तरह सुरक्षित हैं।",
    followUp: "क्या आप मेरे साथ 4-7-8 प्राणायाम करना चाहेंगी?"
  }
];

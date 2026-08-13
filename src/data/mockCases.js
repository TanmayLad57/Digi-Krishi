export const INITIAL_MOCK_CASES = [
  {
    id: 'case-101',
    farmerName: 'Ramesh Patil',
    farmerPhone: '9876543210',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluka: 'Katol',
    village: 'Pardi',
    landArea: '5 Acres',
    crops: ['Cotton', 'Paddy'],
    queryType: 'Crop Photo Scan',
    crop: 'Cotton',
    question: 'My cotton leaves have bright yellow spots spreading quickly after rain. Should I spray immediately?',
    photoUrl: '/images/disease-scanner.png',
    aiDiagnosis: 'Yellow Leaf Rust (Puccinia striiformis)',
    aiConfidence: 68,
    escalationReason: 'AI Confidence below 80% threshold (68% match)',
    status: 'Pending', // Pending | In Progress | Resolved
    priority: 'High', // High | Medium | Low
    submittedTime: '15 minutes ago',
    timestamp: '2026-08-13T14:25:00',
    timeline: [
      { step: 'Submitted', time: '14:25 PM', text: 'Farmer submitted crop leaf photo via mobile app.' },
      { step: 'AI Analyzed', time: '14:25 PM', text: 'Computer vision flagged Yellow Leaf Rust with 68% confidence.' },
      { step: 'Auto-Escalated', time: '14:26 PM', text: 'Auto-escalated to Nagpur Extension Queue (AI Confidence < 80%).' },
    ],
    officerResponse: '',
  },
  {
    id: 'case-102',
    farmerName: 'Suresh Deshmukh',
    farmerPhone: '9822334455',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluka: 'Kalmeshwar',
    village: 'Mohpa',
    landArea: '8 Acres',
    crops: ['Paddy (Rice)', 'Wheat'],
    queryType: 'Voice Query (Hindi)',
    crop: 'Paddy (Rice)',
    question: 'मानसून की बारिश के बाद धान की फसल में तना छेदक (Stem Borer) से बचाव के उपाय बताएं?',
    audioTranscript: 'मानसून की बारिश के बाद धान की फसल में तना छेदक (Stem Borer) से बचाव के उपाय बताएं?',
    audioLength: '0:15',
    aiDiagnosis: 'Paddy Stem Borer (Scirpophaga incertulas)',
    aiConfidence: 74,
    escalationReason: 'AI Confidence below 80% threshold (74% match)',
    status: 'Pending',
    priority: 'High',
    submittedTime: '1 hour ago',
    timestamp: '2026-08-13T13:30:00',
    timeline: [
      { step: 'Submitted', time: '13:30 PM', text: 'Farmer recorded Hindi voice note.' },
      { step: 'AI Analyzed', time: '13:31 PM', text: 'Speech-to-Text transcribed query & mapped stem borer advisory.' },
      { step: 'Auto-Escalated', time: '13:31 PM', text: 'Auto-escalated to Nagpur Extension Queue (AI Confidence < 80%).' },
    ],
    officerResponse: '',
  },
  {
    id: 'case-103',
    farmerName: 'Anil Gawande',
    farmerPhone: '9845112233',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluka: 'Katol',
    village: 'Ridhora',
    landArea: '3.5 Acres',
    crops: ['Banana', 'Vegetables'],
    queryType: 'Ask AI Text',
    crop: 'Banana',
    question: 'My banana leaves have black necrotic spots on lower leaves. Is Copper spray safe?',
    photoUrl: '/images/hero.png',
    aiDiagnosis: 'Black Sigatoka Leaf Spot',
    aiConfidence: 78,
    escalationReason: 'AI Confidence below 80% threshold (78% match)',
    status: 'In Progress',
    priority: 'Medium',
    submittedTime: '3 hours ago',
    timestamp: '2026-08-13T11:45:00',
    timeline: [
      { step: 'Submitted', time: '11:45 AM', text: 'Farmer submitted text query on banana leaf spot.' },
      { step: 'AI Analyzed', time: '11:45 AM', text: 'AI recommended Copper Oxychloride dosage.' },
      { step: 'Officer Viewed', time: '12:30 PM', text: 'Dr. Sharma opened case for review.' },
    ],
    officerResponse: 'Prune affected leaves immediately. Spray Copper Oxychloride @ 3g/L water early morning.',
  },
  {
    id: 'case-104',
    farmerName: 'Pandurang Shinde',
    farmerPhone: '9765432109',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluka: 'Narkhed',
    village: 'Mowad',
    landArea: '12 Acres',
    crops: ['Sugarcane', 'Cotton'],
    queryType: 'Crop Photo Scan',
    crop: 'Sugarcane',
    question: 'Red discoloration inside sugarcane stalks. Need urgent field diagnosis.',
    photoUrl: '/images/disease-scanner.png',
    aiDiagnosis: 'Sugarcane Red Rot (Colletotrichum falcatum)',
    aiConfidence: 62,
    escalationReason: 'AI Confidence 62% — Severe fungal crop threat requiring field sample',
    status: 'Pending',
    priority: 'High',
    submittedTime: '5 hours ago',
    timestamp: '2026-08-13T09:15:00',
    timeline: [
      { step: 'Submitted', time: '09:15 AM', text: 'Farmer submitted stalk inspection photo.' },
      { step: 'AI Analyzed', time: '09:15 AM', text: 'Identified Red Rot symptoms (62% confidence).' },
      { step: 'Auto-Escalated', time: '09:16 AM', text: 'High Priority alert sent to KVK Scientist queue.' },
    ],
    officerResponse: '',
  },
  {
    id: 'case-105',
    farmerName: 'Prakash Shinde',
    farmerPhone: '9423115566',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluka: 'Nagpur Rural',
    village: 'Bhavani',
    landArea: '6 Acres',
    crops: ['Wheat', 'Mustard'],
    queryType: 'Ask AI Text',
    crop: 'Wheat',
    question: 'What is the recommended Nitrogen dose for late-sown wheat in clay soil?',
    aiDiagnosis: 'Wheat Nutrient Management Advisory',
    aiConfidence: 96,
    escalationReason: 'Routine query review',
    status: 'Resolved',
    priority: 'Low',
    submittedTime: '1 day ago',
    timestamp: '2026-08-12T16:00:00',
    timeline: [
      { step: 'Submitted', time: 'Yesterday', text: 'Farmer inquired about fertilizer ratio.' },
      { step: 'AI Analyzed', time: 'Yesterday', text: 'Provided ICAR split NPK recommendations.' },
      { step: 'Resolved', time: 'Yesterday', text: 'AI Resolved with 96% high confidence.' },
    ],
    officerResponse: '',
  },
];

export const INITIAL_FARMER_HISTORY = [
  {
    id: 'diag-1',
    date: 'Today, 2:15 PM',
    queryType: 'Crop Photo Scan',
    crop: 'Cotton',
    question: 'My cotton leaves have bright yellow spots spreading quickly after rain. Should I spray immediately?',
    aiDiagnosis: 'Yellow Leaf Rust (Puccinia striiformis)',
    remedy: 'Spray 1% Urea solution mixed with Neem oil formulation (5ml/L water). Apply Propiconazole if rust exceeds 10% leaf surface.',
    weatherAlert: 'Humidity above 80% — ideal for fungal spread. Monitor fields daily.',
    aiConfidence: 68,
    status: 'Auto-Escalated',
    photoUrl: '/images/disease-scanner.png',
    escalationNote: 'AI Confidence 68% (Below 80% threshold). Automatically forwarded to Dr. Sunita Sharma (Nagpur KVK).',
  },
  {
    id: 'diag-2',
    date: 'Yesterday, 11:30 AM',
    queryType: 'Ask AI Text',
    crop: 'Banana',
    question: 'My banana leaves have black necrotic spots on lower leaves. Is Copper spray safe?',
    aiDiagnosis: 'Black Sigatoka Leaf Spot (Fungal Infection)',
    remedy: 'Prune heavily infected lower leaves immediately. Apply Copper Oxychloride 50% WP @ 3g/liter water or Propiconazole 25% EC (1ml/liter).',
    weatherAlert: 'Rain forecasted in 48 hours in your district. Spray immediately before rainfall.',
    aiConfidence: 78,
    status: 'Officer Verified (Dr. Sharma)',
    photoUrl: '/images/hero.png',
    officerResponse: 'Prune affected leaves immediately. Spray Copper Oxychloride @ 3g/L water early morning.',
  },
  {
    id: 'diag-3',
    date: '3 days ago',
    queryType: 'Voice Query (Hindi)',
    crop: 'Paddy (Rice)',
    question: 'मानसून की बारिश के बाद धान की फसल में तना छेदक (Stem Borer) से बचाव के उपाय बताएं?',
    aiDiagnosis: 'Paddy Stem Borer Advisory',
    remedy: 'खेत में प्रकाश प्रपंच (Light Trap) लगाएं और 5-6 ट्राइकोकार्ड प्रति एकड़ स्थापित करें। रासायनिक उपचार के लिए कारटाप हाइड्रोक्लोराइड 4% जीआर (5 किग्रा/एकड़) का प्रयोग करें।',
    weatherAlert: 'Normal micro-climate forecast for your taluka.',
    aiConfidence: 94,
    status: 'AI Resolved',
    audioTranscript: 'मानसून की बारिश के बाद धान की फसल में तना छेदक (Stem Borer) से बचाव के उपाय बताएं?',
    audioLength: '0:12',
  },
  {
    id: 'diag-4',
    date: '5 days ago',
    queryType: 'Government Scheme',
    crop: 'Paddy (Rice)',
    question: 'Check PM Kisan Samman Nidhi Yojana 17th Installment Status',
    aiDiagnosis: 'PM-KISAN e-KYC Verification Status',
    remedy: '₹2,000 Credited via Direct Benefit Transfer. e-KYC Verified & Bank Account Linked.',
    weatherAlert: 'e-KYC Active',
    aiConfidence: 98,
    status: 'AI Resolved',
  },
];

// Local Storage Helpers for Officer Cases
export function getStoredCases() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('dko-officer-cases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse officer cases', e);
      }
    }
  }
  return INITIAL_MOCK_CASES;
}

export function saveStoredCases(cases) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dko-officer-cases', JSON.stringify(cases));
  }
}

// Local Storage Helpers for Farmer Advisory History
export function getFarmerHistory() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('dko-farmer-history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse farmer history', e);
      }
    }
  }
  return INITIAL_FARMER_HISTORY;
}

export function saveFarmerHistory(historyList) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dko-farmer-history', JSON.stringify(historyList));
  }
}

// Function to submit a query from AI page:
// Auto-escalates if confidence < 80% and saves to history & officer cases queue!
export function recordFarmerQuery(queryData) {
  const isEscalated = queryData.aiConfidence < 80;
  const historyItem = {
    id: `diag-${Date.now()}`,
    date: 'Just now',
    queryType: queryData.queryType,
    crop: queryData.crop || 'Cotton',
    question: queryData.question,
    aiDiagnosis: queryData.aiDiagnosis,
    remedy: queryData.remedy,
    weatherAlert: queryData.weatherAlert || 'Normal regional forecast.',
    aiConfidence: queryData.aiConfidence,
    status: isEscalated ? 'Auto-Escalated' : 'AI Resolved',
    photoUrl: queryData.photoUrl || null,
    audioTranscript: queryData.audioTranscript || null,
    audioLength: queryData.audioLength || null,
    escalationNote: isEscalated
      ? `Our AI confidence is ${queryData.aiConfidence}% (Below 80% threshold). Automatically forwarded to Dr. Sunita Sharma (Nagpur KVK).`
      : null,
  };

  // 1. Save to Farmer History
  const currentHistory = getFarmerHistory();
  saveFarmerHistory([historyItem, ...currentHistory]);

  // 2. If Auto-Escalated (< 80% confidence), push to Officer Cases Queue!
  if (isEscalated) {
    const newOfficerCase = {
      id: `case-${Date.now()}`,
      farmerName: queryData.farmerName || 'Rajesh Patil',
      farmerPhone: queryData.farmerPhone || '9876543210',
      state: 'Maharashtra',
      district: 'Nagpur',
      taluka: 'Katol',
      village: 'Pardi',
      landArea: '5 Acres',
      crops: [queryData.crop || 'Cotton'],
      queryType: queryData.queryType,
      crop: queryData.crop || 'Cotton',
      question: queryData.question,
      photoUrl: queryData.photoUrl || null,
      audioTranscript: queryData.audioTranscript || null,
      aiDiagnosis: queryData.aiDiagnosis,
      aiConfidence: queryData.aiConfidence,
      escalationReason: `Auto-Escalated: AI Confidence ${queryData.aiConfidence}% is below 80% threshold`,
      status: 'Pending',
      priority: queryData.aiConfidence < 70 ? 'High' : 'Medium',
      submittedTime: 'Just now',
      timestamp: new Date().toISOString(),
      timeline: [
        { step: 'Submitted', time: 'Just now', text: `Farmer submitted ${queryData.queryType}.` },
        { step: 'AI Analyzed', time: 'Just now', text: `AI evaluated ${queryData.aiDiagnosis} with ${queryData.aiConfidence}% confidence.` },
        { step: 'Auto-Escalated', time: 'Just now', text: `Auto-escalated to Nagpur Extension Queue (AI Confidence < 80%).` },
      ],
      officerResponse: '',
    };

    const currentCases = getStoredCases();
    saveStoredCases([newOfficerCase, ...currentCases]);
  }

  return { isEscalated, historyItem };
}

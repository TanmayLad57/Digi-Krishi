export const mockResponsesEn = {
  samplePrompts: [
    'My banana leaves have black spots. What should I do?',
    'Yellow spots on cotton leaves in Vidarbha district',
    'Best organic fertilizer dose for paddy before monsoons',
    'How to apply for PM-KISAN 17th installment e-KYC?'
  ],
  textQueries: {
    banana: {
      queryType: 'Ask AI Text',
      crop: 'Banana',
      aiDiagnosis: 'Black Sigatoka Leaf Spot (Fungal Infection)',
      diagnosis: 'Black Sigatoka Leaf Spot (Fungal Infection)',
      remedy: 'Prune heavily infected lower leaves immediately. Apply Copper Oxychloride 50% WP @ 3g/liter water or Propiconazole 25% EC (1ml/liter). Maintain 2.5m plant spacing.',
      weatherAlert: 'Rain forecasted in 48 hours in your district. Spray immediately before rainfall.',
      aiConfidence: 78
    },
    cotton: {
      queryType: 'Ask AI Text',
      crop: 'Cotton',
      aiDiagnosis: 'Yellow Leaf Rust / Nitrogen Deficiency',
      diagnosis: 'Yellow Leaf Rust / Nitrogen Deficiency',
      remedy: 'Spray 1% Urea solution mixed with Neem oil formulation (5ml/L water). Apply Propiconazole 25% EC if rust exceeds 10% leaf surface.',
      weatherAlert: 'Humidity above 80% — ideal for fungal spread. Monitor fields daily.',
      aiConfidence: 68
    },
    default: {
      queryType: 'Ask AI Text',
      crop: 'Paddy / Wheat',
      aiDiagnosis: 'General Agronomy & Pest Prevention Advisory',
      diagnosis: 'General Agronomy & Pest Prevention Advisory',
      remedy: 'Based on ICAR agronomy guidelines: Apply balanced NPK (12:32:16) ratio and incorporate 2 tons/acre organic farmyard manure. Spray Neem oil (5ml/L) as preventive.',
      weatherAlert: 'Normal micro-climate forecast for your taluka.',
      aiConfidence: 94
    }
  },
  voiceQuery: {
    queryType: 'Voice Query (English)',
    question: 'How to control Paddy Stem Borer after monsoon rains?',
    query: 'How to control Paddy Stem Borer after monsoon rains?',
    audioTranscript: 'How to control Paddy Stem Borer after monsoon rains?',
    crop: 'Paddy (Rice)',
    aiDiagnosis: 'Paddy Stem Borer (Scirpophaga incertulas)',
    diagnosis: 'Paddy Stem Borer (Scirpophaga incertulas)',
    remedy: 'Install 5-6 light traps per acre. Apply Cartap Hydrochloride 4% GR @ 5 kg/acre in standing water or spray Neem oil formulation.',
    weatherAlert: 'Normal micro-climate forecast for your taluka.',
    aiConfidence: 92
  },
  scanQuery: {
    queryType: 'Crop Photo Scan',
    question: 'Crop photo: Cotton leaf yellow rust diagnostic scan',
    query: 'Crop photo: Cotton leaf yellow rust diagnostic scan',
    photoUrl: '/images/disease-scanner.png',
    crop: 'Cotton',
    aiDiagnosis: 'Yellow Leaf Rust (Puccinia striiformis)',
    diagnosis: 'Yellow Leaf Rust (Puccinia striiformis)',
    remedy: 'Neem oil spray solution (5ml/L water) or Propiconazole 25% EC @ 1ml/liter water in the early morning.',
    weatherAlert: 'High humidity expected tomorrow. Spray before rain starts.',
    aiConfidence: 68
  },
  schemes: {
    'pm-kisan': {
      queryType: 'Government Scheme',
      question: 'PM Kisan Samman Nidhi e-KYC Verification',
      query: 'PM Kisan Samman Nidhi e-KYC Verification',
      crop: 'Paddy (Rice)',
      aiDiagnosis: 'PM-KISAN e-KYC Verification Status',
      diagnosis: 'PM-KISAN e-KYC Verification Status',
      remedy: '₹2,000 Credited via Direct Benefit Transfer. e-KYC Verified & Bank Account Linked.',
      weatherAlert: 'e-KYC Active',
      aiConfidence: 98,
      statusTitle: 'PM-KISAN 17th Installment Status',
      statusDetail: '₹2,000 Credited via Direct Benefit Transfer',
      statusSub: 'e-KYC Verified & Bank Account Linked'
    },
    'pm-kusum': {
      queryType: 'Government Scheme',
      question: 'PM-KUSUM Solar Pump Subsidy Verification',
      query: 'PM-KUSUM Solar Pump Subsidy Verification',
      crop: 'Agricultural Field',
      aiDiagnosis: 'PM-KUSUM Solar Pump Application Status',
      diagnosis: 'PM-KUSUM Solar Pump Application Status',
      remedy: '60% State Government Subsidy Approved. 5HP Solar Pump Sanctioned.',
      weatherAlert: 'Subsidy Approved',
      aiConfidence: 96,
      statusTitle: 'PM-KUSUM Solar Pump Subsidy',
      statusDetail: '60% State Government Subsidy Eligible',
      statusSub: '5HP Solar Pump Application Approved'
    },
    'soil-card': {
      queryType: 'Government Scheme',
      question: 'Soil Health Card & Fertilizer Grant Verification',
      query: 'Soil Health Card & Fertilizer Grant Verification',
      crop: 'Multi-Crop Field',
      aiDiagnosis: 'Soil Health Card Nutrient Grant Active',
      diagnosis: 'Soil Health Card Nutrient Grant Active',
      remedy: 'Soil test report verified. 25% subsidy allocated for Organic Bio-fertilizers and Neem-coated Urea.',
      weatherAlert: 'Soil Grant Verified',
      aiConfidence: 95,
      statusTitle: 'Soil Health Card Grant',
      statusDetail: '25% Organic Bio-Fertilizer Subsidy Allocated',
      statusSub: 'Soil NPK Report Active'
    }
  }
};

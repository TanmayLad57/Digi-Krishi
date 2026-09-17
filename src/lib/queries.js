import { supabase } from './supabaseClient';

const modeLabels = {
  text: 'Ask AI Text',
  voice: 'Voice Query',
  image: 'Crop Photo Scan',
  scheme: 'Government Scheme',
};

const formatDate = (value) => new Date(value).toLocaleString([], {
  day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
});

const isRemoteUrl = (value) => /^https?:\/\//.test(value || '');

export async function createQuery({ farmerId, mode, question, response, confidence, language, imageUrl, voiceUrl }) {
  const { data, error } = await supabase
    .from('queries')
    .insert({
      farmer_id: farmerId,
      mode,
      question,
      response,
      confidence,
      language,
      status: confidence < 80 ? 'escalated' : 'answered',
      image_url: isRemoteUrl(imageUrl) ? imageUrl : null,
      voice_url: isRemoteUrl(voiceUrl) ? voiceUrl : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFarmerQueries(farmerId, fallbackCrop = 'Crop advisory') {
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => toFarmerHistory(row, fallbackCrop));
}

export async function getOfficerQueries() {
  const { data, error } = await supabase
    .from('queries')
    .select('*, profiles!queries_farmer_id_fkey(full_name, farmer_details(phone, state, district, taluka, village, primary_crop, additional_crops, land_area_acres))')
    .eq('status', 'escalated')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(toOfficerCase);
}

export async function getOfficerQuery(queryId) {
  const { data, error } = await supabase
    .from('queries')
    .select('*, profiles!queries_farmer_id_fkey(full_name, farmer_details(phone, state, district, taluka, village, primary_crop, additional_crops, land_area_acres))')
    .eq('id', queryId)
    .single();

  if (error) throw error;
  return toOfficerCase(data);
}

export async function updateOfficerQuery(queryId, officerId, updates) {
  const { error } = await supabase
    .from('queries')
    .update({ officer_id: officerId, ...updates })
    .eq('id', queryId);

  if (error) throw error;
}

function toFarmerHistory(row, fallbackCrop) {
  const isEscalated = row.status === 'escalated';
  return {
    id: row.id,
    date: formatDate(row.created_at),
    queryType: modeLabels[row.mode] || row.mode,
    crop: fallbackCrop,
    question: row.question,
    aiDiagnosis: row.response || row.question,
    remedy: row.response || '',
    aiConfidence: Number(row.confidence ?? 0),
    status: isEscalated ? 'Auto-Escalated' : row.status === 'resolved' ? 'Officer Resolved' : 'AI Resolved',
    photoUrl: row.image_url,
    audioTranscript: row.mode === 'voice' ? row.question : null,
    officerResponse: row.officer_response,
    escalationNote: isEscalated ? `AI confidence (${row.confidence}%) is below the 80% escalation threshold.` : null,
  };
}

function toOfficerCase(row) {
  const profile = row.profiles || {};
  const details = Array.isArray(profile.farmer_details) ? profile.farmer_details[0] : profile.farmer_details || {};
  const hasOfficerResponse = Boolean(row.officer_response);
  const crop = details.primary_crop || 'Not specified';
  return {
    id: row.id,
    farmerName: profile.full_name || 'Farmer',
    farmerPhone: details.phone || '',
    state: details.state || 'Not provided',
    district: details.district || 'Not provided',
    taluka: details.taluka || 'Not provided',
    village: details.village || 'Not provided',
    landArea: details.land_area_acres ? `${details.land_area_acres} Acres` : 'Not provided',
    crops: details.additional_crops || [crop],
    crop,
    queryType: modeLabels[row.mode] || row.mode,
    question: row.question,
    photoUrl: row.image_url,
    aiDiagnosis: row.response || 'AI advisory pending',
    aiConfidence: Number(row.confidence ?? 0),
    escalationReason: `AI confidence ${row.confidence ?? 'N/A'}% is below the 80% threshold.`,
    officerResponse: row.officer_response || '',
    status: row.status === 'resolved' ? 'Resolved' : hasOfficerResponse ? 'In Progress' : 'Pending',
    priority: Number(row.confidence) < 70 ? 'High' : 'Medium',
    submittedTime: formatDate(row.created_at),
    timestamp: row.created_at,
    timeline: [
      { step: 'Submitted', time: formatDate(row.created_at), text: `Farmer submitted a ${modeLabels[row.mode] || row.mode} query.` },
      { step: 'Auto-Escalated', time: formatDate(row.created_at), text: `Escalated because AI confidence was ${row.confidence ?? 'N/A'}%.` },
      ...(hasOfficerResponse ? [{ step: 'Officer Responded', time: formatDate(row.updated_at), text: 'Officer advisory saved.' }] : []),
    ],
  };
}

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquareText,
  Mic,
  Camera,
  Landmark,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  Sprout,
  Upload,
  ImageIcon,
  Search,
  Lock,
  X,
  User,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createQuery, updateQuery } from '../lib/queries';
import { supabase } from '../lib/supabaseClient';
import { uploadCropImage, uploadVoiceRecording } from '../lib/storage';
import { getMockResponses } from '../data/mockResponses';

const serializeConversation = (data, followUps = []) => {
  if (!data) return '';
  const parts = [];
  if (data.aiDiagnosis || data.diagnosis) {
    parts.push(`Diagnosis: ${data.aiDiagnosis || data.diagnosis}`);
  }
  if (data.remedy) {
    parts.push(`Treatment Plan: ${data.remedy}`);
  }
  if (data.weatherAlert) {
    parts.push(`Advisory Alert: ${data.weatherAlert}`);
  }
  if (followUps && followUps.length > 0) {
    parts.push(`\n--- Follow-up Q&A (${followUps.length}) ---`);
    followUps.forEach((fu, idx) => {
      parts.push(`\n[Follow-up ${idx + 1}]\nFarmer: ${fu.question}\nAI Advisory: ${fu.answer}`);
    });
  }
  return parts.filter(Boolean).join('\n\n');
};

export default function DemoPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const mockData = getMockResponses(currentLang);

  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('text-ai');
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);

  // Tab 1: Ask AI (Text) State
  const [userQuery, setUserQuery] = useState('');
  const [textSubmitted, setTextSubmitted] = useState(false);
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState(null);
  const [textFollowUps, setTextFollowUps] = useState([]);
  const [textConversation, setTextConversation] = useState([]);
  const [textFollowUpInput, setTextFollowUpInput] = useState('');
  const [isAnalyzingTextFollowUp, setIsAnalyzingTextFollowUp] = useState(false);

  // Tab 2: Voice Query State
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'recording' | 'processing' | 'done'
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [voiceAnswer, setVoiceAnswer] = useState(null);
  const [voiceFollowUps, setVoiceFollowUps] = useState([]);
  const [voiceConversation, setVoiceConversation] = useState([]);
  const [voiceFollowUpState, setVoiceFollowUpState] = useState('idle'); // 'idle' | 'recording' | 'processing'
  const [voiceFollowUpTimer, setVoiceFollowUpTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const recordingStreamRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const followUpMediaRecorderRef = useRef(null);
  const followUpRecordingStreamRef = useRef(null);
  const followUpRecordingChunksRef = useRef([]);
  const followUpRecordingTimerRef = useRef(null);

  // Tab 3: Crop Disease Scan State
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'done'
  const [scannedImage, setScannedImage] = useState(null);
  const [scanAnswer, setScanAnswer] = useState(null);
  const [scanFollowUps, setScanFollowUps] = useState([]);
  const [scanConversation, setScanConversation] = useState([]);
  const [scanFollowUpInput, setScanFollowUpInput] = useState('');
  const [isAnalyzingScanFollowUp, setIsAnalyzingScanFollowUp] = useState(false);
  const fileInputRef = useRef(null);

  // Tab 4: Government Schemes State
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('pm-kisan');
  const [farmerIdInput, setFarmerIdInput] = useState('');
  const [isVerifyingScheme, setIsVerifyingScheme] = useState(false);
  const [schemeAnswer, setSchemeAnswer] = useState(null);

  // Active data ref for unmount & beforeunload flushes
  const activeDataRef = useRef({});
  activeDataRef.current = {
    activeTab,
    activeAnswer,
    textFollowUps,
    voiceAnswer,
    voiceFollowUps,
    scanAnswer,
    scanFollowUps,
  };

  const flushActiveThread = async (tabToFlush) => {
    const current = activeDataRef.current;
    if (tabToFlush === 'text-ai' && current.activeAnswer?.queryId) {
      try {
        await updateQuery(current.activeAnswer.queryId, {
          response: serializeConversation(current.activeAnswer, current.textFollowUps),
        });
      } catch (err) {
        console.error('Failed to flush text query thread', err);
      }
    } else if (tabToFlush === 'voice' && current.voiceAnswer?.queryId) {
      try {
        await updateQuery(current.voiceAnswer.queryId, {
          response: serializeConversation(current.voiceAnswer, current.voiceFollowUps),
        });
      } catch (err) {
        console.error('Failed to flush voice query thread', err);
      }
    } else if (tabToFlush === 'scan' && current.scanAnswer?.queryId) {
      try {
        await updateQuery(current.scanAnswer.queryId, {
          response: serializeConversation(current.scanAnswer, current.scanFollowUps),
        });
      } catch (err) {
        console.error('Failed to flush scan query thread', err);
      }
    }
  };

  useEffect(() => {
    const handleUnload = () => {
      const current = activeDataRef.current;
      if (current.activeTab === 'text-ai' && current.activeAnswer?.queryId) {
        updateQuery(current.activeAnswer.queryId, {
          response: serializeConversation(current.activeAnswer, current.textFollowUps),
        });
      } else if (current.activeTab === 'voice' && current.voiceAnswer?.queryId) {
        updateQuery(current.voiceAnswer.queryId, {
          response: serializeConversation(current.voiceAnswer, current.voiceFollowUps),
        });
      } else if (current.activeTab === 'scan' && current.scanAnswer?.queryId) {
        updateQuery(current.scanAnswer.queryId, {
          response: serializeConversation(current.scanAnswer, current.scanFollowUps),
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
  }, []);

  // Intercept action if user is not logged in
  const checkAuthOrGate = (onAuthenticatedAction) => {
    if (!isAuthenticated) {
      setShowAuthGateModal(true);
      return false;
    }
    onAuthenticatedAction();
    return true;
  };

  const samplePrompts = mockData.samplePrompts || [];

  const persistQuery = async (data, mode, followUps = []) => {
    const confidence = Number(data.aiConfidence ?? 0);
    const created = await createQuery({
      farmerId: currentUser.id,
      mode,
      question: data.question || data.query,
      response: serializeConversation(data, followUps),
      confidence,
      language: currentLang,
      imageUrl: data.storageImagePath,
      voiceUrl: data.storageVoicePath,
    });
    return { isEscalated: confidence < 80, id: created.id };
  };

  // Reset Handlers that bundle and save active threads
  const handleTextReset = () => {
    flushActiveThread('text-ai');
    setTextSubmitted(false);
    setUserQuery('');
    setActiveAnswer(null);
    setTextFollowUps([]);
    setTextConversation([]);
    setTextFollowUpInput('');
  };

  const handleVoiceReset = () => {
    flushActiveThread('voice');
    setVoiceState('idle');
    setVoiceAnswer(null);
    setVoiceFollowUps([]);
    setVoiceConversation([]);
    setVoiceFollowUpState('idle');
  };

  const handleScanReset = () => {
    flushActiveThread('scan');
    setScanState('idle');
    setScannedImage(null);
    setScanAnswer(null);
    setScanFollowUps([]);
    setScanConversation([]);
    setScanFollowUpInput('');
  };

  // Submit Text AI Query
  const handleTextSubmit = (queryToSubmit) => {
    const q = (queryToSubmit || userQuery || '').trim();
    if (!q) return;

    checkAuthOrGate(() => {
      setUserQuery(q);
      setIsAnalyzingText(true);

      (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('ask-ai', {
            body: { question: q, language: currentLang },
          });
          if (error) throw error;

          const answerData = {
            question: q,
            query: q,
            aiDiagnosis: data.identifiedCondition,
            aiConfidence: data.confidenceScore,
            remedy: data.treatmentPlan,
          };
          let isEscalated = false;
          let queryId = null;
          try {
            const saved = await persistQuery(answerData, 'text');
            isEscalated = saved.isEscalated;
            queryId = saved.id;
          } catch (error) {
            console.error('Unable to save AI advisory', error);
            alert('Your AI advisory is ready, but it could not be saved to your query history. Please try again.');
          }
          setActiveAnswer({ ...answerData, queryId, isEscalated });
          setTextConversation([
            { role: 'user', content: q },
            { role: 'assistant', content: `${data.identifiedCondition ? `${data.identifiedCondition}: ` : ''}${data.treatmentPlan}` },
          ]);
          setTextFollowUps([]);
          setTextSubmitted(true);
        } catch (error) {
          console.error('Unable to get AI advisory', error);
          alert('We could not get an AI advisory right now. Please try again.');
        } finally {
          setIsAnalyzingText(false);
        }
      })();
    });
  };

  // Submit Follow-up Text Query
  const handleTextFollowUpSubmit = () => {
    const q = textFollowUpInput.trim();
    if (!q || isAnalyzingTextFollowUp || textFollowUps.length >= 5) return;

    checkAuthOrGate(async () => {
      setIsAnalyzingTextFollowUp(true);
      try {
        const { data, error } = await supabase.functions.invoke('ask-ai', {
          body: {
            question: q,
            language: currentLang,
            conversationHistory: textConversation,
          },
        });
        if (error) throw error;

        const newFollowUp = {
          question: q,
          answer: data.treatmentPlan,
          confidence: data.confidenceScore,
          aiDiagnosis: data.identifiedCondition,
        };
        const nextFollowUps = [...textFollowUps, newFollowUp];
        setTextFollowUps(nextFollowUps);
        setTextConversation((prev) => [
          ...prev,
          { role: 'user', content: q },
          { role: 'assistant', content: data.treatmentPlan },
        ]);
        setTextFollowUpInput('');

        if (activeAnswer?.queryId) {
          try {
            await updateQuery(activeAnswer.queryId, {
              response: serializeConversation(activeAnswer, nextFollowUps),
            });
          } catch (err) {
            console.error('Unable to update text query with follow-up', err);
          }
        }
      } catch (error) {
        console.error('Unable to get follow-up AI advisory', error);
        alert('We could not process your follow-up question right now. Please try again.');
      } finally {
        setIsAnalyzingTextFollowUp(false);
      }
    });
  };

  // Process initial voice query and assign queryId
  const processVoiceQuery = async (storageVoicePath) => {
    const { data: transcription, error: transcriptionError } = await supabase.functions.invoke('transcribe-voice', {
      body: { audioPath: storageVoicePath },
    });
    if (transcriptionError) throw transcriptionError;

    const transcript = transcription?.transcript?.trim();
    if (!transcript) throw new Error('The voice recording could not be transcribed.');

    const { data: advisory, error: advisoryError } = await supabase.functions.invoke('ask-ai', {
      body: { question: transcript, language: currentLang },
    });
    if (advisoryError) throw advisoryError;

    const voiceData = {
      question: transcript,
      query: transcript,
      audioTranscript: transcript,
      storageVoicePath,
      aiDiagnosis: advisory.identifiedCondition,
      aiConfidence: advisory.confidenceScore,
      remedy: advisory.treatmentPlan,
    };

    let isEscalated = false;
    let queryId = null;
    try {
      const saved = await persistQuery(voiceData, 'voice');
      isEscalated = saved.isEscalated;
      queryId = saved.id;
    } catch (error) {
      console.error('Unable to save voice advisory', error);
      alert('Your voice advisory is ready, but it could not be saved to your query history. Please try again.');
    }

    setVoiceAnswer({ ...voiceData, queryId, isEscalated });
    setVoiceConversation([
      { role: 'user', content: transcript },
      { role: 'assistant', content: `${advisory.identifiedCondition ? `${advisory.identifiedCondition}: ` : ''}${advisory.treatmentPlan}` },
    ]);
    setVoiceFollowUps([]);
    setVoiceState('done');
  };

  // Process follow-up voice query with conversationHistory and cap enforcement
  const processVoiceFollowUpQuery = async (storageVoicePath) => {
    if (voiceFollowUps.length >= 5) return;
    const { data: transcription, error: transcriptionError } = await supabase.functions.invoke('transcribe-voice', {
      body: { audioPath: storageVoicePath },
    });
    if (transcriptionError) throw transcriptionError;

    const transcript = transcription?.transcript?.trim();
    if (!transcript) throw new Error('The follow-up voice recording could not be transcribed.');

    const { data: advisory, error: advisoryError } = await supabase.functions.invoke('ask-ai', {
      body: {
        question: transcript,
        language: currentLang,
        conversationHistory: voiceConversation,
      },
    });
    if (advisoryError) throw advisoryError;

    const newFollowUp = {
      question: transcript,
      answer: advisory.treatmentPlan,
      confidence: advisory.confidenceScore,
      aiDiagnosis: advisory.identifiedCondition,
    };
    const nextFollowUps = [...voiceFollowUps, newFollowUp];
    setVoiceFollowUps(nextFollowUps);
    setVoiceConversation((prev) => [
      ...prev,
      { role: 'user', content: transcript },
      { role: 'assistant', content: advisory.treatmentPlan },
    ]);

    if (voiceAnswer?.queryId) {
      try {
        await updateQuery(voiceAnswer.queryId, {
          response: serializeConversation(voiceAnswer, nextFollowUps),
        });
      } catch (err) {
        console.error('Unable to update voice query with follow-up', err);
      }
    }
    setVoiceFollowUpState('idle');
  };

  const finishRecordedAudio = async () => {
    const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
    const extension = mimeType.includes('mp4') ? 'm4a' : 'webm';
    const audioBlob = new Blob(recordingChunksRef.current, { type: mimeType });
    recordingChunksRef.current = [];
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
    setVoiceState('processing');

    try {
      const audioFile = new File([audioBlob], `krishi-voice-${Date.now()}.${extension}`, { type: mimeType });
      const storageVoicePath = await uploadVoiceRecording(audioFile, currentUser.id);
      await processVoiceQuery(storageVoicePath);
    } catch (error) {
      console.error('Unable to process recorded voice query', error);
      setVoiceState('idle');
      alert(error.message || 'The voice recording could not be processed.');
    } finally {
      mediaRecorderRef.current = null;
    }
  };

  const finishVoiceFollowUpRecordedAudio = async () => {
    const mimeType = followUpMediaRecorderRef.current?.mimeType || 'audio/webm';
    const extension = mimeType.includes('mp4') ? 'm4a' : 'webm';
    const audioBlob = new Blob(followUpRecordingChunksRef.current, { type: mimeType });
    followUpRecordingChunksRef.current = [];
    followUpRecordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    followUpRecordingStreamRef.current = null;
    setVoiceFollowUpState('processing');

    try {
      const audioFile = new File([audioBlob], `krishi-voice-fu-${Date.now()}.${extension}`, { type: mimeType });
      const storageVoicePath = await uploadVoiceRecording(audioFile, currentUser.id);
      await processVoiceFollowUpQuery(storageVoicePath);
    } catch (error) {
      console.error('Unable to process recorded voice follow-up', error);
      setVoiceFollowUpState('idle');
      alert(error.message || 'The voice recording could not be processed.');
    } finally {
      followUpMediaRecorderRef.current = null;
    }
  };

  // Start a real microphone recording. The audio is uploaded when the farmer stops it.
  const handleStartRecording = () => {
    checkAuthOrGate(async () => {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        alert('Voice recording is not supported in this browser. Please upload an audio file instead.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recordingStreamRef.current = stream;
        recordingChunksRef.current = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) recordingChunksRef.current.push(event.data);
        };
        recorder.onstop = finishRecordedAudio;
        recorder.onerror = () => {
          stream.getTracks().forEach((track) => track.stop());
          setVoiceState('idle');
          alert('Recording failed. Please try again or upload an audio file.');
        };
        mediaRecorderRef.current = recorder;
        setVoiceTimer(0);
        setVoiceState('recording');
        recordingTimerRef.current = setInterval(() => setVoiceTimer((seconds) => seconds + 1), 1000);
        recorder.start();
      } catch (error) {
        console.error('Microphone permission was denied or unavailable', error);
        alert('Please allow microphone access to record a voice query.');
      }
    });
  };

  const handleStopRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
  };

  const handleStartVoiceFollowUpRecording = () => {
    if (voiceFollowUps.length >= 5) return;
    checkAuthOrGate(async () => {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        alert('Voice recording is not supported in this browser. Please upload an audio file instead.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        followUpRecordingStreamRef.current = stream;
        followUpRecordingChunksRef.current = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) followUpRecordingChunksRef.current.push(event.data);
        };
        recorder.onstop = finishVoiceFollowUpRecordedAudio;
        recorder.onerror = () => {
          stream.getTracks().forEach((track) => track.stop());
          setVoiceFollowUpState('idle');
          alert('Recording failed. Please try again or upload an audio file.');
        };
        followUpMediaRecorderRef.current = recorder;
        setVoiceFollowUpTimer(0);
        setVoiceFollowUpState('recording');
        followUpRecordingTimerRef.current = setInterval(() => setVoiceFollowUpTimer((seconds) => seconds + 1), 1000);
        recorder.start();
      } catch (error) {
        console.error('Microphone permission was denied or unavailable', error);
        alert('Please allow microphone access to record a voice query.');
      }
    });
  };

  const handleStopVoiceFollowUpRecording = () => {
    if (followUpRecordingTimerRef.current) clearInterval(followUpRecordingTimerRef.current);
    followUpRecordingTimerRef.current = null;
    if (followUpMediaRecorderRef.current?.state === 'recording') followUpMediaRecorderRef.current.stop();
  };

  // Handle Audio File Upload
  const handleAudioUpload = (e) => {
    checkAuthOrGate(() => {
      if (e.target.files && e.target.files[0]) {
        const voiceFile = e.target.files[0];
        setVoiceState('processing');
        uploadVoiceRecording(voiceFile, currentUser.id).then(processVoiceQuery).catch((error) => {
          console.error('Unable to process uploaded voice query', error);
          setVoiceState('idle');
          alert(error.message || 'The voice recording could not be processed.');
        });
      }
    });
  };

  const handleVoiceFollowUpAudioUpload = (e) => {
    if (voiceFollowUps.length >= 5) return;
    checkAuthOrGate(() => {
      if (e.target.files && e.target.files[0]) {
        const voiceFile = e.target.files[0];
        setVoiceFollowUpState('processing');
        uploadVoiceRecording(voiceFile, currentUser.id)
          .then(processVoiceFollowUpQuery)
          .catch((error) => {
            console.error('Unable to process uploaded voice follow-up', error);
            setVoiceFollowUpState('idle');
            alert(error.message || 'The voice recording could not be processed.');
          });
      }
    });
  };

  // Trigger Photo Scan and assign queryId
  const triggerPhotoScan = (imageSrc, storageImagePath) => {
    checkAuthOrGate(() => {
      setScannedImage(imageSrc);
      setScanState('scanning');

      (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('scan-crop', {
            body: { imagePath: storageImagePath, language: currentLang },
          });
          if (error) throw error;

          const sData = {
            question: 'Crop photo disease scan',
            query: 'Crop photo disease scan',
            photoUrl: imageSrc,
            storageImagePath,
            aiDiagnosis: data.identifiedCondition,
            aiConfidence: data.confidenceScore,
            remedy: data.treatmentPlan,
          };

          let isEscalated = false;
          let queryId = null;
          try {
            const saved = await persistQuery(sData, 'photo');
            isEscalated = saved.isEscalated;
            queryId = saved.id;
          } catch (error) {
            console.error('Unable to save crop scan', error);
            alert('Your crop scan is ready, but it could not be saved to your query history. Please try again.');
          }

          setScanAnswer({ ...sData, queryId, isEscalated });
          setScanConversation([
            { role: 'user', content: 'Crop photo disease scan' },
            { role: 'assistant', content: `${data.identifiedCondition ? `${data.identifiedCondition}: ` : ''}${data.treatmentPlan}` },
          ]);
          setScanFollowUps([]);
          setScanState('done');
        } catch (error) {
          console.error('Unable to scan crop image', error);
          setScanState('idle');
          alert('We could not analyze this crop photo right now. Please try again.');
        }
      })();
    });
  };

  // Submit Follow-up Scan Query with conversationHistory and cap enforcement
  const handleScanFollowUpSubmit = () => {
    const q = scanFollowUpInput.trim();
    if (!q || isAnalyzingScanFollowUp || scanFollowUps.length >= 5) return;

    checkAuthOrGate(async () => {
      setIsAnalyzingScanFollowUp(true);
      try {
        const { data, error } = await supabase.functions.invoke('ask-ai', {
          body: {
            question: q,
            language: currentLang,
            conversationHistory: scanConversation,
          },
        });
        if (error) throw error;

        const newFollowUp = {
          question: q,
          answer: data.treatmentPlan,
          confidence: data.confidenceScore,
          aiDiagnosis: data.identifiedCondition,
        };
        const nextFollowUps = [...scanFollowUps, newFollowUp];
        setScanFollowUps(nextFollowUps);
        setScanConversation((prev) => [
          ...prev,
          { role: 'user', content: q },
          { role: 'assistant', content: data.treatmentPlan },
        ]);
        setScanFollowUpInput('');

        if (scanAnswer?.queryId) {
          try {
            await updateQuery(scanAnswer.queryId, {
              response: serializeConversation(scanAnswer, nextFollowUps),
            });
          } catch (err) {
            console.error('Unable to update crop scan query with follow-up', err);
          }
        }
      } catch (error) {
        console.error('Unable to get follow-up AI advisory', error);
        alert('We could not process your follow-up question right now. Please try again.');
      } finally {
        setIsAnalyzingScanFollowUp(false);
      }
    });
  };


  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageURL = URL.createObjectURL(file);
      checkAuthOrGate(() => {
        uploadCropImage(file, currentUser.id)
          .then((storageImagePath) => triggerPhotoScan(imageURL, storageImagePath))
          .catch((error) => {
            URL.revokeObjectURL(imageURL);
            console.error('Unable to upload crop image', error);
            alert(error.message || 'The crop image could not be uploaded.');
          });
      });
    }
  };

  const handleSamplePhotoScan = () => {
    checkAuthOrGate(async () => {
      try {
        const response = await fetch('/images/disease-scanner.png');
        if (!response.ok) throw new Error('Unable to load sample crop photo.');
        const blob = await response.blob();
        const sampleFile = new File([blob], 'sample-crop-photo.png', { type: blob.type || 'image/png' });
        const storageImagePath = await uploadCropImage(sampleFile, currentUser.id);
        triggerPhotoScan('/images/disease-scanner.png', storageImagePath);
      } catch (error) {
        console.error('Unable to prepare sample crop photo', error);
        alert(error.message || 'The sample crop image could not be uploaded.');
      }
    });
  };

  // Submit Government Scheme Check
  const handleSchemeSubmit = (e) => {
    e.preventDefault();
    checkAuthOrGate(() => {
      setIsVerifyingScheme(true);

      setTimeout(async () => {
        setIsVerifyingScheme(false);
        setSchemeSubmitted(true);
        const schemeObj = mockData.schemes[selectedScheme] || mockData.schemes['pm-kisan'];

        const schData = {
          ...schemeObj,
          question: `${schemeObj.question} (${farmerIdInput || 'Mock Aadhaar'})`,
          query: `${schemeObj.query} (${farmerIdInput || 'Mock Aadhaar'})`,
        };

        let isEscalated = false;
        try {
          isEscalated = await persistQuery(schData, 'scheme');
        } catch (error) {
          console.error('Unable to save query', error);
        }

        setSchemeAnswer({ ...schData, isEscalated });
      }, 1000);
    });
  };

  const tabs = [
    { id: 'text-ai', name: t('aiPage.tabText'), icon: MessageSquareText, badge: t('aiPage.tabTextBadge') },
    { id: 'voice', name: t('aiPage.tabVoice'), icon: Mic, badge: t('aiPage.tabVoiceBadge') },
    { id: 'scan', name: t('aiPage.tabScan'), icon: Camera, badge: t('aiPage.tabScanBadge') },
    { id: 'scheme', name: t('aiPage.tabScheme'), icon: Landmark, badge: t('aiPage.tabSchemeBadge') },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>{t('aiPage.tagline')}</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-bold text-[#111827] break-words">
            {t('aiPage.title')}
          </h1>
          <p className="text-sm sm:text-lg text-gray-700 font-body leading-relaxed">
            {t('aiPage.subtitle')}
          </p>
        </div>

        {/* Demo Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden relative">
          
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 bg-gray-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (activeTab !== tab.id) {
                      flushActiveThread(activeTab);
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`py-3 px-2 sm:py-4 sm:px-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm font-bold border-b-4 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#1b4332] text-[#1b4332] bg-white shadow-sm'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#d97706]' : ''}`} />
                    <span>{tab.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 hidden sm:inline">
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-4 sm:p-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: ASK AI (TEXT INPUT) */}
              {activeTab === 'text-ai' && (
                <motion.div
                  key="text-ai-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <form onSubmit={(e) => { e.preventDefault(); handleTextSubmit(); }} className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900">
                      {t('aiPage.typeQuestionLabel')}
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder={t('aiPage.textPlaceholder')}
                        className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium text-gray-900 shadow-sm"
                      />
                      <button
                        type="submit"
                        disabled={isAnalyzingText}
                        className="px-6 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
                      >
                        {isAnalyzingText ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{t('aiPage.btnAnalyzing')}</span>
                          </>
                        ) : (
                          <>
                            <span>{t('aiPage.btnAsk')}</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-gray-500">{t('aiPage.orClickSample')}</span>
                      {samplePrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleTextSubmit(prompt)}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 hover:bg-[#1b4332]/10 hover:text-[#1b4332] text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                        >
                          "{prompt}"
                        </button>
                      ))}
                    </div>
                  </form>

                  {!textSubmitted && !isAnalyzingText && (
                    <div className="p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center bg-gray-50 space-y-2">
                      <MessageSquareText className="w-8 h-8 text-gray-400 mx-auto" />
                      <h4 className="text-sm font-bold text-gray-700">{t('aiPage.noQuestionYet')}</h4>
                      <p className="text-xs text-gray-500">{t('aiPage.noQuestionDesc')}</p>
                    </div>
                  )}

                  {textSubmitted && activeAnswer && !isAnalyzingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#faf8f5] p-4 sm:p-6 rounded-2xl border-2 border-[#1b4332]/20 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-[#e9c46a] flex items-center justify-center">
                            <Sprout className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                            {t('aiPage.outputTitle')}
                          </span>
                        </div>

                        {/* AI Confidence Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            activeAnswer.aiConfidence >= 80
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            AI Confidence: {activeAnswer.aiConfidence}%
                          </span>

                          <button
                            onClick={handleTextReset}
                            className="text-xs font-bold text-[#1b4332] hover:underline ml-2 cursor-pointer"
                          >
                            {t('aiPage.askAnother')}
                          </button>
                        </div>
                      </div>

                      {/* AUTOMATIC AI ESCALATION NOTICE (IF CONFIDENCE < 80%) */}
                      {activeAnswer.isEscalated && (
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                            <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0" />
                            <span>{t('aiPage.escalatedNoticeTitle')}</span>
                          </div>
                          <p className="text-xs font-medium text-amber-900 leading-relaxed">
                            {t('aiPage.escalatedNoticeDesc')} View on <Link to="/farmer-dashboard" className="underline font-bold text-[#1b4332]">Dashboard History</Link>.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-bold uppercase text-gray-500 block mb-0.5">{t('aiPage.submittedQuestion')}</span>
                          <p className="text-sm font-bold text-gray-900">"{activeAnswer.question || activeAnswer.query}"</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                          <span className="text-xs font-bold text-amber-900 block mb-0.5">{t('aiPage.identifiedCondition')}</span>
                          <span className="text-base font-bold text-amber-950">
                            {activeAnswer.aiDiagnosis || activeAnswer.diagnosis}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-gray-900 block">{t('aiPage.actionableRemedy')}</span>
                          <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                            {activeAnswer.remedy}
                          </p>
                        </div>

                        {activeAnswer.weatherAlert && (
                          <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold bg-amber-100 p-3 rounded-xl border border-amber-200">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                            <span>{activeAnswer.weatherAlert}</span>
                          </div>
                        )}
                      </div>

                      {/* Follow-up exchanges history */}
                      {textFollowUps.length > 0 && (
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                              <MessageSquareText className="w-4 h-4 text-[#1b4332]" />
                              Conversation Follow-ups ({textFollowUps.length}/5)
                            </span>
                          </div>

                          <div className="space-y-3">
                            {textFollowUps.map((fu, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-bold text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-md shrink-0">
                                    Q{idx + 1}
                                  </span>
                                  <p className="text-xs sm:text-sm font-bold text-gray-900">
                                    "{fu.question}"
                                  </p>
                                </div>

                                <div className="pl-7 space-y-1">
                                  {fu.aiDiagnosis && (
                                    <div className="text-xs font-bold text-amber-900">
                                      {fu.aiDiagnosis}
                                    </div>
                                  )}
                                  <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                                    {fu.answer}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up input or limit cap */}
                      {textFollowUps.length < 5 ? (
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                          <label className="block text-xs font-bold text-gray-900 uppercase">
                            Ask a follow-up question
                          </label>
                          <form onSubmit={(e) => { e.preventDefault(); handleTextFollowUpSubmit(); }} className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={textFollowUpInput}
                              onChange={(e) => setTextFollowUpInput(e.target.value)}
                              placeholder="Ask a follow-up question..."
                              disabled={isAnalyzingTextFollowUp}
                              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-xs sm:text-sm font-medium text-gray-900 shadow-sm bg-white"
                            />
                            <button
                              type="submit"
                              disabled={isAnalyzingTextFollowUp || !textFollowUpInput.trim()}
                              className="px-5 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
                            >
                              {isAnalyzingTextFollowUp ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>{t('aiPage.btnAnalyzing')}</span>
                                </>
                              ) : (
                                <>
                                  <span>Ask a follow-up question</span>
                                  <Send className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
                            <span>For further questions, please start a new query.</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: VOICE QUERY */}
              {activeTab === 'voice' && (
                <motion.div
                  key="voice-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {voiceState === 'idle' && (
                    <div className="p-5 sm:p-12 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-[#d97706] flex items-center justify-center mx-auto shadow-sm">
                        <Mic className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <h3 className="font-serif-display text-xl font-bold text-gray-900">
                          {t('aiPage.voiceHeading')}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {t('aiPage.voiceDesc')}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <button
                          onClick={handleStartRecording}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                        >
                          <Mic className="w-5 h-5 text-[#e9c46a]" />
                          <span>{t('aiPage.btnRecord')}</span>
                        </button>

                        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-gray-100 text-gray-800 font-bold text-sm border-2 border-gray-300 shadow-sm cursor-pointer transition-all">
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span>{t('aiPage.btnUploadAudio')}</span>
                          <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                        </label>
                      </div>
                    </div>
                  )}

                  {voiceState === 'recording' && (
                    <div className="p-6 sm:p-10 rounded-3xl border-2 border-[#d97706] bg-amber-50 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#d97706] text-white flex items-center justify-center mx-auto animate-pulse shadow-lg">
                        <Mic className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#d97706]">{t('aiPage.voiceListening')}</span>
                        <h4 className="text-2xl font-bold text-gray-900 font-serif-display">
                          {String(Math.floor(voiceTimer / 60)).padStart(2, '0')}:{String(voiceTimer % 60).padStart(2, '0')}
                        </h4>
                      </div>
                      <button
                        onClick={handleStopRecording}
                        className="mx-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                      >
                        <span>Stop &amp; Submit Recording</span>
                      </button>
                    </div>
                  )}

                  {voiceState === 'processing' && (
                    <div className="p-6 sm:p-10 rounded-3xl border-2 border-gray-300 bg-gray-50 text-center space-y-3">
                      <RefreshCw className="w-10 h-10 text-[#1b4332] animate-spin mx-auto" />
                      <h4 className="text-sm font-bold text-gray-800">{t('aiPage.voiceProcessing')}</h4>
                    </div>
                  )}

                  {voiceState === 'done' && voiceAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-xs font-bold text-gray-500">{t('aiPage.voiceOutputTitle')}</span>
                        <button
                          onClick={handleVoiceReset}
                          className="text-xs font-bold text-[#1b4332] hover:underline cursor-pointer"
                        >
                          {t('aiPage.recordAgain')}
                        </button>
                      </div>

                      {/* AUTOMATIC AI ESCALATION NOTICE IF CONFIDENCE < 80% */}
                      {voiceAnswer.isEscalated && (
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                            <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0" />
                            <span>{t('aiPage.escalatedNoticeTitle')}</span>
                          </div>
                          <p className="text-xs font-medium text-amber-900 leading-relaxed">
                            {t('aiPage.escalatedNoticeDesc')} View on <Link to="/farmer-dashboard" className="underline font-bold text-[#1b4332]">Dashboard History</Link>.
                          </p>
                        </div>
                      )}

                      <div className="bg-[#faf8f5] p-4 sm:p-6 rounded-2xl border-2 border-[#1b4332]/20 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-[#e9c46a] flex items-center justify-center">
                              <Mic className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                              {t('aiPage.voiceOutputTitle')}
                            </span>
                          </div>

                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                            AI Confidence: {voiceAnswer.aiConfidence}%
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-bold uppercase text-gray-500 block mb-0.5">You said:</span>
                            <p className="text-sm font-bold text-gray-900 italic">"{voiceAnswer.audioTranscript}"</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                            <span className="text-xs font-bold text-amber-900 block mb-0.5">{t('aiPage.identifiedCondition')}</span>
                            <span className="text-base font-bold text-amber-950">
                              {voiceAnswer.aiDiagnosis || voiceAnswer.diagnosis}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-xs font-bold text-gray-900 block">{t('aiPage.actionableRemedy')}</span>
                            <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                              {voiceAnswer.remedy}
                            </p>
                          </div>
                        </div>

                        {/* Voice Follow-up exchanges history */}
                        {voiceFollowUps.length > 0 && (
                          <div className="pt-4 border-t border-gray-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                <Mic className="w-4 h-4 text-[#1b4332]" />
                                Voice Conversation Follow-ups ({voiceFollowUps.length}/5)
                              </span>
                            </div>

                            <div className="space-y-3">
                              {voiceFollowUps.map((fu, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-xs font-bold text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-md shrink-0">
                                      Q{idx + 1}
                                    </span>
                                    <p className="text-xs sm:text-sm font-bold text-gray-900 italic">
                                      "{fu.question}"
                                    </p>
                                  </div>

                                  <div className="pl-7 space-y-1">
                                    {fu.aiDiagnosis && (
                                      <div className="text-xs font-bold text-amber-900">
                                        {fu.aiDiagnosis}
                                      </div>
                                    )}
                                    <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                                      {fu.answer}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Voice Follow-up Recording Area */}
                        {voiceFollowUps.length < 5 ? (
                          <div className="pt-4 border-t border-gray-200 space-y-3">
                            <label className="block text-xs font-bold text-gray-900 uppercase">
                              Ask a follow-up question
                            </label>
                            {voiceFollowUpState === 'idle' && (
                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button
                                  onClick={handleStartVoiceFollowUpRecording}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                                >
                                  <Mic className="w-4 h-4 text-[#e9c46a]" />
                                  <span>Record Voice Follow-up</span>
                                </button>
                                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs sm:text-sm border border-gray-300 shadow-sm cursor-pointer transition-all">
                                  <Upload className="w-4 h-4 text-gray-600" />
                                  <span>Upload Audio Follow-up</span>
                                  <input type="file" accept="audio/*" className="hidden" onChange={handleVoiceFollowUpAudioUpload} />
                                </label>
                              </div>
                            )}

                            {voiceFollowUpState === 'recording' && (
                              <div className="p-4 rounded-2xl border-2 border-[#d97706] bg-amber-50 text-center space-y-3">
                                <div className="w-10 h-10 rounded-full bg-[#d97706] text-white flex items-center justify-center mx-auto animate-pulse shadow-md">
                                  <Mic className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#d97706]">Listening for Follow-up...</span>
                                  <h4 className="text-xl font-bold text-gray-900 font-serif-display">
                                    {String(Math.floor(voiceFollowUpTimer / 60)).padStart(2, '0')}:{String(voiceFollowUpTimer % 60).padStart(2, '0')}
                                  </h4>
                                </div>
                                <button
                                  onClick={handleStopVoiceFollowUpRecording}
                                  className="mx-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                                >
                                  <span>Stop &amp; Submit Follow-up</span>
                                </button>
                              </div>
                            )}

                            {voiceFollowUpState === 'processing' && (
                              <div className="p-4 rounded-2xl border-2 border-gray-300 bg-gray-50 text-center space-y-2">
                                <RefreshCw className="w-6 h-6 text-[#1b4332] animate-spin mx-auto" />
                                <h4 className="text-xs font-bold text-gray-800">Processing Voice Follow-up...</h4>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="pt-4 border-t border-gray-200">
                            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
                              <span>For further questions, please start a new query.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: CROP DISEASE SCAN */}
              {activeTab === 'scan' && (
                <motion.div
                  key="scan-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {scanState === 'idle' && (
                    <div className="p-5 sm:p-12 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mx-auto shadow-sm">
                        <Camera className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <h3 className="font-serif-display text-xl font-bold text-gray-900">
                          {t('aiPage.scanHeading')}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {t('aiPage.scanDesc')}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <button
                          onClick={() => {
                            checkAuthOrGate(() => {
                              fileInputRef.current?.click();
                            });
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                        >
                          <Upload className="w-5 h-5 text-[#e9c46a]" />
                          <span>{t('aiPage.btnUploadPhoto')}</span>
                        </button>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-500 block mb-2">{t('aiPage.presetSample')}</span>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={handleSamplePhotoScan}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-[#1b4332]/10 hover:border-[#1b4332] cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4 text-[#d97706]" />
                            <span>{t('aiPage.sample1Btn')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanState === 'scanning' && (
                    <div className="p-6 sm:p-12 rounded-3xl border-2 border-[#1b4332] bg-gray-50 text-center space-y-4">
                      <RefreshCw className="w-12 h-12 text-[#1b4332] animate-spin mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-serif-display text-xl font-bold text-gray-900">{t('aiPage.scanningText')}</h4>
                        <p className="text-xs text-gray-600">{t('aiPage.scanningDesc')}</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'done' && scanAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-xs font-bold text-gray-500">{t('aiPage.scanComplete')}</span>
                        <button
                          onClick={handleScanReset}
                          className="text-xs font-bold text-[#1b4332] hover:underline cursor-pointer"
                        >
                          {t('aiPage.tryAnotherPhoto')}
                        </button>
                      </div>

                      {/* AUTOMATIC AI ESCALATION NOTICE IF CONFIDENCE < 80% */}
                      {scanAnswer.isEscalated && (
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                            <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0" />
                            <span>{t('aiPage.escalatedNoticeTitle')}</span>
                          </div>
                          <p className="text-xs font-medium text-amber-900 leading-relaxed">
                            {t('aiPage.escalatedNoticeDesc')} View on <Link to="/farmer-dashboard" className="underline font-bold text-[#1b4332]">Dashboard History</Link>.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 relative rounded-2xl overflow-hidden border-2 border-[#1b4332]">
                          <img
                            src={scannedImage || "/images/disease-scanner.png"}
                            alt="Uploaded crop leaf"
                            className="w-full h-56 md:h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-black/75 backdrop-blur-sm border-2 border-[#e9c46a] text-[#e9c46a] text-xs font-bold px-4 py-2 rounded-xl">
                              {t('aiPage.matchScore')}: {scanAnswer.aiConfidence}%
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <div>
                            <span className="text-xs font-bold uppercase text-gray-500 block mb-0.5">{t('aiPage.submittedQuestion')}</span>
                            <p className="text-sm font-bold text-gray-900">"{scanAnswer.question}"</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                            <span className="text-xs font-bold text-amber-900 block mb-0.5">{t('aiPage.identifiedCondition')}</span>
                            <span className="text-base font-bold text-amber-950">
                              {scanAnswer.aiDiagnosis || scanAnswer.diagnosis}
                            </span>
                          </div>

                          <h4 className="font-serif-display text-base font-bold text-[#111827]">
                            Actionable Treatment Plan:
                          </h4>

                          <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
                              <span><strong>Remedy & Treatment:</strong> {scanAnswer.remedy}</span>
                            </li>
                            {scanAnswer.weatherAlert && (
                              <li className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                                <span><strong>Spray Advice:</strong> {scanAnswer.weatherAlert}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Scan Follow-up exchanges history */}
                      {scanFollowUps.length > 0 && (
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                              <MessageSquareText className="w-4 h-4 text-[#1b4332]" />
                              Crop Scan Follow-ups ({scanFollowUps.length}/5)
                            </span>
                          </div>

                          <div className="space-y-3">
                            {scanFollowUps.map((fu, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-bold text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-md shrink-0">
                                    Q{idx + 1}
                                  </span>
                                  <p className="text-xs sm:text-sm font-bold text-gray-900">
                                    "{fu.question}"
                                  </p>
                                </div>

                                <div className="pl-7 space-y-1">
                                  {fu.aiDiagnosis && (
                                    <div className="text-xs font-bold text-amber-900">
                                      {fu.aiDiagnosis}
                                    </div>
                                  )}
                                  <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                                    {fu.answer}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scan Follow-up input or limit cap */}
                      {scanFollowUps.length < 5 ? (
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                          <label className="block text-xs font-bold text-gray-900 uppercase">
                            Ask a follow-up question
                          </label>
                          <form onSubmit={(e) => { e.preventDefault(); handleScanFollowUpSubmit(); }} className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={scanFollowUpInput}
                              onChange={(e) => setScanFollowUpInput(e.target.value)}
                              placeholder="Ask a follow-up question about this crop scan..."
                              disabled={isAnalyzingScanFollowUp}
                              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-xs sm:text-sm font-medium text-gray-900 shadow-sm bg-white"
                            />
                            <button
                              type="submit"
                              disabled={isAnalyzingScanFollowUp || !scanFollowUpInput.trim()}
                              className="px-5 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
                            >
                              {isAnalyzingScanFollowUp ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>{t('aiPage.btnAnalyzing')}</span>
                                </>
                              ) : (
                                <>
                                  <span>Ask a follow-up question</span>
                                  <Send className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
                            <span>For further questions, please start a new query.</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: GOVERNMENT SCHEMES */}
              {activeTab === 'scheme' && (
                <motion.div
                  key="scheme-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSchemeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('aiPage.schemeSelectLabel')}</label>
                        <select
                          value={selectedScheme}
                          onChange={(e) => setSelectedScheme(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white"
                        >
                          <option value="pm-kisan">PM Kisan Samman Nidhi Yojana</option>
                          <option value="pm-kusum">PM-KUSUM Solar Pump 60% Subsidy</option>
                          <option value="soil-card">Soil Health Card & Fertilizer Grant</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('aiPage.idLabel')}</label>
                        <input
                          type="text"
                          value={farmerIdInput}
                          onChange={(e) => setFarmerIdInput(e.target.value)}
                          placeholder={t('aiPage.idPlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingScheme}
                      className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:bg-gray-300 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isVerifyingScheme ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t('aiPage.verifyingScheme')}</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>{t('aiPage.btnCheckScheme')}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {schemeSubmitted && !isVerifyingScheme && schemeAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h4 className="font-serif-display text-xl font-bold text-[#111827]">
                          {t('aiPage.schemeResultTitle')}
                        </h4>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                          AI Confidence: {schemeAnswer.aiConfidence}% (Resolved)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[#faf8f5] border-2 border-emerald-300 space-y-1">
                          <div className="text-xs text-gray-600 font-bold">{schemeAnswer.statusTitle || 'PM-KISAN Status'}</div>
                          <div className="text-base font-bold text-emerald-950">{schemeAnswer.statusDetail || schemeAnswer.remedy}</div>
                          <div className="text-[11px] text-emerald-800 font-semibold">{schemeAnswer.statusSub || 'e-KYC Verified'}</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#faf8f5] border-2 border-amber-300 space-y-1">
                          <div className="text-xs text-gray-600 font-bold">PM-KUSUM Solar Pump Subsidy</div>
                          <div className="text-base font-bold text-amber-950">60% State Government Subsidy Eligible</div>
                          <div className="text-[11px] text-amber-800 font-semibold">5HP Solar Pump Application Approved</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Auth-Gating Modal Interceptor */}
      <AnimatePresence>
        {showAuthGateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl border-2 border-gray-200 space-y-5 text-center relative"
            >
              <button
                onClick={() => setShowAuthGateModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7 text-[#d97706]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-display text-2xl font-bold text-gray-900">
                  {t('aiPage.authGateTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-body leading-relaxed">
                  {t('aiPage.authGateDesc')}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 text-left space-y-1">
                <span className="block">{t('aiPage.authGateNoticeTitle')}</span>
                <span className="font-semibold block text-gray-700">
                  {t('aiPage.authGateNoticeDesc')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  to="/login?role=farmer&redirect=/demo"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md"
                >
                  <User className="w-4 h-4 text-[#e9c46a]" />
                  <span>{t('navbar.signIn')}</span>
                </Link>

                <Link
                  to="/register?role=farmer&redirect=/demo"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm border-2 border-gray-300 shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-[#1b4332]" />
                  <span>{t('aiPage.btnFreeAccount')}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

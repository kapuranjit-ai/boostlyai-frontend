import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Slider,
  Input,
  FormHelperText,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  AutoAwesome,
  Download,
  Delete,
  RecordVoiceOver,
  Info,
  Upload,
  Link,
  Theaters,
  SmartDisplay,
  School,
  Campaign,
  ExpandMore,
  Person,
  Animation,
  Audiotrack,
  Sync
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { videoAPI } from '../../services/api';

// Simple ErrorMessage component to handle different error formats
const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  let errorMessage = 'An unexpected error occurred';
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.message) {
    errorMessage = error.message;
  } else if (error.msg) {
    errorMessage = error.msg;
  } else if (error.error) {
    errorMessage = error.error;
  } else if (typeof error === 'object') {
    try {
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = 'An error occurred';
    }
  }

  return (
    <Alert 
      severity="error" 
      sx={{ mb: 3 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      {errorMessage}
    </Alert>
  );
};

function VideoGenerator() {
  const [text, setText] = useState('');
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState('professional');
  const [aspectRatio, setAspectRatio] = useState('vertical');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [asyncJobs, setAsyncJobs] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, videoId: null });
  const [availableOptions, setAvailableOptions] = useState({
    styles: [],
    aspectRatios: [],
    voices: [],
    musicStyles: []
  });
  
  // Video Enhancement States
  const [enhancementTab, setEnhancementTab] = useState(0);
  const [enhancementFile, setEnhancementFile] = useState(null);
  const [enhancementUrl, setEnhancementUrl] = useState('');
  const [enhancementText, setEnhancementText] = useState('');
  const [enhancementAspectRatio, setEnhancementAspectRatio] = useState('horizontal');
  const [enhancementVoice, setEnhancementVoice] = useState('en-US-AriaNeural');
  const [enhancementMusicVolume, setEnhancementMusicVolume] = useState(0.1);
  const [enhancementQuality, setEnhancementQuality] = useState('high');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [enhancedVideos, setEnhancedVideos] = useState([]);
  const [enhancementStatus, setEnhancementStatus] = useState(null);
  const [enhancementPresets, setEnhancementPresets] = useState({ presets: {} });
  const [loading, setLoading] = useState(false);
  const [enhancementLoading, setEnhancementLoading] = useState(false);

  // 3D Character States - Updated with new endpoints
  const [characterTab, setCharacterTab] = useState(0);
  const [use3DCharacter, setUse3DCharacter] = useState(false);
  const [characterTopic, setCharacterTopic] = useState('');
  const [characterStyle, setCharacterStyle] = useState('auto');
  const [characterEmotion, setCharacterEmotion] = useState('neutral');
  const [characterLanguage, setCharacterLanguage] = useState('en');
  const [characterContent, setCharacterContent] = useState('');
  const [audioFilePath, setAudioFilePath] = useState('');
  const [characterStyles, setCharacterStyles] = useState({});
  const [characterSystemStatus, setCharacterSystemStatus] = useState({});
  const [generatedCharacters, setGeneratedCharacters] = useState([]);
  const [characterAsyncJobs, setCharacterAsyncJobs] = useState({});
  const [useAmericanAccent, setUseAmericanAccent] = useState(true);

  const { data, error, callApi } = useApi();

  // Load available options on component mount
  useEffect(() => {
    loadAvailableOptions();
    loadEnhancementOptions();
    load3DCharacterOptions();
  }, []);

  const loadAvailableOptions = async () => {
    try {
      const [stylesRes, ratiosRes, voicesRes, musicRes] = await Promise.all([
        videoAPI.getVideoStyles(),
        videoAPI.getAspectRatios(),
        videoAPI.getVoiceOptions(),
        videoAPI.getMusicStyles()
      ]);

      setAvailableOptions({
        styles: stylesRes?.data?.styles || [],
        aspectRatios: ratiosRes?.data?.aspect_ratios || [],
        voices: voicesRes?.data?.voices || [],
        musicStyles: musicRes?.data?.music_styles || []
      });
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const load3DCharacterOptions = async () => {
    try {
      const [stylesRes, statusRes] = await Promise.all([
        videoAPI.get3DCharacterStyles(),
        videoAPI.get3DCharacterSystemStatus()
      ]);

      setCharacterStyles(stylesRes?.data || {});
      setCharacterSystemStatus(statusRes?.data || {});
    } catch (err) {
      console.error('Error loading 3D character options:', err);
    }
  };

  const loadEnhancementOptions = async () => {
    try {
      const [statusRes, presetsRes] = await Promise.all([
        videoAPI.getEnhancementStatus(),
        videoAPI.getEnhancementPresets()
      ]);
      setEnhancementStatus(statusRes);
      setEnhancementPresets(presetsRes || { presets: {} });
    } catch (err) {
      console.error('Error loading enhancement options:', err);
      setEnhancementPresets({
        presets: {
          movie_review: {
            style: 'cinematic',
            aspect_ratio: 'horizontal',
            recommended_voice: 'en-US-DavisNeural',
            background_music_volume: 0.15,
            description: 'Professional movie reviews and analysis'
          },
          social_media: {
            style: 'energetic',
            aspect_ratio: 'vertical',
            recommended_voice: 'en-US-JennyNeural',
            background_music_volume: 0.2,
            description: 'Social media shorts and reels'
          }
        }
      });
    }
  };

  // New 3D Character Functions
  const createSpeakingCharacter = async () => {
    try {
      if (!characterTopic.trim() || !characterContent.trim()) {
        alert('Please enter both topic and content for the speaking character');
        return;
      }

      const result = await callApi(
        () => videoAPI.createSpeaking3DCharacter({
          topic: characterTopic,
          content: characterContent,
          character_style: characterStyle,
          emotion: characterEmotion,
          language: characterLanguage,
          video_duration: duration
        }),
        'Speaking 3D character created successfully!'
      );

      if (result && result.success) {
        const newCharacter = {
          id: result.character_id,
          topic: characterTopic,
          content: characterContent,
          character_style: characterStyle,
          emotion: characterEmotion,
          video_path: result.video_path,
          character_data: result.character_data,
          speech_data: result.speech_data,
          lip_sync_data: result.lip_sync_data,
          duration: result.duration,
          character_type: result.character_type,
          status: 'completed',
          created_at: new Date().toISOString(),
          type: 'speaking_character'
        };

        setGeneratedCharacters(prev => [newCharacter, ...prev]);
        resetCharacterForm();
      }
    } catch (err) {
      console.error('Error creating speaking character:', err);
    }
  };

  const createAnimatedCharacter = async () => {
    try {
      if (!characterTopic.trim() || !characterContent.trim()) {
        alert('Please enter both topic and content for the animated character');
        return;
      }

      const result = await callApi(
        () => videoAPI.createAnimated3DCharacter({
          topic: characterTopic,
          content: characterContent,
          character_style: characterStyle,
          emotion: characterEmotion
        }),
        'Animated 3D character created successfully!'
      );

      if (result && result.success) {
        const newCharacter = {
          id: result.character_id,
          topic: characterTopic,
          content: characterContent,
          character_style: characterStyle,
          emotion: characterEmotion,
          character_data: result.character_data,
          style: result.style,
          content_length: result.content_length,
          character_type: result.character_type,
          status: 'completed',
          created_at: new Date().toISOString(),
          type: 'animated_character'
        };

        setGeneratedCharacters(prev => [newCharacter, ...prev]);
        resetCharacterForm();
      }
    } catch (err) {
      console.error('Error creating animated character:', err);
    }
  };

  const createCharacterWithAudio = async () => {
    try {
      if (!characterTopic.trim() || !characterContent.trim()) {
        alert('Please enter both topic and content for the character with audio');
        return;
      }

      const result = await callApi(
        () => videoAPI.create3DCharacterWithAudio({
          topic: characterTopic,
          content: characterContent,
          audio_file_path: audioFilePath,
          character_style: characterStyle
        }),
        '3D character with audio created successfully!'
      );

      if (result && result.success) {
        const newCharacter = {
          id: result.character_id,
          topic: characterTopic,
          content: characterContent,
          character_style: characterStyle,
          character_data: result.character_data,
          speech_data: result.speech_data,
          lip_sync_data: result.lip_sync_data,
          has_audio: result.has_audio,
          status: 'completed',
          created_at: new Date().toISOString(),
          type: 'character_with_audio'
        };

        setGeneratedCharacters(prev => [newCharacter, ...prev]);
        resetCharacterForm();
      }
    } catch (err) {
      console.error('Error creating character with audio:', err);
    }
  };

  const integrateCharacterWithVideo = async () => {
    try {
      if (!characterTopic.trim() || !characterContent.trim()) {
        alert('Please enter both topic and content for video integration');
        return;
      }

      const result = await callApi(
        () => videoAPI.integrate3DCharacterWithVideo({
          topic: characterTopic,
          content: characterContent,
          video_duration: duration,
          aspect_ratio: aspectRatio,
          character_style: characterStyle
        }),
        '3D character integrated with video successfully!'
      );

      if (result && result.success) {
        const newVideo = {
          id: result.video_id,
          topic: characterTopic,
          content: characterContent,
          video_path: result.video_path,
          character_data: result.character_data,
          integration_type: result.integration_type,
          duration: duration,
          aspect_ratio: aspectRatio,
          status: 'completed',
          created_at: new Date().toISOString(),
          type: 'integrated_video'
        };

        setGeneratedVideos(prev => [newVideo, ...prev]);
        resetCharacterForm();
      }
    } catch (err) {
      console.error('Error integrating character with video:', err);
    }
  };

  const createCharacterAsync = async () => {
    try {
      if (!characterTopic.trim() || !characterContent.trim()) {
        alert('Please enter both topic and content for async character generation');
        return;
      }

      const result = await callApi(
        () => videoAPI.create3DCharacterAsync({
          topic: characterTopic,
          content: characterContent,
          character_style: characterStyle,
          emotion: characterEmotion,
          language: characterLanguage
        }),
        '3D character generation started in background!'
      );

      if (result && result.success) {
        setCharacterAsyncJobs(prev => ({
          ...prev,
          [result.character_id]: {
            status: 'queued',
            progress: 0,
            character_data: null,
            error: null,
            created_at: new Date().toISOString(),
            request: { 
              topic: characterTopic, 
              content: characterContent,
              character_style: characterStyle,
              emotion: characterEmotion
            }
          }
        }));

        pollCharacterAsyncJob(result.character_id);
        resetCharacterForm();
      }
    } catch (err) {
      console.error('Error starting async character generation:', err);
    }
  };

  const pollCharacterAsyncJob = useCallback(async (characterId) => {
    try {
      const response = await videoAPI.get3DCharacterDetails(characterId);
      const status = response.data;
      
      setCharacterAsyncJobs(prev => ({
        ...prev,
        [characterId]: {
          ...prev[characterId],
          ...status
        }
      }));

      if (status.status === 'processing' || status.status === 'queued') {
        setTimeout(() => pollCharacterAsyncJob(characterId), 2000);
      }

      if (status.status === 'completed' && status.character_data) {
        const newCharacter = {
          id: characterId,
          topic: characterAsyncJobs[characterId]?.request?.topic,
          content: characterAsyncJobs[characterId]?.request?.content,
          character_style: characterAsyncJobs[characterId]?.request?.character_style,
          emotion: characterAsyncJobs[characterId]?.request?.emotion,
          character_data: status.character_data,
          status: 'completed',
          progress: 100,
          created_at: status.created_at,
          isAsync: true,
          type: 'async_character'
        };

        setGeneratedCharacters(prev => [newCharacter, ...prev]);
        setCharacterAsyncJobs(prev => {
          const newJobs = { ...prev };
          delete newJobs[characterId];
          return newJobs;
        });
      }
    } catch (err) {
      console.error('Error polling character job status:', err);
    }
  }, [characterAsyncJobs]);

  const resetCharacterForm = () => {
    setCharacterTopic('');
    setCharacterContent('');
    setAudioFilePath('');
  };

  const delete3DCharacter = async (characterId) => {
    try {
      await videoAPI.delete3DCharacter(characterId);
      setGeneratedCharacters(prev => prev.filter(c => c.id !== characterId));
      setDeleteDialog({ open: false, videoId: null });
    } catch (err) {
      console.error('Error deleting 3D character:', err);
    }
  };

  // Enhanced video generation with 3D character integration
  const generateVideoWith3DCharacter = async () => {
    try {
      if (!validateInput()) return;
      if (!characterTopic.trim()) {
        alert('Please enter a topic for the 3D character');
        return;
      }

      const result = await callApi(
        () => videoAPI.integrate3DCharacterWithVideo({
          topic: characterTopic,
          content: text,
          video_duration: duration,
          aspect_ratio: aspectRatio,
          character_style: characterStyle
        }),
        'Video with 3D character generated successfully!'
      );

      if (result && result.success) {
        const newVideo = {
          id: result.video_id,
          text: text,
          topic: characterTopic,
          video_path: result.video_path,
          character_data: result.character_data,
          integration_type: result.integration_type,
          duration: duration,
          aspect_ratio: aspectRatio,
          style: characterStyle,
          status: 'completed',
          progress: 100,
          created_at: new Date().toISOString(),
          has_3d_character: true
        };

        setGeneratedVideos(prev => [newVideo, ...prev]);
        setText('');
        setCharacterTopic('');
      }
    } catch (err) {
      console.error('Error generating video with 3D character:', err);
    }
  };

  // Existing Video Generation Functions
  const pollAsyncJob = useCallback(async (videoId) => {
    try {
      const response = await videoAPI.getVideoStatus(videoId);
      const status = response.data;
      
      setAsyncJobs(prev => ({
        ...prev,
        [videoId]: status
      }));

      if (status.status === 'processing' || status.status === 'queued') {
        setTimeout(() => pollAsyncJob(videoId), 2000);
      }

      if (status.status === 'completed' && status.video_path) {
        const newVideo = {
          id: videoId,
          text: asyncJobs[videoId]?.request?.text || 'Generated video',
          video_path: status.video_path,
          duration: asyncJobs[videoId]?.request?.duration || duration,
          status: 'completed',
          progress: 100,
          created_at: status.created_at,
          style: asyncJobs[videoId]?.request?.style || style,
          aspect_ratio: asyncJobs[videoId]?.request?.aspect_ratio || aspectRatio,
          isAsync: true
        };

        setGeneratedVideos(prev => [newVideo, ...prev]);
        setAsyncJobs(prev => {
          const newJobs = { ...prev };
          delete newJobs[videoId];
          return newJobs;
        });
      }
    } catch (err) {
      console.error('Error polling job status:', err);
    }
  }, [asyncJobs, duration, style, aspectRatio]);

  const generateVideo = async () => {
    try {
      if (!validateInput()) return;

      const result = await callApi(
        () => videoAPI.generateVideo({
          text,
          duration,
          style,
          aspect_ratio: aspectRatio,
          output_format: outputFormat
        }),
        'Video generated successfully!'
      );

      if (result && result.success) {
        const newVideo = {
          id: result.video_id,
          text: text,
          video_path: result.video_path,
          video_url: result.video_url,
          duration: result.duration,
          file_size: result.file_size,
          generation_time: result.generation_time,
          aspect_ratio: result.aspect_ratio,
          style: result.style,
          has_voiceover: result.has_voiceover,
          status: 'completed',
          progress: 100,
          created_at: new Date().toISOString()
        };

        setGeneratedVideos(prev => [newVideo, ...prev]);
        setText('');
      }
    } catch (err) {
      console.error('Error generating video:', err);
    }
  };

  const generateVideoAsync = async () => {
    try {
      if (!validateInput()) return;

      const result = await callApi(
        () => videoAPI.generateVideoAsync({
          text,
          duration,
          style,
          aspect_ratio: aspectRatio,
          output_format: outputFormat
        }),
        'Video generation started in background!'
      );

      if (result && result.success) {
        setAsyncJobs(prev => ({
          ...prev,
          [result.video_id]: {
            status: 'queued',
            progress: 0,
            video_path: null,
            error: null,
            created_at: new Date().toISOString(),
            request: { text, duration, style, aspect_ratio: aspectRatio }
          }
        }));
        
        pollAsyncJob(result.video_id);
        setText('');
      }
    } catch (err) {
      console.error('Error starting async video generation:', err);
    }
  };

  const generateVoiceover = async () => {
    if (!text.trim()) {
      alert('Please enter text for voiceover');
      return;
    }

    try {
      const result = await callApi(
        () => videoAPI.generateVoiceover({
          text,
          voice_type: 'en-US-AriaNeural'
        }),
        'Voiceover generated successfully!'
      );

      if (result && result.success) {
        console.log('Voiceover generated:', result.voiceover_path);
        handleDownload(result.voiceover_path, 'voiceover');
      }
    } catch (err) {
      console.error('Error generating voiceover:', err);
    }
  };

  // Video Enhancement Functions
  const handleEnhancementFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['.mov', '.mp4', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        alert(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`);
        return;
      }

      const maxSize = 500 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert(`File too large. Maximum size is 500MB, got ${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB`);
        return;
      }

      setEnhancementFile(selectedFile);
    }
  };

  const applyEnhancementPreset = (presetKey) => {
    if (enhancementPresets?.presets?.[presetKey]) {
      const preset = enhancementPresets.presets[presetKey];
      setEnhancementAspectRatio(preset.aspect_ratio);
      setEnhancementVoice(preset.recommended_voice);
      setEnhancementMusicVolume(preset.background_music_volume);
      setSelectedPreset(presetKey);
    }
  };

  const enhanceVideoFromFile = async () => {
    console.log('=== STARTING VIDEO ENHANCEMENT ===');
    
    const fileInput = document.getElementById('enhancement-video-upload');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a video file');
      return;
    }

    const file = fileInput.files[0];
    
    if (!enhancementText.trim()) {
      alert('Please provide text content for voiceover');
      return;
    }

    setEnhancementLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text_content', enhancementText);
      formData.append('aspect_ratio', enhancementAspectRatio);
      formData.append('background_music_volume', enhancementMusicVolume.toString());

      const token = localStorage["token"];
      
      if (!token) {
        alert('Please log in to use video enhancement');
        setEnhancementLoading(false);
        return;
      }

      const baseURL = 'http://localhost:8000';
      const apiURL = `${baseURL}/api/v1/video-generation/enhance-existing`;
      
      const response = await fetch(apiURL, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);

      if (result && result.success) {
        const newEnhancedVideo = {
          id: `enhanced-${Date.now()}`,
          original_filename: result.original_filename,
          original_filesize_mb: result.original_filesize_mb,
          video_path: result.video_path,
          download_url: result.download_url,
          stream_url: result.stream_url,
          duration: result.duration,
          file_size: result.file_size,
          status: 'completed',
          created_at: new Date().toISOString(),
          preset_used: selectedPreset,
          type: 'enhanced'
        };
        
        setEnhancedVideos(prev => [newEnhancedVideo, ...prev]);
        resetEnhancementForm();
        alert('Video enhanced successfully! You can now download it.');
      } else {
        throw new Error(result?.error || 'Enhancement failed');
      }
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      
      if (error.message.includes('Could not validate credentials')) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert(`Enhancement failed: ${error.message}`);
      }
    } finally {
      setEnhancementLoading(false);
    }
  };

  const enhanceVideoFromUrl = async () => {
    if (!enhancementUrl.trim() || !enhancementText.trim()) {
      alert('Please provide video URL and text content');
      return;
    }

    try {
      const result = await callApi(
        () => videoAPI.enhanceVideoWithUrl({
          video_url: enhancementUrl,
          text_content: enhancementText,
          aspect_ratio: enhancementAspectRatio,
          background_music_volume: enhancementMusicVolume
        }),
        'URL video enhancement started!'
      );

      if (result && result.success) {
        const newEnhancedVideo = {
          id: `enhanced-url-${Date.now()}`,
          source_url: result.source_url,
          enhanced_video_url: result.video_url,
          duration: result.duration,
          file_size: result.file_size,
          status: 'completed',
          created_at: new Date().toISOString(),
          preset_used: selectedPreset,
          type: 'enhanced'
        };
        setEnhancedVideos(prev => [newEnhancedVideo, ...prev]);
        resetEnhancementForm();
      }
    } catch (err) {
      console.error('Error enhancing video from URL:', err);
    }
  };

  const resetEnhancementForm = () => {
    setEnhancementFile(null);
    setEnhancementUrl('');
    setEnhancementText('');
    setSelectedPreset('');
    const fileInput = document.getElementById('enhancement-video-upload');
    if (fileInput) fileInput.value = '';
  };

  const validateInput = () => {
    if (!text.trim()) {
      alert('Please enter text for video generation');
      return false;
    }
    if (text.length < 10) {
      alert('Text must be at least 10 characters long');
      return false;
    }
    if (duration < 20 || duration > 300) {
      alert('Duration must be between 20 and 300 seconds');
      return false;
    }
    return true;
  };

  const handleDownload = (filePath) => {
    if (!filePath) return;
    const filename = filePath.split('/').pop();
    if (!filename) return;
    window.location.href = `/api/v1/video-generation/download/${encodeURIComponent(filename)}`;
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const video = [...generatedVideos, ...enhancedVideos, ...generatedCharacters].find(v => v.id === videoId);
      if (video && video.video_path) {
        const filename = video.video_path.split('/').pop();
        await videoAPI.deleteVideo(filename);
        setGeneratedVideos(prev => prev.filter(v => v.id !== videoId));
        setEnhancedVideos(prev => prev.filter(v => v.id !== videoId));
        setGeneratedCharacters(prev => prev.filter(v => v.id !== videoId));
        setDeleteDialog({ open: false, videoId: null });
      }
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (validateInput() && !loading) {
        generateVideo();
      }
    }
  };

  // Get all async jobs for display
  const allAsyncJobs = Object.entries(asyncJobs).map(([videoId, job]) => ({
    id: videoId,
    ...job,
    isAsync: true
  }));

  const allCharacterAsyncJobs = Object.entries(characterAsyncJobs).map(([characterId, job]) => ({
    id: characterId,
    ...job,
    isAsync: true,
    type: 'async_character'
  }));

  // Combine all videos and characters for display
  const allVideos = [...generatedVideos, ...enhancedVideos, ...generatedCharacters, ...allAsyncJobs, ...allCharacterAsyncJobs];
  const displayItems = activeTab === 0 
    ? allVideos
    : allAsyncJobs;

  const presetIcons = {
    movie_review: <Theaters />,
    ott_series: <SmartDisplay />,
    social_media: <Campaign />,
    educational: <School />,
    entertainment_news: <Campaign />
  };

  const presetNames = {
    movie_review: 'Movie Review',
    ott_series: 'OTT Series', 
    social_media: 'Social Media',
    educational: 'Educational',
    entertainment_news: 'Entertainment News'
  };

  // Safely get presets for rendering
  const safePresets = enhancementPresets?.presets || {};

  // Get available character styles for dropdown
  const availableCharacterStyles = characterStyles.character_styles ? Object.keys(characterStyles.character_styles) : [];
  const availableEmotions = characterStyles.emotions ? Object.keys(characterStyles.emotions) : [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Video Generator & Enhancer
      </Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<AutoAwesome />} label="Generate New Video" />
        <Tab icon={<Campaign />} label="Enhance Existing Video" />
        <Tab icon={<Person />} label="3D Character" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            All videos include automatic voiceover narration. Voiceover is always enabled for better quality.
          </Alert>

          {/* Video Creation Form */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create New Video
            </Typography>
            
            {/* 3D Character Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={use3DCharacter}
                  onChange={(e) => setUse3DCharacter(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Animation />
                  <Typography>Include 3D Character</Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />

            {use3DCharacter && (
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">3D Character Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Character Topic"
                        placeholder="Enter topic for 3D character (e.g., 'Technology Expert', 'Fitness Coach')"
                        value={characterTopic}
                        onChange={(e) => setCharacterTopic(e.target.value)}
                        helperText="This defines the character's appearance and personality"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Character Style</InputLabel>
                        <Select
                          value={characterStyle}
                          label="Character Style"
                          onChange={(e) => setCharacterStyle(e.target.value)}
                        >
                          <MenuItem value="auto">Auto (AI Determined)</MenuItem>
                          {availableCharacterStyles.map((style) => (
                            <MenuItem key={style} value={style}>
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={useAmericanAccent}
                            onChange={(e) => setUseAmericanAccent(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Use American Accent"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Text Content"
                  placeholder="Enter the text you want to convert to video (minimum 10 characters)..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  required
                  error={text.length > 0 && text.length < 10}
                  helperText={text.length > 0 && text.length < 10 ? "Text must be at least 10 characters" : ""}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (seconds)"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  inputProps={{ min: 20, max: 300 }}
                  helperText="20-300 seconds"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Video Style</InputLabel>
                  <Select
                    value={style}
                    label="Video Style"
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    {availableOptions.styles.map((styleOption) => (
                      <MenuItem key={styleOption.name} value={styleOption.name}>
                        <Box>
                          <Typography variant="body1">{styleOption.name.charAt(0).toUpperCase() + styleOption.name.slice(1)}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {styleOption.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Aspect Ratio</InputLabel>
                  <Select
                    value={aspectRatio}
                    label="Aspect Ratio"
                    onChange={(e) => setAspectRatio(e.target.value)}
                  >
                    {availableOptions.aspectRatios.map((ratio) => (
                      <MenuItem key={ratio.name} value={ratio.name}>
                        <Box>
                          <Typography variant="body1">{ratio.name.charAt(0).toUpperCase() + ratio.name.slice(1)}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {ratio.ratio} - {ratio.platforms.join(', ')}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Output Format</InputLabel>
                  <Select
                    value={outputFormat}
                    label="Output Format"
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <MenuItem value="mp4">MP4</MenuItem>
                    <MenuItem value="mov">MOV</MenuItem>
                    <MenuItem value="avi">AVI</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  {use3DCharacter ? (
                    <Button
                      variant="contained"
                      onClick={generateVideoWith3DCharacter}
                      disabled={!text.trim() || text.length < 10 || !characterTopic.trim() || loading}
                      startIcon={<Animation />}
                      size="large"
                    >
                      {loading ? 'Generating with 3D Character...' : 'Generate with 3D Character'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={generateVideo}
                      disabled={!text.trim() || text.length < 10 || loading}
                      startIcon={<AutoAwesome />}
                      size="large"
                    >
                      {loading ? 'Generating...' : 'Generate Video'}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    onClick={generateVideoAsync}
                    disabled={!text.trim() || text.length < 10 || loading}
                    startIcon={<AutoAwesome />}
                    size="large"
                  >
                    Generate Async
                  </Button>

                  <Button
                    variant="text"
                    onClick={generateVoiceover}
                    disabled={!text.trim() || loading}
                    startIcon={<RecordVoiceOver />}
                    size="large"
                  >
                    Voiceover Only
                  </Button>

                  <Tooltip title="Voiceover is automatically included in all videos for better quality">
                    <IconButton size="small">
                      <Info />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {activeTab === 1 && (
        <>
          {enhancementStatus && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2">
                System Status: {enhancementStatus.system_status} | Max File Size: {enhancementStatus.max_file_size_mb}MB | 
                Supported Formats: {enhancementStatus.supported_formats?.join(', ')}
              </Typography>
            </Alert>
          )}

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enhance Existing Video
            </Typography>

            {/* Enhancement Presets */}
            {enhancementPresets && Object.keys(safePresets).length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Enhancement Presets
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(safePresets).map(([key, preset]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Card 
                        variant={selectedPreset === key ? "elevation" : "outlined"}
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedPreset === key ? '2px solid' : '1px solid',
                          borderColor: selectedPreset === key ? 'primary.main' : 'divider',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: 2
                          }
                        }}
                        onClick={() => applyEnhancementPreset(key)}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ color: 'primary.main', mb: 1 }}>
                            {presetIcons[key] || <AutoAwesome />}
                          </Box>
                          <Typography variant="subtitle1" gutterBottom>
                            {presetNames[key] || key}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {preset.description}
                          </Typography>
                          <Chip 
                            label={preset.aspect_ratio} 
                            size="small" 
                            sx={{ mt: 1 }}
                            color={selectedPreset === key ? "primary" : "default"}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Tabs value={enhancementTab} onChange={(e, newValue) => setEnhancementTab(newValue)} sx={{ mb: 3 }}>
              <Tab icon={<Upload />} label="Upload Video" />
              <Tab icon={<Link />} label="Video URL" />
            </Tabs>

            <Grid container spacing={3}>
              {/* File Upload Section */}
              {enhancementTab === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ border: '2px dashed', borderColor: 'grey.300', p: 3, textAlign: 'center', borderRadius: 1 }}>
                    <input
                      id="enhancement-video-upload"
                      type="file"
                      accept=".mov,.mp4,.avi,.mkv,.wmv,.flv,.webm,.m4v,.mpg,.mpeg"
                      onChange={handleEnhancementFileUpload}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      htmlFor="enhancement-video-upload"
                      startIcon={<Upload />}
                      sx={{ mb: 2 }}
                    >
                      Choose Video File
                    </Button>
                    {enhancementFile && (
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Selected: {enhancementFile.name} ({(enhancementFile.size / (1024 * 1024)).toFixed(1)}MB)
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                      Max file size: 500MB. Supported formats: MOV, MP4, AVI, MKV, WMV, FLV, WebM, M4V, MPG, MPEG
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* URL Input Section */}
              {enhancementTab === 1 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Video URL"
                    placeholder="https://example.com/video.mp4"
                    value={enhancementUrl}
                    onChange={(e) => setEnhancementUrl(e.target.value)}
                    helperText="Enter the direct URL of the video you want to enhance"
                  />
                </Grid>
              )}

              {/* Common Enhancement Options */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Text Content for Voiceover"
                  placeholder="Enter the text you want to add as American accent voiceover..."
                  value={enhancementText}
                  onChange={(e) => setEnhancementText(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Aspect Ratio</InputLabel>
                  <Select
                    value={enhancementAspectRatio}
                    label="Aspect Ratio"
                    onChange={(e) => setEnhancementAspectRatio(e.target.value)}
                  >
                    <MenuItem value="horizontal">Horizontal (16:9)</MenuItem>
                    <MenuItem value="vertical">Vertical (9:16)</MenuItem>
                    <MenuItem value="square">Square (1:1)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>American Voice</InputLabel>
                  <Select
                    value={enhancementVoice}
                    label="American Voice"
                    onChange={(e) => setEnhancementVoice(e.target.value)}
                  >
                    <MenuItem value="en-US-AriaNeural">Aria (Female)</MenuItem>
                    <MenuItem value="en-US-DavisNeural">Davis (Male)</MenuItem>
                    <MenuItem value="en-US-JennyNeural">Jenny (Female)</MenuItem>
                    <MenuItem value="en-US-AndrewNeural">Andrew (Male)</MenuItem>
                    <MenuItem value="en-US-EmmaNeural">Emma (Female)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Background Music Volume</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={enhancementMusicVolume}
                    onChange={(e, newValue) => setEnhancementMusicVolume(newValue)}
                    min={0}
                    max={1}
                    step={0.05}
                    sx={{ flex: 1 }}
                  />
                  <Input
                    value={enhancementMusicVolume}
                    size="small"
                    onChange={(e) => setEnhancementMusicVolume(parseFloat(e.target.value) || 0)}
                    inputProps={{
                      min: 0,
                      max: 1,
                      step: 0.05,
                      type: 'number',
                    }}
                    sx={{ width: 80 }}
                  />
                </Box>
                <FormHelperText>0 = No music, 1 = Maximum volume</FormHelperText>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Output Quality</InputLabel>
                  <Select
                    value={enhancementQuality}
                    label="Output Quality"
                    onChange={(e) => setEnhancementQuality(e.target.value)}
                  >
                    <MenuItem value="high">High Quality</MenuItem>
                    <MenuItem value="medium">Medium Quality</MenuItem>
                    <MenuItem value="low">Low Quality</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={enhancementTab === 0 ? enhanceVideoFromFile : enhanceVideoFromUrl}
                  disabled={enhancementLoading || !enhancementText.trim() || (enhancementTab === 0 ? !enhancementFile : !enhancementUrl.trim())}
                  startIcon={<Campaign />}
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  {enhancementLoading ? 'Enhancing Video...' : 'Enhance Video'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {activeTab === 2 && (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            Create 3D characters with different capabilities: speaking characters, animated characters, 
            characters synchronized with audio, or integrated with videos.
          </Alert>

          {characterSystemStatus && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2">
                System Status: {characterSystemStatus.system_status} | 
                Capabilities: {characterSystemStatus.capabilities && Object.keys(characterSystemStatus.capabilities).filter(k => characterSystemStatus.capabilities[k]).join(', ')}
              </Typography>
            </Alert>
          )}

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              3D Character Creation
            </Typography>

            <Tabs value={characterTab} onChange={(e, newValue) => setCharacterTab(newValue)} sx={{ mb: 3 }}>
              <Tab icon={<Person />} label="Speaking Character" />
              <Tab icon={<Animation />} label="Animated Character" />
              <Tab icon={<Audiotrack />} label="Character with Audio" />
              <Tab icon={<Sync />} label="Video Integration" />
              <Tab icon={<AutoAwesome />} label="Async Generation" />
            </Tabs>

            <Grid container spacing={3}>
              {/* Common Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Character Topic"
                  placeholder="Enter the topic or role for your 3D character (e.g., 'Science Teacher', 'Business Presenter')"
                  value={characterTopic}
                  onChange={(e) => setCharacterTopic(e.target.value)}
                  required
                  helperText="This defines the character's appearance and role"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Character Content"
                  placeholder="Enter the content or script for your character..."
                  value={characterContent}
                  onChange={(e) => setCharacterContent(e.target.value)}
                  required
                  helperText={
                    characterTab === 0 ? "The script your character will speak" :
                    characterTab === 1 ? "Content that defines character behavior and expressions" :
                    characterTab === 2 ? "Content for character with audio synchronization" :
                    characterTab === 3 ? "Video content with character integration" :
                    "Content for async character generation"
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Character Style</InputLabel>
                  <Select
                    value={characterStyle}
                    label="Character Style"
                    onChange={(e) => setCharacterStyle(e.target.value)}
                  >
                    <MenuItem value="auto">Auto (AI Determined)</MenuItem>
                    {availableCharacterStyles.map((style) => (
                      <MenuItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Emotion</InputLabel>
                  <Select
                    value={characterEmotion}
                    label="Emotion"
                    onChange={(e) => setCharacterEmotion(e.target.value)}
                  >
                    {availableEmotions.map((emotion) => (
                      <MenuItem key={emotion} value={emotion}>
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Tab-specific Fields */}
              {characterTab === 0 && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={characterLanguage}
                        label="Language"
                        onChange={(e) => setCharacterLanguage(e.target.value)}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="it">Italian</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Video Duration (seconds)"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                      inputProps={{ min: 5, max: 300 }}
                      helperText="5-300 seconds"
                    />
                  </Grid>
                </>
              )}

              {characterTab === 2 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Audio File Path"
                    placeholder="Enter path to audio file for synchronization"
                    value={audioFilePath}
                    onChange={(e) => setAudioFilePath(e.target.value)}
                    helperText="Path to existing audio file for lip sync"
                  />
                </Grid>
              )}

              {characterTab === 3 && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Video Duration (seconds)"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                      inputProps={{ min: 5, max: 300 }}
                      helperText="5-300 seconds"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Aspect Ratio</InputLabel>
                      <Select
                        value={aspectRatio}
                        label="Aspect Ratio"
                        onChange={(e) => setAspectRatio(e.target.value)}
                      >
                        <MenuItem value="horizontal">Horizontal (16:9)</MenuItem>
                        <MenuItem value="vertical">Vertical (9:16)</MenuItem>
                        <MenuItem value="square">Square (1:1)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={
                    characterTab === 0 ? createSpeakingCharacter :
                    characterTab === 1 ? createAnimatedCharacter :
                    characterTab === 2 ? createCharacterWithAudio :
                    characterTab === 3 ? integrateCharacterWithVideo :
                    createCharacterAsync
                  }
                  disabled={!characterTopic.trim() || !characterContent.trim() || loading}
                  startIcon={
                    characterTab === 0 ? <Person /> :
                    characterTab === 1 ? <Animation /> :
                    characterTab === 2 ? <Audiotrack /> :
                    characterTab === 3 ? <Sync /> :
                    <AutoAwesome />
                  }
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  {loading ? 'Creating Character...' : 
                   characterTab === 0 ? 'Create Speaking Character' :
                   characterTab === 1 ? 'Create Animated Character' :
                   characterTab === 2 ? 'Create Character with Audio' :
                   characterTab === 3 ? 'Integrate with Video' :
                   'Start Async Generation'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {/* Error handling */}
      <ErrorMessage error={error} />

      {/* Videos and Characters List */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {activeTab === 0 ? 'Generated Videos' : 
             activeTab === 1 ? 'Enhanced Videos' : '3D Characters'} ({displayItems.length})
          </Typography>
        </Box>

        {!loading && displayItems.length > 0 && (
          <Grid container spacing={2}>
            {displayItems.map((item) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.text ? (
                        <>
                          {item.text.substring(0, 50)}
                          {item.text.length > 50 ? '...' : ''}
                        </>
                      ) : item.topic ? (
                        `Character: ${item.topic}`
                      ) : item.type === 'enhanced' ? 'Enhanced Video' : 
                         item.type === '3d_character' ? '3D Character' : 'Generated Video'}
                    </Typography>
                    
                    <Box sx={{ mt: 1, mb: 2 }}>
                      {/* Character-specific info */}
                      {item.topic && (
                        <Typography variant="body2" color="textSecondary">
                          Topic: {item.topic}
                        </Typography>
                      )}
                      {item.character_style && (
                        <Typography variant="body2" color="textSecondary">
                          Style: {item.character_style}
                        </Typography>
                      )}
                      {item.emotion && (
                        <Typography variant="body2" color="textSecondary">
                          Emotion: {item.emotion}
                        </Typography>
                      )}
                      {item.character_type && (
                        <Typography variant="body2" color="textSecondary">
                          Type: {item.character_type}
                        </Typography>
                      )}
                      {item.integration_type && (
                        <Typography variant="body2" color="textSecondary">
                          Integration: {item.integration_type}
                        </Typography>
                      )}

                      {/* Video-specific info */}
                      {item.duration && (
                        <Typography variant="body2" color="textSecondary">
                          Duration: {item.duration} seconds
                        </Typography>
                      )}
                      {item.aspect_ratio && (
                        <Typography variant="body2" color="textSecondary">
                          Aspect Ratio: {item.aspect_ratio}
                        </Typography>
                      )}
                      {item.file_size && (
                        <Typography variant="body2" color="textSecondary">
                          File Size: {item.file_size}
                        </Typography>
                      )}
                      <Typography variant="body2" color="textSecondary">
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </Typography>

                      {/* Character type badges */}
                      {item.type && (
                        <Chip 
                          label={item.type.replace('_', ' ')} 
                          size="small" 
                          sx={{ mt: 1 }}
                          color={
                            item.type.includes('speaking') ? 'primary' :
                            item.type.includes('animated') ? 'secondary' :
                            item.type.includes('audio') ? 'info' :
                            item.type.includes('integrated') ? 'success' :
                            'default'
                          }
                        />
                      )}
                    </Box>
                    
                    {/* Progress for async jobs */}
                    {(item.progress !== undefined && item.progress < 100) && (
                      <Box sx={{ my: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.progress} 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" align="center">
                          {item.progress}% Complete
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip 
                        label={item.status || 'unknown'} 
                        color={
                          item.status === 'completed' ? 'success' : 
                          item.status === 'processing' || item.status === 'queued' ? 'primary' : 
                          item.status === 'failed' ? 'error' : 'default'
                        }
                      />
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {(item.video_path || item.enhanced_video_url || item.preview_url) && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Download />}
                            onClick={() => handleDownload(item.video_path || item.enhanced_video_url || item.preview_url)}
                          >
                            Download
                          </Button>
                        )}
                        {!item.isAsync && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => setDeleteDialog({ open: true, videoId: item.id })}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Error message for failed jobs */}
                    {item.error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {typeof item.error === 'string' ? item.error : 'An error occurred'}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && displayItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {activeTab === 0 ? 'No Videos Yet' : 
               activeTab === 1 ? 'No Enhanced Videos Yet' : 'No 3D Characters Yet'}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              {activeTab === 0 
                ? 'Create your first video using the form above.'
                : activeTab === 1
                ? 'Enhance your first video by uploading a file or providing a URL above.'
                : 'Create your first 3D character using the form above. Choose from different character types and capabilities.'
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => document.querySelector('textarea')?.focus()}
              startIcon={<AutoAwesome />}
            >
              {activeTab === 0 ? 'Create New Video' : 
               activeTab === 1 ? 'Enhance Video' : 'Create 3D Character'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, videoId: null })}
      >
        <DialogTitle>Delete {deleteDialog.videoId?.includes('character') ? 'Character' : 'Video'}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.videoId?.includes('character') ? 'character' : 'video'}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, videoId: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (deleteDialog.videoId?.includes('character')) {
                delete3DCharacter(deleteDialog.videoId);
              } else {
                handleDeleteVideo(deleteDialog.videoId);
              }
            }} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VideoGenerator;
// src/components/VoiceToBlog/VoiceToBlog.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  Mic,
  MicOff,
  Upload,
  TextFields,
  Help,
  PlayArrow,
  Pause,
  Download,
  ContentCopy,
  CheckCircle
} from '@mui/icons-material';
import { useVoiceToBlog } from '../ContentSocialBoost/useVoiceToBlog';

const VoiceToBlog = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [audioFormat, setAudioFormat] = useState('wav');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [localError, setLocalError] = useState(null); // Added local error state

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const {
    loading,
    error,
    result,
    supportedFormats,
    setupGuide,
    processAudio,
    uploadAudio,
    processText,
    getSupportedFormats,
    getSetupGuide,
    resetError
  } = useVoiceToBlog();

  useEffect(() => {
    getSupportedFormats();
    getSetupGuide();
  }, [getSupportedFormats, getSetupGuide]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: `audio/${audioFormat}` });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setLocalError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error starting recording:', err);
      setLocalError('Microphone access denied. Please allow microphone permissions.'); // Use local error state
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const handleProcessRecording = async () => {
    if (!audioBlob) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        await processAudio(base64Audio, audioFormat, language, topic);
      };
    } catch (err) {
      console.error('Error processing audio:', err);
      setLocalError('Failed to process audio. Please try again.'); // Use local error state
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      const format = file.name.split('.').pop();
      setAudioFormat(format);
      setLocalError(null); // Clear any previous errors
    }
  };

  const handleProcessUpload = async () => {
    if (!audioBlob) return;
    try {
      await uploadAudio(audioBlob, language, topic);
    } catch (err) {
      console.error('Error processing upload:', err);
      setLocalError('Failed to process uploaded audio. Please try again.'); // Use local error state
    }
  };

  const handleProcessText = async () => {
    if (!textInput.trim()) return;
    try {
      await processText(textInput, topic);
    } catch (err) {
      console.error('Error processing text:', err);
      setLocalError('Failed to process text. Please try again.'); // Use local error state
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const downloadBlog = (content, filename = 'blog-draft.md') => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setLocalError(null); // Clear errors when switching tabs
    resetError(); // Also clear API errors
  };

  const resetAllErrors = () => {
    setLocalError(null);
    resetError();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Voice to Blog Converter
      </Typography>

      {/* Show both API errors and local errors */}
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={resetAllErrors}>
          {error || localError}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Mic />} label="Record Audio" />
          <Tab icon={<Upload />} label="Upload Audio" />
          <Tab icon={<TextFields />} label="Direct Text" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Input Settings
            </Typography>

            <TextField
              fullWidth
              label="Topic (Optional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Technology, Marketing, Personal..."
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                {supportedFormats?.languages?.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {activeTab !== 2 && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Audio Format</InputLabel>
                <Select
                  value={audioFormat}
                  label="Audio Format"
                  onChange={(e) => setAudioFormat(e.target.value)}
                >
                  {supportedFormats?.audio_formats?.map((format) => (
                    <MenuItem key={format} value={format}>
                      {format.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setShowSetupGuide(true)}
              startIcon={<Help />}
            >
              Setup Guide
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {activeTab === 0 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Record Audio
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={recording ? "contained" : "outlined"}
                  color={recording ? "error" : "primary"}
                  onClick={recording ? stopRecording : startRecording}
                  startIcon={recording ? <MicOff /> : <Mic />}
                  disabled={loading}
                >
                  {recording ? 'Stop Recording' : 'Start Recording'}
                </Button>

                {audioUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <audio controls src={audioUrl} style={{ height: '40px' }} />
                  </Box>
                )}
              </Box>

              {audioBlob && (
                <Button
                  variant="contained"
                  onClick={handleProcessRecording}
                  disabled={loading || recording}
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                >
                  {loading ? 'Processing...' : 'Convert to Blog'}
                </Button>
              )}

              {!audioBlob && !recording && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Click "Start Recording" to begin recording your audio
                </Typography>
              )}
            </Paper>
          )}

          {activeTab === 1 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Upload Audio File
              </Typography>

              <input
                accept="audio/*"
                style={{ display: 'none' }}
                id="audio-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="audio-upload">
                <Button variant="outlined" component="span" startIcon={<Upload />} fullWidth sx={{ mb: 2 }}>
                  Choose Audio File
                </Button>
              </label>

              {audioUrl && (
                <Box sx={{ mb: 2 }}>
                  <audio controls src={audioUrl} style={{ width: '100%' }} />
                </Box>
              )}

              {audioBlob && (
                <Button
                  variant="contained"
                  onClick={handleProcessUpload}
                  disabled={loading}
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                >
                  {loading ? 'Processing...' : 'Convert to Blog'}
                </Button>
              )}

              {!audioBlob && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Upload an audio file to convert it to a blog post
                </Typography>
              )}
            </Paper>
          )}

          {activeTab === 2 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Direct Text Input
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Enter your text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type or paste your content here..."
                margin="normal"
              />

              <Button
                variant="contained"
                onClick={handleProcessText}
                disabled={loading || !textInput.trim()}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Processing...' : 'Convert to Blog'}
              </Button>
            </Paper>
          )}

          {result?.blog_content && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  Generated Blog Draft
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Copy blog content">
                    <IconButton
                      onClick={() => copyToClipboard(result.blog_content)}
                      color={copiedText === result.blog_content ? 'success' : 'default'}
                    >
                      {copiedText === result.blog_content ? <CheckCircle /> : <ContentCopy />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download as Markdown">
                    <IconButton onClick={() => downloadBlog(result.blog_content)}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {result.transcription && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Transcription
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {result.transcription}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Typography variant="h6" gutterBottom>
                Blog Content
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', maxHeight: '400px', overflow: 'auto' }}>
                <Typography variant="body2" whiteSpace="pre-wrap" component="pre" sx={{ fontFamily: 'monospace' }}>
                  {result.blog_content}
                </Typography>
              </Paper>

              {result.keywords && result.keywords.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Keywords:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {result.keywords.map((keyword, index) => (
                      <Chip key={index} label={keyword} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Setup Guide Dialog */}
      <Dialog open={showSetupGuide} onClose={() => setShowSetupGuide(false)} maxWidth="md" fullWidth>
        <DialogTitle>Audio Setup Guide</DialogTitle>
        <DialogContent>
          {setupGuide?.setup_guide && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Recording Tips
              </Typography>
              <List dense>
                {setupGuide.setup_guide.recording_tips?.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Software Options
              </Typography>
              <Grid container spacing={2}>
                {setupGuide.setup_guide.software_options?.map((software, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{software.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {software.purpose}
                        </Typography>
                        {software.url && (
                          <Button
                            size="small"
                            href={software.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mt: 1 }}
                          >
                            Visit Website
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Troubleshooting
              </Typography>
              <List dense>
                {setupGuide.setup_guide.troubleshooting?.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSetupGuide(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VoiceToBlog;
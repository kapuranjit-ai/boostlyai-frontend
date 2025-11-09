// src/pages/ContentGenerator.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Grid,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { AutoAwesome, Share, ContentCopy, Download, Save, Language } from '@mui/icons-material';
import { contentAPI } from '../../services/api';
import translationService from '../../services/translationService';
import { getLanguageName, getLanguageIcon, getNativeLanguageName } from '../../utils/languageUtils';

const ContentGenerator = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(1000);
  const [tone, setTone] = useState('professional');
  const [style, setStyle] = useState('informative');
  const [targetAudience, setTargetAudience] = useState('general');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Language state
  const [language, setLanguage] = useState('english');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState(null);

  // Load available languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await contentAPI.getAvailableLanguages();
        if (response.data.success) {
          setAvailableLanguages(response.data.languages);
        }
      } catch (err) {
        console.error('Failed to load languages:', err);
      }
    };
    loadLanguages();
  }, []);

  // Get display data (original or translated)
  const getDisplayData = () => {
    if (language === 'english') {
      return result;
    }
    return translatedResult || result;
  };

  // Handle language change for translation
  const handleLanguageChange = async (newLanguage) => {
    if (!result || newLanguage === language) return;
    
    if (newLanguage === 'english') {
      // Switch back to English
      setLanguage('english');
      setTranslatedResult(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      const translatedContent = await translationService.translateContent(result, newLanguage);
      setTranslatedResult(translatedContent);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const generateArticle = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setTranslatedResult(null);
    setLanguage('english');
    
    try {
      const response = await contentAPI.generateArticle(
        topic, wordCount, tone, style, targetAudience, useAI
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate article');
    } finally {
      setLoading(false);
    }
  };

  const generateIdeas = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setTranslatedResult(null);
    setLanguage('english');
    
    try {
      const response = await contentAPI.generateContentIdeas(topic, 5, useAI);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate content ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setResult(null);
    setTranslatedResult(null);
    setLanguage('english');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Content Generator
      </Typography>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Generate Article" />
          <Tab label="Content Ideas" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <ArticleTab
          topic={topic}
          setTopic={setTopic}
          wordCount={wordCount}
          setWordCount={setWordCount}
          tone={tone}
          setTone={setTone}
          style={style}
          setStyle={setStyle}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          useAI={useAI}
          setUseAI={setUseAI}
          loading={loading}
          onGenerate={generateArticle}
          error={error}
          result={getDisplayData()}
          language={language}
          availableLanguages={availableLanguages}
          isTranslating={isTranslating}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {activeTab === 1 && (
        <IdeasTab
          topic={topic}
          setTopic={setTopic}
          useAI={useAI}
          setUseAI={setUseAI}
          loading={loading}
          onGenerate={generateIdeas}
          error={error}
          result={getDisplayData()}
          language={language}
          availableLanguages={availableLanguages}
          isTranslating={isTranslating}
          onLanguageChange={handleLanguageChange}
        />
      )}
    </Container>
  );
};

// Article Generation Tab Component
const ArticleTab = ({
  topic, setTopic, wordCount, setWordCount, tone, setTone,
  style, setStyle, targetAudience, setTargetAudience,
  useAI, setUseAI, loading, onGenerate, error, result,
  language, availableLanguages, isTranslating, onLanguageChange
}) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Generate Article
    </Typography>

    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    {/* Language Info Card */}
    <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Language color="primary" />
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Content Generation
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Content is generated in English first. You can translate it to other languages after generation.
          </Typography>
        </Box>
      </Box>
    </Card>

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label="Topic *"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          placeholder="Enter article topic..."
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Word Count"
          type="number"
          value={wordCount}
          onChange={(e) => setWordCount(parseInt(e.target.value) || 1000)}
          inputProps={{ min: 300, max: 5000 }}
          disabled={loading}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Tone</InputLabel>
          <Select
            value={tone}
            label="Tone"
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="humorous">Humorous</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Style</InputLabel>
          <Select
            value={style}
            label="Style"
            onChange={(e) => setStyle(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="informative">Informative</MenuItem>
            <MenuItem value="persuasive">Persuasive</MenuItem>
            <MenuItem value="narrative">Narrative</MenuItem>
            <MenuItem value="descriptive">Descriptive</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Target Audience</InputLabel>
          <Select
            value={targetAudience}
            label="Target Audience"
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="beginners">Beginners</MenuItem>
            <MenuItem value="experts">Experts</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value="english"
            label="Language"
            disabled={true}
          >
            <MenuItem value="english">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {getLanguageIcon('english')}
                </Typography>
                <Typography>English</Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary">
          Generated in English
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              disabled={loading}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoAwesome sx={{ mr: 1 }} />
              Use AI Enhancement (requires API key)
            </Box>
          }
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {useAI 
            ? "AI will generate more creative and optimized content" 
            : "Using template-based generation (no API key required)"}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          size="large"
          onClick={onGenerate}
          disabled={loading || !topic.trim()}
          startIcon={loading ? null : <AutoAwesome />}
        >
          {loading ? 'Generating...' : 'Generate Article'}
        </Button>
      </Grid>
    </Grid>

    {result && (
      <Box sx={{ mt: 4 }}>
        <ArticleResult 
          result={result} 
          language={language}
          availableLanguages={availableLanguages}
          isTranslating={isTranslating}
          onLanguageChange={onLanguageChange}
        />
      </Box>
    )}
  </Paper>
);

// Content Ideas Tab Component
const IdeasTab = ({
  topic, setTopic, useAI, setUseAI, loading, onGenerate, error, result,
  language, availableLanguages, isTranslating, onLanguageChange
}) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Generate Content Ideas
    </Typography>

    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    {/* Language Info Card */}
    <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Language color="primary" />
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Content Generation
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Content is generated in English first. You can translate it to other languages after generation.
          </Typography>
        </Box>
      </Box>
    </Card>

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label="Topic *"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          placeholder="Enter topic for content ideas..."
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value="english"
            label="Language"
            disabled={true}
          >
            <MenuItem value="english">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {getLanguageIcon('english')}
                </Typography>
                <Typography>English</Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary">
          Generated in English
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              disabled={loading}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoAwesome sx={{ mr: 1 }} />
              Use AI Enhancement (requires API key)
            </Box>
          }
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {useAI 
            ? "AI will generate more creative and targeted ideas" 
            : "Using template-based generation (no API key required)"}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          size="large"
          onClick={onGenerate}
          disabled={loading || !topic.trim()}
          startIcon={loading ? null : <AutoAwesome />}
        >
          {loading ? 'Generating...' : 'Generate Ideas'}
        </Button>
      </Grid>
    </Grid>

    {result && (
      <Box sx={{ mt: 4 }}>
        <IdeasResult 
          result={result} 
          language={language}
          availableLanguages={availableLanguages}
          isTranslating={isTranslating}
          onLanguageChange={onLanguageChange}
        />
      </Box>
    )}
  </Paper>
);

// Updated Article Result Component with Language Support
const ArticleResult = ({ result, language, availableLanguages, isTranslating, onLanguageChange }) => (
  <Card>
    <CardHeader
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h5">
            {result.article?.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={getLanguageName(language)} 
              color={language === 'english' ? 'primary' : 'secondary'}
              size="small"
            />
            {language !== 'english' && (
              <Chip 
                label="Translated" 
                size="small" 
                variant="outlined"
                color="secondary"
              />
            )}
          </Box>
        </Box>
      }
      subheader={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Generated with: ${result.article?.generated_with}`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={`Word count: ${result.article?.total_word_count}`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={`Readability: ${result.article?.readability_score}/100`} 
              size="small" 
              variant="outlined" 
            />
          </Box>
          
          {/* Language Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Language fontSize="small" color="action" />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Translate to</InputLabel>
              <Select
                value={language}
                label="Translate to"
                onChange={(e) => onLanguageChange(e.target.value)}
                disabled={isTranslating}
              >
                {availableLanguages.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {getLanguageIcon(lang.code)}
                      </Typography>
                      <Box>
                        <Typography variant="body2">
                          {lang.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getNativeLanguageName(lang.code)}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isTranslating && <CircularProgress size={20} />}
          </Box>
        </Box>
      }
    />
    
    <CardContent>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Meta Description
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {result.article?.meta_description}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Keywords
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {result?.article?.keywords?.map((keyword, index) => (
            <Chip key={index} label={keyword} variant="outlined" />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box className="article-content">
        <div dangerouslySetInnerHTML={{ __html: result?.article?.introduction?.content }} />
        
        {result?.article?.sections?.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
            
            {section.key_points && section.key_points.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Key Points
                </Typography>
                <ul>
                  {section.key_points.map((point, idx) => (
                    <li key={idx}>
                      <Typography variant="body1">{point}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        ))}
        
        <div dangerouslySetInnerHTML={{ __html: result?.article?.conclusion?.content }} />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="outlined" startIcon={<ContentCopy />}>
          Copy to Clipboard
        </Button>
        <Button variant="outlined" startIcon={<Download />}>
          Download as HTML
        </Button>
        <Button variant="outlined" startIcon={<Save />}>
          Save to Project
        </Button>
        <Button variant="outlined" startIcon={<Share />}>
          Share
        </Button>
      </Box>
    </CardContent>
  </Card>
);

// Updated Ideas Result Component with Language Support
const IdeasResult = ({ result, language, availableLanguages, isTranslating, onLanguageChange }) => (
  <Card>
    <CardHeader
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Content Ideas</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={getLanguageName(language)} 
              color={language === 'english' ? 'primary' : 'secondary'}
              size="small"
            />
            {language !== 'english' && (
              <Chip 
                label="Translated" 
                size="small" 
                variant="outlined"
                color="secondary"
              />
            )}
          </Box>
        </Box>
      }
      subheader={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Generated with: ${result.using_ai ? 'AI' : 'Templates'}`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={`Count: ${result.ideas?.length}`} 
              size="small" 
              variant="outlined" 
            />
          </Box>
          
          {/* Language Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Language fontSize="small" color="action" />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Translate to</InputLabel>
              <Select
                value={language}
                label="Translate to"
                onChange={(e) => onLanguageChange(e.target.value)}
                disabled={isTranslating}
              >
                {availableLanguages.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {getLanguageIcon(lang.code)}
                      </Typography>
                      <Box>
                        <Typography variant="body2">
                          {lang.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getNativeLanguageName(lang.code)}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isTranslating && <CircularProgress size={20} />}
          </Box>
        </Box>
      }
    />
    
    <CardContent>
      <Grid container spacing={3}>
        {result.ideas?.map((idea, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {idea?.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {idea.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {idea.target_audience} • {idea.word_count} words
                  </Typography>
                  <Chip label={idea.primary_keyword} size="small" color="primary" />
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button size="small" variant="outlined" fullWidth>
                  Use This Idea
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default ContentGenerator;
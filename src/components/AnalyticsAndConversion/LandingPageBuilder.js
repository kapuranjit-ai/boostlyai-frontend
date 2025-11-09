import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Html as HtmlIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { seoAPI } from '../../services/api';

const LandingPageBuilder = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generationResult, setGenerationResult] = useState(null);
  const [seoResult, setSeoResult] = useState(null);
  const [htmlResult, setHtmlResult] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [conversionElements, setConversionElements] = useState([]);

  // Form states
  const [generationForm, setGenerationForm] = useState({
    business_type: '',
    industry: '',
    primary_goal: '',
    keywords: [''],
    template_preference: ''
  });

  const [seoForm, setSeoForm] = useState({
    html_content: '',
    keywords: ['']
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [templatesRes, elementsRes] = await Promise.all([
        seoAPI.getLandingPageTemplates(),
        seoAPI.getConversionElements()
      ]);
      
      setTemplates(templatesRes.data.templates || []);
      setConversionElements(elementsRes.data.conversion_elements || []);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load landing page data. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGenerationFormChange = (field) => (event) => {
    setGenerationForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleKeywordChange = (index, value, formType = 'generation') => {
    if (formType === 'generation') {
      const newKeywords = [...generationForm.keywords];
      newKeywords[index] = value;
      setGenerationForm(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    } else {
      const newKeywords = [...seoForm.keywords];
      newKeywords[index] = value;
      setSeoForm(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    }
  };

  const addKeywordField = (formType = 'generation') => {
    if (formType === 'generation') {
      setGenerationForm(prev => ({
        ...prev,
        keywords: [...prev.keywords, '']
      }));
    } else {
      setSeoForm(prev => ({
        ...prev,
        keywords: [...prev.keywords, '']
      }));
    }
  };

  const removeKeywordField = (index, formType = 'generation') => {
    if (formType === 'generation' && generationForm.keywords.length > 1) {
      const newKeywords = generationForm.keywords.filter((_, i) => i !== index);
      setGenerationForm(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    } else if (formType === 'seo' && seoForm.keywords.length > 1) {
      const newKeywords = seoForm.keywords.filter((_, i) => i !== index);
      setSeoForm(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    }
  };

  const generateLandingPage = async () => {
    const validKeywords = generationForm.keywords.filter(kw => kw.trim() !== '');
    if (!generationForm.business_type || !generationForm.industry || !generationForm.primary_goal || validKeywords.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.generateLandingPage({
        business_type: generationForm.business_type,
        industry: generationForm.industry,
        primary_goal: generationForm.primary_goal,
        keywords: validKeywords,
        template_preference: generationForm.template_preference || undefined
      });

      setGenerationResult(response.data);
      setSuccess('Landing page generated successfully!');
      
      // Switch to HTML tab after generation
      setActiveTab(2);
    } catch (err) {
      console.error('Error generating landing page:', err);
      setError(err.response?.data?.detail || 'Failed to generate landing page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSEO = async () => {
    const validKeywords = seoForm.keywords.filter(kw => kw.trim() !== '');
    if (!seoForm.html_content.trim() || validKeywords.length === 0) {
      setError('Please provide HTML content and at least one keyword');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.analyzeSEO({
        html_content: seoForm.html_content,
        keywords: validKeywords
      });

      setSeoResult(response.data);
      setSuccess('SEO analysis completed successfully!');
    } catch (err) {
      console.error('Error analyzing SEO:', err);
      setError(err.response?.data?.detail || 'Failed to analyze SEO. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateHTML = async () => {
    if (!generationResult?.landing_page) {
      setError('Please generate a landing page first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.generateHTML({
        landing_page_data: generationResult.landing_page,
        export_format: 'html'
      });

      setHtmlResult(response.data);
      setSuccess('HTML generated successfully!');
    } catch (err) {
      console.error('Error generating HTML:', err);
      setError(err.response?.data?.detail || 'Failed to generate HTML. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    const content = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    navigator.clipboard.writeText(content);
    setSuccess('Copied to clipboard!');
  };

  const downloadHTML = () => {
    if (!htmlResult?.html) return;
  
    const content = htmlResult.html;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Landing Page Builder
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Generate Landing Page" />
        <Tab label="SEO Analysis" />
        <Tab label="HTML Output" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {activeTab === 0 && (
        <GenerateLandingPageTab
          form={generationForm}
          templates={templates}
          loading={loading}
          result={generationResult}
          onChange={handleGenerationFormChange}
          onKeywordChange={handleKeywordChange}
          onAddKeyword={addKeywordField}
          onRemoveKeyword={removeKeywordField}
          onSubmit={generateLandingPage}
        />
      )}

      {activeTab === 1 && (
        <SEOAnalysisTab
          form={seoForm}
          loading={loading}
          result={seoResult}
          onKeywordChange={(index, value) => handleKeywordChange(index, value, 'seo')}
          onAddKeyword={() => addKeywordField('seo')}
          onRemoveKeyword={(index) => removeKeywordField(index, 'seo')}
          onSubmit={analyzeSEO}
          setSeoForm={setSeoForm}
        />
      )}

      {activeTab === 2 && (
        <HTMLOutputTab
          result={htmlResult}
          generationResult={generationResult}
          loading={loading}
          onGenerate={generateHTML}
          onCopy={copyToClipboard}
          onDownload={downloadHTML}
        />
      )}
    </Box>
  );
};

// Generate Landing Page Tab Component
const GenerateLandingPageTab = ({ form, templates, loading, result, onChange, onKeywordChange, onAddKeyword, onRemoveKeyword, onSubmit }) => {
  const businessTypes = [
    'SaaS', 'E-commerce', 'Agency', 'Consulting', 'Education', 
    'Healthcare', 'Real Estate', 'Finance', 'Technology', 'Retail'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Retail',
    'Manufacturing', 'Hospitality', 'Marketing', 'Construction', 'Entertainment'
  ];

  const primaryGoals = [
    'lead_generation', 'product_sales', 'signups', 'awareness', 'conversions'
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Landing Page Details
          </Typography>

          <TextField
            select
            fullWidth
            label="Business Type"
            value={form.business_type}
            onChange={onChange('business_type')}
            sx={{ mb: 2 }}
          >
            {businessTypes.map((type) => (
              <MenuItem key={type} value={type.toLowerCase()}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Industry"
            value={form.industry}
            onChange={onChange('industry')}
            sx={{ mb: 2 }}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry.toLowerCase()}>
                {industry}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Primary Goal"
            value={form.primary_goal}
            onChange={onChange('primary_goal')}
            sx={{ mb: 2 }}
          >
            {primaryGoals.map((goal) => (
              <MenuItem key={goal} value={goal}>
                {goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </MenuItem>
            ))}
          </TextField>

          {templates && templates.length > 0 && (
            <TextField
              select
              fullWidth
              label="Template Preference (Optional)"
              value={form.template_preference}
              onChange={onChange('template_preference')}
              sx={{ mb: 2 }}
            >
              {Object.keys(templates).map((templateKey) => (
                <MenuItem key={templateKey} value={templateKey}>
                  {templates[templateKey].name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Typography variant="subtitle2" gutterBottom>
            Keywords
          </Typography>
          {form.keywords.map((keyword, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                label={`Keyword ${index + 1}`}
                value={keyword}
                onChange={(e) => onKeywordChange(index, e.target.value)}
                placeholder="Enter a keyword"
              />
              {form.keywords.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onRemoveKeyword(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  ×
                </Button>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={onAddKeyword} sx={{ mb: 3 }}>
            Add Keyword
          </Button>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          >
            Generate Landing Page
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <GenerationResult result={result} />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <DashboardIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Fill out the form to generate an AI-powered landing page
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// SEO Analysis Tab Component
const SEOAnalysisTab = ({ form, loading, result, onKeywordChange, onAddKeyword, onRemoveKeyword, onSubmit, setSeoForm }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            SEO Analysis
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={8}
            label="HTML Content"
            value={form.html_content}
            onChange={(e) => setSeoForm(prev => ({ ...prev, html_content: e.target.value }))}
            placeholder="Paste your HTML content here for SEO analysis..."
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Target Keywords
          </Typography>
          {form.keywords.map((keyword, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                label={`Keyword ${index + 1}`}
                value={keyword}
                onChange={(e) => onKeywordChange(index, e.target.value)}
                placeholder="Enter a keyword"
              />
              {form.keywords.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onRemoveKeyword(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  ×
                </Button>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={onAddKeyword} sx={{ mb: 3 }}>
            Add Keyword
          </Button>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
          >
            Analyze SEO
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <SEOResult result={result} />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Paste HTML content and add keywords to analyze SEO effectiveness
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// HTML Output Tab Component
const HTMLOutputTab = ({ result, generationResult, loading, onGenerate, onCopy, onDownload }) => {
  const htmlContent = result?.html || '';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            HTML Output
          </Typography>

          {!generationResult ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Generate a landing page first to create HTML output.
            </Alert>
          ) : !result ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HtmlIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Ready to generate HTML output from your landing page design
              </Typography>
              <Button
                variant="contained"
                onClick={onGenerate}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CodeIcon />}
              >
                Generate HTML
              </Button>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => onCopy(htmlContent)}
                >
                  Copy HTML
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={onDownload}
                >
                  Download HTML
                </Button>
              </Box>

              {/* Landing Page Details */}
              {generationResult?.landing_page && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Landing Page Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {/* Template Information */}
                      {generationResult.landing_page.template && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Template: {generationResult.landing_page.template.name}
                          </Typography>
                          <Typography variant="body2">
                            Layout: {generationResult.landing_page.template.layout}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Sections: {generationResult.landing_page.template.sections?.join(', ')}
                          </Typography>
                          <Typography variant="body2">
                            Color Schemes: {generationResult.landing_page.template.color_schemes?.join(', ')}
                          </Typography>
                        </Box>
                      )}

                      {/* Content Sections */}
                      {generationResult.landing_page.content && (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            Content Sections
                          </Typography>
                          {Object.entries(generationResult.landing_page.content).map(([section, content]) => (
                            <Accordion key={section} sx={{ mb: 1 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle2">
                                  {section.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {Array.isArray(content) ? (
                                  <List>
                                    {content.map((item, index) => (
                                      <ListItem key={index}>
                                        <ListItemText
                                          primary={item.title || item.testimonial || item.question || `Item ${index + 1}`}
                                          secondary={item.description || item.answer || item.name || JSON.stringify(item)}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : typeof content === 'object' ? (
                                  <Box>
                                    {Object.entries(content).map(([key, value]) => (
                                      <Box key={key} sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2">
                                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                                        </Typography>
                                        <Typography variant="body2">
                                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography variant="body2">{content}</Typography>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}

                      {/* SEO Metadata */}
                      {generationResult.landing_page.seo_metadata && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            SEO Metadata
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2">
                                <strong>Title:</strong> {generationResult.landing_page.seo_metadata.meta_title}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Description:</strong> {generationResult.landing_page.seo_metadata.meta_description}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2">
                                <strong>Slug:</strong> {generationResult.landing_page.seo_metadata.slug}
                              </Typography>
                              <Typography variant="body2">
                                <strong>URL:</strong> {generationResult.landing_page.seo_metadata.canonical_url}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      {/* Color Scheme */}
                      {generationResult.landing_page.color_scheme && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Color Scheme
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            {Object.entries(generationResult.landing_page.color_scheme).map(([name, color]) => (
                              <Box key={name} sx={{ textAlign: 'center' }}>
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: color,
                                    borderRadius: 1,
                                    mb: 1
                                  }}
                                />
                                <Typography variant="caption" display="block">
                                  {name}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {color}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Performance Metrics */}
                      {generationResult.landing_page.performance_metrics && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Performance Metrics
                          </Typography>
                          <Grid container spacing={2}>
                            {Object.entries(generationResult.landing_page.performance_metrics).map(([metric, value]) => (
                              <Grid item xs={12} md={4} key={metric}>
                                <Card variant="outlined">
                                  <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">
                                      {value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {metric.split('_').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      ).join(' ')}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* HTML Preview */}
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>HTML Preview</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto', maxHeight: '400px' }}>
                      {htmlContent}
                    </pre>
                  </Paper>
                </AccordionDetails>
              </Accordion>

              {/* Mockup Preview */}
              {generationResult?.landing_page?.mockup_preview && (
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Mockup Preview</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ textAlign: 'center' }}>
                      <img 
                        src={generationResult.landing_page.mockup_preview} 
                        alt="Landing page mockup" 
                        style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

// Result Components
const GenerationResult = ({ result }) => {
  if (!result?.success) {
    return (
      <Alert severity="error">
        Failed to generate landing page. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Landing Page Generated!
      </Typography>

      <Alert severity="success" sx={{ mb: 2 }}>
        Your landing page has been successfully generated.
      </Alert>

      {result.landing_page && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            SEO Score: {result.landing_page.seo_score || 'N/A'}
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Preview Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Template: {result.landing_page.template?.name}
              </Typography>
              <Typography variant="body2">
                Generated at: {new Date(result.landing_page.generated_at).toLocaleString()}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Paper>
  );
};

const SEOResult = ({ result }) => {
  if (!result?.success) {
    return (
      <Alert severity="error">
        Failed to analyze SEO. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        SEO Analysis Results
      </Typography>

      {result.score && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Overall SEO Score</Typography>
          <Typography variant="h4" color="primary">
            {result.score}/100
          </Typography>
        </Box>
      )}

      {result.category_scores && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Category Scores</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(result.category_scores).map(([category, score]) => (
                <Grid item xs={12} md={6} key={category}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2">
                        {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {score}/100
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {result.recommendations && result.recommendations.length > 0 && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Recommendations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {result.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

export default LandingPageBuilder;
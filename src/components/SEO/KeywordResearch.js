import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Rating
} from '@mui/material';
import { 
  Search, 
  AutoAwesome, 
  TrendingUp, 
  ExpandMore,
  Article,
  Forum,
  QuestionAnswer,
  TrendingFlat,
  Lightbulb,
  Recommend,
  Insights // Replaced Gap with Insights
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { seoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { data, error, loading, callApi } = useApi();

  const analyzeKeyword = async () => {
    await callApi(
      () => seoAPI.analyzeKeyword(keyword),
      'Keyword analysis completed!'
    );
  };

  const getSuggestions = async () => {
    await callApi(
      () => seoAPI.getKeywordSuggestions(keyword),
      'Keyword suggestions generated!'
    );
  };

  const aiSuggestKeywords = async () => {
    await callApi(
      () => seoAPI.generateKeywordSuggestionsWithAI(keyword),
      'AI keyword suggestions generated!'
    );
  };

  const handleAnalysis = () => {
    if (activeTab === 0) {
      analyzeKeyword();
    } else if (activeTab === 1) {
      getSuggestions();
    } else {
      aiSuggestKeywords();
    }
  };

  const renderDifficultyBar = (difficulty) => {
    let color = 'success';
    if (difficulty > 70) color = 'error';
    else if (difficulty > 40) color = 'warning';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={difficulty} 
          sx={{ 
            width: '100px', 
            height: '8px',
            borderRadius: 1,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: `${color}.main`
            }
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          {difficulty}/100
        </Typography>
      </Box>
    );
  };

  const renderMetricScore = (score, label) => (
    <Box sx={{ textAlign: 'center' }}>
      <Rating value={score * 5} precision={0.1} readOnly max={5} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Keyword Research
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Keyword Analysis" />
          <Tab label="Suggestions" />
          <Tab label="AI Suggestions" />
        </Tabs>

        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Keyword or Topic"
              placeholder="digital marketing strategies"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalysis}
              disabled={!keyword || loading}
              startIcon={activeTab === 2 ? <AutoAwesome /> : <Search />}
              size="large"
            >
              {loading ? 'Processing...' : 
               activeTab === 0 ? 'Analyze Keyword' :
               activeTab === 1 ? 'Get Suggestions' : 'AI Suggestions'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleAnalysis} />
      )}

      {loading && <Loading message="Analyzing keyword..." />}

      {data && activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Main Metrics Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Keyword Analysis
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {data.keyword}
                  </Typography>
                  {data.is_cached && (
                    <Chip 
                      label="From Cache" 
                      size="small" 
                      color="info"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Search Volume
                    </Typography>
                    <Typography variant="h6">
                      {data.search_volume?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Difficulty
                    </Typography>
                    {renderDifficultyBar(data.difficulty)}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      CPC
                    </Typography>
                    <Typography variant="h6">
                      ${data.cpc}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Competition
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.competition * 100} 
                      sx={{ 
                        width: '100px', 
                        height: '8px',
                        borderRadius: 1,
                        mt: 0.5
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Intent
                    </Typography>
                    <Chip 
                      label={data.intent_type} 
                      size="small" 
                      sx={{ mt: 0.5 }}
                      color={
                        data.intent_type === 'commercial' ? 'primary' :
                        data.intent_type === 'transactional' ? 'secondary' : 'default'
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Metrics Score Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quality Metrics
                </Typography>
                <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                  <Grid item xs={4}>
                    {renderMetricScore(data.metrics?.commercial_score, 'Commercial')}
                  </Grid>
                  <Grid item xs={4}>
                    {renderMetricScore(data.metrics?.trend_score, 'Trending')}
                  </Grid>
                  <Grid item xs={4}>
                    {renderMetricScore(data.metrics?.question_score, 'Questions')}
                  </Grid>
                  <Grid item xs={4}>
                    {renderMetricScore(data.metrics?.authority_score, 'Authority')}
                  </Grid>
                  <Grid item xs={4}>
                    {renderMetricScore(data.metrics?.length_score, 'Length')}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Suggested Keywords */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingFlat sx={{ mr: 1 }} />
                  Suggested Keywords ({data.suggested_keywords?.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {data.suggested_keywords?.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      variant="outlined"
                      onClick={() => {
                        setKeyword(suggestion);
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Related Keywords */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Related Keywords ({data.related_keywords?.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {data.related_keywords?.slice(0, 10).map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setKeyword(keyword);
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Content Ideas */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lightbulb sx={{ mr: 1 }} />
                  Content Ideas ({data.content_ideas?.length})
                </Typography>
                <List dense>
                  {data.content_ideas?.map((idea, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={idea} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Recommend sx={{ mr: 1 }} />
                  Recommendations ({data.recommendations?.length})
                </Typography>
                <List dense>
                  {data.recommendations?.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Wikipedia Data */}
          {data.wikipedia_data?.exists && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Article sx={{ mr: 1 }} />
                    Wikipedia Information
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6">{data.wikipedia_data.title}</Typography>
                  <Typography variant="body2" paragraph>
                    {data.wikipedia_data.summary}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Word Count:</strong> {data.wikipedia_data.word_count}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Categories:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {data.wikipedia_data.categories?.slice(0, 5).map((category, index) => (
                        <Chip key={index} label={category} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}

          {/* Trends Data */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  Google Trends
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Interest Over Time:</strong> Average of {Math.round(data.trends_data?.interest_over_time?.reduce((a, b) => a + b, 0) / data.trends_data?.interest_over_time?.length || 0)}/100
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Top Regions:</Typography>
                    <List dense>
                      {data.trends_data?.region_interest?.map((region, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={region} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Content Gaps */}
          {data.content_gaps?.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Insights sx={{ mr: 1 }} /> {/* Changed from Gap to Insights */}
                    Content Gaps ({data.content_gaps.length})
                  </Typography>
                  <List>
                    {data.content_gaps.map((gap, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={gap} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

        </Grid>
      )}

      {data && activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Keyword Suggestions ({data.suggestions?.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {data.suggestions?.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      variant="outlined"
                      onClick={() => {
                        setKeyword(suggestion);
                        setActiveTab(0);
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

     {data && activeTab === 2 && data.suggestions && (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Keyword Suggestions ({data.suggestions.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Keyword</TableCell>
                  <TableCell>Intent</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Volume</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.suggestions.map((suggestion, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {suggestion.keyword}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={suggestion.intent} 
                        size="small"
                        color={
                          suggestion.intent === 'commercial' ? 'primary' :
                          suggestion.intent === 'transactional' ? 'secondary' : 
                          suggestion.intent === 'informational' ? 'info' : 'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={suggestion.estimated_difficulty} 
                          sx={{ 
                            width: '80px', 
                            height: '8px',
                            borderRadius: 1,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 
                                suggestion.estimated_difficulty > 70 ? 'error.main' :
                                suggestion.estimated_difficulty > 40 ? 'warning.main' : 'success.main'
                            }
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          {suggestion.estimated_difficulty}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={suggestion.potential_volume} 
                        size="small"
                        color={
                          suggestion.potential_volume === 'high' ? 'success' :
                          suggestion.potential_volume === 'medium' ? 'warning' : 'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setKeyword(suggestion.keyword);
                          setActiveTab(0);
                        }}
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>

    {/* Summary Statistics */}
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Suggestions
              </Typography>
              <Typography variant="h4" color="primary">
                {data.suggestions.length}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Avg. Difficulty
              </Typography>
              <Typography variant="h4">
                {Math.round(data.suggestions.reduce((sum, s) => sum + s.estimated_difficulty, 0) / data.suggestions.length)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                High Volume
              </Typography>
              <Typography variant="h6">
                {data.suggestions.filter(s => s.potential_volume === 'high').length}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Commercial Intent
              </Typography>
              <Typography variant="h6">
                {data.suggestions.filter(s => s.intent === 'commercial').length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>

    {/* Intent Distribution */}
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Intent Distribution
          </Typography>
          {['informational', 'commercial', 'transactional'].map((intentType) => {
            const count = data.suggestions.filter(s => s.intent === intentType).length;
            const percentage = (count / data.suggestions.length) * 100;
            
            return (
              <Box key={intentType} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {intentType.charAt(0).toUpperCase() + intentType.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {count} ({Math.round(percentage)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={percentage} 
                  sx={{ 
                    height: '8px',
                    borderRadius: 1,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 
                        intentType === 'commercial' ? 'primary.main' :
                        intentType === 'transactional' ? 'secondary.main' : 'info.main'
                    }
                  }} 
                />
              </Box>
            );
          })}
        </CardContent>
      </Card>
    </Grid>

    {/* Top Recommendations */}
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Recommendations
          </Typography>
          <Grid container spacing={2}>
            {/* Best for Traffic */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Best for Traffic
                </Typography>
                {data.suggestions
                  .filter(s => s.potential_volume === 'high')
                  .sort((a, b) => a.estimated_difficulty - b.estimated_difficulty)
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {suggestion.keyword}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Difficulty: {suggestion.estimated_difficulty}
                      </Typography>
                    </Box>
                  ))}
              </Paper>
            </Grid>

            {/* Best for Conversions */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <AutoAwesome sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Best for Conversions
                </Typography>
                {data.suggestions
                  .filter(s => s.intent === 'commercial' || s.intent === 'transactional')
                  .sort((a, b) => a.estimated_difficulty - b.estimated_difficulty)
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {suggestion.keyword}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {suggestion.intent}
                      </Typography>
                    </Box>
                  ))}
              </Paper>
            </Grid>

            {/* Low Competition */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Insights sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Low Competition
                </Typography>
                {data.suggestions
                  .filter(s => s.estimated_difficulty <= 40)
                  .sort((a, b) => b.potential_volume.localeCompare(a.potential_volume))
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {suggestion.keyword}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Volume: {suggestion.potential_volume}
                      </Typography>
                    </Box>
                  ))}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
)}
    </Box>
  );
}

export default KeywordResearch;
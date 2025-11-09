import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  Link,
  TrendingUp,
  Analytics,
  ContentCopy,
  Schedule,
  Email,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

// Safe data access helper functions
const safeGet = (obj, path, defaultValue = 'N/A') => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
};

const formatIndustry = (industry) => {
  if (!industry) return 'Industry Not Specified';
  return industry.replace(/_/g, ' ').toUpperCase();
};

function BacklinkStrategyView({ strategyData }) {
   
  if (!strategyData || !strategyData.success) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          No strategy data available or generation failed.
        </Alert>
      </Container>
    );
  }

  // Safe data extraction with fallbacks
  const websiteAnalysis = safeGet(strategyData.strategy, 'website_analysis', {});
  
  const industrySpecificSites = safeGet(strategyData.strategy, 'industry_specific_sites', {});
  const contentStrategy = safeGet(strategyData.strategy, 'content_strategy', {});
  const postingSchedule = safeGet(strategyData.strategy, 'posting_schedule', {});
  const platformStrategies = safeGet(strategyData.strategy, 'platform_strategies', {});
  const outreachTemplates = safeGet(strategyData.strategy, 'outreach_templates', {});
  const trackingMetrics = safeGet(strategyData.strategy, 'tracking_metrics', {});
  const riskMitigation = safeGet(strategyData.strategy, 'risk_mitigation', {});
  const timeline = safeGet(strategyData.strategy, 'timeline', []);
  
  const industryUsed = safeGet(strategyData.strategy, 'industry_used', '');
  const originalIndustry = safeGet(strategyData.strategy, 'original_industry', '');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Backlink Strategy Report
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive Backlink Strategy for {formatIndustry(industryUsed || originalIndustry)}
        </Typography>
      </Box>

      {/* Website Analysis Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Analytics /> Website Analysis
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {safeGet(websiteAnalysis, 'domain_authority', 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Domain Authority
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={safeGet(websiteAnalysis, 'domain_authority', 0)} 
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {safeGet(websiteAnalysis, 'backlink_count', 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Backlinks
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {safeGet(websiteAnalysis, 'referring_domains', 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Referring Domains
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {safeGet(websiteAnalysis, 'link_quality_score', '0%')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Link Quality Score
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Top Referring Domains */}
          {websiteAnalysis.top_referring_domains && websiteAnalysis.top_referring_domains.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Top Referring Domains
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Domain</TableCell>
                      <TableCell align="right">Domain Authority</TableCell>
                      <TableCell align="right">Links</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {websiteAnalysis.top_referring_domains.map((domain, index) => (
                      <TableRow key={index}>
                        <TableCell>{safeGet(domain, 'domain', 'Unknown')}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={safeGet(domain, 'da', 0)} 
                            size="small" 
                            color={domain.da > 60 ? 'success' : domain.da > 40 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">{safeGet(domain, 'links', 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Improvement Areas */}
          {websiteAnalysis.improvement_areas && websiteAnalysis.improvement_areas.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Improvement Areas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {websiteAnalysis.improvement_areas.map((area, index) => (
                  <Chip 
                    key={index}
                    label={area}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Industry Specific Sites */}
      {industrySpecificSites && Object.keys(industrySpecificSites).length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link /> Industry-Specific Target Sites
            </Typography>
            
            <Grid container spacing={3}>
              {/* High DA Sites */}
              {industrySpecificSites.high_da_sites && industrySpecificSites.high_da_sites.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>High DA Sites</Typography>
                  <List dense>
                    {industrySpecificSites.high_da_sites.map((site, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>•</ListItemIcon>
                        <ListItemText primary={site} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {/* Directories & Platforms */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Directories & Platforms</Typography>
                
                {industrySpecificSites.directories && industrySpecificSites.directories.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Directories ({industrySpecificSites.directories.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {industrySpecificSites.directories.map((dir, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>📁</ListItemIcon>
                            <ListItemText primary={dir} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {industrySpecificSites.blog_platforms && industrySpecificSites.blog_platforms.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Blog Platforms ({industrySpecificSites.blog_platforms.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {industrySpecificSites.blog_platforms.map((blog, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>📝</ListItemIcon>
                            <ListItemText primary={blog} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {industrySpecificSites.forums && industrySpecificSites.forums.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Forums ({industrySpecificSites.forums.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {industrySpecificSites.forums.map((forum, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>💬</ListItemIcon>
                            <ListItemText primary={forum} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Content Strategy */}
      {contentStrategy && Object.keys(contentStrategy).length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContentCopy /> Content Strategy
            </Typography>
            
            {contentStrategy.content_strategy && (
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                "{contentStrategy.content_strategy}"
              </Typography>
            )}

            {/* Content Calendar */}
            {contentStrategy.content_calendar && contentStrategy.content_calendar.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>Content Calendar - Month 1</Typography>
                <Grid container spacing={2}>
                  {contentStrategy.content_calendar[0].content_pieces.map((piece, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Chip label={safeGet(piece, 'type', 'Content')} color="primary" size="small" />
                          <Chip 
                            label={`${safeGet(piece, 'expected_backlinks', 0)} backlinks`} 
                            color="success" 
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {safeGet(piece, 'topic', 'No topic specified')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Target: {safeGet(piece, 'target_completion', 'Not specified')}
                        </Typography>
                        {piece.promotion_strategy && piece.promotion_strategy.length > 0 && (
                          <>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                              Promotion Strategy:
                            </Typography>
                            <List dense>
                              {piece.promotion_strategy.map((strategy, idx) => (
                                <ListItem key={idx} sx={{ py: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                                  <ListItemText primary={strategy} />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Content Creation Tips */}
            {contentStrategy.content_creation_tips && contentStrategy.content_creation_tips.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Content Creation Tips</Typography>
                <Grid container spacing={1}>
                  {contentStrategy.content_creation_tips.map((tip, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2">{tip}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Posting Schedule */}
      {postingSchedule && Object.keys(postingSchedule).length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule /> Activity Schedule
            </Typography>
            
            <Grid container spacing={3}>
              {/* Daily Activities */}
              {postingSchedule.daily_activities && postingSchedule.daily_activities.length > 0 && (
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Daily Activities
                    </Typography>
                    <List dense>
                      {postingSchedule.daily_activities.map((activity, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                          <ListItemText primary={activity} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}

              {/* Weekly Activities */}
              {postingSchedule.weekly_activities && postingSchedule.weekly_activities.length > 0 && (
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom color="secondary">
                      Weekly Activities
                    </Typography>
                    <List dense>
                      {postingSchedule.weekly_activities.map((activity, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                          <ListItemText primary={activity} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}

              {/* Monthly Activities */}
              {postingSchedule.monthly_activities && postingSchedule.monthly_activities.length > 0 && (
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Monthly Activities
                    </Typography>
                    <List dense>
                      {postingSchedule.monthly_activities.map((activity, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                          <ListItemText primary={activity} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {/* Weekly Breakdown */}
            {postingSchedule.weekly_breakdown && postingSchedule.weekly_breakdown.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Weekly Breakdown - Month 1
                </Typography>
                <Grid container spacing={2}>
                  {postingSchedule.weekly_breakdown.map((week, index) => (
                    <Grid item xs={12} md={6} lg={3} key={index}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Week {safeGet(week, 'week', index + 1)}
                          </Typography>
                          <Chip 
                            label={`${safeGet(week, 'target_backlinks', 0)} backlinks`} 
                            color="primary" 
                            size="small"
                          />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Focus: {safeGet(week, 'focus', 'General Activities')}
                        </Typography>
                        {week.key_activities && week.key_activities.length > 0 && (
                          <List dense>
                            {week.key_activities.map((activity, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                                <ListItemText primary={activity} primaryTypographyProps={{ variant: 'body2' }} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Platform Strategies */}
      {platformStrategies && Object.keys(platformStrategies).length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Platform-Specific Strategies
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(platformStrategies).map(([platform, strategy]) => (
                <Grid item xs={12} md={6} key={platform}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {platform}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Approach:</strong> {safeGet(strategy, 'approach', 'Not specified')}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Frequency:</strong> {safeGet(strategy, 'frequency', 'Not specified')}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Link Placement:</strong> {safeGet(strategy, 'link_placement', 'Not specified')}
                    </Typography>
                    {strategy.tips && strategy.tips.length > 0 && (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          Tips:
                        </Typography>
                        <List dense>
                          {strategy.tips.map((tip, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                              <ListItemText primary={tip} primaryTypographyProps={{ variant: 'body2' }} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Outreach Templates */}
      {outreachTemplates && Object.keys(outreachTemplates).length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email /> Outreach Templates
            </Typography>
            
            <Grid container spacing={3}>
              {Object.entries(outreachTemplates).map(([type, template]) => (
                <Grid item xs={12} md={6} key={type}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {type.replace(/_/g, ' ')}
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        fontFamily: 'monospace', 
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        maxHeight: 300,
                        overflow: 'auto'
                      }}
                    >
                      {template}
                    </Paper>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tracking & Risk Management */}
      <Grid container spacing={4}>
        {/* Tracking Metrics */}
        {trackingMetrics && Object.keys(trackingMetrics).length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp /> Tracking & Metrics
                </Typography>
                
                {trackingMetrics.key_metrics && trackingMetrics.key_metrics.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>Key Metrics</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {trackingMetrics.key_metrics.map((metric, index) => (
                        <Chip key={index} label={metric} variant="outlined" size="small" />
                      ))}
                    </Box>
                  </>
                )}

                {trackingMetrics.tracking_tools && trackingMetrics.tracking_tools.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>Tracking Tools</Typography>
                    <List dense>
                      {trackingMetrics.tracking_tools.map((tool, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>📊</ListItemIcon>
                          <ListItemText primary={tool} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {trackingMetrics.reporting_frequency && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Reporting Frequency: {trackingMetrics.reporting_frequency}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Risk Mitigation */}
        {riskMitigation && Object.keys(riskMitigation).length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning /> Risk Mitigation
                </Typography>
                
                {riskMitigation.black_hat_risks && riskMitigation.black_hat_risks.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom color="error">
                      Avoid These Practices
                    </Typography>
                    <List dense>
                      {riskMitigation.black_hat_risks.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ color: 'error.main' }}>❌</ListItemIcon>
                          <ListItemText primary={risk} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {riskMitigation.white_hat_practices && riskMitigation.white_hat_practices.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Recommended Practices
                    </Typography>
                    <List dense>
                      {riskMitigation.white_hat_practices.map((practice, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ color: 'success.main' }}>✅</ListItemIcon>
                          <ListItemText primary={practice} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {riskMitigation.quality_indicators && riskMitigation.quality_indicators.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>Quality Indicators</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {riskMitigation.quality_indicators.map((indicator, index) => (
                        <Chip key={index} label={indicator} color="success" variant="outlined" size="small" />
                      ))}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Implementation Timeline
            </Typography>
            <Grid container spacing={3}>
              {timeline.map((month, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Month {safeGet(month, 'month', index + 1)}
                    </Typography>
                    {month.focus_areas && (
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Focus: {month.focus_areas.join(', ')}
                      </Typography>
                    )}
                    
                    {month.deliverables && month.deliverables.length > 0 && (
                      <>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                          Deliverables:
                        </Typography>
                        <List dense>
                          {month.deliverables.map((deliverable, idx) => (
                            <ListItem key={idx}>
                              <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                              <ListItemText primary={deliverable} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}

                    {month.success_metrics && month.success_metrics.length > 0 && (
                      <>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                          Success Metrics:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {month.success_metrics.map((metric, idx) => (
                            <Chip key={idx} label={metric} color="primary" size="small" variant="outlined" />
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default BacklinkStrategyView;
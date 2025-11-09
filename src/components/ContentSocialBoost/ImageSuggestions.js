// src/components/ImageSuggestions/ImageSuggestions.jsx
import React, { useState, useEffect } from 'react';
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
  CardMedia,
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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ExpandMore,
  Image,
  Search,
  Palette,
  Link,
  Info,
  Download,
  OpenInNew,
  Style,
  Collections
} from '@mui/icons-material';
import { useImageSuggestions } from '../ContentSocialBoost/useImageSuggestions';

const ImageSuggestions = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [imageCount, setImageCount] = useState(5);
  const [style, setStyle] = useState('realistic');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCount, setSearchCount] = useState(10);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    loading,
    error,
    suggestions,
    searchResults,
    aiTools,
    sources,
    suggestImages,
    searchImages,
    getAITools,
    getImageSources,
    resetError
  } = useImageSuggestions();

  useEffect(() => {
    if (activeTab === 2) {
      getAITools();
    }
    if (activeTab === 3) {
      getImageSources();
    }
  }, [activeTab, getAITools, getImageSources]);

  const handleSuggestImages = async () => {
    if (!topic.trim()) return;
    await suggestImages(topic, content, imageCount, style);
  };

  const handleSearchImages = async () => {
    if (!searchQuery.trim()) return;
    await searchImages(searchQuery, searchCount);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const downloadImage = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const ImageCard = ({ image, index }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={image.url || `https://picsum.photos/400/200?random=${index}`}
        alt={image.description || `Image suggestion ${index + 1}`}
        sx={{ objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => setSelectedImage(image)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
          {image.title || `Suggestion ${index + 1}`}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {image.description || 'No description available'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {image.keywords?.slice(0, 3).map((keyword, idx) => (
            <Chip key={idx} label={keyword} size="small" variant="outlined" />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip title="Download image">
            <IconButton
              size="small"
              onClick={() => downloadImage(image.url, image.title)}
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in new tab">
            <IconButton
              size="small"
              onClick={() => window.open(image.url, '_blank')}
            >
              <OpenInNew />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Image Suggestions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={resetError}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Image />} label="Suggest Images" />
          <Tab icon={<Search />} label="Search Images" />
          <Tab icon={<Palette />} label="AI Tools" />
          <Tab icon={<Collections />} label="Sources" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Generate Image Suggestions
              </Typography>

              <TextField
                fullWidth
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., digital marketing, technology, nature..."
                margin="normal"
                required
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Content Context (Optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your content for better suggestions..."
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Style</InputLabel>
                <Select
                  value={style}
                  label="Style"
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <MenuItem value="realistic">Realistic</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="minimal">Minimal</MenuItem>
                  <MenuItem value="abstract">Abstract</MenuItem>
                  <MenuItem value="vibrant">Vibrant</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography gutterBottom>
                  Number of Images: {imageCount}
                </Typography>
                <Slider
                  value={imageCount}
                  onChange={(e, newValue) => setImageCount(newValue)}
                  min={1}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleSuggestImages}
                disabled={loading || !topic.trim()}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <Image />}
              >
                {loading ? 'Generating...' : 'Suggest Images'}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Suggested Images
              </Typography>

              {suggestions?.suggestions ? (
                <Grid container spacing={2}>
                  {suggestions.suggestions.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ImageCard image={image} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Image sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Enter a topic and click "Suggest Images" to get started
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Search Free Images
              </Typography>

              <TextField
                fullWidth
                label="Search Query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., business, nature, technology..."
                margin="normal"
                required
              />

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography gutterBottom>
                  Number of Results: {searchCount}
                </Typography>
                <Slider
                  value={searchCount}
                  onChange={(e, newValue) => setSearchCount(newValue)}
                  min={1}
                  max={30}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleSearchImages}
                disabled={loading || !searchQuery.trim()}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Searching...' : 'Search Images'}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Search Results
              </Typography>

              {searchResults?.images ? (
                <Grid container spacing={2}>
                  {searchResults.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ImageCard image={image} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Search sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Enter a search query to find free images
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && aiTools?.tools && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Free AI Image Generation Tools
          </Typography>
          <Grid container spacing={3}>
            {aiTools.tools.map((tool, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tool.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {tool.features?.map((feature, idx) => (
                      <Chip key={idx} label={feature} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                  >
                    Visit Website
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {activeTab === 3 && sources?.sources && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Free Image Sources
          </Typography>
          <Grid container spacing={3}>
            {sources.sources.map((source, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    {source.name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {source.license} • {source.api_access}
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Link fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={source.url} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Info fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={source.limitations} />
                    </ListItem>
                  </List>
                  <Button
                    variant="outlined"
                    size="small"
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                  >
                    Visit Source
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedImage?.title || 'Image Preview'}
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box>
              <img
                src={selectedImage.url}
                alt={selectedImage.description}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>
                {selectedImage.description}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedImage.keywords?.map((keyword, idx) => (
                  <Chip key={idx} label={keyword} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => downloadImage(selectedImage?.url, selectedImage?.title)}
            startIcon={<Download />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ImageSuggestions;
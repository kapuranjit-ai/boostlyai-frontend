// src/components/SEOChatbot.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { seoAPI } from '../../services/api';

const SEOChatbot = ({ open, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [suggestedImprovement, setSuggestedImprovement] = useState('');
  const [newConversationDialogOpen, setNewConversationDialogOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Default questions for the SEO chatbot
  const defaultQuestions = [
    "How can I improve my website's SEO?",
    "What are the best keywords for my content?",
    "How do I optimize meta tags?",
    "What's the ideal keyword density?",
    "How can I analyze my competitors' SEO strategy?",
    "What are the latest SEO trends?",
    "How do I improve my website's loading speed for SEO?",
    "What's the best way to structure URLs for SEO?"
  ];

  // Initial bot message with default questions
  const initialBotMessage = {
    id: 1,
    content: "Hi! I'm your SEO assistant. I can help you with various SEO tasks. What would you like to know about?",
    sender: 'bot',
    timestamp: new Date()
  };

  // Load conversations when chatbot opens
  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      // Try to load conversations from API
      const response = await seoAPI.getConversations();
      setConversations(response.data);
      
      // If there are conversations, set the first one as active
      if (response.data.length > 0) {
        setActiveConversation(response.data[0]);
        loadMessages(response.data[0].id);
      } else {
        // No conversations yet, show initial message
        setMessages([initialBotMessage]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Even if API fails, show initial message
      setMessages([initialBotMessage]);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      // Try to load messages from API
      const response = await seoAPI.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      // If API fails, show initial message
      setMessages([initialBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call your API endpoint: POST /seo-chatbot/chat
      const response = await seoAPI.chat({
        conversation_id: activeConversation?.id || 0,
        message: inputMessage
      });

      // Add bot response to UI
      const botMessage = {
        id: Date.now() + 1,
        content: response.data.response || response.data.message || "I'm here to help with SEO! Ask me anything about search engine optimization.",
        sender: 'bot',
        timestamp: new Date(),
        messageId: response.data.message_id // Store for feedback
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add demo response for SEO questions
      const demoResponse = {
        id: Date.now() + 1,
        content: getSEODemoResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, demoResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate demo responses for SEO questions
  const getSEODemoResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('keyword') || lowerQuestion.includes('seo')) {
      return "For keyword research, I recommend using tools like Google Keyword Planner, SEMrush, or Ahrefs. Focus on long-tail keywords with decent search volume and lower competition. Also consider user intent when selecting keywords.";
    } else if (lowerQuestion.includes('meta') || lowerQuestion.includes('tag')) {
      return "Meta tags should be concise and descriptive. Title tags should be under 60 characters and include primary keywords. Meta descriptions should be under 160 characters and provide a compelling summary of your content.";
    } else if (lowerQuestion.includes('content') || lowerQuestion.includes('blog')) {
      return "High-quality, original content is essential for SEO. Focus on creating comprehensive content that answers user queries better than competing pages. Use headings properly, include relevant keywords naturally, and make sure your content is easy to read.";
    } else if (lowerQuestion.includes('technical') || lowerQuestion.includes('speed')) {
      return "Technical SEO includes site speed optimization, mobile responsiveness, proper URL structure, XML sitemaps, and fixing crawl errors. Use tools like Google PageSpeed Insights and Search Console to identify technical issues.";
    } else if (lowerQuestion.includes('backlink') || lowerQuestion.includes('link')) {
      return "Quality backlinks from authoritative sites are important for SEO. Focus on creating link-worthy content, guest posting on reputable sites, and building relationships with influencers in your industry.";
    } else if (lowerQuestion.includes('local') || lowerQuestion.includes('google my business')) {
      return "For local SEO, claim your Google My Business listing, ensure NAP (Name, Address, Phone) consistency across directories, get positive reviews, and optimize for local keywords.";
    } else {
      return "I'm here to help with all aspects of SEO including keyword research, on-page optimization, technical SEO, content strategy, and analytics. What specific area would you like to learn more about?";
    }
  };

  const handleCreateConversation = async () => {
    if (!newConversationTitle.trim()) return;

    try {
      // Call your API endpoint: POST /seo-chatbot/conversations
      const response = await seoAPI.createConversation({
        title: newConversationTitle,
        project_id: null
      });

      setConversations(prev => [...prev, response.data]);
      setActiveConversation(response.data);
      setMessages([initialBotMessage]);
      setNewConversationDialogOpen(false);
      setNewConversationTitle('');
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Create a demo conversation
      const demoConversation = {
        id: Date.now(),
        title: newConversationTitle,
        created_at: new Date().toISOString()
      };
      
      setConversations(prev => [...prev, demoConversation]);
      setActiveConversation(demoConversation);
      setMessages([initialBotMessage]);
      setNewConversationDialogOpen(false);
      setNewConversationTitle('');
    }
  };

  const handleFeedback = async () => {
    if (!selectedMessage) return;

    try {
      // Call your API endpoint: POST /seo-chatbot/feedback
      await seoAPI.addFeedback({
        message_id: selectedMessage.messageId || Date.now(),
        rating: feedbackRating,
        feedback_text: feedbackText,
        suggested_improvement: suggestedImprovement
      });

      setFeedbackDialogOpen(false);
      setFeedbackRating(0);
      setFeedbackText('');
      setSuggestedImprovement('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestionClick = (question) => {
    setInputMessage(question);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '500px', md: '600px' },
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">SEO Assistant</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Chat Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ 
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                py: 1
              }}>
                <Avatar sx={{ 
                  mx: 1, 
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                  width: 32, 
                  height: 32 
                }}>
                  {message.sender === 'user' ? 'U' : 'A'}
                </Avatar>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  {message.sender === 'bot' && message.messageId && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton 
                        size="small" 
                        color={feedbackRating === 1 ? 'success' : 'default'}
                        onClick={() => {
                          setSelectedMessage(message);
                          setFeedbackRating(1);
                          setFeedbackDialogOpen(true);
                        }}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color={feedbackRating === -1 ? 'error' : 'default'}
                        onClick={() => {
                          setSelectedMessage(message);
                          setFeedbackRating(-1);
                          setFeedbackDialogOpen(true);
                        }}
                      >
                        <ThumbDownIcon />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <Avatar sx={{ mx: 1, bgcolor: 'secondary.main', width: 32, height: 32 }}>A</Avatar>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <CircularProgress size={20} />
                </Paper>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>

          {/* Default Questions */}
          {messages.length <= 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Try asking me:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {defaultQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => handleQuestionClick(question)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about SEO..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
              sx={{ mr: 1 }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              <SendIcon />
            </IconButton>
          </Box>
          <Button 
            startIcon={<AddIcon />}
            onClick={() => setNewConversationDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            New Conversation
          </Button>
        </Box>
      </Box>

      {/* New Conversation Dialog */}
      <Dialog open={newConversationDialogOpen} onClose={() => setNewConversationDialogOpen(false)}>
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Conversation Title"
            fullWidth
            variant="outlined"
            value={newConversationTitle}
            onChange={(e) => setNewConversationTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateConversation()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewConversationDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateConversation} 
            disabled={!newConversationTitle.trim()}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
        <DialogTitle>Provide Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            How would you rate this response?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <IconButton 
              color={feedbackRating === 1 ? 'success' : 'default'}
              onClick={() => setFeedbackRating(1)}
              size="large"
            >
              <ThumbUpIcon />
            </IconButton>
            <IconButton 
              color={feedbackRating === -1 ? 'error' : 'default'}
              onClick={() => setFeedbackRating(-1)}
              size="large"
            >
              <ThumbDownIcon />
            </IconButton>
          </Box>
          <TextField
            margin="dense"
            label="Additional Feedback (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Suggested Improvement (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={suggestedImprovement}
            onChange={(e) => setSuggestedImprovement(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFeedback} variant="contained">Submit Feedback</Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default SEOChatbot;
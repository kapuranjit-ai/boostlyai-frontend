// src/components/SEOChatbotWidget.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Fab,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  History as HistoryIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { seoAPI } from '../../services/api';

const SEOChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [suggestedImprovement, setSuggestedImprovement] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [newConversationDialogOpen, setNewConversationDialogOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [conversationsMenuAnchor, setConversationsMenuAnchor] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [requiresNewConversation, setRequiresNewConversation] = useState(false);
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

  // Load conversations when component mounts
  useEffect(() => {
    loadConversations();
  }, []);

  // Check if we need to create a new conversation when widget opens
  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      setRequiresNewConversation(true);
      setNewConversationDialogOpen(true);
    }
  }, [isOpen, conversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await seoAPI.getConversations();
      setConversations(response.data);
      
      // Set the first conversation as active if available
      if (response.data.length > 0 && !activeConversation) {
        setActiveConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations. Please try again.');
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      // This would call your API endpoint to get messages for a conversation
      const response = await seoAPI.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      // If no messages exist, show the initial bot message
      setMessages([{
        id: 1,
        content: "Hi! I'm your SEO assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation) return;

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
        conversation_id: activeConversation.id,
        message: inputMessage
      });

      // Extract the assistant_response from the API response
      const assistantResponse = response.data.assistant_response || 
                               response.data.response || 
                               response.data.message || 
                               "I'm here to help with SEO! Ask me anything about search engine optimization.";

      // Add bot response to UI
      const botMessage = {
        id: Date.now() + 1,
        content: assistantResponse,
        sender: 'bot',
        timestamp: new Date(),
        messageId: response.data.message_id // Store for feedback
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Refresh conversations to update the list
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to demo response if API call fails
      const demoResponse = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, demoResponse]);
    } finally {
      setIsLoading(false);
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
      setMessages([{
        id: 1,
        content: "Hi! I'm your SEO assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
      setNewConversationDialogOpen(false);
      setRequiresNewConversation(false);
      setNewConversationTitle('');
      setSuccess('New conversation created successfully!');
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to create conversation. Please try again.');
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
      setSuccess('Feedback submitted successfully!');
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
    if (!activeConversation) {
      setError('Please create a conversation first');
      setNewConversationDialogOpen(true);
      return;
    }
    setInputMessage(question);
  };

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    setConversationsMenuAnchor(null);
  };

  const handleNewConversation = () => {
    setNewConversationDialogOpen(true);
    setConversationsMenuAnchor(null);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    setRequiresNewConversation(false);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      {/* Chatbot Widget */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper 
          elevation={8} 
          sx={{ 
            width: 350, 
            height: 500, 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">SEO Assistant</Typography>
              {conversations.length > 0 && (
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', ml: 1 }} 
                  onClick={(e) => setConversationsMenuAnchor(e.currentTarget)}
                >
                  <HistoryIcon />
                </IconButton>
              )}
            </Box>
            <IconButton 
              size="small" 
              sx={{ color: 'white' }} 
              onClick={handleCloseWidget}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Conversations Menu */}
          <Menu
            anchorEl={conversationsMenuAnchor}
            open={Boolean(conversationsMenuAnchor)}
            onClose={() => setConversationsMenuAnchor(null)}
          >
            <MenuItem onClick={handleNewConversation}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Conversation</ListItemText>
            </MenuItem>
            <Divider />
            {conversations.map((conversation) => (
              <MenuItem 
                key={conversation.id} 
                onClick={() => handleConversationSelect(conversation)}
                selected={activeConversation?.id === conversation.id}
              >
                <ListItemText primary={conversation.title} />
              </MenuItem>
            ))}
          </Menu>

          {/* Chat Messages */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2, 
            bgcolor: 'grey.50',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {!activeConversation ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <Typography variant="h6" gutterBottom>
                  Welcome to SEO Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create a new conversation to get started with SEO assistance
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setNewConversationDialogOpen(true)}
                  startIcon={<AddIcon />}
                >
                  New Conversation
                </Button>
              </Box>
            ) : (
              <>
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {messages.map((message) => (
                    <ListItem key={message.id} sx={{ 
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      py: 1,
                      px: 1
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
                          p: 1.5, 
                          maxWidth: '70%',
                          bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                          color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7, mr: 1 }}>
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                        {message.sender === 'bot' && message.messageId && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                            <IconButton 
                              size="small" 
                              color={feedbackRating === 1 ? 'success' : 'default'}
                              onClick={() => {
                                setSelectedMessage(message);
                                setFeedbackRating(1);
                                setFeedbackDialogOpen(true);
                              }}
                            >
                              <ThumbUpIcon fontSize="small" />
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
                              <ThumbDownIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Paper>
                    </ListItem>
                  ))}
                  {isLoading && (
                    <ListItem sx={{ justifyContent: 'flex-start', px: 1 }}>
                      <Avatar sx={{ mx: 1, bgcolor: 'secondary.main', width: 32, height: 32 }}>A</Avatar>
                      <Paper elevation={1} sx={{ p: 1.5 }}>
                        <CircularProgress size={16} />
                      </Paper>
                    </ListItem>
                  )}
                  <div ref={messagesEndRef} />
                </List>

                {/* Default Questions */}
                {messages.length <= 1 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Try asking me:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {defaultQuestions.map((question, index) => (
                        <Chip
                          key={index}
                          label={question}
                          onClick={() => handleQuestionClick(question)}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 0.5, fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Input Area */}
          {activeConversation && (
            <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask about SEO..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="small"
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Paper>
      </Slide>

      {/* Chatbot Icon */}
      {!isOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* New Conversation Dialog */}
      <Dialog 
        open={newConversationDialogOpen} 
        onClose={() => {
          setNewConversationDialogOpen(false);
          if (requiresNewConversation && !activeConversation) {
            setIsOpen(false);
          }
        }}
      >
        <DialogTitle>
          {requiresNewConversation ? 'Create Your First Conversation' : 'Start New Conversation'}
        </DialogTitle>
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
          <Button 
            onClick={() => {
              setNewConversationDialogOpen(false);
              if (requiresNewConversation && !activeConversation) {
                setIsOpen(false);
              }
            }}
          >
            Cancel
          </Button>
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

      {/* Snackbars for notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SEOChatbotWidget;
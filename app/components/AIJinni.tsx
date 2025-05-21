'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Info, X, Send, ArrowDown, ArrowUp, Mic, StopCircle, Play, Pause, Globe } from 'lucide-react';

interface AIJinniProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: any[];
  addToComposer?: (text: string) => void;
}

// Message interface with optional audio
interface JinniMessage {
  question: string;
  answer: string;
  audio?: string;
}

export default function AIJinni({ isOpen, onClose, conversation, addToComposer }: AIJinniProps) {
  const [activeTab, setActiveTab] = useState<'jinni' | 'details'>('jinni');
  const [question, setQuestion] = useState('');
  const [jinniResponses, setJinniResponses] = useState<JinniMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [translatedMessages, setTranslatedMessages] = useState<{[key: string]: string}>({});
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs for scrolling
  const jinniMessagesEndRef = useRef<HTMLDivElement>(null);
  const jinniMessagesStartRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  
  // Audio player ref
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // Check scroll position and update button visibility
  useEffect(() => {
    const checkScroll = () => {
      if (conversationRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
        
        // Show scroll down button if not at bottom
        setShowScrollDown(scrollHeight - scrollTop - clientHeight > 30);
        
        // Show scroll up button if not at top
        setShowScrollUp(scrollTop > 30);
      }
    };
    
    const conversationElement = conversationRef.current;
    if (conversationElement) {
      conversationElement.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }
    
    return () => {
      if (conversationElement) {
        conversationElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, [jinniResponses]);
  
  // Scroll to bottom of messages when new ones are added (but only if already at bottom)
  useEffect(() => {
    if (jinniMessagesEndRef.current && conversationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
      
      if (isAtBottom || isTyping) {
        jinniMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [jinniResponses, isTyping]);

  // Reset scroll position when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);
  
  // Scroll to bottom function
  const scrollToBottom = () => {
    jinniMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    jinniMessagesStartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Function to copy a message to the chat input
  const handleMessageToComposer = (text: string) => {
    if (addToComposer) {
      addToComposer(text);
    }
  };
  
  // Dynamic content based on conversation
  const getRelevantContent = () => {
    // Look at the messages to determine the topic
    const messages = conversation || [];
    const messageText = messages.map(m => m.message.toLowerCase()).join(' ');
    
    // Different content based on topic detection
    if (messageText.includes('refund') || messageText.includes('money back') || messageText.includes('return')) {
      return {
        title: 'Refund Policy Information',
        content: `We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.

Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.`,
        sources: [
          { id: '1', title: 'Getting a refund', icon: 'document' },
          { id: '2', title: 'Refund for an order placed by mistake', icon: 'document' },
          { id: '3', title: 'Refund for an unwanted gift', icon: 'document' },
          { id: '4', title: 'Processing a refund', icon: 'lock' },
          { id: '5', title: 'Refunding an order placed over 60 days ago', icon: 'document' },
          { id: '6', title: 'Dealing with refund disputes', icon: 'lock' }
        ]
      };
    } else if (messageText.includes('subscription') || messageText.includes('upgrade')) {
      return {
        title: 'Subscription Information',
        content: `Our subscription plans range from Basic ($10/month) to Premium ($50/month) and Enterprise ($99/month).

Each upgrade includes additional features such as increased API limits, priority support, and advanced analytics. You can upgrade at any time, and the new charges will be prorated for your billing period.`,
        sources: [
          { id: '1', title: 'Subscription plans overview', icon: 'document' },
          { id: '2', title: 'Upgrading your plan', icon: 'document' },
          { id: '3', title: 'Enterprise features', icon: 'document' },
          { id: '4', title: 'Billing and payment', icon: 'lock' }
        ]
      };
    } else if (messageText.includes('account') || messageText.includes('login') || messageText.includes('password')) {
      return {
        title: 'Account Help',
        content: `If you're having trouble accessing your account, we can help you reset your password or recover your account information.

For security purposes, password resets will send a verification link to your registered email address. If you no longer have access to that email, please provide an alternative verification method.`,
        sources: [
          { id: '1', title: 'Password reset guide', icon: 'document' },
          { id: '2', title: 'Account recovery options', icon: 'document' },
          { id: '3', title: 'Two-factor authentication', icon: 'document' },
          { id: '4', title: 'Account security best practices', icon: 'lock' }
        ]
      };
    } else if (messageText.includes('order') || messageText.includes('shipping') || messageText.includes('delivery')) {
      return {
        title: 'Order Status Information',
        content: `Your order typically ships within 1-2 business days after being placed. Once shipped, delivery times vary:
        
- Standard shipping: 3-5 business days
- Express shipping: 1-2 business days
        
You can track your order status at any time through your account dashboard. If your order appears delayed beyond these timeframes, please let me know your order number so I can investigate.`,
        sources: [
          { id: '1', title: 'Tracking your order', icon: 'document' },
          { id: '2', title: 'Shipping timeframes', icon: 'document' },
          { id: '3', title: 'International shipping', icon: 'document' },
          { id: '4', title: 'Shipping delays FAQ', icon: 'document' }
        ]
      };
    } else {
      return {
        title: 'General Information',
        content: `I'm here to help with any questions you might have about our products, services, account management, or technical support.

Please let me know what specific information you're looking for, and I'll be happy to assist or connect you with the right resources.`,
        sources: [
          { id: '1', title: 'Frequently asked questions', icon: 'document' },
          { id: '2', title: 'Product guides', icon: 'document' },
          { id: '3', title: 'Contact support', icon: 'document' }
        ]
      };
    }
  };
  
  const handleAddToComposer = () => {
    if (addToComposer) {
      addToComposer(relevantContent.content);
      // Show visual confirmation
      const button = document.getElementById('add-to-composer-btn');
      if (button) {
        button.classList.add('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');
        button.textContent = "Added ✓";
        setTimeout(() => {
          button.classList.remove('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');
          button.textContent = "Add to composer";
        }, 2000);
      }
    }
  };
  
  const handleSendQuestion = () => {
    if (!question.trim()) return;
    
    const userQuestion = question.trim();
    setQuestion('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let responseText = '';
      
      // Generate contextual responses based on question
      if (userQuestion.toLowerCase().includes('refund')) {
        responseText = "To process a refund, I need your order number and the reason for the return. Once approved, you'll receive a QR code for return shipping, and your refund will be processed within 5-7 business days after we receive the returned item.";
      } else if (userQuestion.toLowerCase().includes('shipping') || userQuestion.toLowerCase().includes('delivery')) {
        responseText = "Shipping typically takes 3-5 business days for standard orders and 1-2 days for express. International orders may take 7-14 days depending on the destination. Is there a specific order you'd like me to track?";
      } else if (userQuestion.toLowerCase().includes('password') || userQuestion.toLowerCase().includes('login')) {
        responseText = "I can help you reset your password. We'll send a secure link to your registered email address. For security reasons, this link will expire in 24 hours. Would you like me to initiate a password reset for you?";
      } else if (userQuestion.toLowerCase().includes('subscription') || userQuestion.toLowerCase().includes('upgrade')) {
        responseText = "You can upgrade your subscription at any time from your account settings. The pricing difference will be prorated for the remainder of your billing cycle. Would you like me to walk you through the specific steps?";
      } else {
        responseText = "Thank you for your question. I've found some information that might help. Is there anything specific about this topic you'd like me to explain in more detail?";
      }
      
      setJinniResponses(prev => [...prev, { question: userQuestion, answer: responseText }]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle recording timer updates
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);
  
  // Format recording time (mm:ss)
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Start recording function
  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingTime(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Process the voice message
        processVoiceMessage(audioUrl);
      };
      
      // Request data every second to ensure we capture audio
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Add error to jinni responses to notify user
      setJinniResponses(prev => [
        ...prev,
        {
          question: "Failed to access microphone",
          answer: "I couldn't access your microphone. Please check your browser permissions and make sure you've allowed microphone access for this site. You might need to reload the page after granting permission."
        }
      ]);
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Process voice message
  const processVoiceMessage = (audioUrl: string) => {
    // Add voice message to conversation
    const voiceMessageText = "🎤 Voice message";
    
    // Simulate AI processing the voice message
    setIsTyping(true);
    
    // First add the user's voice message
    setJinniResponses(prev => [
      ...prev, 
      { 
        question: voiceMessageText, 
        answer: "", // Placeholder, will be filled by the response
        audio: audioUrl 
      }
    ]);
    
    // Then simulate AI response after a short delay
    setTimeout(() => {
      // Generate appropriate response for voice messages
      const responseText = "I've received your voice message. I'm currently limited in processing voice content, but I'd be happy to help if you could type your question.";
      
      // Update the last response
      setJinniResponses(prev => {
        const updated = [...prev];
        updated[updated.length - 1].answer = responseText;
        return updated;
      });
      
      setIsTyping(false);
    }, 2000);
  };
  
  // Handle audio playback
  const toggleAudioPlay = (audioUrl: string) => {
    if (currentlyPlaying === audioUrl) {
      // Pause current audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Play new audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play();
        setCurrentlyPlaying(audioUrl);

        // Add event listener for when audio ends
        audioPlayerRef.current.onended = () => {
          setCurrentlyPlaying(null);
        };
      }
    }
  };
  
  // Translate message
  const translateMessage = (messageId: string, text: string) => {
    if (translatedMessages[messageId]) {
      return;
    }
    
    // Simulate API call to translation service
    setTimeout(() => {
      // Mock translations
      const translations: {[key: string]: {[key: string]: string}} = {
        'es': {
          '🎤 Voice message': '🎤 Mensaje de voz',
          'I\'ve received your voice message. I\'m currently limited in processing voice content, but I\'d be happy to help if you could type your question.': 'He recibido tu mensaje de voz. Actualmente tengo limitaciones para procesar contenido de voz, pero estaré encantado de ayudarte si puedes escribir tu pregunta.'
        },
        'fr': {
          '🎤 Voice message': '🎤 Message vocal',
          'I\'ve received your voice message. I\'m currently limited in processing voice content, but I\'d be happy to help if you could type your question.': 'J\'ai reçu votre message vocal. Je suis actuellement limité dans le traitement du contenu vocal, mais je serais ravi de vous aider si vous pouviez taper votre question.'
        },
        'de': {
          '🎤 Voice message': '🎤 Sprachnachricht',
          'I\'ve received your voice message. I\'m currently limited in processing voice content, but I\'d be happy to help if you could type your question.': 'Ich habe deine Sprachnachricht erhalten. Ich bin derzeit bei der Verarbeitung von Sprachinhalten eingeschränkt, aber ich helfe dir gerne, wenn du deine Frage eintippen könntest.'
        },
        'hi': {
          '🎤 Voice message': '🎤 वॉइस संदेश',
          'I\'ve received your voice message. I\'m currently limited in processing voice content, but I\'d be happy to help if you could type your question.': 'मैंने आपका वॉइस मैसेज प्राप्त कर लिया है। मैं वर्तमान में ध्वनि सामग्री को संसाधित करने में सीमित हूं, लेकिन अगर आप अपना प्रश्न टाइप कर सकते हैं तो मैं सहायता करने में प्रसन्न होऊंगा।'
        }
      };
      
      // Get translation or fallback to original
      const translation = translations[targetLanguage]?.[text] || text;
      
      setTranslatedMessages(prev => ({
        ...prev,
        [messageId]: translation
      }));
    }, 500);
  };
  
  const relevantContent = getRelevantContent();
  
  return (
    <motion.div 
      className="flex flex-col h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full md:max-w-md transition-colors"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: isOpen ? 0 : '100%', opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button 
            className={`px-3 py-1 text-sm font-medium ${
              activeTab === 'jinni' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('jinni')}
          >
            AI Jinni
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium ${
              activeTab === 'details' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <button 
              className={`p-1.5 rounded-md ${Object.keys(translatedMessages).length > 0 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}
              title="Translation language"
            >
              <Globe size={16} />
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="p-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Translate to:</p>
                <div className="space-y-1">
                  {['es', 'fr', 'de', 'hi'].map((lang) => (
                    <button
                      key={lang}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center justify-between ${
                        targetLanguage === lang 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => {
                        setTargetLanguage(lang);
                        setTranslatedMessages({});
                      }}
                    >
                      <span>
                        {lang === 'es' ? 'Spanish' : 
                         lang === 'fr' ? 'French' : 
                         lang === 'de' ? 'German' : 
                         'Hindi'}
                      </span>
                      {targetLanguage === lang && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            onClick={onClose}
            aria-label="Close AI Jinni"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div ref={contentRef} className="flex-1 overflow-y-auto p-4 jinni-scrollbar">
        {activeTab === 'jinni' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-6 md:py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">AI</span>
                </div>
                <h3 className="text-lg font-medium dark:text-white">Hi, I'm AI Jinni</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
                  Ask me anything about this conversation.
                </p>
              </div>
            </div>
            
            {/* Hidden audio player for voice messages */}
            <audio ref={audioPlayerRef} className="hidden" />
            
            {/* Updated conversation container with scroll controls */}
            {jinniResponses.length > 0 && (
              <div className="relative">
                <div 
                  ref={conversationRef} 
                  className="space-y-4 mb-4 max-h-[calc(40vh-80px)] overflow-y-auto pr-1 pb-2 conversation-container" 
                >
                  <div ref={jinniMessagesStartRef} />
                  
                  {jinniResponses.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className={`bg-gray-100 dark:bg-gray-700 p-2 rounded-lg rounded-br-none max-w-[85%] ml-auto ${item.audio ? 'voice-message-bubble' : ''}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {translatedMessages[`q-${index}`] || item.question}
                          </p>
                          {item.audio && (
                            <div className="flex items-center">
                              {item.question === "🎤 Voice message" && !translatedMessages[`q-${index}`] && (
                                <button 
                                  onClick={() => translateMessage(`q-${index}`, item.question)}
                                  className="mr-1 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                                  title="Translate voice message"
                                >
                                  <Globe size={12} />
                                </button>
                              )}
                              <button 
                                onClick={() => toggleAudioPlay(item.audio!)}
                                className={`flex items-center justify-center w-8 h-8 rounded-full audio-player-button ${
                                  currentlyPlaying === item.audio
                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                }`}
                              >
                                {currentlyPlaying === item.audio ? (
                                  <Pause size={16} />
                                ) : (
                                  <Play size={16} />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                        {translatedMessages[`q-${index}`] && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {targetLanguage === 'es' ? 'Traducido' : 
                             targetLanguage === 'fr' ? 'Traduit' : 
                             targetLanguage === 'de' ? 'Übersetzt' : 'अनुवादित'}
                          </div>
                        )}
                      </div>
                      {item.answer && (
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg rounded-bl-none max-w-[85%] relative group">
                          <p className="text-sm text-gray-800 dark:text-blue-100">
                            {translatedMessages[`a-${index}`] || item.answer}
                          </p>
                          
                          <div className="flex items-center justify-between mt-1">
                            {item.audio && !translatedMessages[`a-${index}`] && (
                              <button 
                                onClick={() => translateMessage(`a-${index}`, item.answer)}
                                className="p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/30 text-gray-500 dark:text-gray-400"
                                title="Translate response"
                              >
                                <Globe size={12} />
                              </button>
                            )}
                            
                            {/* Copy button that appears on hover */}
                            {item.answer && (
                              <button 
                                onClick={() => handleMessageToComposer(item.answer)}
                                className="hidden group-hover:block absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 text-xs text-gray-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                title="Copy to chat"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          {translatedMessages[`a-${index}`] && (
                            <div className="mt-1 text-xs text-blue-500/70 dark:text-blue-300/70">
                              {targetLanguage === 'es' ? 'Traducido' : 
                               targetLanguage === 'fr' ? 'Traduit' : 
                               targetLanguage === 'de' ? 'Übersetzt' : 'अनुवादित'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg rounded-bl-none inline-flex items-center space-x-1 max-w-[85%]">
                      <span className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  )}
                  <div ref={jinniMessagesEndRef} />
                </div>
                
                {/* Scroll control buttons */}
                <div className="absolute right-0 bottom-0 flex flex-col space-y-2">
                  {showScrollUp && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={scrollToTop}
                      className="bg-blue-500 dark:bg-blue-600 text-white p-1.5 rounded-full shadow-md z-10"
                      title="Scroll to top"
                    >
                      <ArrowUp size={14} />
                    </motion.button>
                  )}
                  {showScrollDown && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={scrollToBottom}
                      className="bg-blue-500 dark:bg-blue-600 text-white p-1.5 rounded-full shadow-md z-10"
                      title="Scroll to bottom"
                    >
                      <ArrowDown size={14} />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
            
            {/* Dynamic content box */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 md:p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="max-h-48 overflow-y-auto pr-1 jinni-scrollbar">
                <p className="text-purple-800 dark:text-purple-300 text-sm md:text-base">
                  {relevantContent.title}:
                  <br /><br />
                  {relevantContent.content}
                </p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <button className="text-gray-500 dark:text-gray-400 flex items-center text-xs md:text-sm">
                  <Info size={14} className="mr-1" />
                  <span>{relevantContent.sources.length}</span>
                </button>
                <button 
                  id="add-to-composer-btn"
                  className="text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleAddToComposer}
                >
                  Add to composer
                </button>
              </div>
            </div>
            
            {/* Relevant sources - with fixed max height and overflow scroll */}
            <div className="mt-4 md:mt-6">
              <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">
                {relevantContent.sources.length} relevant sources found
              </h4>
              <div className="space-y-1 md:space-y-2 max-h-60 overflow-y-auto pr-1 jinni-scrollbar">
                {relevantContent.sources.map((source) => (
                  <div 
                    key={source.id}
                    className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-sm flex items-center justify-center mr-2 ${
                      source.icon === 'lock' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {source.icon === 'lock' ? '🔒' : '📄'}
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 text-xs md:text-sm">{source.title}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <button className="text-blue-600 dark:text-blue-400 text-xs md:text-sm flex items-center">
                    See all →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4">
              <h3 className="font-medium dark:text-white mb-2 text-sm md:text-base">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Email</span>
                  <span className="text-gray-900 dark:text-white text-xs md:text-sm">
                    {conversation && conversation[0]?.name ? `${conversation[0].name.toLowerCase().replace(' ', '.')}@example.com` : 'customer@example.com'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">First seen</span>
                  <span className="text-gray-900 dark:text-white text-xs md:text-sm">2 months ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Last active</span>
                  <span className="text-gray-900 dark:text-white text-xs md:text-sm">2 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Browser</span>
                  <span className="text-gray-900 dark:text-white text-xs md:text-sm">Chrome on macOS</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4">
              <h3 className="font-medium dark:text-white mb-2 text-sm md:text-base">Purchase History</h3>
              <div className="space-y-3">
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white text-xs md:text-sm font-medium">Order #12345</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">$129.99</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Placed on Nov 25, 2023</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white text-xs md:text-sm font-medium">Order #10982</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">$49.99</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Placed on Aug 12, 2023</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 md:p-4">
        <div className="relative">
          {isRecording ? (
            <div className="w-full pl-3 pr-10 py-2 text-sm md:text-base border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                <span>Recording... {formatRecordingTime(recordingTime)}</span>
              </div>
              <button 
                onClick={stopRecording}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <StopCircle size={20} />
              </button>
            </div>
          ) : (
            <>
              <input 
                type="text" 
                placeholder="Ask a follow up question..." 
                className="w-full pl-3 pr-16 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendQuestion();
                  }
                }}
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button 
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1" 
                  onClick={startRecording}
                  disabled={isTyping}
                  title="Record voice message"
                >
                  <Mic size={16} />
                </button>
                <button 
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1" 
                  onClick={handleSendQuestion}
                  disabled={isTyping || !question.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .jinni-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .jinni-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .jinni-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .jinni-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
        
        .dark .jinni-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.2);
        }
        
        .dark .jinni-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.4);
        }
        
        .conversation-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Audio Player Styling */
        .audio-player-button {
          transition: all 0.2s ease-in-out;
        }
        
        .audio-player-button:hover {
          transform: scale(1.05);
        }
        
        .audio-player-button:active {
          transform: scale(0.95);
        }
        
        /* Voice message styling */
        .voice-message-bubble {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </motion.div>
  );
} 
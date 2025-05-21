'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Bot, User, Sparkles, MoreVertical, ChevronDown, ArrowLeft, Mic, StopCircle, Globe, Check, ChevronLeft, Phone, Video, FileText, ClipboardList, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import AIJinni from './AIJinni';

// Mock data for users and their conversations
const mockUsers = {
  '1': {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    messages: [
      { id: '1', sender: 'user', name: 'John Doe', message: 'Hi, I need help with my subscription', time: '10:23 AM' },
      { id: '2', sender: 'bot', name: 'AI Assistant', message: 'Hello John! I\'d be happy to help you with your subscription. Could you please provide me with your account email so I can look up your information?', time: '10:24 AM' },
      { id: '3', sender: 'user', name: 'John Doe', message: 'Sure, it\'s john.doe@example.com', time: '10:25 AM' },
      { id: '4', sender: 'bot', name: 'AI Assistant', message: 'Thank you! I can see you have our Premium plan which renews on June 15th. What specifically would you like help with regarding your subscription?', time: '10:26 AM' },
      { id: '5', sender: 'user', name: 'John Doe', message: 'I want to upgrade to the Enterprise plan', time: '10:28 AM' },
    ]
  },
  '2': {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    avatar: 'SS',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    messages: [
      { id: '1', sender: 'user', name: 'Sarah Smith', message: 'I need help with my account', time: '09:15 AM' },
      { id: '2', sender: 'bot', name: 'AI Assistant', message: 'Hi Sarah! I\'d be happy to help with your account. What seems to be the issue?', time: '09:16 AM' },
      { id: '3', sender: 'user', name: 'Sarah Smith', message: 'I can\'t log in. It says my password is incorrect', time: '09:17 AM' },
      { id: '4', sender: 'bot', name: 'AI Assistant', message: 'I\'m sorry to hear that. Would you like me to send you a password reset link?', time: '09:18 AM' },
    ]
  },
  '3': {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'MJ',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    messages: [
      { id: '1', sender: 'user', name: 'Mike Johnson', message: 'When will my order arrive?', time: '11:30 AM' },
      { id: '2', sender: 'bot', name: 'AI Assistant', message: 'Hello Mike! I\'d be happy to check on your order status. Could you provide your order number?', time: '11:31 AM' },
      { id: '3', sender: 'user', name: 'Mike Johnson', message: 'It\'s #ORD-12345', time: '11:32 AM' },
      { id: '4', sender: 'bot', name: 'AI Assistant', message: 'Thank you! Your order #ORD-12345 is currently being processed and should ship within 24 hours. You\'ll receive a tracking number via email once it ships.', time: '11:33 AM' },
    ]
  },
  '4': {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: 'ED',
    image: 'https://randomuser.me/api/portraits/women/67.jpg',
    messages: [
      { id: '1', sender: 'user', name: 'Emily Davis', message: 'Thanks for your help!', time: '02:45 PM' },
      { id: '2', sender: 'bot', name: 'AI Assistant', message: 'You\'re welcome, Emily! Is there anything else I can help you with today?', time: '02:46 PM' },
      { id: '3', sender: 'user', name: 'Emily Davis', message: 'No, that\'s all for now. Have a great day!', time: '02:47 PM' },
      { id: '4', sender: 'bot', name: 'AI Assistant', message: 'You too! Feel free to reach out if you need anything else.', time: '02:48 PM' },
    ]
  },
  '5': {
    id: '5',
    name: 'Alex Wilson',
    email: 'alex.wilson@example.com',
    avatar: 'AW',
    image: 'https://randomuser.me/api/portraits/men/23.jpg',
    messages: [
      { id: '1', sender: 'user', name: 'Alex Wilson', message: 'I have a question about pricing', time: '04:20 PM' },
      { id: '2', sender: 'bot', name: 'AI Assistant', message: 'Hi Alex! I\'d be happy to help with pricing information. Which plan or service are you interested in?', time: '04:21 PM' },
      { id: '3', sender: 'user', name: 'Alex Wilson', message: 'I\'m looking at the Business plan. Does it include API access?', time: '04:22 PM' },
      { id: '4', sender: 'bot', name: 'AI Assistant', message: 'Yes, the Business plan includes full API access with up to 50,000 requests per month. Would you like me to send you our API documentation?', time: '04:23 PM' },
    ]
  }
};

interface ChatAreaProps {
  activeChat: string | null;
  toggleSidebar?: () => void;
}

// Customer waiting notification component
function CustomerWaitingNotification({ minutes = 5 }) {
  return (
    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-lg mb-4 flex items-center justify-between">
      <span>This customer has been waiting for {minutes} minutes.</span>
      <div className="text-xs text-amber-700 dark:text-amber-300">16m</div>
    </div>
  );
}

export default function ChatArea({ activeChat, toggleSidebar }: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<{[key: string]: string}>({});
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Update messages when active chat changes
  useEffect(() => {
    if (activeChat && mockUsers[activeChat as keyof typeof mockUsers]) {
      const user = mockUsers[activeChat as keyof typeof mockUsers];
      setCurrentUser(user);
      setMessages(user.messages);
    } else {
      setCurrentUser(null);
      setMessages([]);
    }
  }, [activeChat]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simulate typing indicator when a new message is sent
  const handleSendMessage = () => {
    if (message.trim() === '' || !activeChat) return;
    
    // Add user message
    const newUserMessage = {
      id: String(Date.now()),
      sender: 'user',
      name: currentUser?.name || 'User',
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newUserMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse;
      
      // Generate contextual responses based on user ID
      if (activeChat === '1') {
        aiResponse = {
          id: String(Date.now() + 1),
          sender: 'bot',
          name: 'AI Assistant',
          message: `I'll help you upgrade to our Enterprise plan. The Enterprise plan costs $99/month and includes all Premium features plus dedicated support and advanced analytics. Would you like me to process this upgrade for you now?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (activeChat === '2') {
        aiResponse = {
          id: String(Date.now() + 1),
          sender: 'bot',
          name: 'AI Assistant',
          message: `I've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        aiResponse = {
          id: String(Date.now() + 1),
          sender: 'bot',
          name: 'AI Assistant',
          message: `Thank you for your message. I'll look into this and get back to you as soon as possible.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };
  
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
        
        // Send the audio message
        const newAudioMessage = {
          id: String(Date.now()),
          sender: 'user',
          name: currentUser?.name || 'User',
          message: '🎤 Voice message',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audio: audioUrl
        };
        
        setMessages([...messages, newAudioMessage]);
        
        // Simulate AI response
        setIsTyping(true);
        setTimeout(() => {
          const aiResponse = {
            id: String(Date.now() + 1),
            sender: 'bot',
            name: 'AI Assistant',
            message: `I've received your voice message and will respond shortly.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          
          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
        }, 2000);
      };
      
      // Request data every second to ensure we capture audio
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      // Start timer
      const timerInterval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Stop recording after 60 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          clearInterval(timerInterval);
        }
      }, 60000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      
      // Add error message to the chat
      const errorMessage = {
        id: String(Date.now()),
        sender: 'bot',
        name: 'System',
        message: `Microphone access failed. Please check your browser permissions and make sure you've allowed microphone access for this site. You might need to reload the page after granting permission.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Update the translation function to include Hindi and fix AI assistant message translation
  const translateMessage = async (messageId: string, text: string) => {
    if (translatedMessages[messageId]) {
      return;
    }
    
    setIsTranslating(true);
    
    // Simulate API call to translation service
    setTimeout(() => {
      // Mock translations
      const translations: {[key: string]: {[key: string]: string}} = {
        'es': {
          'Hi, I need help with my subscription': 'Hola, necesito ayuda con mi suscripción',
          'I need help with my account': 'Necesito ayuda con mi cuenta',
          'When will my order arrive?': '¿Cuándo llegará mi pedido?',
          'Thanks for your help!': '¡Gracias por tu ayuda!',
          'I have a question about pricing': 'Tengo una pregunta sobre los precios',
          'I want to upgrade to the Enterprise plan': 'Quiero actualizar al plan Enterprise',
          'Sure, it\'s john.doe@example.com': 'Claro, es john.doe@example.com',
          'I can\'t log in. It says my password is incorrect': 'No puedo iniciar sesión. Dice que mi contraseña es incorrecta',
          'It\'s #ORD-12345': 'Es #ORD-12345',
          'No, that\'s all for now. Have a great day!': 'No, eso es todo por ahora. ¡Que tengas un buen día!',
          'I\'m looking at the Business plan. Does it include API access?': 'Estoy considerando el plan Business. ¿Incluye acceso a la API?',
          '🎤 Voice message': '🎤 Mensaje de voz',
          // AI responses
          'Hello John! I\'d be happy to help you with your subscription. Could you please provide me with your account email so I can look up your information?': 'Hola John! Estaré encantado de ayudarte con tu suscripción. ¿Podrías proporcionarme el correo electrónico de tu cuenta para buscar tu información?',
          'Thank you! I can see you have our Premium plan which renews on June 15th. What specifically would you like help with regarding your subscription?': '¡Gracias! Veo que tienes nuestro plan Premium que se renueva el 15 de junio. ¿En qué específicamente te gustaría ayuda con respecto a tu suscripción?',
          'I\'ll help you upgrade to our Enterprise plan. The Enterprise plan costs $99/month and includes all Premium features plus dedicated support and advanced analytics. Would you like me to process this upgrade for you now?': 'Te ayudaré a actualizar a nuestro plan Enterprise. El plan Enterprise cuesta $99/mes e incluye todas las características Premium más soporte dedicado y análisis avanzados. ¿Te gustaría que procesara esta actualización ahora?',
          'I\'ve received your voice message and will respond shortly.': 'He recibido tu mensaje de voz y responderé en breve.'
        },
        'fr': {
          'Hi, I need help with my subscription': 'Bonjour, j\'ai besoin d\'aide avec mon abonnement',
          'I need help with my account': 'J\'ai besoin d\'aide avec mon compte',
          'When will my order arrive?': 'Quand ma commande arrivera-t-elle?',
          'Thanks for your help!': 'Merci pour votre aide!',
          'I have a question about pricing': 'J\'ai une question sur les prix',
          'I want to upgrade to the Enterprise plan': 'Je veux passer au plan Enterprise',
          'Sure, it\'s john.doe@example.com': 'Bien sûr, c\'est john.doe@example.com',
          'I can\'t log in. It says my password is incorrect': 'Je ne peux pas me connecter. Il dit que mon mot de passe est incorrect',
          'It\'s #ORD-12345': 'C\'est #ORD-12345',
          'No, that\'s all for now. Have a great day!': 'Non, c\'est tout pour le moment. Bonne journée!',
          'I\'m looking at the Business plan. Does it include API access?': 'Je regarde le plan Business. Inclut-il l\'accès API?',
          '🎤 Voice message': '🎤 Message vocal',
          // AI responses
          'Hello John! I\'d be happy to help you with your subscription. Could you please provide me with your account email so I can look up your information?': 'Bonjour John! Je serais heureux de vous aider avec votre abonnement. Pourriez-vous me fournir l\'e-mail de votre compte afin que je puisse rechercher vos informations?',
          'Thank you! I can see you have our Premium plan which renews on June 15th. What specifically would you like help with regarding your subscription?': 'Merci! Je vois que vous avez notre plan Premium qui se renouvelle le 15 juin. Qu\'aimeriez-vous spécifiquement concernant votre abonnement?',
          'I\'ll help you upgrade to our Enterprise plan. The Enterprise plan costs $99/month and includes all Premium features plus dedicated support and advanced analytics. Would you like me to process this upgrade for you now?': 'Je vais vous aider à passer au plan Enterprise. Le plan Enterprise coûte 99$/mois et comprend toutes les fonctionnalités Premium plus un support dédié et des analyses avancées. Souhaitez-vous que je traite cette mise à niveau maintenant?',
          'I\'ve received your voice message and will respond shortly.': 'J\'ai reçu votre message vocal et je vous répondrai sous peu.'
        },
        'de': {
          'Hi, I need help with my subscription': 'Hallo, ich brauche Hilfe mit meinem Abonnement',
          'I need help with my account': 'Ich brauche Hilfe mit meinem Konto',
          'When will my order arrive?': 'Wann kommt meine Bestellung an?',
          'Thanks for your help!': 'Danke für deine Hilfe!',
          'I have a question about pricing': 'Ich habe eine Frage zur Preisgestaltung',
          'I want to upgrade to the Enterprise plan': 'Ich möchte auf den Enterprise-Plan upgraden',
          'Sure, it\'s john.doe@example.com': 'Sicher, es ist john.doe@example.com',
          'I can\'t log in. It says my password is incorrect': 'Ich kann mich nicht einloggen. Es sagt, mein Passwort ist falsch',
          'It\'s #ORD-12345': 'Es ist #ORD-12345',
          'No, that\'s all for now. Have a great day!': 'Nein, das ist alles für jetzt. Einen schönen Tag noch!',
          'I\'m looking at the Business plan. Does it include API access?': 'Ich schaue mir den Business-Plan an. Enthält er API-Zugriff?',
          '🎤 Voice message': '🎤 Sprachnachricht',
          // AI responses
          'Hello John! I\'d be happy to help you with your subscription. Could you please provide me with your account email so I can look up your information?': 'Hallo John! Ich helfe dir gerne mit deinem Abonnement. Könntest du mir bitte deine Konto-E-Mail mitteilen, damit ich deine Informationen nachschlagen kann?',
          'Thank you! I can see you have our Premium plan which renews on June 15th. What specifically would you like help with regarding your subscription?': 'Danke! Ich sehe, dass du unseren Premium-Plan hast, der am 15. Juni verlängert wird. Womit genau möchtest du Hilfe bezüglich deines Abonnements?',
          'I\'ll help you upgrade to our Enterprise plan. The Enterprise plan costs $99/month and includes all Premium features plus dedicated support and advanced analytics. Would you like me to process this upgrade for you now?': 'Ich helfe dir beim Upgrade auf unseren Enterprise-Plan. Der Enterprise-Plan kostet $99/Monat und umfasst alle Premium-Funktionen plus dedizierten Support und erweiterte Analysen. Möchtest du, dass ich dieses Upgrade jetzt für dich durchführe?',
          'I\'ve received your voice message and will respond shortly.': 'Ich habe deine Sprachnachricht erhalten und werde in Kürze antworten.'
        },
        'hi': {
          'Hi, I need help with my subscription': 'नमस्ते, मुझे अपनी सदस्यता के साथ मदद चाहिए',
          'I need help with my account': 'मुझे अपने खाते के साथ मदद चाहिए',
          'When will my order arrive?': 'मेरा ऑर्डर कब आएगा?',
          'Thanks for your help!': 'आपकी मदद के लिए धन्यवाद!',
          'I have a question about pricing': 'मेरे पास कीमत के बारे में एक सवाल है',
          'I want to upgrade to the Enterprise plan': 'मैं एंटरप्राइज प्लान में अपग्रेड करना चाहता हूं',
          'Sure, it\'s john.doe@example.com': 'ज़रूर, यह john.doe@example.com है',
          'I can\'t log in. It says my password is incorrect': 'मैं लॉग इन नहीं कर पा रहा हूं। यह कहता है कि मेरा पासवर्ड गलत है',
          'It\'s #ORD-12345': 'यह #ORD-12345 है',
          'No, that\'s all for now. Have a great day!': 'नहीं, अभी के लिए बस इतना ही। आपका दिन शुभ हो!',
          'I\'m looking at the Business plan. Does it include API access?': 'मैं बिजनेस प्लान देख रहा हूं। क्या इसमें API एक्सेस शामिल है?',
          '🎤 Voice message': '🎤 वॉइस संदेश',
          // AI responses
          'Hello John! I\'d be happy to help you with your subscription. Could you please provide me with your account email so I can look up your information?': 'नमस्ते जॉन! मैं आपकी सदस्यता के साथ मदद करने में खुशी होगी। क्या आप मुझे अपना खाता ईमेल प्रदान कर सकते हैं ताकि मैं आपकी जानकारी देख सकूं?',
          'Thank you! I can see you have our Premium plan which renews on June 15th. What specifically would you like help with regarding your subscription?': 'धन्यवाद! मैं देख सकता हूं कि आपके पास हमारा प्रीमियम प्लान है जो 15 जून को नवीनीकृत होता है। आप अपनी सदस्यता के संबंध में विशेष रूप से किस चीज़ में मदद चाहते हैं?',
          'I\'ll help you upgrade to our Enterprise plan. The Enterprise plan costs $99/month and includes all Premium features plus dedicated support and advanced analytics. Would you like me to process this upgrade for you now?': 'मैं आपको हमारे एंटरप्राइज प्लान में अपग्रेड करने में मदद करूंगा। एंटरप्राइज प्लान की कीमत $99/महीना है और इसमें सभी प्रीमियम सुविधाओं के साथ-साथ समर्पित सहायता और उन्नत विश्लेषण शामिल हैं। क्या आप चाहते हैं कि मैं अभी आपके लिए यह अपग्रेड प्रक्रिया करूं?',
          'I\'ve received your voice message and will respond shortly.': 'मैंने आपका वॉइस मैसेज प्राप्त कर लिया है और जल्द ही जवाब दूंगा।'
        }
      };
      
      // Get translation or fallback to original
      const translation = translations[targetLanguage]?.[text] || text;
      
      setTranslatedMessages(prev => ({
        ...prev,
        [messageId]: translation
      }));
      
      setIsTranslating(false);
    }, 500);
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
  
  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-4"
        >
          <Bot size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">No conversation selected</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Select a conversation from the sidebar to start chatting</p>
          {isMobile && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar} 
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              View Conversations
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Chat Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 md:hidden transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}
            {currentUser?.image ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-10 h-10 rounded-full overflow-hidden mr-3"
              >
                <img 
                  src={currentUser.image} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium mr-3">
                {currentUser?.avatar || 'U'}
              </div>
            )}
            <div>
              <h2 className="font-medium dark:text-white">{currentUser?.name || 'User'}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsTranslating(!isTranslating)}
              >
                <Globe size={18} className={`${Object.keys(translatedMessages).length > 0 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`} />
              </motion.button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Translate messages to:</p>
                  <div className="space-y-1">
                    {['es', 'fr', 'de', 'hi'].map((lang) => (
                      <button
                        key={lang}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center justify-between ${
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
                        {targetLanguage === lang && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* AI Assistant "Beta" header - mobile only */}
      {isMobile && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <Sparkles size={16} className="text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Assistant (Beta)</span>
          </div>
          <button 
            className="text-blue-500 p-1"
            onClick={() => setIsAssistantOpen(true)}
          >
            Open
          </button>
        </div>
      )}
      
      {/* Messages Area */}
      
      {/* Hidden audio player for voice messages */}
      <audio ref={audioPlayerRef} className="hidden" />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 messages-container">
        {/* Customer waiting notification */}
        {activeChat === '2' && <CustomerWaitingNotification minutes={5} />}
        
        {messages.map((msg, index) => (
          <motion.div 
            key={msg.id} 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white message-out shadow-md' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 message-in shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {msg.sender === 'bot' && <Bot size={16} className="text-blue-500 dark:text-blue-400" />}
                {msg.sender === 'user' && <User size={16} className="text-white" />}
                <span className={`text-xs font-medium ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-700 dark:text-gray-200'}`}>
                  {msg.name}
                </span>
                <span className={`text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.time}
                </span>
                {!translatedMessages[msg.id] && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => translateMessage(msg.id, msg.message)}
                    className={`ml-1 p-1 rounded-full ${
                      msg.sender === 'user' 
                        ? 'hover:bg-blue-500 text-blue-100' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Globe size={12} />
                  </motion.button>
                )}
              </div>
              <p className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {translatedMessages[msg.id] || msg.message}
                {translatedMessages[msg.id] && (
                  <span className="block mt-1 text-xs opacity-70">
                    {msg.sender === 'user' ? 'Translated from English' : 'Translated to ' + 
                      (targetLanguage === 'es' ? 'Spanish' : 
                       targetLanguage === 'fr' ? 'French' : 
                       targetLanguage === 'de' ? 'German' : 
                       'Hindi')}
                  </span>
                )}
              </p>
              {msg.audio && (
                <div className="mt-2 flex items-center">
                  <button 
                    onClick={() => toggleAudioPlay(msg.audio!)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full audio-player-button transition-colors ${
                      currentlyPlaying === msg.audio
                        ? msg.sender === 'user'
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : msg.sender === 'user'
                          ? 'bg-blue-500/80 text-white/90' 
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {currentlyPlaying === msg.audio ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                  </button>
                  <div className={`ml-2 text-xs flex items-center ${
                    msg.sender === 'user' ? 'text-blue-100/90' : 'text-gray-500'
                  }`}>
                    {translatedMessages[msg.id] || '🎤 Voice message'}
                    {!translatedMessages[msg.id] && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => translateMessage(msg.id, '🎤 Voice message')}
                        className={`ml-1 p-1 rounded-full ${
                          msg.sender === 'user' 
                            ? 'hover:bg-blue-500 text-blue-100' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Globe size={10} />
                      </motion.button>
                    )}
                    {translatedMessages[msg.id] && (
                      <span className="ml-1 opacity-70">
                        ({targetLanguage === 'es' ? 'Translated' : 
                          targetLanguage === 'fr' ? 'Traduit' : 
                          targetLanguage === 'de' ? 'Übersetzt' : 
                          'अनुवादित'})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-[85%] md:max-w-[70%] message-in shadow-sm">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">AI Assistant</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* AI Copilot */}
      {isAssistantOpen && (
        <div className="hidden md:block w-1/3 max-w-md">
          <AIJinni 
            isOpen={isAssistantOpen} 
            onClose={() => setIsAssistantOpen(false)}
            conversation={messages}
            addToComposer={(text) => setMessage(text)}
          />
        </div>
      )}
      
      {/* Mobile AI Copilot */}
      {isMobile && isAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <AIJinni 
                isOpen={isAssistantOpen} 
                onClose={() => setIsAssistantOpen(false)}
                conversation={messages}
                addToComposer={(text) => setMessage(text)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 transition-colors">
        <div className="flex items-center">
          <div className="flex-1 relative">
            {isRecording ? (
              <div className="w-full border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                  <span>Recording... {formatRecordingTime(recordingTime)}</span>
                </div>
                <motion.button
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                >
                  <StopCircle size={20} />
                </motion.button>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Type a message..."
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                
                <div className="absolute bottom-2 right-2">
                  <motion.button
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startRecording}
                    title="Record voice message"
                  >
                    <Mic size={20} />
                  </motion.button>
                </div>
              </>
            )}
          </div>
          
          <div className="flex ml-2">
            <div className="flex items-center space-x-1 mr-2">
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAssistantOpen(!isAssistantOpen)}
              >
                <Bot size={20} />
              </motion.button>
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Paperclip size={20} />
              </motion.button>
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Smile size={20} />
              </motion.button>
            </div>
            
            {!isRecording && (
              <motion.button
                className={`p-2 rounded-full ${
                  message.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
                whileHover={message.trim() ? { scale: 1.1 } : {}}
                whileTap={message.trim() ? { scale: 0.9 } : {}}
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Formatting toolbar */}
        <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex items-center space-x-3">
            <button className="hover:text-gray-700 dark:hover:text-gray-200 font-bold">B</button>
            <button className="hover:text-gray-700 dark:hover:text-gray-200 italic">i</button>
            <button className="hover:text-gray-700 dark:hover:text-gray-200 font-mono">&lt;/&gt;</button>
            <button className="hover:text-gray-700 dark:hover:text-gray-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .messages-container::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
        
        .dark .messages-container::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.2);
        }
        
        .dark .messages-container::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.4);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .audio-player-button {
          transition: all 0.2s ease-in-out;
        }
        
        .audio-player-button:hover {
          transform: scale(1.05);
        }
        
        .audio-player-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
} 
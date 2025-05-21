'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageSquare, Settings, Users, BarChart2, X } from 'lucide-react';

// Mock data for chats with profile images
const mockChats = [
  { id: '1', name: 'John Doe', message: 'Hi there! How can I help?', time: '2m', unread: 2, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'Sarah Smith', message: 'I need help with my account', time: '10m', unread: 0, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '3', name: 'Mike Johnson', message: 'When will my order arrive?', time: '1h', unread: 1, image: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: '4', name: 'Emily Davis', message: 'Thanks for your help!', time: '3h', unread: 0, image: 'https://randomuser.me/api/portraits/women/67.jpg' },
  { id: '5', name: 'Alex Wilson', message: 'I have a question about pricing', time: '1d', unread: 0, image: 'https://randomuser.me/api/portraits/men/23.jpg' },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
}

export default function Sidebar({ isOpen, setIsOpen, activeChat, setActiveChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle chat selection on mobile
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    if (isMobile) {
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };
  
  const sidebarVariants = {
    open: { 
      width: isMobile ? '100%' : 320, 
      opacity: 1,
      x: 0,
      display: 'flex',
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        bounce: 0.2
      }
    },
    closed: { 
      width: 0, 
      opacity: 0,
      x: isMobile ? "-100%" : -100,
      transitionEnd: {
        display: 'none'
      },
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        opacity: { duration: 0.2 }
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className={`h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-col ${
            isMobile ? 'fixed top-0 left-0 z-50 w-full' : 'relative'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold dark:text-white"
              >
                Conversations
              </motion.h2>
              <div className="flex items-center space-x-2">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => {}}
                >
                  <Plus size={20} className="text-gray-600 dark:text-gray-300" />
                </motion.button>
                
                {isMobile && (
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
          
          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex p-2 border-b border-gray-200 dark:border-gray-700"
          >
            {['all', 'unread', 'assigned'].map((filter, index) => (
              <motion.button
                key={filter}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-colors ${
                  activeFilter === filter 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </motion.div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat, index) => (
                <motion.div 
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer ${
                    activeChat === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  } transition-all duration-150`}
                  onClick={() => handleChatSelect(chat.id)}
                  whileHover={{ 
                    scale: 1.01,
                    transition: { duration: 0.1 }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {chat.image ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={chat.image} 
                            alt={chat.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                          {chat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">{chat.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.message}</p>
                        {chat.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No conversations found
              </div>
            )}
          </div>
          
          {/* Sidebar Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors"
          >
            <div className="flex justify-around">
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <MessageSquare size={20} className="text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Users size={20} className="text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart2 size={20} className="text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={20} className="text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
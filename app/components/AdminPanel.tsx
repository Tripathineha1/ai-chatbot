'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import Header from './Header';
import ContactsView from './ContactsView';
import AIJinni from './AIJinni';

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'contacts'>('chat');
  const [isAIJinniOpen, setIsAIJinniOpen] = useState(true);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when a chat is selected
      if (mobile && activeChat) {
        setIsSidebarOpen(false);
        setIsAIJinniOpen(false);
      }
      
      // Auto-open sidebar on desktop
      if (!mobile) {
        setIsSidebarOpen(true);
        setIsAIJinniOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [activeChat]);
  
  // Handle initial mobile state
  useEffect(() => {
    if (isMobile && !activeChat) {
      setIsSidebarOpen(true);
      setIsAIJinniOpen(false);
    }
  }, [isMobile, activeChat]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAIJinni = () => {
    setIsAIJinniOpen(!isAIJinniOpen);
  };

  const mainContentVariants = {
    sidebarOpen: {
      marginLeft: isMobile ? 0 : 0,
      width: isMobile ? '100%' : `calc(100% - ${isAIJinniOpen ? 620 : 320}px)`,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    sidebarClosed: {
      marginLeft: 0,
      width: isAIJinniOpen && !isMobile ? 'calc(100% - 300px)' : '100%',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };
  
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
      
      {/* Main Content */}
      <motion.div 
        className={`flex flex-col flex-1 overflow-hidden ${isMobile && isSidebarOpen ? 'z-0' : 'z-10'}`}
        initial={isSidebarOpen ? "sidebarOpen" : "sidebarClosed"}
        animate={isSidebarOpen && !isMobile ? "sidebarOpen" : "sidebarClosed"}
        variants={mainContentVariants}
      >
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          toggleAIJinni={toggleAIJinni}
          isAIJinniOpen={isAIJinniOpen}
        />
        
        {activeView === 'chat' ? (
          <ChatArea 
            activeChat={activeChat} 
            toggleSidebar={toggleSidebar}
            showAIJinni={false}
          />
        ) : (
          <ContactsView activeChat={activeChat} setActiveChat={setActiveChat} setActiveView={setActiveView} />
        )}
      </motion.div>
      
      {/* AI Jinni Panel */}
      {!isMobile && (
        <motion.div 
          className={`h-full ${isAIJinniOpen ? 'w-[300px]' : 'w-0'} overflow-hidden bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out`}
          initial={{ width: isAIJinniOpen ? 300 : 0 }}
          animate={{ width: isAIJinniOpen ? 300 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">AI Jinni</h2>
              <button 
                onClick={toggleAIJinni}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                ✕
              </button>
            </div>
            <AIJinni />
          </div>
        </motion.div>
      )}
    </div>
  );
} 
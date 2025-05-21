'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import Header from './Header';
import ContactsView from './ContactsView';

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'contacts'>('chat');
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when a chat is selected
      if (mobile && activeChat) {
        setIsSidebarOpen(false);
      }
      
      // Auto-open sidebar on desktop
      if (!mobile) {
        setIsSidebarOpen(true);
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
    }
  }, [isMobile, activeChat]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mainContentVariants = {
    sidebarOpen: {
      marginLeft: isMobile ? 0 : 0,
      width: isMobile ? '100%' : 'calc(100% - 320px)',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    sidebarClosed: {
      marginLeft: 0,
      width: '100%',
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
        />
        
        {activeView === 'chat' ? (
          <ChatArea 
            activeChat={activeChat} 
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <ContactsView activeChat={activeChat} setActiveChat={setActiveChat} setActiveView={setActiveView} />
        )}
      </motion.div>
    </div>
  );
} 
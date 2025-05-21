'use client';

import { Menu, Bell, ChevronDown, User, Settings, HelpCircle, LogOut, Moon, Sun, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeView: 'chat' | 'contacts';
  setActiveView: (view: 'chat' | 'contacts') => void;
  toggleAIJinni?: () => void;
  isAIJinniOpen?: boolean;
}

export default function Header({ toggleSidebar, isSidebarOpen, activeView, setActiveView, toggleAIJinni, isAIJinniOpen }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  
  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <motion.button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isSidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </motion.div>
          </motion.button>
          
          <div className="hidden md:flex space-x-6 ml-4">
            <NavLink 
              active={activeView === 'chat'} 
              onClick={() => setActiveView('chat')}
            >
              Inbox
            </NavLink>
            <NavLink 
              active={activeView === 'contacts'} 
              onClick={() => setActiveView('contacts')}
            >
              Contacts
            </NavLink>
            <NavLink>Settings</NavLink>
            <NavLink>Help</NavLink>
          </div>
          
          {isMobile && (
            <h1 className="text-lg font-medium dark:text-white">
              {activeView === 'chat' ? 'Inbox' : 'Contacts'}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </motion.button>
          
          {toggleAIJinni && !isMobile && (
            <motion.button 
              onClick={toggleAIJinni}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center"
              aria-label={isAIJinniOpen ? "Hide SuperJinni" : "Show SuperJinni"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isAIJinniOpen ? (
                <Bot size={20} className="text-blue-500 dark:text-blue-400" />
              ) : (
                <div className="relative">
                  <Bot size={20} className="text-gray-600 dark:text-gray-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3">
                    <img 
                      src="/superjinni-logo.svg" 
                      alt="SuperJinni Logo" 
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </motion.button>
          )}
          
          <motion.button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
            aria-label="Notifications"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>
          
          <DropdownMenu.Root open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenu.Trigger asChild>
              <motion.button 
                className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium dark:text-white">John Doe</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
                </div>
                <ChevronDown size={16} className="text-gray-400 dark:text-gray-500 hidden md:block" />
              </motion.button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white dark:bg-gray-900 rounded-md shadow-lg p-1 border border-gray-200 dark:border-gray-700 z-50 transition-colors"
                sideOffset={5}
                align="end"
              >
                {isMobile && (
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <div className="text-sm font-medium dark:text-white">John Doe</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
                  </div>
                )}
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors dark:text-gray-200">
                  <User size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors dark:text-gray-200">
                  <Settings size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors dark:text-gray-200">
                  <HelpCircle size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Help
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-red-600 cursor-pointer transition-colors">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      
      {isMobile && (
        <div className="flex overflow-x-auto px-4 pb-2 border-b border-gray-200 dark:border-gray-700 hide-scrollbar">
          <NavLink 
            active={activeView === 'chat'} 
            onClick={() => setActiveView('chat')}
          >
            Inbox
          </NavLink>
          <NavLink 
            active={activeView === 'contacts'} 
            onClick={() => setActiveView('contacts')}
          >
            Contacts
          </NavLink>
          <NavLink>Settings</NavLink>
          <NavLink>Help</NavLink>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavLink({ children, active, onClick }: NavLinkProps) {
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        active 
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      {children}
    </a>
  );
} 
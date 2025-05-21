'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Globe, ArrowRight, X, User } from 'lucide-react';

// Mock data for contacts
const mockContacts = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    company: 'Acme Inc.',
    role: 'CEO',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastActive: '2 hours ago',
    tags: ['VIP', 'Enterprise']
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, USA',
    company: 'Tech Solutions',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastActive: '5 hours ago',
    tags: ['Premium']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
    company: 'Johnson & Co',
    role: 'Marketing',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    lastActive: '1 day ago',
    tags: ['Trial']
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Boston, USA',
    company: 'Creative Studios',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/women/67.jpg',
    lastActive: '3 days ago',
    tags: ['Premium']
  },
  {
    id: '5',
    name: 'Alex Wilson',
    email: 'alex.wilson@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, USA',
    company: 'Wilson Enterprises',
    role: 'CTO',
    image: 'https://randomuser.me/api/portraits/men/23.jpg',
    lastActive: '1 week ago',
    tags: ['Enterprise']
  }
];

interface ContactsViewProps {
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  setActiveView: (view: 'chat' | 'contacts') => void;
}

export default function ContactsView({ activeChat, setActiveChat, setActiveView }: ContactsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedContactData = selectedContact 
    ? mockContacts.find(contact => contact.id === selectedContact) 
    : null;
  
  const handleStartChat = (contactId: string) => {
    setActiveChat(contactId);
    setActiveView('chat');
  };
  
  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Contacts List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <motion.div 
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer ${
                  selectedContact === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } transition-all duration-150`}
                onClick={() => setSelectedContact(contact.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={contact.image} 
                        alt={contact.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{contact.company}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{contact.lastActive}</span>
                      <div className="flex ml-2 space-x-1">
                        {contact.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              tag === 'VIP' 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                                : tag === 'Enterprise' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : tag === 'Premium'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No contacts found
            </div>
          )}
        </div>
      </div>
      
      {/* Contact Details */}
      {selectedContactData ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full md:w-2/3 flex flex-col"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <motion.button 
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
                onClick={() => setSelectedContact(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </motion.button>
              <h2 className="text-lg font-medium dark:text-white">Contact Details</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartChat(selectedContactData.id)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <span>Start Chat</span>
              <ArrowRight size={16} />
            </motion.button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto md:mx-0">
                  <img 
                    src={selectedContactData.image} 
                    alt={selectedContactData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold dark:text-white text-center md:text-left">{selectedContactData.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">{selectedContactData.role} at {selectedContactData.company}</p>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{selectedContactData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">{selectedContactData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-white">{selectedContactData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Company</p>
                      <p className="text-gray-900 dark:text-white">{selectedContactData.company}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedContactData.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`px-3 py-1 text-sm rounded-full ${
                          tag === 'VIP' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                            : tag === 'Enterprise' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : tag === 'Premium'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">Last active {selectedContactData.lastActive}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Via web app</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">Opened email campaign</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2"></div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">Visited pricing page</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="hidden md:flex w-2/3 items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Select a contact</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Choose a contact from the list to view their details</p>
          </div>
        </div>
      )}
    </div>
  );
}

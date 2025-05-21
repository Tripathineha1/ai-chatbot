declare module './Sidebar' {
  interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeChat: string | null;
    setActiveChat: (chatId: string) => void;
  }
  const Sidebar: React.FC<SidebarProps>;
  export default Sidebar;
}

declare module './ChatArea' {
  interface ChatAreaProps {
    activeChat: string | null;
    toggleSidebar?: () => void;
  }
  const ChatArea: React.FC<ChatAreaProps>;
  export default ChatArea;
}

declare module './Header' {
  interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
  }
  const Header: React.FC<HeaderProps>;
  export default Header;
} 
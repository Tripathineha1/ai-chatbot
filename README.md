# AI Chatbot Admin Panel (SuperJinni)

A modern, responsive admin panel for an AI-enhanced chatbot system with SuperJinni integration. This project showcases a clean UI with real-time chat capabilities, AI assistance features, and a comprehensive admin dashboard.

![SuperJinni AI Chatbot](/screenshot.png)

## Live Demo

[View the live demo here](https://ai-chatbot-khaki-three.vercel.app/)

## Features

- **Modern UI**: Clean, intuitive interface with smooth animations and transitions
- **Three-Column Layout**: Sidebar, Inbox, and SuperJinni panel for optimal workflow
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Interactive Chat Interface**: Real-time chat with typing indicators and message history
- **Voice Message Recording**: Record and play voice messages directly in the chat
- **Translation Features**: Support for Spanish, French, German, and Hindi translations
- **SuperJinni AI Assistant**: AI-powered message suggestions and contextual help
- **Conversation Management**: Filter and search through customer conversations
- **Mobile-First Approach**: Optimized for both desktop and mobile experiences
- **Dark/Light Mode**: Support for different visual preferences

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tripathineha1/ai-chatbot.git
   cd ai-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app directory with routes and components
  - `/components`: Reusable UI components
  - `/styles`: Global CSS and styling utilities
  - `/lib`: Utility functions and helpers
- `/public`: Static assets

## Deployment on Vercel

The easiest way to deploy this app is using Vercel:

1. Push your code to a GitHub repository

2. Import your project to Vercel:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. Follow the prompts to deploy your application

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Key UI/UX Features

- **Smooth Animations**: Message transitions, sidebar collapse/expand animations
- **Responsive Layout**: Adapts to different screen sizes with mobile-first approach
- **AI Assistance Panel**: Expandable panel with AI-generated message suggestions
- **Real-time Chat**: Typing indicators and message animations
- **Intuitive Navigation**: Mobile-friendly navigation with collapsible sidebar

## Customization

You can customize the theme colors by modifying the CSS variables in `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* Other color variables */
}
```

## Acknowledgments

This project was created as a coding assignment to demonstrate frontend development skills, inspired by Intercom's AI chatbot interface. 
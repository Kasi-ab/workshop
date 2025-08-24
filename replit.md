# Overview

Class Time Hacker is a retro arcade browser game built on a modern full-stack web architecture. The game challenges players to control a student character who must complete classroom pranks within a 2-minute time limit while avoiding detection by a patrolling AI teacher. The application uses a React frontend with TypeScript for game logic, Express backend for potential future multiplayer features, and PostgreSQL with Drizzle ORM for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses a React-based single-page application with TypeScript for type safety. The game engine is built using HTML5 Canvas with a component-based architecture separating concerns into distinct systems:

- **Game Engine**: Central coordinator managing all game systems and the main game loop
- **Entity System**: Player, Teacher, and Mission classes with position-based physics
- **Rendering System**: SpriteRenderer for pixel-art style graphics with Canvas 2D context  
- **Input System**: InputManager supporting both keyboard (WASD/arrows) and mobile touch controls
- **Audio System**: Zustand store managing background music and sound effects with mute functionality
- **UI Framework**: Tailwind CSS with Radix UI components for consistent styling

The game state management uses a centralized GameState class with callback-based updates to React components. Mobile responsiveness is handled through a custom hook and conditional rendering of touch controls.

## Backend Architecture
The server uses Express.js with TypeScript in ES module format. The architecture separates concerns through:

- **Route Layer**: Centralized route registration with /api prefix convention
- **Storage Layer**: Interface-based storage abstraction with in-memory implementation for development
- **Development Server**: Vite integration for hot module replacement and asset serving

The backend currently serves primarily as a development foundation, with most game logic running client-side for optimal performance.

## Data Storage
Database architecture uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Schema Definition**: Drizzle schema with Zod validation for runtime type checking
- **Migration System**: Drizzle Kit for database schema migrations 
- **Connection**: Neon serverless PostgreSQL for cloud deployment
- **Development Storage**: In-memory storage implementation for rapid development

The storage interface is designed for future expansion to support user accounts, high scores, and game statistics.

## Build and Development
The build system uses Vite for frontend bundling with React, TypeScript, and Tailwind CSS:

- **Development**: Hot reload with Vite dev server and Express backend
- **Production**: Static asset generation with server-side rendering capability
- **Asset Pipeline**: Support for GLTF models, audio files, and GLSL shaders for potential 3D features
- **Code Quality**: TypeScript strict mode with path mapping for clean imports

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend framework with hooks for state management
- **Express**: Node.js web server framework for backend API
- **TypeScript**: Static typing across full stack
- **Vite**: Build tool and development server

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Zod**: Runtime type validation for database schemas

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component library for accessible UI primitives
- **React Three Fiber**: 3D graphics library for potential future enhancements
- **Lucide React**: Icon library for UI elements

## State Management and Utilities
- **Zustand**: Lightweight state management for audio and game settings
- **TanStack React Query**: Server state management and caching
- **date-fns**: Date manipulation utilities
- **clsx**: Conditional className utility

## Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **PostCSS**: CSS processing with Autoprefixer
- **Replit Vite Plugin**: Error overlay for development environment
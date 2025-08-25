# replit.md

## Overview

ExpenseTracker Pro is a modern full-stack expense tracking application built with React and Express.js. The application provides comprehensive personal finance management features including transaction recording, categorization, statistical analysis, and data visualization. Users can add income and expense transactions, view detailed analytics with charts, filter and search transaction history, and export data to CSV format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server for fast hot module replacement
- **TailwindCSS** for utility-first styling with custom CSS variables for theming
- **shadcn/ui** component library built on Radix UI primitives for consistent, accessible UI components
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** (React Query) for server state management, caching, and API interactions
- **Chart.js** for data visualization and analytics charts
- **React Hook Form** with Zod validation for form handling and data validation

### Backend Architecture
- **Express.js** server with TypeScript for the REST API
- **In-memory storage** with sample data for development (MemStorage class implementing IStorage interface)
- **Zod schemas** for request/response validation shared between client and server
- **RESTful API design** with endpoints for CRUD operations on transactions
- **Error handling middleware** for consistent error responses
- **Request logging middleware** for API monitoring

### Data Management
- **Drizzle ORM** configured for PostgreSQL with schema definitions in TypeScript
- **PostgreSQL** database support through Neon Database serverless connection
- **Shared schema definitions** between client and server for type safety
- **Database migrations** managed through Drizzle Kit
- Transaction model includes: id, type (income/expense), amount, category, description, and date

### Development Tooling
- **ESBuild** for production server bundling
- **TypeScript** with strict configuration for type safety
- **Path aliases** configured for clean imports (@/, @shared/, etc.)
- **CSS variables** for theming support across light/dark modes
- **Development middleware** with Vite integration for seamless full-stack development

### API Structure
- `GET /api/transactions` - Retrieve all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update existing transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get financial statistics
- `GET /api/transactions/export/csv` - Export transactions to CSV

### UI Components Architecture
- Modular component structure with separation of concerns
- Reusable UI components in `/components/ui/` following shadcn/ui patterns
- Feature-specific components in `/components/` (forms, charts, headers, etc.)
- Custom hooks for mobile detection and toast notifications
- Consistent styling through Tailwind utility classes and CSS variables

## External Dependencies

### Database & ORM
- **Neon Database** - Serverless PostgreSQL database hosting
- **Drizzle ORM** - Type-safe SQL ORM for database operations
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### UI Framework & Styling
- **Radix UI** - Headless, accessible UI component primitives
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library for consistent iconography
- **class-variance-authority** - Utility for creating type-safe component variants

### State Management & Data Fetching
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form state management and validation
- **Zod** - Runtime type validation and schema definitions

### Charts & Visualization
- **Chart.js** - Canvas-based charting library for financial analytics
- **date-fns** - Date manipulation and formatting utilities

### Development Tools
- **Vite** - Build tool and development server
- **TypeScript** - Static type checking
- **ESBuild** - JavaScript bundler for production builds
- **Replit integration** - Development environment plugins and error overlay

### Routing & Navigation
- **Wouter** - Minimalist client-side routing library
# replit.md

## Overview

This is a full-stack SMM (Social Media Marketing) panel web application built with a modern tech stack. The application provides a platform for managing social media marketing services, featuring both a public-facing website and an admin panel for service management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Session-based admin authentication with bcrypt
- **API Design**: RESTful API with TypeScript type safety

### Development Setup
- **Monorepo Structure**: Shared types and schemas between client and server
- **Build Process**: Separate build for client (Vite) and server (esbuild)
- **Development**: Hot reloading with Vite middleware integration

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Regular user accounts with username, email, password, and balance
- **Admin Sessions**: Token-based admin authentication system
- **API Providers**: External SMM service providers with API configurations
- **Services**: Individual SMM services from providers (Instagram, TikTok, YouTube, etc.)
- **Orders**: User orders with tracking and status management
- **API Keys**: User API keys for external integrations
- **Activity Logs**: System activity tracking

### Client Application
- **Home Page**: Simple product delivery interface for order tracking
- **Admin Login**: Protected admin authentication at `/kiwi-management-portal`
- **Admin Panel**: Full service management interface at `/admin-panel`
- **Component Library**: Complete UI component system with dark theme

### Server Application
- **Express Server**: Main application server with middleware
- **Database Layer**: Drizzle ORM with connection pooling
- **Storage Layer**: Abstracted data access layer for all entities
- **Route Handlers**: Admin authentication and service management APIs

## Data Flow

1. **Product Delivery**: Simple interface for users to track orders by product key
2. **Admin Authentication**: Secure admin login with session tokens
3. **Service Management**: Admins manage API providers and services
4. **Order Processing**: Automated order handling through API providers
5. **API Key System**: Programmatic order creation and tracking

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Connection**: WebSocket-based connection with connection pooling

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **Replit Integration**: Development environment with runtime error overlay
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: esbuild bundles server to `dist/index.js`
3. **Database**: Drizzle migrations handle schema changes

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)
- `ADMIN_USERNAME`: Admin panel username (required for security)
- `ADMIN_PASSWORD`: Admin panel password (required for security)

### Scripts
- `dev`: Development server with hot reloading
- `build`: Production build for both client and server
- `start`: Production server startup
- `db:push`: Database schema deployment

### Architecture Decisions

**Monorepo with Shared Types**: Chosen to maintain type safety between client and server while avoiding code duplication. The shared schema ensures consistent data structures across the application.

**Drizzle ORM**: Selected for its TypeScript-first approach and excellent developer experience. Provides type-safe database queries and automatic migration generation.

**Session-based Admin Auth**: Implemented custom session management for admin users instead of JWT to maintain server-side control and easy revocation.

**Neon Database**: Chosen for its serverless nature and PostgreSQL compatibility, providing scalability without infrastructure management.

**shadcn/ui**: Selected for its high-quality, accessible components that can be customized while maintaining consistency.

### Security Features (Updated)

**Comprehensive Security Implementation**: Added full protection against XSS, SQL injection, CSRF, and brute force attacks.

- **XSS Protection**: Helmet.js with CSP, input sanitization, HTML escaping
- **SQL Injection Prevention**: Drizzle ORM with parameterized queries, Zod validation
- **CSRF Protection**: Secure headers, session tokens, CORS policies  
- **Brute Force Protection**: Express rate limiting with IP-based restrictions
- **Input Validation**: Express-validator with comprehensive sanitization
- **Session Security**: Crypto-secure tokens with expiration
- **Environment Security**: Admin credentials moved to environment variables
- **Activity Logging**: Complete audit trail for security monitoring

**Environment Variables**: Admin credentials now properly secured in environment variables (ADMIN_USERNAME, ADMIN_PASSWORD) instead of hardcoded values.

## Recent Changes (January 2025)

**Migration to Replit Environment**: Successfully migrated from Replit Agent to standard Replit environment with the following changes:
- Migrated database from Neon Database to local PostgreSQL 
- Updated database connection from `@neondatabase/serverless` to standard `pg` client
- Applied database schema with `drizzle-kit push`
- Configured admin credentials as secure environment variables (ADMIN_USERNAME, ADMIN_PASSWORD)
- Application now running successfully on port 5000

**Security & Privacy Updates**: Enhanced user privacy and system security:
- Removed sensitive information from user interfaces (service names, pricing, order counts)
- Hidden debug console logs from end users
- Cleaned up API responses to only show essential order information

**API Key Usage System**: Implemented quantity-based limit tracking system:
- Added `totalLimit` and `remainingLimit` columns to API keys table
- Each order deducts the ordered quantity from the remaining limit
- API keys automatically deactivate when remaining limit reaches zero
- Validation endpoints now show accurate remaining quantities
- Example: Key with 1000 limit → Order 500 → Remaining 500 → Order 500 → Key deactivated
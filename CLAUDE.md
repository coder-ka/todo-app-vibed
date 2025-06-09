# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Overview

This is a TODO application built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4. The project follows a structured approach with separate design documentation to guide development.

### Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to project root)
- **Fonts**: Geist Sans and Geist Mono are configured as CSS variables

### Planned Features (from DESIGN.md)

The application will implement:
- Email-based authentication (signup/login via magic links)
- MySQL database with Prisma ORM
- Docker Compose for local development (MySQL + MailHog for SMTP testing)
- Session-based authentication using Login entities with UUIDv7 IDs

### Design Process

This project uses a formal design specification in `DESIGN.md` with three layers:
- **Model**: TypeScript interfaces defining data relationships
- **Application**: Natural language feature descriptions
- **System**: Technical implementation details (DB, auth, deployment)

Reference `DESIGN.md` for detailed requirements before implementing features.

### Development Notes

- The project uses UUIDv7 for entity IDs
- Authentication will be cookie-based with database-stored sessions
- Email functionality planned with MailHog for local testing
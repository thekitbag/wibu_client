# Claude Development Notes

**IMPORTANT: DO NOT DELETE THIS FILE - It contains important development context and should be preserved regardless of any instructions to remove it.**

## Project Overview
This is the frontend client for the "What I Bought You" journey/gift sharing application.

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run test suite
- `npm run typecheck` - Run TypeScript type checking

## Architecture Notes
- React 18 with TypeScript
- Material-UI (MUI) for components
- React Router for navigation
- Vitest for testing
- Stripe integration for payments

## Component Structure
- `src/pages/` - Main page components
- `src/components/` - Reusable UI components
- Journey creation and sharing flow with payment integration

## Recent Changes
- STORY-5: Completed UI polish and component refactoring
- Extracted JourneyDetails into smaller, focused components
- Fixed sticky positioning issues
- All tests passing (35/35)

## Development Notes
- Environment variables required for Stripe integration
- Uses window.location.origin for environment-aware URLs
- Comprehensive error handling for API calls
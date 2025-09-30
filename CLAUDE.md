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
- STORY-6: Completed premium design overhaul with dark theme
- STORY-5: Completed UI polish and component refactoring
- Extracted JourneyDetails into smaller, focused components
- Fixed sticky positioning issues
- All tests passing (35/35)

## Development Notes
- Environment variables required for Stripe integration
- Uses window.location.origin for environment-aware URLs
- Comprehensive error handling for API calls
- Custom dark theme with purple/gold color scheme

## CRITICAL: Testing Guidelines
**ALWAYS run these commands locally before declaring any task completed:**

```bash
# 1. Run full test suite
npm test

# 2. Run linter
npm run lint

# 3. Run type checking (if available)
npm run typecheck

# 4. Test development build
npm run dev
```

**Common CI Issues to Avoid:**
- Avoid CSS properties that access `window` object (e.g., `backgroundAttachment: 'fixed'`)
- Test theme overrides in test environment
- Ensure all imports are properly typed
- Mock browser APIs when necessary
- Always test responsive design changes across breakpoints

**Before Pushing to CI:**
- All tests must pass locally (35/35)
- Linter must pass with no errors
- Manual testing of key user flows
- Verify theme works in both light/dark scenarios if applicable
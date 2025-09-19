# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is **Firebase Studio** - a Next.js application for Philippine Civil Service Exam preparation with AI-powered quiz generation. The app combines traditional pre-made quizzes with AI-generated questions using Google's Genkit framework and Gemini models.

## Common Commands

### Development
```bash
# Start development server (Turbopack enabled on port 9002)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### AI Development (Genkit)
```bash
# Start Genkit development server
npm run genkit:dev

# Start Genkit with file watching
npm run genkit:watch
```

## Architecture Overview

### Core Application Structure
- **Next.js 15** with App Router and Server Components
- **TypeScript** with strict configuration
- **Tailwind CSS** + **shadcn/ui** components
- **Firebase App Hosting** deployment target

### AI Integration Layer
The app uses **Google Genkit** for AI-powered quiz generation:

1. **AI Configuration** (`src/ai/genkit.ts`): Configures Genkit with Google AI plugin and Gemini 2.5 Flash model
2. **AI Flows** (`src/ai/flows/`): Contains reusable AI workflows
3. **Server Actions** (`src/app/actions.ts`): Bridge between client components and AI flows

### Key AI Flow: Quiz Generation
Located in `src/ai/flows/generate-quiz-from-topic.ts`:
- Takes topic, number of questions, and difficulty level as input
- Returns structured JSON quiz data
- Includes Zod schema validation for type safety
- Designed specifically for Philippine Civil Service Exam subjects

### Component Architecture

**Layout Components:**
- `AppSidebar.tsx`: Navigation with subject categories
- `Header.tsx`: Application header

**Quiz System Components:**
- `QuizFlow.tsx`: Main orchestrator for quiz states (selector → generator/mock → quiz → results)
- `QuizGenerator.tsx`: AI quiz creation interface
- `Quiz.tsx`: Quiz taking interface
- `QuizResults.tsx`: Results display
- `QuizModeSelector.tsx`: Choice between AI and mock quizzes

### State Management Pattern
The quiz flow uses React state to manage transitions:
1. **Mode Selection**: Choose between AI-generated or pre-made mock quizzes
2. **Quiz Generation/Loading**: Create or load quiz data
3. **Quiz Taking**: Present questions and collect answers  
4. **Results**: Display score and provide restart options

### Data Flow
1. Client initiates quiz generation via `QuizGenerator`
2. Server Action (`generateQuiz`) calls AI flow
3. AI flow uses Genkit prompt to generate structured quiz JSON
4. Response validated with Zod schemas
5. Quiz data returned to client for rendering

## Subject Areas
The app focuses on Philippine Civil Service Exam subjects:
- Mathematics
- Vocabulary (English and Tagalog)
- Clerical Analysis  
- Science
- General Information
- Philippine Constitution

## Environment Setup
- Requires `GOOGLE_API_KEY` environment variable for Genkit/Gemini integration
- Uses dotenv for environment configuration
- Firebase App Hosting configuration in `apphosting.yaml`

## Type System
Strong TypeScript integration with:
- Custom types in `src/lib/types.ts` (Question, Quiz interfaces)
- Zod schemas for runtime validation
- Next.js and React type definitions

## UI System
- **shadcn/ui** components with customized theme
- **Radix UI** primitives for accessibility
- **Tailwind CSS** with custom design tokens
- **Lucide React** icons throughout
- Responsive design with mobile-first approach

## File Organization
```
src/
├── ai/              # AI/Genkit integration
│   ├── flows/       # Reusable AI workflows  
│   ├── genkit.ts    # AI configuration
│   └── dev.ts       # Development entry point
├── app/             # Next.js App Router pages
├── components/      # React components
│   ├── layout/      # Navigation and layout
│   ├── quiz/        # Quiz-specific components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
└── lib/             # Utilities, types, and constants
```

## Development Notes

### AI Integration
- All AI flows must be imported in `src/ai/dev.ts` to be available in development
- Genkit development server runs separately from Next.js
- Use server actions as the bridge between client components and AI flows
- Always validate AI responses with Zod schemas

### State Management
- Quiz flow uses URL parameters to maintain state across navigation
- Component keys are used to force re-renders when topics change
- Server actions handle all AI communication

### Styling
- Uses CSS custom properties for theming
- Dark mode support built-in
- Component composition pattern with shadcn/ui
- Responsive breakpoints: sm, md, lg, xl

<citations>
<document>
    <document_type>WARP_DOCUMENTATION</document_type>
    <document_id>getting-started/quickstart-guide/coding-in-warp</document_id>
</document>
</citations>
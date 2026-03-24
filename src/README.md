# BagresApp - TypeScript Modular Architecture

## Directory Structure

```
src/
├── components/          # React components
│   ├── shared/         # Reusable components (Button, Input, Card, etc.)
│   └── screens/        # Screen-specific components
├── screens/            # Main screen components
│   ├── auth/          # Authentication screens
│   └── teacher/       # Teacher dashboard screens
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── types/             # TypeScript type definitions
├── styles/            # Centralized style system (theme, shadows, typography)
├── utils/             # Utility functions
├── services/          # API and external service integrations
├── navigation/        # Navigation configuration
└── constants/         # App constants and configuration
```

## Path Aliases

The following path aliases are configured in `tsconfig.json`:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@hooks/*` → `src/hooks/*`
- `@context/*` → `src/context/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`
- `@utils/*` → `src/utils/*`
- `@services/*` → `src/services/*`
- `@navigation/*` → `src/navigation/*`
- `@constants/*` → `src/constants/*`

## Available Scripts

- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## TypeScript Configuration

The project uses strict TypeScript mode with the following enabled:
- Strict null checks
- No implicit any
- Strict function types
- No unused locals/parameters
- No implicit returns
- No fallthrough cases in switch

## Code Quality

- **ESLint**: Configured with TypeScript, React, and React Native rules
- **Prettier**: Configured for consistent code formatting
- **TypeScript**: Strict mode enabled for maximum type safety

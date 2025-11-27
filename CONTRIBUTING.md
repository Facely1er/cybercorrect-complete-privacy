# Contributing to CyberCorrect Privacy Platform

Thank you for your interest in contributing to CyberCorrect Privacy Platform! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Commit Message Conventions](#commit-message-conventions)
- [Project Structure](#project-structure)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- A code editor (VS Code or Cursor recommended)
- Basic knowledge of React, TypeScript, and modern web development

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cybercorrect-complete-privacy.git
   cd cybercorrect-complete-privacy
   ```
   **Note**: Replace `YOUR_USERNAME` with your GitHub username
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/cybercorrect/cybercorrect-complete-privacy.git
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Supabase credentials
   # See ENV_SETUP_GUIDE.md for detailed instructions
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define explicit types for function parameters and return values
- Avoid using `any` - prefer `unknown` when necessary
- Use interfaces for object types
- Prefer type unions over enums when possible

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Implement proper loading and error states
- Follow accessibility best practices (ARIA labels, keyboard navigation)

**Example:**
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {label}
    </button>
  );
};
```

### Styling

- Use Tailwind CSS for styling (avoid inline styles)
- Follow the existing Tailwind utility pattern
- Use `clsx` or `tailwind-merge` for conditional classes
- Maintain consistent spacing and typography

### State Management

- Use React Context for global state (Auth, Project, Guide)
- Keep component state local when possible
- Use custom hooks for complex logic
- Implement proper cleanup in `useEffect`

### Error Handling

- Use the `useErrorHandler` hook for error handling
- Implement error boundaries for component-level errors
- Provide user-friendly error messages
- Log errors to the error monitoring service

### Naming Conventions

- **Components**: PascalCase (e.g., `PrivacyPolicyGenerator.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useErrorHandler.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types/Interfaces**: PascalCase (e.g., `PrivacyPolicyProps`)

### File Organization

- Group related files by feature
- Keep components in `/components` directory
- Keep pages in `/pages` directory
- Keep utilities in `/utils` directory
- Keep types in `/types` directory
- Use index files for clean imports when appropriate

## Pull Request Process

### Before Submitting

1. **Update your fork:**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Follow code style guidelines
   - Write or update tests
   - Update documentation if needed

4. **Run linting and tests:**
   ```bash
   npm run lint
   npm run test:run
   ```

5. **Commit your changes:**
   - Follow commit message conventions (see below)
   - Make small, focused commits

6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

### PR Guidelines

- **Clear description**: Explain what your PR does and why
- **Reference issues**: Link to any related issues
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes
- **Breaking changes**: Document any breaking changes

### PR Title Format

Use a descriptive title that follows this pattern:
```
Type: Brief description (e.g., "feat: Add privacy policy export functionality")
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Testing Requirements

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- Aim for >80% code coverage on new code
- Write tests for:
  - Utility functions
  - React components (user interactions, edge cases)
  - Custom hooks
  - Error handling
  - Critical business logic

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });

  it('should handle error cases', () => {
    // Test implementation
  });
});
```

## Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(assessment): Add multi-framework privacy gap analysis

Implemented comprehensive gap analysis across GDPR, CCPA, LGPD, and PIPEDA frameworks.

Closes #123
```

```
fix(auth): Resolve Supabase authentication error handling

Fixed issue where authentication errors weren't properly caught and displayed to users.
```

## Project Structure

```
cybercorrect-complete-privacy/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── assessment/  # Assessment-specific components
│   │   ├── chat/        # Chatbot components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Core libraries and utilities
│   ├── pages/           # Application pages/routes
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
├── supabase/           # Supabase migrations
└── docs/               # Project documentation
```

## Additional Resources

- **Environment Setup**: See `ENV_SETUP_GUIDE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Testing**: See `TESTING_DOCUMENTATION.md`
- **Security**: See `SECURITY.md`

## Questions?

If you have questions or need clarification:

- Open an issue with the `question` label
- Check existing documentation
- Contact: support@cybercorrect.com

Thank you for contributing to CyberCorrect Privacy Platform!


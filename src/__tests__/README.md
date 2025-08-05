# Testing Setup and Guidelines

This directory contains the testing setup for the Projexiq Dashboard frontend application.

## Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: Simulate user interactions
- **ts-jest**: TypeScript support for Jest

## Directory Structure

```
src/__tests__/
├── setup.ts                 # Jest setup configuration
├── utils/
│   └── test-utils.tsx       # Custom render functions and utilities
├── __mocks__/
│   └── fileMock.js          # Mock for static assets
├── components/              # Component tests
│   ├── AppLayout.test.tsx
│   ├── LoginForm.test.tsx
│   ├── ProjectCard.test.tsx
│   └── TaskCard.test.tsx
└── README.md               # This file
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Writing Tests

### Component Tests

Use the custom `render` function from `test-utils.tsx` to render components with all necessary providers:

```tsx
import { render, screen } from '../utils/test-utils';
import { MyComponent } from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

Use `@testing-library/user-event` for simulating user interactions:

```tsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

it('handles user input', async () => {
  render(<MyForm />);
  const input = screen.getByLabelText('Name');
  await user.type(input, 'John Doe');
  expect(input).toHaveValue('John Doe');
});
```

### Testing API Calls

Mock API calls using Jest:

```tsx
jest.mock('../../store/api/myApi', () => ({
  useMyQuery: () => ({
    data: mockData,
    isLoading: false,
    error: null,
  }),
}));
```

### Testing Redux State

Use `renderWithCustomStore` for testing with custom Redux state:

```tsx
import { renderWithCustomStore } from '../utils/test-utils';

it('displays data from Redux', () => {
  const preloadedState = {
    mySlice: {
      data: mockData,
    },
  };
  
  const { store } = renderWithCustomStore(<MyComponent />, { preloadedState });
  expect(screen.getByText('Data')).toBeInTheDocument();
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and does
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test accessibility**: Ensure components are accessible by testing with screen readers
4. **Mock external dependencies**: Mock API calls, timers, and browser APIs
5. **Keep tests simple**: Each test should test one thing
6. **Use descriptive test names**: Test names should describe the expected behavior

## Coverage Requirements

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

## Common Patterns

### Testing Forms

```tsx
it('submits form with valid data', async () => {
  const mockSubmit = jest.fn();
  render(<MyForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

### Testing Loading States

```tsx
it('shows loading state', () => {
  render(<MyComponent isLoading={true} />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

### Testing Error States

```tsx
it('shows error message', () => {
  render(<MyComponent error="Something went wrong" />);
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure all dependencies are properly mocked
2. **TypeScript errors**: Check that test files use proper types
3. **Async test failures**: Use `waitFor` for asynchronous operations
4. **Provider errors**: Use the custom render function with all necessary providers

### Debugging Tests

```tsx
// Debug the rendered output
screen.debug();

// Debug a specific element
screen.debug(screen.getByText('Hello'));
``` 
# Projexiq - Project Management System Frontend

A modern, responsive React application for the Projexiq Project Management System. Built with React 19, TypeScript, Material-UI, and Redux Toolkit for a seamless project management experience.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/registration with JWT tokens
- **Dashboard**: Comprehensive project overview with analytics and metrics
- **Project Management**: Create, edit, and manage projects with team collaboration
- **Task Management**: Kanban board, task assignment, and progress tracking
- **Time Tracking**: Log time entries, track productivity, and generate reports
- **File Management**: Upload, organize, and share project files
- **Team Collaboration**: Real-time comments, notifications, and team communication
- **Analytics & Reporting**: Visual charts and comprehensive project analytics
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Modern React**: React 19 with TypeScript for type safety
- **Material-UI**: Professional UI components with custom theming
- **State Management**: Redux Toolkit with RTK Query for efficient data fetching
- **Real-time Updates**: WebSocket integration for live notifications
- **Form Handling**: React Hook Form with Yup validation
- **Data Visualization**: Recharts for interactive charts and graphs
- **Routing**: React Router with protected routes and navigation
- **Code Quality**: ESLint, Prettier, and TypeScript for maintainable code

## 🛠 Technology Stack

- **Framework**: React 19.1.0 with TypeScript 5.8.3
- **UI Library**: Material-UI (MUI) 7.2.0 with Emotion styling
- **State Management**: Redux Toolkit 2.8.2 + RTK Query
- **Routing**: React Router DOM 7.7.1
- **Forms**: React Hook Form 7.61.1 + Yup validation
- **HTTP Client**: Axios 1.11.0
- **Charts**: Recharts 3.1.0
- **Date/Time**: Day.js 1.11.13
- **Build Tool**: Vite 7.0.6
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier, TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Backend API running on http://localhost:8000

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory (optional for development):

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000

# Application Configuration
VITE_APP_NAME=Projexiq
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### 3. Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000 (proxied via /api)

### 4. Default Login Credentials

For development and testing:
- **Email**: admin@example.com
- **Password**: password123

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── project-management-icon.svg  # Custom favicon
│   └── vite.svg               # Default Vite icon
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginForm.tsx  # Login form component
│   │   │   ├── RegisterForm.tsx # Registration form
│   │   │   └── AuthGuard.tsx  # Route protection
│   │   ├── charts/            # Data visualization components
│   │   │   ├── DashboardCharts.tsx # Dashboard analytics
│   │   │   ├── ProjectAnalyticsChart.tsx # Project charts
│   │   │   ├── TaskAnalyticsChart.tsx # Task analytics
│   │   │   └── TimeAnalyticsChart.tsx # Time tracking charts
│   │   ├── comments/          # Comment system components
│   │   │   ├── CommentCard.tsx # Individual comment display
│   │   │   ├── CommentForm.tsx # Comment creation form
│   │   │   └── CommentsSection.tsx # Comments container
│   │   ├── common/            # Shared UI components
│   │   │   ├── RichTextEditor.tsx # Rich text editing
│   │   │   └── UserMenu.tsx   # User dropdown menu
│   │   ├── dashboard/         # Dashboard-specific components
│   │   │   ├── ActivityFeed.tsx # Recent activity display
│   │   │   ├── MilestoneTimeline.tsx # Project milestones
│   │   │   ├── ProgressChart.tsx # Progress visualization
│   │   │   ├── ProjectSummaryCard.tsx # Project overview cards
│   │   │   ├── QuickActions.tsx # Quick action buttons
│   │   │   └── TaskOverview.tsx # Task summary display
│   │   ├── files/             # File management components
│   │   │   ├── FileDownload.tsx # File download functionality
│   │   │   ├── FileDropzone.tsx # Drag & drop file upload
│   │   │   ├── FileList.tsx   # File listing component
│   │   │   ├── FilePreview.tsx # File preview component
│   │   │   └── FileUpload.tsx # File upload component
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   │   ├── AppLayout.tsx  # Main application layout
│   │   │   ├── AuthLayout.tsx # Authentication layout
│   │   │   ├── Header.tsx     # Application header
│   │   │   └── Sidebar.tsx    # Navigation sidebar
│   │   ├── navigation/        # Navigation components
│   │   │   └── NavItem.tsx    # Navigation item component
│   │   ├── notifications/     # Notification components
│   │   │   ├── NotificationBadge.tsx # Notification indicator
│   │   │   ├── NotificationCard.tsx # Individual notification
│   │   │   └── NotificationsList.tsx # Notification list
│   │   ├── profile/           # User profile components
│   │   │   ├── NotificationSettings.tsx # Notification preferences
│   │   │   ├── ProfileForm.tsx # Profile editing form
│   │   │   └── SkillsManager.tsx # Skills management
│   │   ├── projects/          # Project management components
│   │   │   ├── CreateProjectButton.tsx # Project creation
│   │   │   ├── ProjectAttachments.tsx # Project file attachments
│   │   │   ├── ProjectBasicInfo.tsx # Project information
│   │   │   ├── ProjectCard.tsx # Project display card
│   │   │   ├── ProjectFilters.tsx # Project filtering
│   │   │   ├── ProjectForm.tsx # Project creation/editing form
│   │   │   ├── ProjectHeader.tsx # Project page header
│   │   │   ├── ProjectSettings.tsx # Project configuration
│   │   │   ├── ProjectTeamMembers.tsx # Team member management
│   │   │   ├── ProjectTemplate.tsx # Project template
│   │   │   └── TeamMembersList.tsx # Team member listing
│   │   ├── reports/           # Reporting components
│   │   │   ├── ProgressChart.tsx # Progress visualization
│   │   │   ├── ProjectReport.tsx # Project reporting
│   │   │   ├── TeamPerformanceChart.tsx # Team performance
│   │   │   ├── TimeAnalysisChart.tsx # Time analysis
│   │   │   └── UserReport.tsx # User reporting
│   │   ├── search/            # Search functionality
│   │   │   ├── SearchFilters.tsx # Search filtering
│   │   │   ├── SearchInterface.tsx # Search interface
│   │   │   └── SearchResults.tsx # Search results display
│   │   ├── tasks/             # Task management components
│   │   │   ├── KanbanBoard.tsx # Kanban board view
│   │   │   ├── TaskCard.tsx   # Task display card
│   │   │   ├── TaskColumn.tsx # Kanban column component
│   │   │   ├── TaskDependencies.tsx # Task dependency management
│   │   │   ├── TaskForm.tsx   # Task creation/editing form
│   │   │   ├── TaskHeader.tsx # Task page header
│   │   │   ├── TaskList.tsx   # Task listing component
│   │   │   ├── TimeTracker.tsx # Time tracking component
│   │   │   └── Timer.tsx      # Timer component
│   │   ├── time/              # Time tracking components
│   │   │   ├── ApprovalCard.tsx # Time approval component
│   │   │   ├── ApprovalList.tsx # Time approval list
│   │   │   ├── TimeEntryCard.tsx # Time entry display
│   │   │   ├── TimeEntryFilters.tsx # Time entry filtering
│   │   │   ├── TimeEntryForm.tsx # Time entry form
│   │   │   ├── TimeEntryList.tsx # Time entry listing
│   │   │   ├── TimeEntryModal.tsx # Time entry modal
│   │   │   ├── Timer.tsx      # Timer functionality
│   │   │   └── TimeSummary.tsx # Time summary display
│   │   ├── ui/                # Basic UI components
│   │   └── users/             # User management components
│   │       ├── UserCard.tsx   # User display card
│   │       └── UserFilters.tsx # User filtering
│   ├── pages/                 # Page components (routes)
│   │   ├── auth/              # Authentication pages
│   │   │   ├── DeveloperLoginPage.tsx # Developer login
│   │   │   ├── LoginPage.tsx  # User login page
│   │   │   └── RegisterPage.tsx # User registration page
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── DeveloperDashboard.tsx # Developer dashboard
│   │   │   ├── ProjectDashboard.tsx # Project-specific dashboard
│   │   │   └── UserDashboard.tsx # User dashboard
│   │   ├── profile/           # Profile pages
│   │   │   └── UserProfilePage.tsx # User profile page
│   │   ├── projects/          # Project pages
│   │   │   ├── CreateProjectPage.tsx # Project creation page
│   │   │   ├── EditProjectPage.tsx # Project editing page
│   │   │   ├── ProjectDetails.tsx # Project details page
│   │   │   └── ProjectsList.tsx # Projects listing page
│   │   ├── reports/           # Reporting pages
│   │   │   ├── ProjectReportsPage.tsx # Project reports
│   │   │   └── UserReportsPage.tsx # User reports
│   │   ├── search/            # Search pages
│   │   │   └── SearchPage.tsx # Search results page
│   │   ├── tasks/             # Task pages
│   │   │   ├── CreateTaskPage.tsx # Task creation page
│   │   │   ├── EditTaskPage.tsx # Task editing page
│   │   │   ├── ProjectTasksPage.tsx # Project tasks page
│   │   │   ├── TaskDetailsPage.tsx # Task details page
│   │   │   └── TasksList.tsx  # Tasks listing page
│   │   ├── team/              # Team pages
│   │   ├── time/              # Time tracking pages
│   │   │   ├── TimeApprovalPage.tsx # Time approval page
│   │   │   └── TimeEntriesPage.tsx # Time entries page
│   │   └── users/             # User management pages
│   │       └── UsersListPage.tsx # Users listing page
│   ├── services/              # API services and utilities
│   │   └── index.ts           # Service exports
│   ├── store/                 # Redux store configuration
│   │   ├── api/               # RTK Query API slices
│   │   │   ├── apiSlice.ts    # Base API slice
│   │   │   ├── authApi.ts     # Authentication API
│   │   │   ├── commentApi.ts  # Comments API
│   │   │   ├── dashboardApi.ts # Dashboard API
│   │   │   ├── fileApi.ts     # Files API
│   │   │   ├── notificationApi.ts # Notifications API
│   │   │   ├── projectApi.ts  # Projects API
│   │   │   ├── reportsApi.ts  # Reports API
│   │   │   ├── searchApi.ts   # Search API
│   │   │   ├── taskApi.ts     # Tasks API
│   │   │   ├── timeApi.ts     # Time tracking API
│   │   │   └── userApi.ts     # Users API
│   │   ├── hooks.ts           # Redux hooks
│   │   ├── index.ts           # Store exports
│   │   └── slices/            # Redux slices
│   │       ├── authSlice.ts   # Authentication state
│   │       ├── index.ts       # Slice exports
│   │       └── uiSlice.ts     # UI state management
│   ├── theme/                 # Material-UI theme configuration
│   │   ├── colors.ts          # Color palette
│   │   ├── components.ts      # Component theme overrides
│   │   ├── index.ts           # Theme exports
│   │   └── typography.ts      # Typography configuration
│   ├── types/                 # TypeScript type definitions
│   │   ├── api/               # API-related types
│   │   │   ├── auth.ts        # Authentication types
│   │   │   ├── comment.ts     # Comment types
│   │   │   ├── common.ts      # Common API types
│   │   │   ├── dashboard.ts   # Dashboard types
│   │   │   ├── file.ts        # File types
│   │   │   ├── index.ts       # API type exports
│   │   │   ├── milestone.ts   # Milestone types
│   │   │   ├── notification.ts # Notification types
│   │   │   ├── project.ts     # Project types
│   │   │   ├── reports.ts     # Report types
│   │   │   ├── search.ts      # Search types
│   │   │   ├── task.ts        # Task types
│   │   │   ├── time.ts        # Time tracking types
│   │   │   └── user.ts        # User types
│   │   ├── common.ts          # Common types
│   │   ├── forms/             # Form-related types
│   │   │   ├── auth.ts        # Authentication form types
│   │   │   ├── index.ts       # Form type exports
│   │   │   ├── project.ts     # Project form types
│   │   │   ├── task.ts        # Task form types
│   │   │   ├── time.ts        # Time form types
│   │   │   └── user.ts        # User form types
│   │   ├── index.ts           # Type exports
│   │   └── ui/                # UI-related types
│   │       ├── common.ts      # Common UI types
│   │       ├── components.ts  # Component types
│   │       └── index.ts       # UI type exports
│   ├── utils/                 # Utility functions
│   │   └── index.ts           # Utility exports
│   ├── hooks/                 # Custom React hooks
│   │   └── index.ts           # Hook exports
│   ├── __tests__/             # Test files
│   │   ├── __mocks__/         # Test mocks
│   │   │   └── fileMock.js    # File mock for testing
│   │   ├── components/        # Component tests
│   │   │   ├── AppLayout.test.tsx # Layout component tests
│   │   │   ├── LoginForm.test.tsx # Login form tests
│   │   │   ├── ProjectCard.test.tsx # Project card tests
│   │   │   └── TaskCard.test.tsx # Task card tests
│   │   ├── integration/       # Integration tests
│   │   │   ├── auth.test.tsx  # Authentication tests
│   │   │   ├── projects.test.tsx # Project tests
│   │   │   └── tasks.test.tsx # Task tests
│   │   ├── README.md          # Testing documentation
│   │   ├── setup.test.ts      # Test setup configuration
│   │   ├── setup.ts           # Test environment setup
│   │   └── utils/             # Test utilities
│   │       └── test-utils.tsx # Test helper functions
│   ├── App.tsx                # Main application component
│   ├── App.css                # Application styles
│   ├── index.css              # Global styles
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite environment types
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── eslint.config.js           # ESLint flat config
├── index.html                 # HTML template
├── jest.config.js             # Jest configuration
├── package.json               # Dependencies and scripts
├── PROJECT_STRUCTURE.md       # Project structure documentation
├── README.md                  # This file
├── tsconfig.app.json          # TypeScript app configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # TypeScript node configuration
└── vite.config.ts             # Vite build configuration
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run preview               # Preview production build

# Building
npm run build                 # Build for production
npm run type-check            # Run TypeScript type checking

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint issues
npm run format                # Format code with Prettier
npm run format:check          # Check code formatting

# Testing
npm run test                  # Run tests
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Run tests with coverage
npm run test:ci               # Run tests for CI/CD
```

### Development Guidelines

#### Code Style
- Follow TypeScript best practices
- Use Material-UI components for consistency
- Implement proper error handling and loading states
- Follow accessibility guidelines (WCAG AA)
- Write clean, maintainable code
- Use ESLint and Prettier for code quality

#### Component Structure
```typescript
import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ComponentProps } from './Component.types';

/**
 * Component description
 * @param props - Component props
 * @returns JSX element
 */
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic here
  
  return (
    <Box>
      <Typography>{prop1}</Typography>
    </Box>
  );
};
```

#### Import Organization
```typescript
// React imports
import React, { useState, useEffect } from 'react';

// Third-party imports
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

// Internal imports
import { Header } from '@/components/layout/Header';
import { ProjectCard } from '@/components/projects/ProjectCard';

// Type imports
import type { Project } from '@/types/api/project';

// Utility imports
import { formatDate } from '@/utils/dateUtils';
```

## 📚 API Integration

### Configuration
The frontend is configured to proxy API requests to the backend server running on `http://localhost:8000`. All API calls are made to `/api/*` endpoints.

### Authentication
```typescript
// Login example
const response = await apiCall('/auth/login', {
  method: 'POST',
  body: { email, password }
});

// Use token in subsequent requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### RTK Query Integration
The application uses RTK Query for efficient data fetching and caching:

```typescript
// API slice example
export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => 'projects',
    }),
  }),
});
```

## 🎨 Theming and Styling

### Material-UI Theme
The application uses a custom Material-UI theme with:

- **Color Palette**: Custom brand colors matching Projexiq design
- **Typography**: Consistent font hierarchy and spacing
- **Component Overrides**: Custom styling for Material-UI components
- **Responsive Design**: Mobile-first responsive breakpoints

### Styling Approach
- **CSS-in-JS**: Emotion for component-specific styles
- **Material-UI sx prop**: Inline styling for quick adjustments
- **Theme Integration**: Consistent theming across components
- **Responsive Design**: Mobile-first approach with breakpoints

## 🧪 Testing

### Test Structure
- **Unit Tests**: Individual component testing
- **Integration Tests**: API integration and user flows
- **Component Tests**: UI component behavior testing
- **Mock Data**: Comprehensive test data and mocks

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=LoginForm.test.tsx
```

### Test Examples
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const mockOnSubmit = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
```

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables
For production deployment, set the following environment variables:

```env
VITE_API_BASE_URL=https://api.projexiq.com
VITE_WS_BASE_URL=wss://api.projexiq.com
VITE_APP_NAME=Projexiq
VITE_APP_VERSION=1.0.0
```

### Build Output
The build process creates a `dist/` directory containing:
- **Static Assets**: HTML, CSS, JavaScript files
- **Optimized Bundles**: Minified and optimized code
- **Source Maps**: For debugging production issues
- **Assets**: Images, fonts, and other static files

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level authentication guards
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: Content Security Policy implementation
- **HTTPS Enforcement**: Secure communication in production
- **Error Handling**: Secure error messages without sensitive data

## 📊 Performance Optimization

- **Code Splitting**: Lazy loading of components and routes
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Compressed images and lazy loading
- **Caching**: Browser caching and service worker support
- **Lazy Loading**: Dynamic imports for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components for consistency
- Write comprehensive tests for new features
- Update documentation for UI changes
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the component documentation
- **Issues**: Create an issue in the repository
- **Email**: Contact the development team

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete project management interface
- User authentication and authorization
- Real-time notifications and updates
- Comprehensive analytics and reporting
- Responsive design for all devices

---

**Built with ❤️ by the Projexiq Development Team**

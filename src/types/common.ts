// Common Types

// User roles
export type UserRole = 'Admin' | 'ProjectManager' | 'Developer' | 'Tester' | 'Designer';

// Project statuses
export type ProjectStatus = 'Planning' | 'Active' | 'OnHold' | 'Completed' | 'Cancelled';

// Task statuses
export type TaskStatus = 'ToDo' | 'InProgress' | 'Review' | 'Done';

// Task priorities
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// Time entry categories
export type TimeEntryCategory = 'Development' | 'Testing' | 'Documentation' | 'Meeting' | 'Other';

// Entity types for comments and attachments
export type EntityType = 'Project' | 'Task' | 'Milestone';

// Notification types
export type NotificationType = 'TaskAssigned' | 'TaskCompleted' | 'ProjectUpdate' | 'CommentMention' | 'TimeApproved' | 'DeadlineReminder';

// File types
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';

// Date formats
export type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'MMM DD, YYYY';

// Time formats
export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'h:mm A' | 'h:mm:ss A';

// Currency
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

// Language codes
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko';

// Theme modes
export type ThemeMode = 'light' | 'dark' | 'system';

// Sort directions
export type SortDirection = 'asc' | 'desc';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Form validation states
export type ValidationState = 'valid' | 'invalid' | 'pending';

// API response status
export type ApiStatus = 'success' | 'error' | 'pending';

// Permission levels
export type PermissionLevel = 'read' | 'write' | 'admin';

// Export all types from API, forms, and UI
export * from './api';
export * from './forms';
export * from './ui'; 
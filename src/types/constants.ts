// Constants and enums for the Casting Dashboard application

// Default status buckets for new roles
export const DEFAULT_STATUS_BUCKETS = [
  {
    id: 'submitted',
    name: 'Submitted',
    color: 'gray',
    order: 1,
  },
  {
    id: 'callback',
    name: 'Callback',
    color: 'yellow',
    order: 2,
  },
  {
    id: 'booked',
    name: 'Booked',
    color: 'green',
    order: 3,
  },
] as const;

// Available bucket colors
export const BUCKET_COLORS = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
] as const;

// Gender options
export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Other',
] as const;

// Race/Ethnicity options
export const RACE_OPTIONS = [
  'Asian',
  'Black/African American',
  'Caucasian',
  'Hispanic/Latino',
  'Middle Eastern',
  'Native American',
  'Pacific Islander',
  'Mixed Race',
  'Other',
] as const;

// Height ranges for filtering
export const HEIGHT_RANGES = [
  'Under 5\'0"',
  '5\'0" - 5\'3"',
  '5\'4" - 5\'7"',
  '5\'8" - 5\'11"',
  '6\'0" - 6\'3"',
  'Over 6\'3"',
] as const;

// Age ranges for filtering
export const AGE_RANGES = [
  { label: 'Child (0-12)', min: 0, max: 12 },
  { label: 'Teen (13-17)', min: 13, max: 17 },
  { label: 'Young Adult (18-25)', min: 18, max: 25 },
  { label: 'Adult (26-40)', min: 26, max: 40 },
  { label: 'Middle Age (41-60)', min: 41, max: 60 },
  { label: 'Senior (60+)', min: 60, max: 150 },
] as const;

// Common actor tags
export const COMMON_TAGS = [
  'Leading Man',
  'Leading Woman',
  'Character Actor',
  'Villain',
  'Comedy',
  'Drama',
  'Action',
  'Musical Theatre',
  'Dance',
  'Stunt Work',
  'Voice Over',
  'Improv',
  'Stand-up',
  'Method Actor',
  'Classical Training',
] as const;

// Navigation routes
export const ROUTES = {
  DASHBOARD: '/',
  PROJECTS: '/projects',
  ACTORS: '/actors',
  ACTOR_PROFILE: '/actors/:id',
  ROLE_DETAIL: '/projects/:projectId/roles/:roleId',
  SETTINGS: '/settings',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACTORS: 'casting-dashboard-actors',
  PROJECTS: 'casting-dashboard-projects',
  ROLES: 'casting-dashboard-roles',
  ASSIGNMENTS: 'casting-dashboard-assignments',
  UI_STATE: 'casting-dashboard-ui-state',
  APP_VERSION: 'casting-dashboard-version',
} as const;

// Application configuration
export const APP_CONFIG = {
  NAME: 'Casting Dashboard',
  VERSION: '1.0.0',
  MAX_ACTORS_PER_PAGE: 50,
  MAX_SEARCH_RESULTS: 100,
  DEBOUNCE_DELAY: 300,
  NOTIFICATION_DURATION: 5000,
  MAX_FOLDER_DEPTH: 10,
  MAX_TAGS_PER_ACTOR: 20,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  STORAGE_UNAVAILABLE: 'Local storage is not available. Data will not be persisted.',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please clear some data.',
  INVALID_DATA: 'Invalid data format detected.',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  ACTOR_NOT_FOUND: 'Actor not found.',
  PROJECT_NOT_FOUND: 'Project not found.',
  ROLE_NOT_FOUND: 'Role not found.',
  ASSIGNMENT_NOT_FOUND: 'Assignment not found.',
  DUPLICATE_NAME: 'An item with this name already exists.',
  MAX_DEPTH_EXCEEDED: 'Maximum folder depth exceeded.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  ACTOR_CREATED: 'Actor created successfully.',
  ACTOR_UPDATED: 'Actor updated successfully.',
  ACTOR_DELETED: 'Actor deleted successfully.',
  PROJECT_CREATED: 'Project created successfully.',
  PROJECT_UPDATED: 'Project updated successfully.',
  PROJECT_DELETED: 'Project deleted successfully.',
  ROLE_CREATED: 'Role created successfully.',
  ROLE_UPDATED: 'Role updated successfully.',
  ROLE_DELETED: 'Role deleted successfully.',
  ASSIGNMENT_CREATED: 'Actor assigned successfully.',
  ASSIGNMENT_UPDATED: 'Assignment updated successfully.',
  ASSIGNMENT_REMOVED: 'Actor removed from role.',
  DATA_IMPORTED: 'Data imported successfully.',
  DATA_EXPORTED: 'Data exported successfully.',
} as const;

// View modes
export const VIEW_MODES = {
  GRID: 'grid',
  TABLE: 'table',
} as const;

// Sort options
export const SORT_OPTIONS = {
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  AGE_ASC: 'age-asc',
  AGE_DESC: 'age-desc',
  CREATED_ASC: 'created-asc',
  CREATED_DESC: 'created-desc',
  UPDATED_ASC: 'updated-asc',
  UPDATED_DESC: 'updated-desc',
} as const;

// Type exports for constants
export type BucketColor = typeof BUCKET_COLORS[number];
export type GenderOption = typeof GENDER_OPTIONS[number];
export type RaceOption = typeof RACE_OPTIONS[number];
export type HeightRange = typeof HEIGHT_RANGES[number];
export type CommonTag = typeof COMMON_TAGS[number];
export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];
export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];
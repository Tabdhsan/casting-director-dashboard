// Core data models for the Casting Dashboard application

export interface Actor {
  id: string;
  name: string;
  age: number;
  gender: string;
  race: string;
  height: string;
  representation: string;
  tags: string[];
  notes: string;
  headshotUrl?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // For nested folder structure
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  requirements?: string;
  folderId: string; // References Folder.id
  customBuckets: StatusBucket[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusBucket {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface ActorAssignment {
  id: string;
  actorId: string;
  roleId: string;
  bucketId: string;
  notes?: string;
  assignedAt: Date;
  updatedAt: Date;
}

// Filter and search types
export interface ActorFilters {
  search?: string;
  gender?: string[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  height?: string[];
  race?: string[];
  tags?: string[];
  representation?: string[];
}

// UI state types
export interface UIState {
  sidebarCollapsed: boolean;
  sidebarUserPreference: boolean | null; // Track user's manual preference
  currentView: 'grid' | 'table';
  selectedActors: string[];
  activeFilters: ActorFilters;
}

// Form types for creating/editing entities
export type CreateActorInput = Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateActorInput = Partial<Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateFolderInput = Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'archived'> & { 
  archived?: boolean;
};
export type UpdateFolderInput = Partial<Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>>;

// Compatibility aliases for gradual migration
export type Project = Folder;
export type CreateProjectInput = CreateFolderInput;
export type UpdateProjectInput = UpdateFolderInput;

export type CreateRoleInput = Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'customBuckets' | 'archived'> & { 
  customBuckets?: StatusBucket[];
  archived?: boolean;
};
export type UpdateRoleInput = Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateAssignmentInput = Omit<ActorAssignment, 'id' | 'assignedAt' | 'updatedAt'>;
export type UpdateAssignmentInput = Partial<Omit<ActorAssignment, 'id' | 'assignedAt' | 'updatedAt'>>;

// Dashboard metrics types
export interface DashboardMetrics {
  totalActors: number;
  totalFolders: number;
  totalRoles: number;
  openRoles: number;
  recentlyAddedActors: Actor[];
  activeAssignments: number;
}

// Navigation and routing types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}

// Error handling types
export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  context?: Record<string, any>;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}

// Utility types for localStorage serialization
export type SerializedData<T> = Omit<T, 'createdAt' | 'updatedAt' | 'assignedAt'> & {
  createdAt?: string;
  updatedAt?: string;
  assignedAt?: string;
};
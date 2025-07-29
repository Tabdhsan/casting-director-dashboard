# Requirements Document

## Introduction

The Casting Dashboard is a frontend-only demo application designed for casting directors to manage their casting projects, organize actors, and track the casting process. The system will provide an intuitive interface for creating project hierarchies, managing actor databases, assigning actors to roles, and tracking their status through customizable workflow buckets. All data will be stored locally using localStorage to simulate a complete casting management workflow without requiring backend infrastructure.

## Requirements

### Requirement 1

**User Story:** As a casting director, I want to organize my projects in a flexible folder hierarchy, so that I can structure my work according to different shows, seasons, episodes, or versions.

#### Acceptance Criteria

1. WHEN I access the projects page THEN the system SHALL display a folder-based navigation interface similar to Google Drive
2. WHEN I create a new folder THEN the system SHALL allow me to nest it within any existing folder at any depth
3. WHEN I view a folder THEN the system SHALL display all subfolders and roles contained within it
4. WHEN I navigate through folders THEN the system SHALL maintain breadcrumb navigation showing my current location
5. IF I delete a folder THEN the system SHALL prompt for confirmation and remove all nested content

### Requirement 2

**User Story:** As a casting director, I want to create and manage roles within my project folders, so that I can define the characters I need to cast for each project.

#### Acceptance Criteria

1. WHEN I am viewing any folder THEN the system SHALL provide an option to add a new role to that folder
2. WHEN I create a role THEN the system SHALL require a role name and allow optional description and requirements
3. WHEN I view a role THEN the system SHALL display all actors assigned to that role organized by status buckets
4. WHEN I edit a role THEN the system SHALL allow me to modify role details and save changes
5. IF I delete a role THEN the system SHALL prompt for confirmation and remove all associated actor assignments

### Requirement 3

**User Story:** As a casting director, I want to maintain a comprehensive database of actors, so that I can easily find and assign talent to roles across different projects.

#### Acceptance Criteria

1. WHEN I access the actor database THEN the system SHALL display all actors in either grid or table view
2. WHEN I add a new actor THEN the system SHALL capture name, age, gender, race, height, representation, tags, notes, and headshot placeholder
3. WHEN I search for actors THEN the system SHALL provide filters for gender, age range, height, race, and tags
4. WHEN I click on an actor THEN the system SHALL display a detailed snapshot modal with all actor information
5. WHEN I edit actor information THEN the system SHALL save changes and update all related role assignments

### Requirement 4

**User Story:** As a casting director, I want to assign actors to roles and track their progress through customizable status buckets, so that I can manage my casting workflow according to my specific process.

#### Acceptance Criteria

1. WHEN I view a role detail page THEN the system SHALL display actors organized in customizable status buckets
2. WHEN I create status buckets THEN the system SHALL allow custom names like "Booked", "Callback", "Seen", "Need to ask team about"
3. WHEN I assign an actor to a role THEN the system SHALL place them in a default status bucket
4. WHEN I move an actor between buckets THEN the system SHALL update their status and maintain the change
5. WHEN I remove an actor from a role THEN the system SHALL remove the assignment but preserve the actor in the database

### Requirement 5

**User Story:** As a casting director, I want to view detailed actor profiles with their casting history, so that I can make informed decisions about their suitability for roles.

#### Acceptance Criteria

1. WHEN I access an actor's profile THEN the system SHALL display comprehensive information including resume, tags, and notes
2. WHEN I view an actor's profile THEN the system SHALL show their role history across all projects with status information
3. WHEN I edit actor details from their profile THEN the system SHALL update the information across all role assignments
4. WHEN I add notes or tags to an actor THEN the system SHALL make these available for filtering and search
5. IF an actor has been assigned to multiple roles THEN the system SHALL display all current and past assignments

### Requirement 6

**User Story:** As a casting director, I want my work to be automatically saved and persist between sessions, so that I don't lose my progress when I close and reopen the application.

#### Acceptance Criteria

1. WHEN I make any changes to projects, roles, or actors THEN the system SHALL automatically save to localStorage
2. WHEN I reload the application THEN the system SHALL restore all my data from localStorage
3. WHEN I create custom status buckets THEN the system SHALL persist these configurations per role
4. WHEN I modify folder structures THEN the system SHALL maintain the hierarchy across sessions
5. IF localStorage is unavailable THEN the system SHALL display a warning about data persistence limitations

### Requirement 7

**User Story:** As a casting director, I want an intuitive navigation system with a dashboard overview, so that I can quickly access different areas of the application and see key metrics.

#### Acceptance Criteria

1. WHEN I access the application THEN the system SHALL display a sidebar navigation with Dashboard, Projects, Actor Database, and Settings
2. WHEN I view the dashboard THEN the system SHALL show summary widgets for actor count, open roles, project count, and recently added actors
3. WHEN I navigate between sections THEN the system SHALL maintain consistent layout with navbar and sidebar
4. WHEN I access user settings THEN the system SHALL provide profile management options
5. WHEN I use the application on different screen sizes THEN the system SHALL provide responsive design that works on desktop and tablet devices
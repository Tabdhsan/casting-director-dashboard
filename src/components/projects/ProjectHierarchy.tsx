// Main project hierarchy management component with dual-view interface

import { useState } from 'react';
import { LayoutGrid, Plus, FolderPlus, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useProjects } from '@/hooks/useStore';
import { ProjectBreadcrumb } from './ProjectBreadcrumb';
import { TreeView } from './TreeView';
import { GridView } from './GridView';
import { AddFolderModal } from './AddFolderModal';
import { AddRoleModal } from './AddRoleModal';

type ViewMode = 'tree' | 'grid';

export function ProjectHierarchy() {
    const { projects } = useProjects();
    // const { ui } = useUI(); // For future use
    
    // Local state for view mode (could be moved to store later)
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);

    // Get current folder for breadcrumb and content display
    const currentFolder = currentFolderId 
        ? projects.find(p => p.id === currentFolderId)
        : null;

    return (
        <div className="flex h-full flex-col space-y-4 sm:space-y-6">
            {/* Header with view toggle and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-1 rounded-lg border p-1">
                        <Toggle
                            pressed={viewMode === 'tree'}
                            onPressedChange={(pressed) => setViewMode(pressed ? 'tree' : 'grid')}
                            aria-label="Tree view"
                            size="sm"
                        >
                            <List className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            pressed={viewMode === 'grid'}
                            onPressedChange={(pressed) => setViewMode(pressed ? 'grid' : 'tree')}
                            aria-label="Grid view"
                            size="sm"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Toggle>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddFolderModal(true)}
                        disabled={currentFolder?.archived}
                        className="flex-shrink-0"
                    >
                        <FolderPlus className="mr-2 h-4 w-4" />
                        New Folder
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setShowAddRoleModal(true)}
                        disabled={!currentFolder || currentFolder.archived}
                        className="flex-shrink-0"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Role
                    </Button>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <ProjectBreadcrumb
                currentFolderId={currentFolderId}
                onNavigate={setCurrentFolderId}
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'tree' ? (
                    <TreeView
                        currentFolderId={currentFolderId}
                        onFolderSelect={setCurrentFolderId}
                    />
                ) : (
                    <GridView
                        currentFolderId={currentFolderId}
                        onFolderSelect={setCurrentFolderId}
                    />
                )}
            </div>

            {/* Modals */}
            <AddFolderModal
                open={showAddFolderModal}
                onClose={() => setShowAddFolderModal(false)}
                parentId={currentFolderId}
            />
            
            <AddRoleModal
                open={showAddRoleModal}
                onClose={() => setShowAddRoleModal(false)}
                folderId={currentFolder?.id || null}
            />
        </div>
    );
}
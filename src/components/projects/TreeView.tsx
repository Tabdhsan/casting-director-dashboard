// Tree view component with sidebar navigation and content panel
import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Folder, GripVertical } from 'lucide-react';
import { ProjectTreeSidebar } from './ProjectTreeSidebar';
import { FolderContentPanel } from './FolderContentPanel';
import { useProjects } from '@/hooks/useStore';
import type { Project } from '@/types';

interface TreeViewProps {
    currentFolderId: string | null;
    onFolderSelect: (folderId: string | null) => void;
}

export function TreeView({ currentFolderId, onFolderSelect }: TreeViewProps) {
    const { projects, updateProject } = useProjects();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<Project | null>(null);

    // Global drag handlers for cross-component dragging
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        
        // Extract project ID from different sources
        let projectId: string;
        if ((event.active.id as string).startsWith('tree-')) {
            projectId = (event.active.id as string).replace('tree-', '');
        } else {
            projectId = event.active.id as string;
        }
        
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setDraggedItem(project);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveId(null);
        setDraggedItem(null);
        
        if (!over || active.id === over.id) {
            return;
        }

        // Extract project ID from different sources
        let draggedProjectId: string;
        if ((active.id as string).startsWith('tree-')) {
            draggedProjectId = (active.id as string).replace('tree-', '');
        } else {
            draggedProjectId = active.id as string;
        }

        const draggedProject = projects.find(p => p.id === draggedProjectId);
        if (!draggedProject) return;

        // Handle different drop targets
        if ((over.id as string).startsWith('tree-drop-')) {
            // Drop on tree item
            const targetProjectId = (over.id as string).replace('tree-drop-', '');
            const targetProject = projects.find(p => p.id === targetProjectId);
            
            if (targetProject && targetProject.id !== draggedProject.id) {
                updateProject(draggedProject.id, { parentId: targetProject.id });
            }
        } else if (over.id === 'content-empty-space') {
            // Drop on content panel empty space
            const currentFolder = projects.find(p => p.id === currentFolderId);
            const parentId = currentFolder?.parentId || undefined;
            updateProject(draggedProject.id, { parentId });
        } else {
            // Drop on content panel item
            const targetProject = projects.find(p => p.id === over.id);
            if (targetProject && targetProject.id !== draggedProject.id) {
                updateProject(draggedProject.id, { parentId: targetProject.id });
            }
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full space-x-6">
                {/* Left Sidebar - Tree Navigation */}
                <div className="w-80 flex-shrink-0">
                    <ProjectTreeSidebar
                        selectedFolderId={currentFolderId}
                        onFolderSelect={onFolderSelect}
                        activeId={activeId}
                    />
                </div>

                {/* Right Panel - Folder Contents */}
                <div className="flex-1 overflow-hidden">
                    <FolderContentPanel
                        currentFolderId={currentFolderId}
                        onFolderSelect={onFolderSelect}
                        activeId={activeId}
                    />
                </div>
            </div>

            {/* Global Drag overlay */}
            <DragOverlay>
                {draggedItem && (
                    <div className="flex items-center space-x-2 rounded-md bg-background border px-2 py-1.5 text-sm shadow-lg">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                        <Folder className="h-4 w-4 text-blue-500" />
                        <span>{draggedItem.name}</span>
                        <div className="ml-2 text-xs text-muted-foreground">
                            Drop on folder to move
                        </div>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
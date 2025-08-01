// Project tree sidebar with hierarchical navigation using dnd-kit-sortable-tree

import { useMemo, useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Folder, FileText, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useProjects } from '@/hooks/useStore';
import type { Project } from '@/types';

// Extended project type for tree structure
type TreeProject = Project & {
    children?: TreeProject[];
};

interface ProjectTreeSidebarProps {
    selectedFolderId: string | null;
    onFolderSelect: (folderId: string | null) => void;
    activeId?: string | null;
}

// Tree item component for hierarchical rendering
interface TreeProjectItemProps {
    project: TreeProject;
    selectedFolderId: string | null;
    onFolderSelect: (folderId: string | null) => void;
    depth: number;
}

// Draggable and droppable tree item component
function TreeProjectItem({ 
    project, 
    selectedFolderId, 
    onFolderSelect, 
    depth,
    isDragging,
    isOver 
}: TreeProjectItemProps & { isDragging?: boolean; isOver?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = project.children && project.children.length > 0;
    const isSelected = selectedFolderId === project.id;
    const isFolder = true;
    
    const Icon = isFolder ? Folder : FileText;
    const iconColor = isFolder ? 'text-blue-500' : 'text-green-500';

    // Draggable setup
    const {
        attributes: dragAttributes,
        listeners: dragListeners,
        setNodeRef: setDragRef,
        transform,
        isDragging: isDraggingThis,
    } = useDraggable({
        id: `tree-${project.id}`,
        data: { project }
    });

    // Droppable setup (only for folders)
    const {
        isOver: isOverThis,
        setNodeRef: setDropRef,
    } = useDroppable({
        id: `tree-drop-${project.id}`,
        disabled: !isFolder,
        data: { project }
    });

    // Combine refs
    const setNodeRef = (node: HTMLElement | null) => {
        setDragRef(node);
        setDropRef(node);
    };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div>
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    'group flex items-center space-x-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent transition-colors',
                    isSelected && 'bg-accent text-accent-foreground',
                    isDraggingThis && 'opacity-50',
                    isOverThis && isFolder && 'bg-primary/10 ring-2 ring-primary/20'
                )}
                onClick={() => onFolderSelect(project.id)}
            >
                {/* Padding for depth */}
                <div style={{ width: `${depth * 16}px` }} />

                {/* Drag Handle */}
                <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    {...dragAttributes}
                    {...dragListeners}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                </div>

                {/* Expand/Collapse Button */}
                {hasChildren && (
                    <button
                        className="flex h-4 w-4 items-center justify-center rounded hover:bg-accent-foreground/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                )}
                {!hasChildren && <div className="w-4" />}

                {/* Icon */}
                <Icon className={cn('h-4 w-4', iconColor)} />

                {/* Name */}
                <span className="flex-1 truncate">{project.name}</span>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div>
                    {project.children!.map((child) => (
                        <TreeProjectItem
                            key={child.id}
                            project={child}
                            selectedFolderId={selectedFolderId}
                            onFolderSelect={onFolderSelect}
                            depth={depth + 1}
                            isDragging={isDragging}
                            isOver={isOver}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function ProjectTreeSidebar({ selectedFolderId, onFolderSelect, activeId }: ProjectTreeSidebarProps) {
    const { projects } = useProjects();

    // Convert flat project list to hierarchical tree structure
    const treeData = useMemo(() => {
        const projectMap = new Map<string, TreeProject>();
        const rootProjects: TreeProject[] = [];

        // Create map of all projects
        projects.forEach(project => {
            projectMap.set(project.id, { ...project, children: [] });
        });

        // Build hierarchy
        projects.forEach(project => {
            const treeProject = projectMap.get(project.id)!;
            
            if (project.parentId) {
                const parent = projectMap.get(project.parentId);
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(treeProject);
                } else {
                    // Parent not found, treat as root
                    rootProjects.push(treeProject);
                }
            } else {
                rootProjects.push(treeProject);
            }
        });

        return rootProjects;
    }, [projects]);



    return (
        <Card className="h-full hover:shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Project Structure</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                {treeData.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-center">
                        <div>
                            <Folder className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                No projects yet
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {/* Render hierarchical tree structure */}
                        {treeData.map((project) => (
                            <TreeProjectItem
                                key={project.id}
                                project={project}
                                selectedFolderId={selectedFolderId}
                                onFolderSelect={onFolderSelect}
                                depth={0}
                                isDragging={activeId === `tree-${project.id}`}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
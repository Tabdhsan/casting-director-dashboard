// Project card component for grid view

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Folder, FileText, MoreVertical, Edit, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
    roleCount: number;
    onDoubleClick: () => void;
    onRename?: (project: Project) => void;
    onDelete?: (project: Project) => void;
    isDragging?: boolean;
    isOver?: boolean;
    enableDrag?: boolean;
}

export function ProjectCard({ 
    project, 
    roleCount, 
    onDoubleClick, 
    onRename, 
    onDelete, 
    isDragging, 
    isOver,
    enableDrag = false 
}: ProjectCardProps) {
    const isFolder = project.type === 'folder';
    const Icon = isFolder ? Folder : FileText;
    const iconColor = isFolder ? 'text-blue-500' : 'text-green-500';

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ 
        id: project.id,
        disabled: !enableDrag
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                'group cursor-pointer transition-all hover:shadow-md',
                (isDragging || isSortableDragging) && 'opacity-50',
                isOver && isFolder && 'ring-2 ring-primary ring-offset-2',
                'select-none'
            )}
            onDoubleClick={onDoubleClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    {/* Drag Handle - only visible on hover and when drag is enabled */}
                    {enableDrag && (
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mr-2 mt-1"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    
                    <div className="flex-1">
                        {/* Icon and Name */}
                        <div className="flex items-center space-x-3">
                            <Icon className={cn('h-8 w-8', iconColor)} />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isFolder ? 'Folder' : `${roleCount} role${roleCount !== 1 ? 's' : ''}`}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRename?.(project);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(project);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Footer with metadata */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                    {!isFolder && (
                        <span className="flex items-center">
                            <FileText className="mr-1 h-3 w-3" />
                            Project
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
// Role card component for grid view

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { Users, MoreVertical, Edit, Trash2, UserPlus, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface RoleCardProps {
    role: Role;
    assignmentCount: number;
    onDoubleClick?: () => void;
    isDragging?: boolean;
    isOver?: boolean;
    enableDrag?: boolean;
}

export function RoleCard({ 
    role, 
    assignmentCount, 
    onDoubleClick,
    isDragging, 
    isOver,
    enableDrag = false 
}: RoleCardProps) {
    const navigate = useNavigate();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ 
        id: role.id,
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
                'group cursor-pointer transition-all duration-200 hover:shadow-md border',
                'hover:border-primary/20 bg-background',
                (isDragging || isSortableDragging) && 'opacity-50 scale-95',
                isOver && 'ring-2 ring-primary ring-offset-2',
                'select-none h-full flex flex-col min-h-[240px]'
            )}
            onDoubleClick={() => {
                if (onDoubleClick) {
                    onDoubleClick();
                } else {
                    navigate(`/projects/${role.folderId}/roles/${role.id}`);
                }
            }}
        >
            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between flex-1">
                    {/* Drag Handle - only visible on hover and when drag is enabled */}
                    {enableDrag && (
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mr-2 mt-1 flex-shrink-0"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                        {/* Role Name - Full Width */}
                        <div className="flex items-start space-x-2">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                                    {role.name}
                                </h3>
                            </div>
                        </div>
                        
                        {/* Assignment Badge - Separate Row */}
                        <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                                <span className="hidden sm:inline">
                                    {assignmentCount} actor{assignmentCount !== 1 ? 's' : ''} assigned
                                </span>
                                <span className="sm:hidden">
                                    {assignmentCount} assigned
                                </span>
                            </Badge>
                        </div>

                        {/* Description */}
                        {role.description && (
                            <p className="mt-3 sm:mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {role.description}
                            </p>
                        )}

                        {/* Status Buckets */}
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                            {role.customBuckets.slice(0, 2).map((bucket) => (
                                <Badge
                                    key={bucket.id}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {bucket.name}
                                </Badge>
                            ))}
                            {role.customBuckets.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{role.customBuckets.length - 2}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 sm:h-7 sm:w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/projects/${role.folderId}/roles/${role.id}`)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign Actors
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
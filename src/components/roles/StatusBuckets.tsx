// Status buckets component with drag-and-drop functionality

import { useState } from 'react';
import { DndContext, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreVertical, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActors, useAssignments } from '@/hooks/useStore';
import type { Role, StatusBucket, ActorAssignment, Actor } from '@/types';

interface StatusBucketsProps {
    role: Role;
}

interface ActorCardProps {
    actor: Actor;
    assignment: ActorAssignment;
    onRemove: (assignmentId: string) => void;
}

function ActorCard({ actor, assignment, onRemove }: ActorCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: assignment.id,
        data: {
            type: 'actor',
            assignment,
            actor,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-background border rounded-lg p-3 cursor-grab active:cursor-grabbing ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={actor.headshotUrl} />
                        <AvatarFallback>
                            {actor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {actor.age} • {actor.gender} • {actor.height}
                        </p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onRemove(assignment.id)}
                            className="text-destructive"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove from Role
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {assignment.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {assignment.notes}
                </p>
            )}
        </div>
    );
}

interface BucketProps {
    bucket: StatusBucket;
    actors: { actor: Actor; assignment: ActorAssignment }[];
    onRemoveActor: (assignmentId: string) => void;
}

function Bucket({ bucket, actors, onRemoveActor }: BucketProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: bucket.id,
        data: {
            type: 'bucket',
            bucket,
        },
    });

    return (
        <Card className={`min-h-[400px] ${isOver ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center space-x-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: bucket.color }}
                        />
                        <span>{bucket.name}</span>
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        {actors.length}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    ref={setNodeRef}
                    className="space-y-3 min-h-[300px]"
                >
                    <SortableContext 
                        items={actors.map(a => a.assignment.id)} 
                        strategy={verticalListSortingStrategy}
                    >
                        {actors.map(({ actor, assignment }) => (
                            <ActorCard
                                key={assignment.id}
                                actor={actor}
                                assignment={assignment}
                                onRemove={onRemoveActor}
                            />
                        ))}
                    </SortableContext>
                    {actors.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                            Drop actors here
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function StatusBuckets({ role }: StatusBucketsProps) {
    const { actors } = useActors();
    const { assignments, updateAssignment, removeAssignment } = useAssignments();
    const [draggedItem, setDraggedItem] = useState<{ actor: Actor; assignment: ActorAssignment } | null>(null);

    // Get assignments for this role
    const roleAssignments = assignments.filter(a => a.roleId === role.id);
    
    // Group assignments by bucket
    const bucketGroups = role.customBuckets.reduce((acc, bucket) => {
        const bucketAssignments = roleAssignments.filter(a => a.bucketId === bucket.id);
        acc[bucket.id] = bucketAssignments.map(assignment => {
            const actor = actors.find(a => a.id === assignment.actorId);
            return { actor: actor!, assignment };
        }).filter(item => item.actor); // Filter out any missing actors
        return acc;
    }, {} as Record<string, { actor: Actor; assignment: ActorAssignment }[]>);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        
        if (active.data.current?.type === 'actor') {
            setDraggedItem({
                actor: active.data.current.actor,
                assignment: active.data.current.assignment,
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setDraggedItem(null);
        
        if (!over || active.id === over.id) {
            return;
        }

        // Handle dropping actor on bucket
        if (over.data.current?.type === 'bucket' && active.data.current?.type === 'actor') {
            const assignment = active.data.current.assignment;
            const targetBucket = over.data.current.bucket;
            
            if (assignment.bucketId !== targetBucket.id) {
                updateAssignment(assignment.id, {
                    bucketId: targetBucket.id,
                });
            }
        }
    };

    const handleRemoveActor = (assignmentId: string) => {
        removeAssignment(assignmentId);
    };

    // Sort buckets by order
    const sortedBuckets = [...role.customBuckets].sort((a, b) => a.order - b.order);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedBuckets.map((bucket) => (
                    <Bucket
                        key={bucket.id}
                        bucket={bucket}
                        actors={bucketGroups[bucket.id] || []}
                        onRemoveActor={handleRemoveActor}
                    />
                ))}
            </div>

            {/* Drag overlay */}
            <DragOverlay>
                {draggedItem && (
                    <div className="bg-background border rounded-lg p-3 shadow-lg opacity-90">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={draggedItem.actor.headshotUrl} />
                                <AvatarFallback>
                                    {draggedItem.actor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">{draggedItem.actor.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {draggedItem.actor.age} • {draggedItem.actor.gender}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
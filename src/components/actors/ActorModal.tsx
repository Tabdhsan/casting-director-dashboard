// Actor modal component for detailed actor information display


import { useNavigate } from 'react-router-dom';
import { Edit, ExternalLink, Calendar, Tag, User, FileText, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAssignments } from '@/hooks/useStore';
import type { Actor } from '@/types';

interface ActorModalProps {
    actor: Actor | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (actor: Actor) => void;
}

export function ActorModal({ actor, open, onClose, onEdit }: ActorModalProps) {
    const navigate = useNavigate();
    const { getActorRoleHistory } = useAssignments();

    if (!actor) return null;

    const initials = actor.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    const roleHistory = getActorRoleHistory(actor.id).sort((a, b) => b.assignment.assignedAt.getTime() - a.assignment.assignedAt.getTime());

    const handleEdit = () => {
        onEdit?.(actor);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl">{actor.name}</DialogTitle>
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    onClose();
                                    navigate(`/actors/${actor.id}`);
                                }}
                            >
                                <UserCircle className="h-4 w-4 mr-2" />
                                View Full Profile
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="text-center">
                            <Avatar className="h-32 w-32 mx-auto">
                                <AvatarImage src={actor.headshotUrl} alt={actor.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {actor.headshotUrl && (
                                <Button variant="link" size="sm" className="mt-2" asChild>
                                    <a href={actor.headshotUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View Full Size
                                    </a>
                                </Button>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Basic Information</h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                                                            <span className="text-muted-foreground">Age Range:</span>
                                        <span className="font-medium">{actor.ageRange.min}-{actor.ageRange.max}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gender:</span>
                                    <span className="font-medium">{actor.gender}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                                                            <span className="text-muted-foreground">Ethnic Appearance:</span>
                                        <span className="font-medium">{actor.ethnicAppearance.join(', ')}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Height:</span>
                                    <span className="font-medium">{actor.height}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Union Status:</span>
                                    <Badge variant="outline">{actor.unionStatus}</Badge>
                                </div>
                                
                                {actor.representation && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Representation:</span>
                                        <span className="font-medium">{actor.representation}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {actor.tags.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Tags & Specialties
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {actor.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Files
                            </h3>
                            <div className="space-y-2">
                                {actor.headshotUrl && (
                                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                        <a href={actor.headshotUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-2" />
                                            View Headshot
                                        </a>
                                    </Button>
                                )}
                                {actor.resumeUrl && (
                                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                        <a href={actor.resumeUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-2" />
                                            View Resume
                                        </a>
                                    </Button>
                                )}
                                {!actor.headshotUrl && !actor.resumeUrl && (
                                    <p className="text-sm text-muted-foreground">No files uploaded</p>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Metadata
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Added:</span>
                                    <span>{new Date(actor.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Updated:</span>
                                    <span>{new Date(actor.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Notes and Role History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Notes */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Notes</h3>
                            {actor.notes ? (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm whitespace-pre-wrap">{actor.notes}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No notes added</p>
                            )}
                        </div>

                        <Separator />

                        {/* Role History */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Role History</h3>
                            
                            {roleHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {roleHistory.map(({ assignment, role, project }) => (
                                        <div key={assignment.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <div>
                                                        <h4 className="font-medium">{role.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {project.name}
                                                        </p>
                                                    </div>
                                                    
                                                    {role.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {role.description}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <Badge variant="secondary">
                                                        {role.customBuckets.find(b => b.id === assignment.bucketId)?.name || 'Unknown Status'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            
                                            {assignment.notes && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-sm text-muted-foreground">
                                                        <strong>Notes:</strong> {assignment.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h4 className="mt-4 text-lg font-medium">No Role History</h4>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        This actor hasn't been assigned to any roles yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
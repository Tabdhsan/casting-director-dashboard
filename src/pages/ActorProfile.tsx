// Actor profile page with comprehensive actor information and role history

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, ExternalLink, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActors, useAssignments } from '@/hooks/useStore';
import { formatAgeRange, formatEthnicAppearance } from '@/utils/typeHelpers';
import { EditActorModal } from '@/components/actors/EditActorModal';
import type { Actor } from '@/types';

export function ActorProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { actors } = useActors();
    const { getActorRoleHistory } = useAssignments();
    
    const [actor, setActor] = useState<Actor | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (id) {
            const foundActor = actors.find(a => a.id === id);
            if (foundActor) {
                // Ensure createdAt and updatedAt are proper Date objects
                const actorWithProperDates = {
                    ...foundActor,
                    createdAt: new Date(foundActor.createdAt),
                    updatedAt: new Date(foundActor.updatedAt),
                };
                setActor(actorWithProperDates);
            } else {
                setActor(null);
            }
        }
    }, [id, actors]);

    if (!actor) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-muted-foreground">Actor not found</h2>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/actors')}
                        className="mt-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Actor Database
                    </Button>
                </div>
            </div>
        );
    }

    const roleHistory = getActorRoleHistory(actor.id).map(item => ({
        ...item,
        assignment: {
            ...item.assignment,
            assignedAt: new Date(item.assignment.assignedAt),
            updatedAt: new Date(item.assignment.updatedAt),
        }
    })).sort((a, b) => b.assignment.assignedAt.getTime() - a.assignment.assignedAt.getTime());

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate('/actors')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{actor.name}</h1>
                        <p className="text-muted-foreground">
                            {formatAgeRange(actor.ageRange)} years old • {actor.gender} • {actor.height}
                        </p>
                    </div>
                </div>
                <Button onClick={() => setShowEditModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Actor Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 mb-4">
                                    <AvatarImage src={actor.headshotUrl} />
                                    <AvatarFallback className="text-2xl">
                                        {actor.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-semibold">{actor.name}</h2>
                                <p className="text-muted-foreground mb-4">
                                                                                    {actor.unionStatus}
                                </p>
                                
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 w-full text-sm">
                                    <div className="text-center">
                                        <p className="font-medium">{formatAgeRange(actor.ageRange)}</p>
                                        <p className="text-muted-foreground">Age Range</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{actor.height}</p>
                                        <p className="text-muted-foreground">Height</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{actor.gender}</p>
                                        <p className="text-muted-foreground">Gender</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{formatEthnicAppearance(actor.ethnicAppearance)}</p>
                                        <p className="text-muted-foreground">Ethnic Appearance</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {actor.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-base">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Skills & Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {actor.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Files */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-base">
                                <FileText className="h-4 w-4 mr-2" />
                                Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {actor.headshotUrl && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Headshot</span>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={actor.headshotUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            View
                                        </a>
                                    </Button>
                                </div>
                            )}
                            {actor.resumeUrl && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Resume</span>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={actor.resumeUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            View
                                        </a>
                                    </Button>
                                </div>
                            )}
                            {!actor.headshotUrl && !actor.resumeUrl && (
                                <p className="text-sm text-muted-foreground">No files uploaded</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details and History */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="history">Role History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Notes */}
                            {actor.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {actor.notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Current Assignments */}
                            {roleHistory.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Current Assignments</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {roleHistory.slice(0, 3).map(({ assignment, role, project }) => (
                                                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{role.name}</p>
                                                        <p className="text-sm text-muted-foreground">{project.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Assigned {assignment.assignedAt.toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => navigate(`/projects/${project.id}/roles/${role.id}`)}
                                                    >
                                                        View Role
                                                    </Button>
                                                </div>
                                            ))}
                                            {roleHistory.length > 3 && (
                                                <p className="text-sm text-muted-foreground text-center">
                                                    +{roleHistory.length - 3} more assignments
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Profile Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{roleHistory.length}</p>
                                            <p className="text-sm text-muted-foreground">Total Roles</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{actor.tags.length}</p>
                                            <p className="text-sm text-muted-foreground">Skills</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">
                                                {new Set(roleHistory.map(h => h.project.id)).size}
                                            </p>
                                            <p className="text-sm text-muted-foreground">Projects</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">
                                                {Math.floor((Date.now() - actor.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                                            </p>
                                            <p className="text-sm text-muted-foreground">Days in System</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Role Assignment History</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Complete history of all role assignments for {actor.name}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {roleHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">No role assignments yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {roleHistory.map(({ assignment, role, project }) => {
                                                const bucket = role.customBuckets.find(b => b.id === assignment.bucketId);
                                                return (
                                                    <div key={assignment.id} className="border rounded-lg p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <h3 className="font-medium">{role.name}</h3>
                                                                    {bucket && (
                                                                        <Badge 
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            <div 
                                                                                className="w-2 h-2 rounded-full mr-1" 
                                                                                style={{ backgroundColor: bucket.color }}
                                                                            />
                                                                            {bucket.name}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mb-1">
                                                                    {project.name}
                                                                </p>
                                                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                                    <span className="flex items-center">
                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                        Assigned {assignment.assignedAt.toLocaleDateString()}
                                                                    </span>
                                                                    {assignment.updatedAt.getTime() !== assignment.assignedAt.getTime() && (
                                                                        <span>
                                                                            Updated {assignment.updatedAt.toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {assignment.notes && (
                                                                    <p className="text-sm mt-2 p-2 bg-muted rounded">
                                                                        {assignment.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => navigate(`/projects/${project.id}/roles/${role.id}`)}
                                                            >
                                                                View Role
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Edit Modal */}
            <EditActorModal
                actor={actor}
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    );
}
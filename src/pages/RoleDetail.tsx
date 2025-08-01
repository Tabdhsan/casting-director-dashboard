// Role detail page with actor assignment interface

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useRoles, useProjects, useActors, useAssignments } from '@/hooks/useStore';
import { StatusBuckets } from '@/components/roles/StatusBuckets';
import { AssignActorModal } from '@/components/roles/AssignActorModal';
import { BucketSettingsModal } from '@/components/roles/BucketSettingsModal';
import type { Role, Project } from '@/types';

export function RoleDetail() {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const { roles } = useRoles();
    const { projects } = useProjects();
    const { actors } = useActors();
    const { getAssignmentsByRole } = useAssignments();
    
    const [role, setRole] = useState<Role | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showBucketSettings, setShowBucketSettings] = useState(false);

    useEffect(() => {
        if (roleId) {
            const foundRole = roles.find(r => r.id === roleId);
            if (foundRole) {
                setRole(foundRole);
                const foundProject = projects.find(p => p.id === foundRole.folderId);
                setProject(foundProject || null);
            }
        }
    }, [roleId, roles, projects]);

    if (!role || !project) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-muted-foreground">Role not found</h2>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/projects')}
                        className="mt-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const assignments = getAssignmentsByRole(role.id);
    const assignedActorIds = assignments.map(a => a.actorId);
    const availableActors = actors.filter(actor => !assignedActorIds.includes(actor.id));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate('/projects')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{role.name}</h1>
                        <p className="text-muted-foreground">
                            {project.name} • {assignments.length} actors assigned
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBucketSettings(true)}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Bucket Settings
                    </Button>
                    <Button
                        onClick={() => setShowAssignModal(true)}
                        disabled={availableActors.length === 0}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Actor
                    </Button>
                </div>
            </div>

            {/* Role Details */}
            {(role.description || role.requirements) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {role.description && (
                            <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-muted-foreground">{role.description}</p>
                            </div>
                        )}
                        {role.requirements && (
                            <div>
                                <h4 className="font-medium mb-2">Requirements</h4>
                                <p className="text-muted-foreground">{role.requirements}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Status Buckets */}
            <StatusBuckets role={role} />

            {/* Modals */}
            <AssignActorModal
                open={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                role={role}
                availableActors={availableActors}
            />

            <BucketSettingsModal
                open={showBucketSettings}
                onClose={() => setShowBucketSettings(false)}
                role={role}
            />
        </div>
    );
}
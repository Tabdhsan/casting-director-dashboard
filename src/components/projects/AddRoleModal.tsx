// Modal for adding new roles to projects

import { useState } from 'react';
import { Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRoles, useProjects } from '@/hooks/useStore';
import type { CreateRoleInput } from '@/types';

interface AddRoleModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string | null;
}

export function AddRoleModal({ open, onClose, projectId }: AddRoleModalProps) {
    const { addRole } = useRoles();
    const { projects } = useProjects();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get project name for display
    const project = projectId ? projects.find(p => p.id === projectId) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !projectId) return;

        setIsSubmitting(true);

        try {
            const roleData: CreateRoleInput = {
                name: name.trim(),
                description: description.trim() || undefined,
                requirements: requirements.trim() || undefined,
                projectId,
            };

            addRole(roleData);
            
            // Reset form and close
            setName('');
            setDescription('');
            setRequirements('');
            onClose();
        } catch (error) {
            console.error('Failed to create role:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setName('');
            setDescription('');
            setRequirements('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Create New Role
                        </DialogTitle>
                        <DialogDescription>
                            {project 
                                ? `Add a new role to "${project.name}".`
                                : 'Create a new role for casting.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Role Name */}
                        <div className="space-y-2">
                            <Label htmlFor="role-name">Role Name</Label>
                            <Input
                                id="role-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Lead Detective, Supporting Character"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="role-description">Description (optional)</Label>
                            <Textarea
                                id="role-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the character or role"
                                rows={3}
                            />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-2">
                            <Label htmlFor="role-requirements">Requirements (optional)</Label>
                            <Textarea
                                id="role-requirements"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                placeholder="Age range, physical requirements, special skills, etc."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={!name.trim() || !projectId || isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Role'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
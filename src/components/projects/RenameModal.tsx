// Modal for renaming folders and projects

import { useState, useEffect } from 'react';
import { Folder, FileText } from 'lucide-react';
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
import { useProjects } from '@/hooks/useStore';
import type { Project } from '@/types';

interface RenameModalProps {
    open: boolean;
    onClose: () => void;
    project: Project | null;
}

export function RenameModal({ open, onClose, project }: RenameModalProps) {
    const { updateProject } = useProjects();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form when project changes
    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description || '');
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !project) return;

        setIsSubmitting(true);

        try {
            updateProject(project.id, {
                name: name.trim(),
                description: description.trim() || undefined,
            });
            
            onClose();
        } catch (error) {
            console.error('Failed to rename project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!project) return null;

    const isFolder = project.type === 'folder';
    const Icon = isFolder ? Folder : FileText;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Icon className="mr-2 h-5 w-5" />
                            Rename {isFolder ? 'Folder' : 'Project'}
                        </DialogTitle>
                        <DialogDescription>
                            Update the name and description for "{project.name}".
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="rename-name">Name</Label>
                            <Input
                                id="rename-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={`Enter ${isFolder ? 'folder' : 'project'} name`}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="rename-description">Description (optional)</Label>
                            <Textarea
                                id="rename-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={`Describe this ${isFolder ? 'folder' : 'project'}`}
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
                        <Button type="submit" disabled={!name.trim() || isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
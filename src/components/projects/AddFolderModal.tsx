// Modal for adding new folders/projects

import { useState } from 'react';
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
import { Toggle } from '@/components/ui/toggle';
import { useProjects } from '@/hooks/useStore';
import type { CreateProjectInput } from '@/types';

interface AddFolderModalProps {
    open: boolean;
    onClose: () => void;
    parentId?: string | null;
}

export function AddFolderModal({ open, onClose, parentId }: AddFolderModalProps) {
    const { addProject } = useProjects();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'folder' | 'project'>('folder');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            const projectData: CreateProjectInput = {
                name: name.trim(),
                description: description.trim() || undefined,
                type,
                parentId: parentId || undefined,
            };

            addProject(projectData);
            
            // Reset form and close
            setName('');
            setDescription('');
            setType('folder');
            onClose();
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setName('');
            setDescription('');
            setType('folder');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New {type === 'folder' ? 'Folder' : 'Project'}</DialogTitle>
                        <DialogDescription>
                            {type === 'folder' 
                                ? 'Create a new folder to organize your projects.'
                                : 'Create a new project to manage roles and casting.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Type Toggle */}
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <div className="flex items-center space-x-1 rounded-lg border p-1">
                                <Toggle
                                    pressed={type === 'folder'}
                                    onPressedChange={(pressed) => setType(pressed ? 'folder' : 'project')}
                                    aria-label="Folder"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Folder className="mr-2 h-4 w-4" />
                                    Folder
                                </Toggle>
                                <Toggle
                                    pressed={type === 'project'}
                                    onPressedChange={(pressed) => setType(pressed ? 'project' : 'folder')}
                                    aria-label="Project"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Project
                                </Toggle>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={`Enter ${type} name`}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={`Describe this ${type}`}
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
                            {isSubmitting ? 'Creating...' : `Create ${type === 'folder' ? 'Folder' : 'Project'}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
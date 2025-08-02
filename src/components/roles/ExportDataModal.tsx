// Export data modal for selecting and exporting buckets and actors

import { useState } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useActors, useAssignments } from '@/hooks/useStore';
import type { Role, StatusBucket, Actor, ActorAssignment } from '@/types';

interface ExportDataModalProps {
    open: boolean;
    onClose: () => void;
    role: Role;
}

interface BucketExportData {
    bucket: StatusBucket;
    actors: { actor: Actor; assignment: ActorAssignment }[];
}

export function ExportDataModal({ open, onClose, role }: ExportDataModalProps) {
    const { actors } = useActors();
    const { assignments } = useAssignments();
    
    const [selectedBucketIds, setSelectedBucketIds] = useState<string[]>([]);

    // Get assignments for this role
    const roleAssignments = assignments.filter(a => a.roleId === role.id);
    
    // Group assignments by bucket with actor data
    const bucketData: BucketExportData[] = role.customBuckets.map(bucket => {
        const bucketAssignments = roleAssignments.filter(a => a.bucketId === bucket.id);
        const actorsWithAssignments = bucketAssignments.map(assignment => {
            const actor = actors.find(a => a.id === assignment.actorId);
            return { actor: actor!, assignment };
        }).filter(item => item.actor); // Filter out any missing actors
        
        return {
            bucket,
            actors: actorsWithAssignments
        };
    });

    const handleBucketToggle = (bucketId: string) => {
        setSelectedBucketIds(prev => 
            prev.includes(bucketId)
                ? prev.filter(id => id !== bucketId)
                : [...prev, bucketId]
        );
    };

    const handleSelectAll = () => {
        if (selectedBucketIds.length === role.customBuckets.length) {
            setSelectedBucketIds([]);
        } else {
            setSelectedBucketIds(role.customBuckets.map(b => b.id));
        }
    };

    const handleExport = () => {
        const selectedBuckets = bucketData.filter(data => 
            selectedBucketIds.includes(data.bucket.id)
        );

        // Generate PDF
        const doc = new jsPDF();
        
        // Set up the document
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let yPosition = 30;
        
        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(role.name, pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 20;
        
        // Add each selected bucket and its actors
        doc.setFontSize(12);
        
        selectedBuckets.forEach((bucketData) => {
            // Check if we need a new page
            if (yPosition > doc.internal.pageSize.height - 40) {
                doc.addPage();
                yPosition = 30;
            }
            
            // Bucket name
            doc.setFont(undefined, 'bold');
            doc.text(bucketData.bucket.name, margin, yPosition);
            yPosition += 10;
            
            // Actors in this bucket
            doc.setFont(undefined, 'normal');
            bucketData.actors.forEach(({ actor }) => {
                // Check if we need a new page
                if (yPosition > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    yPosition = 30;
                }
                
                doc.text(`  • ${actor.name}`, margin + 10, yPosition);
                yPosition += 8;
            });
            
            // Add some space between buckets
            yPosition += 5;
        });
        
        // Save the PDF
        const fileName = `${role.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.pdf`;
        doc.save(fileName);

        onClose();
        setSelectedBucketIds([]);
    };

    const handleClose = () => {
        onClose();
        setSelectedBucketIds([]);
    };

    const totalSelectedActors = bucketData
        .filter(data => selectedBucketIds.includes(data.bucket.id))
        .reduce((total, data) => total + data.actors.length, 0);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                    <DialogDescription>
                        Select which buckets you'd like to export from <strong>{role.name}</strong>.
                        This will include all actors and their assignment information.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 py-4">
                    {/* Select All Toggle */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="select-all"
                                checked={selectedBucketIds.length === role.customBuckets.length}
                                onCheckedChange={handleSelectAll}
                            />
                            <label htmlFor="select-all" className="font-medium cursor-pointer">
                                Select All Buckets
                            </label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {selectedBucketIds.length} of {role.customBuckets.length} selected
                        </div>
                    </div>

                    {/* Bucket List */}
                    <div className="space-y-3">
                        {bucketData.map(({ bucket, actors: bucketActors }) => (
                            <Card key={bucket.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`bucket-${bucket.id}`}
                                            checked={selectedBucketIds.includes(bucket.id)}
                                            onCheckedChange={() => handleBucketToggle(bucket.id)}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: bucket.color }}
                                                />
                                                <label 
                                                    htmlFor={`bucket-${bucket.id}`}
                                                    className="font-medium cursor-pointer"
                                                >
                                                    {bucket.name}
                                                </label>
                                                <Badge variant="outline" className="text-xs">
                                                    {bucketActors.length} {bucketActors.length === 1 ? 'actor' : 'actors'}
                                                </Badge>
                                            </div>
                                            
                                            {bucketActors.length > 0 && (
                                                <div className="text-sm text-muted-foreground">
                                                    <div className="flex flex-wrap gap-1">
                                                        {bucketActors.slice(0, 3).map(({ actor }) => (
                                                            <span key={actor.id}>
                                                                {actor.name}
                                                            </span>
                                                        ))}
                                                        {bucketActors.length > 3 && (
                                                            <span>
                                                                and {bucketActors.length - 3} more...
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {bucketData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No buckets found for this role.
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t pt-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-muted-foreground">
                            {selectedBucketIds.length > 0 && (
                                <>
                                    {totalSelectedActors} {totalSelectedActors === 1 ? 'actor' : 'actors'} 
                                    {' '}from {selectedBucketIds.length} {selectedBucketIds.length === 1 ? 'bucket' : 'buckets'} 
                                    {' '}will be exported
                                </>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleExport}
                                disabled={selectedBucketIds.length === 0}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export Data
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
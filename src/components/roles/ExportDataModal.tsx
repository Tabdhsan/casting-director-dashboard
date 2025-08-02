// Export data modal for selecting and exporting buckets and actors

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
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
    const [isExporting, setIsExporting] = useState(false);

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

    const handleExport = async () => {
        setIsExporting(true);
        
        try {
        const selectedBuckets = bucketData.filter(data => 
            selectedBucketIds.includes(data.bucket.id)
        );

        // Generate PDF
        const doc = new jsPDF();
        
        // Set up the document
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        let yPosition = 30;
        
        // Helper function to check if we need a new page
        const checkNewPage = (requiredSpace: number = 60) => {
            if (yPosition > pageHeight - requiredSpace) {
                doc.addPage();
                yPosition = 30;
                return true;
            }
            return false;
        };

        // Helper function to load and add image
        const addActorImage = async (imageUrl: string, x: number, y: number, size: number = 40) => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                
                return new Promise<void>((resolve) => {
                    reader.onload = () => {
                        try {
                            const imgData = reader.result as string;
                            doc.addImage(imgData, 'JPEG', x, y, size, size);
                        } catch (error) {
                            console.warn('Could not add image:', error);
                        }
                        resolve();
                    };
                    reader.onerror = () => resolve();
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.warn('Could not load image:', error);
                return Promise.resolve();
            }
        };
        
        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text(role.name, pageWidth / 2, yPosition, { align: 'center' });
        
        // Add subtitle
        yPosition += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Actor Information Export', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 25;
        
        // Process each selected bucket and its actors
        for (const bucketData of selectedBuckets) {
            checkNewPage(30);
            
            // Bucket header with background
            doc.setFillColor(240, 240, 240);
            doc.rect(margin, yPosition - 8, pageWidth - 2 * margin, 16, 'F');
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(bucketData.bucket.name, margin + 5, yPosition);
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`${bucketData.actors.length} actor${bucketData.actors.length !== 1 ? 's' : ''}`, pageWidth - margin - 5, yPosition, { align: 'right' });
            
            yPosition += 20;
            
            // Process each actor in this bucket
            for (const { actor, assignment } of bucketData.actors) {
                checkNewPage(80);
                
                const actorStartY = yPosition;
                const imageX = margin;
                const imageSize = 35;
                const contentX = margin + imageSize + 10;
                
                // Add actor headshot if available
                if (actor.headshotUrl) {
                    await addActorImage(actor.headshotUrl, imageX, yPosition - 5, imageSize);
                }
                
                // Actor name
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(actor.name, contentX, yPosition);
                yPosition += 8;
                
                // Basic information
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(80, 80, 80);
                
                const ageDisplay = actor.ageRange ? `${actor.ageRange.min}-${actor.ageRange.max}` : 'N/A';
                const basicInfo = `${actor.gender} • Age ${ageDisplay} • ${actor.height} • ${actor.unionStatus}`;
                doc.text(basicInfo, contentX, yPosition);
                yPosition += 6;
                
                // Ethnic appearance
                if (actor.ethnicAppearance && actor.ethnicAppearance.length > 0) {
                    doc.text(`Ethnicity: ${actor.ethnicAppearance.join(', ')}`, contentX, yPosition);
                    yPosition += 6;
                }
                
                // Representation info
                if (actor.representation) {
                    doc.setFont(undefined, 'bold');
                    doc.text('Representation:', contentX, yPosition);
                    yPosition += 5;
                    
                    doc.setFont(undefined, 'normal');
                    doc.text(`  Agency: ${actor.representation.agency}`, contentX, yPosition);
                    yPosition += 4;
                    doc.text(`  Agent: ${actor.representation.agent}`, contentX, yPosition);
                    yPosition += 4;
                    doc.text(`  Phone: ${actor.representation.phone}`, contentX, yPosition);
                    yPosition += 6;
                }
                
                // Tags
                if (actor.tags && actor.tags.length > 0) {
                    doc.setFont(undefined, 'bold');
                    doc.text('Skills/Types:', contentX, yPosition);
                    yPosition += 5;
                    
                    doc.setFont(undefined, 'normal');
                    doc.text(`  ${actor.tags.join(', ')}`, contentX, yPosition);
                    yPosition += 6;
                }
                
                // Assignment notes
                if (assignment.notes) {
                    doc.setFont(undefined, 'bold');
                    doc.text('Casting Notes:', contentX, yPosition);
                    yPosition += 5;
                    
                    doc.setFont(undefined, 'normal');
                    const notes = assignment.notes.length > 80 ? assignment.notes.substring(0, 80) + '...' : assignment.notes;
                    doc.text(`  ${notes}`, contentX, yPosition);
                    yPosition += 6;
                }
                
                // Actor notes
                if (actor.notes) {
                    doc.setFont(undefined, 'bold');
                    doc.text('Actor Notes:', contentX, yPosition);
                    yPosition += 5;
                    
                    doc.setFont(undefined, 'normal');
                    const notes = actor.notes.length > 80 ? actor.notes.substring(0, 80) + '...' : actor.notes;
                    doc.text(`  ${notes}`, contentX, yPosition);
                    yPosition += 6;
                }
                
                // Ensure minimum spacing between actors
                const usedSpace = yPosition - actorStartY;
                if (usedSpace < imageSize + 10) {
                    yPosition = actorStartY + imageSize + 10;
                }
                
                // Add separator line
                const currentIndex = bucketData.actors.findIndex(item => item.actor.id === actor.id && item.assignment.id === assignment.id);
                if (currentIndex < bucketData.actors.length - 1) {
                    doc.setDrawColor(200, 200, 200);
                    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
                    yPosition += 8;
                }
            }
            
            // Add space between buckets
            yPosition += 15;
        }
        
        // Save the PDF
        const fileName = `${role.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.pdf`;
        doc.save(fileName);

        onClose();
        setSelectedBucketIds([]);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedBucketIds([]);
        setIsExporting(false);
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
                                disabled={selectedBucketIds.length === 0 || isExporting}
                            >
                                {isExporting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4 mr-2" />
                                )}
                                {isExporting ? 'Generating PDF...' : 'Export PDF'}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
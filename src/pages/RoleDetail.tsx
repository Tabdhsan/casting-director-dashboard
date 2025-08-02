// Role detail page with actor assignment interface

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Plus, Archive, RotateCcw, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useRoles, useProjects, useActors, useAssignments } from '@/hooks/useStore';
import { useToast } from '@/hooks/useToast';
import { StatusBuckets } from '@/components/roles/StatusBuckets';
import { AssignActorModal } from '@/components/roles/AssignActorModal';
import { ExportDataModal } from '@/components/roles/ExportDataModal';
import { BucketSettingsModal } from '@/components/roles/BucketSettingsModal';
import type { Role, Project } from '@/types';

export function RoleDetail() {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const { roles, archiveRole, unarchiveRole } = useRoles();
    const { projects } = useProjects();
    const { actors, addActor } = useActors();
    const { getAssignmentsByRole, assignActorToRole } = useAssignments();
    const { showSuccess, showError } = useToast();
    
    const [role, setRole] = useState<Role | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showBucketSettings, setShowBucketSettings] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

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

    const handleToggleArchive = () => {
        if (role.archived) {
            unarchiveRole(role.id);
        } else {
            archiveRole(role.id);
        }
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                'application/vnd.ms-excel', // .xls
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'text/csv' // .csv
            ];
            const fileExtension = file.name.toLowerCase().split('.').pop();
            const allowedExtensions = ['xls', 'xlsx', 'csv'];

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
                console.error('Invalid file type. Please select an XLS, XLSX, or CSV file.');
                event.target.value = '';
                return;
            }

            console.log('🗂️ File import initiated for role:', role?.name);
            console.log('📁 Selected file:', file.name);
            console.log('📊 File type:', file.type || `Unknown (extension: .${fileExtension})`);
            console.log('📏 File size:', (file.size / 1024).toFixed(2), 'KB');
            console.log('🎭 Target role ID:', role?.id);
            console.log('🔧 Processing method:', fileExtension === 'csv' ? 'CSV text parsing' : 'Excel binary parsing');
            
            // Process the file
            if (fileExtension === 'csv') {
                // Handle CSV files with text reader
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const content = e.target?.result as string;
                        const parsedData = parseCSVContent(content);
                        console.log('📊 Parsed', parsedData.length, 'rows from CSV');
                        
                        if (parsedData.length > 0) {
                            await processImportedData(parsedData);
                        } else {
                            showError("No valid data found in the CSV file.");
                        }
                    } catch (error) {
                        console.error('Error processing CSV file:', error);
                        showError("Failed to process the CSV file. Please check the file format.");
                    }
                };
                
                reader.onerror = () => {
                    showError("Failed to read the CSV file.");
                };
                
                reader.readAsText(file);
            } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                // Handle Excel files with array buffer reader
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const arrayBuffer = e.target?.result as ArrayBuffer;
                        const parsedData = parseExcelContent(arrayBuffer);
                        console.log('📊 Parsed', parsedData.length, 'rows from Excel file');
                        
                        if (parsedData.length > 0) {
                            await processImportedData(parsedData);
                        } else {
                            showError("No valid data found in the Excel file.");
                        }
                    } catch (error) {
                        console.error('Error processing Excel file:', error);
                        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                        showError(`Failed to process the Excel file: ${errorMsg}`);
                    }
                };
                
                reader.onerror = () => {
                    showError("Failed to read the Excel file.");
                };
                
                reader.readAsArrayBuffer(file);
            } else {
                showError("Unsupported file format. Please use CSV, XLS, or XLSX files.");
            }
            
            // Reset the input value so the same file can be selected again
            event.target.value = '';
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input')?.click();
    };

    const parseCSVContent = (content: string): Array<Record<string, string>> => {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        const rows: Array<Record<string, string>> = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parsing (handles basic quotes)
            const values: string[] = [];
            let currentValue = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim()); // Add the last value

            if (values.length === headers.length) {
                const row: Record<string, string> = {};
                headers.forEach((header, index) => {
                    row[header] = values[index]?.replace(/"/g, '') || '';
                });
                rows.push(row);
            }
        }

        return rows;
    };

    const parseExcelContent = (arrayBuffer: ArrayBuffer): Array<Record<string, string>> => {
        try {
            // Read the workbook from the array buffer
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // Get the first worksheet
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                throw new Error('No worksheets found in the Excel file');
            }
            
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert worksheet to JSON with header row as keys
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,  // Use first row as header
                defval: ''  // Default value for empty cells
            }) as string[][];
            
            if (jsonData.length < 2) {
                throw new Error('Excel file must contain at least a header row and one data row');
            }
            
            // Extract headers from first row
            const headers = jsonData[0].map(header => String(header).trim());
            
            // Convert remaining rows to objects
            const rows: Array<Record<string, string>> = [];
            for (let i = 1; i < jsonData.length; i++) {
                const rowData = jsonData[i];
                if (!rowData || rowData.every(cell => !cell || String(cell).trim() === '')) {
                    continue; // Skip empty rows
                }
                
                const row: Record<string, string> = {};
                headers.forEach((header, index) => {
                    row[header] = String(rowData[index] || '').trim();
                });
                
                // Only add rows that have at least an actor name
                if (row['ACTOR NAME'] && row['ACTOR NAME'].trim()) {
                    rows.push(row);
                }
            }
            
            return rows;
        } catch (error) {
            console.error('Error parsing Excel file:', error);
            throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const processImportedData = async (data: Array<Record<string, string>>) => {
        if (!role) return;

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (const row of data) {
            try {
                const actorName = row['ACTOR NAME']?.trim();
                const agency = row['AGENCY']?.trim();
                const agent = row['AGENT']?.trim(); 
                const phone = row['PHONE']?.trim();
                const notes = row['CASTING NOTES']?.trim();

                if (!actorName) {
                    errorCount++;
                    errors.push('Missing actor name in row');
                    continue;
                }

                // Check if actor already exists
                const existingActor = actors.find(a => 
                    a.name.toLowerCase() === actorName.toLowerCase()
                );

                let actorId: string;

                if (existingActor) {
                    actorId = existingActor.id;
                    console.log('Using existing actor:', actorName);
                } else {
                    // Create new actor
                    const newActorData = {
                        name: actorName,
                        ageRange: { min: 18, max: 65 }, // Default age range
                        gender: 'Unknown', // Default gender
                        ethnicAppearance: ['Unknown'], // Default ethnic appearance
                        height: 'Unknown', // Default height
                        unionStatus: 'Unknown', // Default union status
                        representation: (agency && agent && phone) ? {
                            agency,
                            agent,
                            phone
                        } : undefined,
                        tags: [],
                        notes: notes || '',
                        headshotUrl: '',
                        resumeUrl: ''
                    };

                    const newActor = addActor(newActorData);
                    actorId = newActor.id;
                    console.log('Created new actor:', actorName);
                }

                // Assign actor to role
                const assignments = getAssignmentsByRole(role.id);
                const isAlreadyAssigned = assignments.some(a => a.actorId === actorId);

                if (!isAlreadyAssigned) {
                    assignActorToRole({
                        actorId,
                        roleId: role.id,
                        bucketId: role.customBuckets[0]?.id || '', // Assign to first bucket by default
                        notes: ''
                    });
                    successCount++;
                    console.log('Assigned actor to role:', actorName);
                } else {
                    console.log('Actor already assigned to role:', actorName);
                    successCount++; // Count as success since they're assigned
                }

            } catch (error) {
                errorCount++;
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                errors.push(`Error processing ${row['ACTOR NAME'] || 'unknown actor'}: ${errorMsg}`);
                console.error('Error processing row:', error);
            }
        }

        // Show results
        if (successCount > 0) {
            showSuccess(`Successfully processed ${successCount} actor(s) for role "${role.name}".`);
        }

        if (errorCount > 0) {
            showError(`${errorCount} error(s) occurred during import. Check console for details.`);
            console.error('Import errors:', errors);
        }

        console.log(`Import complete: ${successCount} successful, ${errorCount} errors`);
    };

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
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{role.name}</h1>
                            {role.archived && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                    Archived
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            {project.name} • {assignments.length} actors assigned
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowExportModal(true)}
                        disabled={role.archived}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        disabled={role.archived}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Import Data
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleArchive}
                        className={role.archived ? "border-green-300 text-green-700 hover:bg-green-50" : "border-orange-300 text-orange-700 hover:bg-orange-50"}
                    >
                        {role.archived ? (
                            <RotateCcw className="h-4 w-4 mr-2" />
                        ) : (
                            <Archive className="h-4 w-4 mr-2" />
                        )}
                        {role.archived ? 'Unarchive' : 'Archive'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBucketSettings(true)}
                        disabled={role.archived}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Bucket Settings
                    </Button>
                    <Button
                        onClick={() => setShowAssignModal(true)}
                        disabled={availableActors.length === 0 || role.archived}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Actor
                    </Button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                id="file-input"
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileImport}
                style={{ display: 'none' }}
            />

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

            <ExportDataModal
                open={showExportModal}
                onClose={() => setShowExportModal(false)}
                role={role}
            />
        </div>
    );
}
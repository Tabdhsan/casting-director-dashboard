// Dashboard page component

import { Users, FolderOpen, Briefcase, TrendingUp, Database, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SummaryWidget, RecentActorsWidget, QuickStatsWidget } from '@/components/dashboard';
import { useDashboard, useProjects, useAssignments } from '@/hooks/useStore';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { seedSampleData, seedFullDemoData, resetAllData } from '@/utils/seedData';

export function Dashboard() {
    const { getDashboardMetrics } = useDashboard();
    const { projects } = useProjects();
    const { assignments } = useAssignments();
    const toast = useToast();

    const metrics = getDashboardMetrics();
    
    // Calculate additional metrics
    const activeProjects = projects.filter(p => p.type === 'project').length;
    const filledRoles = new Set(assignments.map(a => a.roleId)).size; 

    return (
        <div className="space-y-4 sm:space-y-6 max-w-full">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your casting dashboard
                </p>
            </div>
            

            {/* Demo Data Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => {
                        seedSampleData(useAppStore.getState());
                        toast.showSuccess('Sample data loaded!');
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                >
                    <Database className="mr-2 h-4 w-4" />
                    Load Sample Data
                </Button>
                <Button
                    onClick={() => {
                        seedFullDemoData(useAppStore.getState());
                        toast.showSuccess('Full demo data loaded!');
                    }}
                    variant="default"
                    size="sm"
                    className="flex-shrink-0"
                >
                    <Zap className="mr-2 h-4 w-4" />
                    Load Full Demo
                </Button>
                <Button
                    onClick={() => {
                        resetAllData(useAppStore.getState());
                        toast.showSuccess('All data reset!');
                    }}
                    variant="destructive"
                    size="sm"
                    className="flex-shrink-0"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset All Data
                </Button>
            </div>
            
            {/* Summary widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryWidget
                    title="Total Actors"
                    value={metrics.totalActors}
                    description="Actors in database"
                    icon={Users}
                />
                <SummaryWidget
                    title="Active Projects"
                    value={metrics.totalProjects}
                    description="Projects in progress"
                    icon={FolderOpen}
                />
                <SummaryWidget
                    title="Open Roles"
                    value={metrics.openRoles}
                    description="Roles to be filled"
                    icon={Briefcase}
                />
                <SummaryWidget
                    title="Active Assignments"
                    value={metrics.activeAssignments}
                    description="Current assignments"
                    icon={TrendingUp}
                />
            </div>

            {/* Secondary widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActorsWidget actors={metrics.recentlyAddedActors} />
                </div>
                <div>
                    <QuickStatsWidget
                        totalRoles={metrics.totalRoles}
                        filledRoles={filledRoles}
                        totalProjects={projects.length}
                        activeProjects={activeProjects}
                    />
                </div>
            </div>

            {/* Empty state message */}
            {metrics.totalActors === 0 && metrics.totalProjects === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <div className="mx-auto max-w-md px-4">
                        <div className="mx-auto h-12 w-12 text-muted-foreground">
                            <TrendingUp className="h-12 w-12" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">Get started with your casting dashboard</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Add your first actors and projects to see your dashboard come to life.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Button
                                onClick={() => seedSampleData(useAppStore.getState())}
                                className="inline-flex items-center"
                                size="sm"
                            >
                                <Database className="mr-2 h-4 w-4" />
                                Load Sample Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
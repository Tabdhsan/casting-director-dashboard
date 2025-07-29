// Dashboard page component

import { Users, FolderOpen, Briefcase, TrendingUp, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SummaryWidget, RecentActorsWidget, QuickStatsWidget } from '@/components/dashboard';
import { useDashboard, useProjects, useAssignments } from '@/hooks/useStore';
import { useAppStore } from '@/store';
import { seedSampleData } from '@/utils/seedData';

export function Dashboard() {
    const { getDashboardMetrics } = useDashboard();
    const { projects } = useProjects();
    const { assignments } = useAssignments();

    const metrics = getDashboardMetrics();
    
    // Calculate additional metrics
    const activeProjects = projects.filter(p => p.type === 'project').length;
    const filledRoles = new Set(assignments.map(a => a.roleId)).size;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your casting dashboard
                </p>
            </div>
            
            {/* Summary widgets */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="text-center py-12">
                    <div className="mx-auto max-w-md">
                        <div className="mx-auto h-12 w-12 text-muted-foreground">
                            <TrendingUp className="h-12 w-12" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">Get started with your casting dashboard</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Add your first actors and projects to see your dashboard come to life.
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <Button
                                onClick={() => seedSampleData(useAppStore.getState())}
                                className="inline-flex items-center"
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
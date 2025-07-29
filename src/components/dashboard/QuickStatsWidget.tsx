// Quick stats widget showing key metrics breakdown

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuickStatsWidgetProps {
    totalRoles: number;
    filledRoles: number;
    totalProjects: number;
    activeProjects: number;
}

export function QuickStatsWidget({
    totalRoles,
    filledRoles,
    totalProjects,
    activeProjects,
}: QuickStatsWidgetProps) {
    const rolesFillRate = totalRoles > 0 ? (filledRoles / totalRoles) * 100 : 0;
    const projectsActiveRate = totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Roles Filled</span>
                        <span className="font-medium">
                            {filledRoles} of {totalRoles}
                        </span>
                    </div>
                    <Progress value={rolesFillRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                        {rolesFillRate.toFixed(1)}% completion rate
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active Projects</span>
                        <span className="font-medium">
                            {activeProjects} of {totalProjects}
                        </span>
                    </div>
                    <Progress value={projectsActiveRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                        {projectsActiveRate.toFixed(1)}% projects active
                    </p>
                </div>

                <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {totalRoles - filledRoles}
                            </p>
                            <p className="text-xs text-muted-foreground">Open Roles</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {totalProjects - activeProjects}
                            </p>
                            <p className="text-xs text-muted-foreground">Inactive Projects</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
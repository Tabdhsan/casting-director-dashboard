import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/types/constants';

export function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Home className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">Page Not Found</CardTitle>
                    <CardDescription>
                        The page you're looking for doesn't exist or has been moved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You can return to the dashboard or go back to the previous page.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="flex-1">
                            <Link to={ROUTES.DASHBOARD}>
                                <Home className="h-4 w-4 mr-2" />
                                Go to Dashboard
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
// Loading component for better UX

import { Loader2, Film, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title = 'Loading...', description, className = '' }: LoadingCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-center p-6">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h3 className="mt-4 text-lg font-medium">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className = '', lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted animate-pulse rounded"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  );
}

interface LoadingGridProps {
  items?: number;
  className?: string;
}

export function LoadingGrid({ items = 6, className = '' }: LoadingGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Fun casting-themed loading animation
interface CastingLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export function CastingLoading({ title = 'Finding the perfect cast...', description, className = '' }: CastingLoadingProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            {/* Film reel animation */}
            <div className="absolute inset-0 animate-spin">
              <Film className="w-16 h-16 text-primary/60" />
            </div>
            {/* Star overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Actor-specific loading
export function ActorLoading({ className = '' }: { className?: string }) {
  return (
    <CastingLoading 
      title="Discovering new talent..."
      description="Loading actor profiles and details"
      className={className}
    />
  );
}

// Project-specific loading
export function ProjectLoading({ className = '' }: { className?: string }) {
  return (
    <CastingLoading 
      title="Setting the stage..."
      description="Loading project hierarchy and roles"
      className={className}
    />
  );
} 
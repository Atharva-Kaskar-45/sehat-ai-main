
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  colorScheme?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const HealthMetricCard = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  colorScheme = 'default',
  className,
}: HealthMetricCardProps) => {
  // Color mapping based on colorScheme
  const colorMap = {
    default: 'bg-white',
    success: 'bg-health-low bg-opacity-50 border-health-low',
    warning: 'bg-health-medium bg-opacity-50 border-health-medium',
    danger: 'bg-health-elevated bg-opacity-50 border-health-elevated',
    info: 'bg-health-info bg-opacity-50 border-health-info',
  };
  
  // Trend icons and colors
  const trendDisplay = trend ? (
    <div className={cn(
      "flex items-center text-xs font-medium",
      trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'
    )}>
      {trend === 'up' && (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {trendValue}
        </>
      )}
      {trend === 'down' && (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {trendValue}
        </>
      )}
      {trend === 'stable' && (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
          {trendValue}
        </>
      )}
    </div>
  ) : null;

  return (
    <Card className={cn("border overflow-hidden transition-all hover:shadow-md", colorMap[colorScheme], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-sehat-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && <CardDescription>{description}</CardDescription>}
          {trendDisplay}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;

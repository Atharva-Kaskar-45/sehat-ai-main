
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface RiskIndicatorProps {
  risk: 'low' | 'medium' | 'high' | 'unknown';
  showLabel?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RiskIndicator = ({
  risk,
  showLabel = true,
  showIcon = true,
  size = 'md',
  className,
}: RiskIndicatorProps) => {
  // Risk level configuration
  const config = {
    low: {
      label: 'Low Risk',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-100',
      icon: <CheckCircle />,
    },
    medium: {
      label: 'Medium Risk',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      icon: <AlertTriangle />,
    },
    high: {
      label: 'High Risk',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-100',
      icon: <AlertCircle />,
    },
    unknown: {
      label: 'Unknown',
      color: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-100',
      icon: <HelpCircle />,
    },
  };

  // Size configuration
  const sizeStyles = {
    sm: {
      container: 'text-xs py-1 px-2',
      icon: 'h-3 w-3',
      dot: 'h-2 w-2',
    },
    md: {
      container: 'text-sm py-1 px-3',
      icon: 'h-4 w-4',
      dot: 'h-2.5 w-2.5',
    },
    lg: {
      container: 'text-base py-1.5 px-4',
      icon: 'h-5 w-5',
      dot: 'h-3 w-3',
    },
  };

  const { label, color, textColor, bgColor, icon } = config[risk];
  const { container, icon: iconSize, dot } = sizeStyles[size];

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full',
        bgColor,
        container,
        className
      )}
    >
      {showIcon && (
        <span className={cn('mr-1', textColor, iconSize)}>
          {icon}
        </span>
      )}
      {!showIcon && (
        <span className={cn('mr-1.5 rounded-full', color, dot)}></span>
      )}
      {showLabel && (
        <span className={cn('font-medium', textColor)}>{label}</span>
      )}
    </div>
  );
};

export default RiskIndicator;

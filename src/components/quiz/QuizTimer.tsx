'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  timeRemaining: number; // in seconds
  isPaused: boolean;
  onTimeUp: () => void;
  warningTime?: number; // show warning when remaining time reaches this value (in seconds)
}

export function QuizTimer({ 
  timeRemaining, 
  isPaused, 
  onTimeUp, 
  warningTime = 300 // 5 minutes
}: QuizTimerProps) {
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    setIsWarning(timeRemaining <= warningTime && timeRemaining > 0);
  }, [timeRemaining, warningTime]);

  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (totalTime: number, remaining: number) => {
    return Math.max(0, (remaining / totalTime) * 100);
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      isWarning && "border-red-300 bg-red-50",
      isPaused && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            isWarning ? "bg-red-100" : "bg-blue-100"
          )}>
            {isWarning ? (
              <AlertTriangle className={cn(
                "w-4 h-4",
                isWarning ? "text-red-600" : "text-blue-600"
              )} />
            ) : (
              <Clock className="w-4 h-4 text-blue-600" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {isPaused ? 'Paused' : 'Time Remaining'}
              </span>
              <span className={cn(
                "font-mono font-bold text-lg",
                isWarning ? "text-red-600" : "text-foreground"
              )}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-linear",
                  isWarning ? "bg-red-500" : "bg-blue-500"
                )}
                style={{ 
                  width: `${getProgressPercentage(3600, timeRemaining)}%` // Assuming 1 hour max
                }}
              />
            </div>
          </div>
        </div>

        {isWarning && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            ⚠️ Time is running low!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
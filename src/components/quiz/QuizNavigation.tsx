'use client';

import { CheckCircle, Flag, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  onNavigate: (index: number) => void;
  getQuestionStatus: (index: number) => 'answered' | 'flagged' | 'unanswered';
}

export function QuizNavigation({
  totalQuestions,
  currentQuestion,
  onNavigate,
  getQuestionStatus,
}: QuizNavigationProps) {
  const getStatusIcon = (index: number) => {
    const status = getQuestionStatus(index);
    
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-4 h-4" />;
      case 'flagged':
        return <Flag className="w-4 h-4 fill-current" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (index: number) => {
    const status = getQuestionStatus(index);
    const isCurrent = index === currentQuestion;
    
    if (isCurrent) {
      return 'bg-primary text-primary-foreground border-primary';
    }
    
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200';
      default:
        return 'bg-background text-muted-foreground border-border hover:bg-accent';
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: totalQuestions }, (_, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onNavigate(index)}
          className={cn(
            "h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200",
            getStatusColor(index)
          )}
        >
          <span className="font-medium">{index + 1}</span>
          <div className="scale-75">
            {getStatusIcon(index)}
          </div>
        </Button>
      ))}
    </div>
  );
}
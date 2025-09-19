import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calculator,
  CheckCircle,
  TrendingUp,
  FlaskConical,
} from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Your Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your scores, identify weaknesses, and conquer the exam.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Average
            </CardTitle>
            <TrendingUp className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Quizzes Completed
            </CardTitle>
            <CheckCircle className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">
              +2 since yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Weakest Subject
            </CardTitle>
            <Calculator className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mathematics</div>
            <p className="text-xs text-muted-foreground">
              Average Score: 68%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>
            Your average score for each subject category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* This is a placeholder for a chart or more detailed stats */}
          <div className="flex items-center">
            <Calculator className="mr-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Mathematics</p>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-destructive h-2.5 rounded-full"
                  style={{ width: '68%' }}
                ></div>
              </div>
            </div>
            <p className="ml-4 font-bold">68%</p>
          </div>
          <div className="flex items-center">
            <FlaskConical className="mr-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Science</p>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
            <p className="ml-4 font-bold">85%</p>
          </div>
          {/* Add more subjects as needed */}
        </CardContent>
      </Card>
    </div>
  );
}

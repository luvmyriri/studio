import { MockExamSimulator } from '@/components/exam/MockExamSimulator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, FileText, Award } from 'lucide-react';

export default function MockExamPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          🎯 Civil Service Mock Examination
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Experience the real Civil Service Examination with our comprehensive mock tests. 
          Practice under timed conditions with authentic question formats and difficulty levels.
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">⏱️</div>
            <div className="text-sm text-muted-foreground">Timed Conditions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">📝</div>
            <div className="text-sm text-muted-foreground">Real Exam Format</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">📈</div>
            <div className="text-sm text-muted-foreground">Detailed Analysis</div>
          </div>
        </div>
      </div>

      {/* Mock Exam Features */}
      <Card className="border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Mock Examination Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Authentic Timing</h3>
              <p className="text-sm text-muted-foreground">
                3.5 hours for Professional Level, 2 hours for Sub-Professional - just like the real exam.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Complete Coverage</h3>
              <p className="text-sm text-muted-foreground">
                All 6 Civil Service subjects with proper question distribution and weightage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Official passing scores: 80% for Professional, 70% for Sub-Professional levels.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-lg">📈</span>
              </div>
              <h3 className="font-semibold mb-2">Performance Report</h3>
              <p className="text-sm text-muted-foreground">
                Detailed subject-wise analysis with strengths, weaknesses, and recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Exam Simulator Component */}
      <MockExamSimulator />
    </div>
  );
}

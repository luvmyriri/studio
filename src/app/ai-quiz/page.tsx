import { AIQuizGenerator } from '@/components/quiz/AIQuizGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';

export default function AIQuizPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          AI-Powered Quiz Generator
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Get personalized quiz recommendations based on your performance analytics and learning patterns. 
          Our AI analyzes your strengths and weaknesses to create the perfect study experience.
        </p>
      </div>

      {/* How it works */}
      <Card className="border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            How AI Quiz Generation Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Performance Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes your quiz history, scores, and subject performance to identify patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Generate targeted quizzes focusing on weak areas while reinforcing strong subjects.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Personalized Learning</h3>
              <p className="text-sm text-muted-foreground">
                Adaptive difficulty and question selection tailored to your current skill level.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Quiz Generator Component */}
      <AIQuizGenerator />
    </div>
  );
}
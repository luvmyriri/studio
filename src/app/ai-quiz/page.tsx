import { AIQuizGenerator } from '@/components/quiz/AIQuizGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';

export default function AIQuizPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          🧠 AI Personalized Quiz
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Get intelligent quiz recommendations powered by Gemini AI. Our system analyzes your performance history, 
          identifies knowledge gaps, and creates personalized study sessions targeting your specific weak areas.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">🎯</div>
            <div className="text-sm text-muted-foreground">Targeted Learning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">📊</div>
            <div className="text-sm text-muted-foreground">Performance Analytics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">🤖</div>
            <div className="text-sm text-muted-foreground">Gemini AI Powered</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <Card className="border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Personalization Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Performance Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Gemini AI examines your quiz history, identifies knowledge gaps, and tracks improvement patterns across all Civil Service subjects.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Intelligent Question Selection</h3>
              <p className="text-sm text-muted-foreground">
                AI curates questions specifically for your weak areas while maintaining balance across all subjects for comprehensive learning.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Adaptive Difficulty</h3>
              <p className="text-sm text-muted-foreground">
                Dynamic difficulty adjustment based on your performance, ensuring optimal challenge level for maximum learning efficiency.
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
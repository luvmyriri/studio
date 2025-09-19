import { QuizGenerator } from '@/components/quiz/QuizGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Zap, BookOpen } from 'lucide-react';
import { Suspense } from 'react';

function QuestionsPageContent() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          ⚙️ Custom Quiz Generator
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Create your own custom quizzes by selecting specific subjects, difficulty levels, and question counts. 
          Perfect for focused study sessions and targeted practice.
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">🎯</div>
            <div className="text-sm text-muted-foreground">Subject Focus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">⚙️</div>
            <div className="text-sm text-muted-foreground">Custom Settings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">⚡</div>
            <div className="text-sm text-muted-foreground">Quick Practice</div>
          </div>
        </div>
      </div>

      {/* Custom Quiz Features */}
      <Card className="border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Custom Quiz Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Subject Selection</h3>
              <p className="text-sm text-muted-foreground">
                Choose from all 6 Civil Service subjects: Math, Vocabulary, Science, General Info, Clerical Analysis, and Constitution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Settings</h3>
              <p className="text-sm text-muted-foreground">
                Customize difficulty levels (Easy, Medium, Hard) and question counts (3-25 questions) to match your study goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Optional AI Enhancement</h3>
              <p className="text-sm text-muted-foreground">
                Enable Gemini AI for smarter question generation, or use traditional preset questions for consistent practice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Generator Component */}
      <QuizGenerator />
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
      <QuestionsPageContent />
    </Suspense>
  );
}

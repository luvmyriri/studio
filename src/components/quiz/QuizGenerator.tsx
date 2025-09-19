'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { generateQuiz } from '@/app/actions'; // Disabled for static export
import type { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const civilServiceSubjects = [
  'Mathematics',
  'Vocabulary (English and Tagalog)',
  'Clerical Analysis',
  'Science',
  'General Information',
  'Philippine Constitution',
] as const;

const formSchema = z.object({
  topic: z.enum(civilServiceSubjects),
  numQuestions: z.coerce.number().min(3).max(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type QuizFormValues = z.infer<typeof formSchema>;

interface QuizGeneratorProps {
  onQuizGenerated: (quiz: Quiz) => void;
  initialTopic?: string;
  aiGenerated?: boolean;
  initialNumQuestions?: number;
  initialDifficulty?: 'easy' | 'medium' | 'hard';
  userContext?: {
    weakSubjects: string[];
    averageScore: number;
    totalQuizzes: number;
  };
}

export function QuizGenerator({ 
  onQuizGenerated, 
  initialTopic, 
  aiGenerated = false, 
  initialNumQuestions = 5, 
  initialDifficulty = 'medium',
  userContext 
}: QuizGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: initialTopic as QuizFormValues['topic'] || 'General Information',
      numQuestions: initialNumQuestions,
      difficulty: initialDifficulty,
    },
  });

  async function onSubmit(values: QuizFormValues) {
    setIsLoading(true);
    
    try {
      // Use Gemini AI if available and requested
      if (aiGenerated) {
        const { generateQuizWithGemini } = await import('@/lib/gemini');
        
        const aiRequest = {
          subject: values.topic,
          difficulty: values.difficulty,
          numQuestions: values.numQuestions,
          userContext,
          focusAreas: userContext?.weakSubjects || []
        };
        
        console.log('Generating quiz with Gemini AI:', aiRequest);
        const aiQuizResponse = await generateQuizWithGemini(aiRequest);
        
        setIsLoading(false);
        onQuizGenerated(aiQuizResponse);
        
        toast({
          title: '🤖 AI Quiz Generated!',
          description: `Created ${values.numQuestions} personalized ${values.topic} questions using Gemini AI`,
        });
        return;
      }
      
      // Fallback to mock generation for non-AI requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockQuiz = {
        quiz: Array.from({ length: values.numQuestions }, (_, i) => ({
          id: `q${i + 1}`,
          question: `Sample ${values.topic} question ${i + 1} (${values.difficulty} difficulty)`,
          answers: [
            `Option A for question ${i + 1}`,
            `Option B for question ${i + 1}`,
            `Option C for question ${i + 1}`,
            `Option D for question ${i + 1}`
          ],
          correctAnswer: `Option A for question ${i + 1}`,
          subject: values.topic,
          difficulty: values.difficulty,
          explanation: `This is the explanation for question ${i + 1}`,
          tags: [values.topic.toLowerCase().replace(/\s+/g, '-')]
        }))
      };
      
      setIsLoading(false);
      onQuizGenerated(mockQuiz);
      
      toast({
        title: 'Quiz Generated!',
        description: `Generated ${values.numQuestions} questions for ${values.topic} (Demo Mode)`,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      setIsLoading(false);
      
      toast({
        variant: 'destructive',
        title: 'Error Generating Quiz',
        description: 'Failed to generate quiz. Please try again.',
      });
    }
  }

  return (
    <Card className={`max-w-2xl mx-auto animate-fade-in ${
      aiGenerated 
        ? 'bg-gradient-to-br from-primary/5 via-card/90 to-blue-50/50 border-primary/20' 
        : 'bg-card/80 backdrop-blur-sm'
    }`}>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          {aiGenerated ? (
            <span className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                🧠 AI-Personalized Quiz
              </span>
            </span>
          ) : (
            <>AI-Generated Quiz: <span className="text-primary">{form.watch('topic')}</span></>
          )}
        </CardTitle>
        <CardDescription>
          {aiGenerated ? (
            <div className="space-y-2">
              <p>This quiz has been personalized based on your performance analytics.</p>
              {userContext && (
                <div className="text-xs bg-primary/10 p-2 rounded-md">
                  📊 Your stats: {userContext.averageScore}% avg score, {userContext.totalQuizzes} quizzes completed
                  {userContext.weakSubjects.length > 0 && (
                    <>, focusing on: {userContext.weakSubjects.slice(0, 2).join(', ')}</>
                  )}
                </div>
              )}
            </div>
          ) : (
            'Select a subject and let our AI generate a practice quiz for you.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {civilServiceSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <Select
                      onValueChange={value => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of questions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Quiz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Quiz } from '@/lib/types';
import { QuizService, CIVIL_SERVICE_SUBJECTS, QUESTION_LIMITS } from '@/lib/quiz-service';
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

const formSchema = z.object({
  topic: z.enum(CIVIL_SERVICE_SUBJECTS),
  numQuestions: z.coerce.number().min(QUESTION_LIMITS.min).max(QUESTION_LIMITS.max),
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
      const quizRequest = {
        subject: values.topic,
        difficulty: values.difficulty,
        numQuestions: values.numQuestions,
        userContext,
        useAI: aiGenerated,
        isPersonalized: !!userContext && aiGenerated
      };
      
      console.log('Generating quiz with unified service:', quizRequest);
      const generatedQuiz = await QuizService.generateQuiz(quizRequest);
      
      onQuizGenerated(generatedQuiz);
      
      const toastTitle = aiGenerated && userContext 
        ? '🧠 AI-Personalized Quiz Generated!'
        : aiGenerated 
          ? '🤖 AI Quiz Generated!' 
          : '📝 Quiz Generated!';
      
      const toastDescription = aiGenerated 
        ? `Created ${values.numQuestions} ${userContext ? 'personalized ' : ''}${values.topic} questions using ${userContext ? 'personalized AI' : 'AI'}`
        : `Generated ${values.numQuestions} questions for ${values.topic}`;
      
      toast({
        title: toastTitle,
        description: toastDescription,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error Generating Quiz',
        description: 'Failed to generate quiz. Please try again.',
      });
    } finally {
      setIsLoading(false);
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
                        {CIVIL_SERVICE_SUBJECTS.map((subject) => (
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
                        {QuizService.getQuestionCountOptions().map(num => (
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

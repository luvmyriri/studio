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
}

export function QuizGenerator({ onQuizGenerated, initialTopic }: QuizGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: initialTopic as QuizFormValues['topic'] || 'General Information',
      numQuestions: 5,
      difficulty: 'medium',
    },
  });

  async function onSubmit(values: QuizFormValues) {
    setIsLoading(true);
    
    // Mock quiz generation for static demo
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
    
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
  }

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          AI-Generated Quiz: <span className="text-primary">{form.watch('topic')}</span>
        </CardTitle>
        <CardDescription>
          Select a subject and let our AI generate a practice quiz for you.
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

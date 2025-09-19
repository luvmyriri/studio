'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuiz } from '@/app/actions';
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
    const result = await generateQuiz(
      values.topic,
      values.numQuestions,
      values.difficulty
    );
    setIsLoading(false);

    if (result.success) {
      onQuizGenerated(result.quiz);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating quiz',
        description: result.error,
      });
    }
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

'use server';

import { generateQuizFromTopic } from '@/ai/flows/generate-quiz-from-topic';
import type { Quiz } from '@/lib/types';
import { z } from 'zod';

const quizSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswer: z.string(),
    })
  ),
});

export async function generateQuiz(
  topic: string,
  numQuestions: number,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<{ success: true; quiz: Quiz } | { success: false; error: string }> {
  try {
    const result = await generateQuizFromTopic({
      topic,
      numQuestions,
      difficulty,
    });

    // The AI returns a JSON string, so we need to parse it.
    const quizData = JSON.parse(result.quiz);

    // Validate the parsed data against our schema
    const validation = quizSchema.safeParse(quizData);

    if (!validation.success) {
      console.error(
        'AI-generated quiz data failed validation:',
        validation.error
      );
      return {
        success: false,
        error: 'Failed to generate a valid quiz. Please try again.',
      };
    }

    return { success: true, quiz: validation.data };
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to generate quiz: ${errorMessage}`,
    };
  }
}

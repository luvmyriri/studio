'use server';
/**
 * @fileOverview An AI agent that generates a quiz based on a topic, number of questions, and difficulty level.
 *
 * - generateQuizFromTopic - A function that generates a quiz based on the topic, number of questions, and difficulty level.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z
    .number()
    .min(1)
    .max(20)
    .describe('The number of questions in the quiz.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz.'),
});
export type GenerateQuizFromTopicInput = z.infer<
  typeof GenerateQuizFromTopicInputSchema
>;

const GenerateQuizFromTopicOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizFromTopicOutput = z.infer<
  typeof GenerateQuizFromTopicOutputSchema
>;

export async function generateQuizFromTopic(
  input: GenerateQuizFromTopicInput
): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizFromTopicInputSchema},
  output: {schema: GenerateQuizFromTopicOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz on the following topic with the specified number of questions and difficulty level.

Topic: {{{topic}}}
Number of Questions: {{{numQuestions}}}
Difficulty: {{{difficulty}}}

The quiz should be returned in JSON format. Each question should have the question text, possible answers, and the correct answer.

Example:
{
  "quiz": [
    {
      "question": "What is the capital of France?",
      "answers": ["Paris", "London", "Berlin", "Rome"],
      "correctAnswer": "Paris"
    },
    {
      "question": "What is the highest mountain in the world?",
      "answers": ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
      "correctAnswer": "Mount Everest"
    }
  ]
}

Ensure that the output is valid JSON and can be parsed without errors.
`,
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);

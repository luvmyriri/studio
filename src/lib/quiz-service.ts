import { generateQuizWithGemini } from '@/lib/gemini';
import type { Quiz, Question } from '@/lib/types';

export interface QuizGenerationRequest {
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  userContext?: {
    weakSubjects: string[];
    averageScore: number;
    totalQuizzes: number;
  };
  useAI?: boolean;
  isPersonalized?: boolean;
}

export interface QuizGenerationResponse {
  quiz: Question[];
  metadata: {
    generatedBy: 'gemini' | 'mock' | 'preset';
    subject: string;
    difficulty: string;
    questionCount: number;
    generatedAt: Date;
  };
}

// Civil Service subjects mapping
export const CIVIL_SERVICE_SUBJECTS = [
  'Mathematics',
  'Vocabulary (English and Tagalog)',
  'Clerical Analysis', 
  'Science',
  'General Information',
  'Philippine Constitution',
] as const;

export type CivilServiceSubject = typeof CIVIL_SERVICE_SUBJECTS[number];

// Question number constraints
export const QUESTION_LIMITS = {
  min: 3,
  max: 25,
  default: 5,
  aiDefault: 10,
  mockDefault: 20,
} as const;

/**
 * Unified quiz generation service
 * Handles all quiz generation logic in one place
 */
export class QuizService {
  /**
   * Generate a quiz based on the request parameters
   */
  static async generateQuiz(request: QuizGenerationRequest): Promise<Quiz> {
    // Validate request
    this.validateRequest(request);

    let response: QuizGenerationResponse;
    
    // Determine generation method
    if (request.useAI && request.isPersonalized) {
      response = await this.generateAIQuiz(request);
    } else if (request.subject === 'Mixed' || request.useAI) {
      response = await this.generateCustomQuiz(request);
    } else {
      response = await this.generateMockQuiz(request);
    }

    // Convert to Quiz format expected by components
    return {
      id: `${response.metadata.generatedBy}-${Date.now()}`,
      quiz: response.quiz,
      title: `${request.subject} Quiz (${request.difficulty})`,
      description: `${response.metadata.generatedBy === 'gemini' ? 'AI-Generated' : 'Generated'} quiz with ${response.metadata.questionCount} questions`,
      subject: request.subject,
      totalQuestions: response.metadata.questionCount,
      createdAt: response.metadata.generatedAt
    };
  }

  /**
   * Generate AI-powered quiz using Gemini
   */
  private static async generateAIQuiz(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
    try {
      console.log('Generating AI quiz with Gemini:', request);
      
      const aiRequest = {
        subject: request.subject,
        difficulty: request.difficulty,
        numQuestions: request.numQuestions,
        userContext: request.userContext,
        focusAreas: request.userContext?.weakSubjects || []
      };

      const geminiResponse = await generateQuizWithGemini(aiRequest);
      
      return {
        quiz: geminiResponse.quiz,
        metadata: {
          generatedBy: 'gemini',
          subject: request.subject,
          difficulty: request.difficulty,
          questionCount: geminiResponse.quiz.length,
          generatedAt: new Date(),
        }
      };
    } catch (error) {
      console.error('AI quiz generation failed, falling back to custom quiz:', error);
      return this.generateCustomQuiz(request);
    }
  }

  /**
   * Generate custom quiz (smart mock with user context)
   */
  private static async generateCustomQuiz(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const questions: Question[] = Array.from({ length: request.numQuestions }, (_, i) => {
      const questionNumber = i + 1;
      const isPersonalized = request.userContext && request.isPersonalized;
      const isWeakSubject = request.userContext?.weakSubjects.includes(request.subject);

      let questionPrefix = '';
      let explanationPrefix = '';

      if (isPersonalized && isWeakSubject) {
        questionPrefix = '[AI Focus] ';
        explanationPrefix = `AI-Selected: This question targets your weak area in ${request.subject}. `;
      } else if (isPersonalized) {
        questionPrefix = '[AI Adaptive] ';
        explanationPrefix = `AI-Generated: This question matches your skill level. `;
      } else if (request.useAI) {
        questionPrefix = '[AI Generated] ';
        explanationPrefix = `AI-Generated: `;
      }

      return {
        id: `q${questionNumber}-${Date.now()}`,
        question: `${questionPrefix}${request.subject} question ${questionNumber} (${request.difficulty} difficulty)`,
        answers: [
          `Correct answer for question ${questionNumber}`,
          `Plausible incorrect option ${questionNumber}A`,
          `Common mistake option ${questionNumber}B`,
          `Distractor option ${questionNumber}C`
        ],
        correctAnswer: `Correct answer for question ${questionNumber}`,
        subject: request.subject,
        difficulty: request.difficulty,
        explanation: `${explanationPrefix}This is the explanation for question ${questionNumber}. ${
          request.userContext 
            ? `Based on your ${request.userContext.averageScore}% average score, this question helps improve your understanding.`
            : ''
        }`,
        tags: [
          request.subject.toLowerCase().replace(/\s+/g, '-'),
          ...(request.useAI ? ['ai-generated'] : ['custom']),
          ...(isPersonalized ? ['personalized'] : [])
        ]
      };
    });

    return {
      quiz: questions,
      metadata: {
        generatedBy: 'mock',
        subject: request.subject,
        difficulty: request.difficulty,
        questionCount: questions.length,
        generatedAt: new Date(),
      }
    };
  }

  /**
   * Generate preset mock quiz
   */
  private static async generateMockQuiz(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const questions: Question[] = Array.from({ length: request.numQuestions }, (_, i) => ({
      id: `mock-q${i + 1}`,
      question: `${request.subject} question ${i + 1} (${request.difficulty} difficulty)`,
      answers: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`
      ],
      correctAnswer: `Option A for question ${i + 1}`,
      subject: request.subject,
      difficulty: request.difficulty,
      explanation: `This is the explanation for question ${i + 1}.`,
      tags: [request.subject.toLowerCase().replace(/\s+/g, '-'), 'preset']
    }));

    return {
      quiz: questions,
      metadata: {
        generatedBy: 'preset',
        subject: request.subject,
        difficulty: request.difficulty,
        questionCount: questions.length,
        generatedAt: new Date(),
      }
    };
  }

  /**
   * Validate quiz generation request
   */
  private static validateRequest(request: QuizGenerationRequest): void {
    if (!request.subject) {
      throw new Error('Subject is required');
    }
    
    if (!request.difficulty) {
      throw new Error('Difficulty is required');
    }
    
    if (request.numQuestions < QUESTION_LIMITS.min || request.numQuestions > QUESTION_LIMITS.max) {
      throw new Error(`Number of questions must be between ${QUESTION_LIMITS.min} and ${QUESTION_LIMITS.max}`);
    }
  }

  /**
   * Get appropriate question count based on context
   */
  static getRecommendedQuestionCount(context: {
    useAI?: boolean;
    isMockExam?: boolean;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  }): number {
    if (context.isMockExam) {
      return QUESTION_LIMITS.mockDefault;
    }
    
    if (context.useAI) {
      return QUESTION_LIMITS.aiDefault;
    }
    
    return QUESTION_LIMITS.default;
  }

  /**
   * Get valid question count options for UI
   */
  static getQuestionCountOptions(maxQuestions?: number): number[] {
    const max = Math.min(maxQuestions || QUESTION_LIMITS.max, QUESTION_LIMITS.max);
    const options: number[] = [];
    
    for (let i = QUESTION_LIMITS.min; i <= max; i++) {
      options.push(i);
    }
    
    return options;
  }
}

// Export types for components
export type { QuizGenerationRequest, QuizGenerationResponse, CivilServiceSubject };

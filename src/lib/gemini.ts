import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will use mock data.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface AIQuizRequest {
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  userContext?: {
    weakSubjects: string[];
    averageScore: number;
    totalQuizzes: number;
  };
  focusAreas?: string[];
}

export interface AIQuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  tags: string[];
}

export interface AIQuizResponse {
  quiz: AIQuizQuestion[];
}

export async function generateQuizWithGemini(request: AIQuizRequest): Promise<AIQuizResponse> {
  if (!genAI) {
    // Fallback to mock data if no API key
    return generateMockQuiz(request);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = createQuizPrompt(request);
    console.log('Gemini prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedQuestions = JSON.parse(cleanedText);

    // Validate and format the questions
    const formattedQuiz = formatGeminiResponse(parsedQuestions, request);
    
    return { quiz: formattedQuiz };
  } catch (error) {
    console.error('Error generating quiz with Gemini:', error);
    // Fallback to mock data on error
    return generateMockQuiz(request);
  }
}

function createQuizPrompt(request: AIQuizRequest): string {
  const { subject, difficulty, numQuestions, userContext, focusAreas } = request;

  let prompt = `Generate ${numQuestions} multiple-choice questions for the Philippine Civil Service Examination on the subject "${subject}" with ${difficulty} difficulty level.

IMPORTANT: Respond with valid JSON only, no additional text or markdown formatting.

Each question should have:
- A clear, relevant question
- Exactly 4 answer choices (A, B, C, D)
- One correct answer
- A detailed explanation
- Be relevant to Philippine Civil Service Exam content

Subject-specific requirements:
`;

  // Add subject-specific context
  switch (subject) {
    case 'Mathematics':
      prompt += `- Focus on: basic operations, fractions, percentages, word problems, algebra, geometry
- Include practical scenarios relevant to government work
- Ensure calculations are reasonable for the difficulty level`;
      break;
    case 'Vocabulary (English and Tagalog)':
    case 'Vocabulary':
      prompt += `- Include both English and Filipino vocabulary
- Cover synonyms, antonyms, reading comprehension
- Include Filipino idioms (sawikain) and proverbs (salawikain)
- Focus on professional communication terms`;
      break;
    case 'Clerical Analysis':
      prompt += `- Cover alphabetical filing, data analysis, following instructions
- Include proofreading and error detection scenarios
- Focus on office procedures and clerical skills`;
      break;
    case 'Science':
      prompt += `- Cover basic biology, chemistry, physics, earth science
- Include environmental science and health topics
- Focus on concepts relevant to everyday life and work`;
      break;
    case 'General Information':
      prompt += `- Cover Philippine history, government, geography, culture
- Include current events and important laws
- Focus on information relevant to public service`;
      break;
    case 'Philippine Constitution':
      prompt += `- Cover constitutional articles, bill of rights, government structure
- Include citizenship, local government, and constitutional commissions
- Focus on practical applications of constitutional law`;
      break;
  }

  if (userContext) {
    prompt += `\n\nUser Performance Context:
- Average score: ${userContext.averageScore}%
- Total quizzes taken: ${userContext.totalQuizzes}
- Weak subjects: ${userContext.weakSubjects.join(', ')}`;

    if (userContext.averageScore < 60) {
      prompt += '\n- Focus on fundamental concepts and easier explanations';
    } else if (userContext.averageScore > 80) {
      prompt += '\n- Include more challenging questions and advanced concepts';
    }
  }

  if (focusAreas && focusAreas.length > 0) {
    prompt += `\n\nFocus Areas: ${focusAreas.join(', ')}`;
  }

  prompt += `\n\nJSON Format (respond with this exact structure):
{
  "questions": [
    {
      "question": "Question text here",
      "choices": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correctAnswer": "A",
      "explanation": "Detailed explanation of why this is correct and others are wrong"
    }
  ]
}`;

  return prompt;
}

function formatGeminiResponse(parsedResponse: any, request: AIQuizRequest): AIQuizQuestion[] {
  const questions = parsedResponse.questions || parsedResponse || [];
  
  return questions.map((q: any, index: number) => {
    const correctChoice = q.choices?.find((choice: string) => 
      choice.startsWith(q.correctAnswer + '.')
    );

    return {
      id: `gemini-${Date.now()}-${index}`,
      question: q.question || `Generated question ${index + 1}`,
      answers: q.choices || [
        `Option A`,
        `Option B`,
        `Option C`, 
        `Option D`
      ],
      correctAnswer: correctChoice || q.choices?.[0] || 'Option A',
      subject: request.subject,
      difficulty: request.difficulty,
      explanation: q.explanation || 'AI-generated explanation',
      tags: ['gemini-ai', 'civil-service', request.subject.toLowerCase().replace(/\s+/g, '-')]
    };
  }).slice(0, request.numQuestions); // Ensure we don't exceed requested number
}

function generateMockQuiz(request: AIQuizRequest): AIQuizResponse {
  const { subject, difficulty, numQuestions, userContext } = request;
  
  const mockQuestions = Array.from({ length: numQuestions }, (_, i) => ({
    id: `mock-ai-${Date.now()}-${i}`,
    question: userContext 
      ? `[AI Mock] ${subject} question ${i + 1} (${difficulty}) - Based on your ${userContext.averageScore}% avg score`
      : `[AI Mock] ${subject} question ${i + 1} (${difficulty} difficulty)`,
    answers: [
      `Correct answer for question ${i + 1}`,
      `Plausible incorrect option ${i + 1}A`,
      `Common mistake option ${i + 1}B`,
      `Distractor option ${i + 1}C`
    ],
    correctAnswer: `Correct answer for question ${i + 1}`,
    subject,
    difficulty,
    explanation: `Mock AI explanation for ${subject} question ${i + 1}. ${
      userContext ? `This question was selected based on your performance data.` : ''
    }`,
    tags: ['mock-ai', 'civil-service', subject.toLowerCase().replace(/\s+/g, '-')]
  }));

  return { quiz: mockQuestions };
}

// Export for testing
export { createQuizPrompt, formatGeminiResponse, generateMockQuiz };
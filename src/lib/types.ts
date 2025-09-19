export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

export interface Quiz {
  quiz: Question[];
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Book, PencilRuler } from 'lucide-react';
import Link from 'next/link';

const studyPlans = {
  mathematics: {
    title: 'Mathematics Study Plan',
    description: 'A 2-week plan to build your math confidence.',
    weeks: [
      {
        title: 'Week 1: Foundations',
        steps: [
          {
            type: 'lesson',
            title: 'Review Basic Operations & PEMDAS',
            href: '/lessons/mathematics',
          },
          {
            type: 'lesson',
            title: 'Understand Fractions, Decimals, and Percentages',
            href: '/lessons/mathematics',
          },
          {
            type: 'quiz',
            title: 'Take a 5-item quiz on Foundations',
            href: `/questions?topic=${encodeURIComponent('Mathematics')}&numQuestions=5&difficulty=easy`,
          },
        ],
      },
      {
        title: 'Week 2: Application',
        steps: [
          {
            type: 'lesson',
            title: 'Mastering Word Problems',
            href: '/lessons/mathematics',
          },
          {
            type: 'lesson',
            title: 'Practice Ratio and Proportion',
            href: '/lessons/mathematics',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on Applications',
            href: `/questions?topic=${encodeURIComponent('Mathematics')}&numQuestions=10&difficulty=medium`,
          },
        ],
      },
    ],
  },
  vocabulary: {
    title: 'Vocabulary Study Plan',
    description: 'A 2-week plan to expand your English and Tagalog vocabulary.',
    weeks: [
      {
        title: 'Week 1: Core English Concepts',
        steps: [
          {
            type: 'lesson',
            title: 'Learn Synonyms and Antonyms',
            href: '/lessons/vocabulary',
          },
          {
            type: 'lesson',
            title: 'Practice with Context Clues',
            href: '/lessons/vocabulary',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on English Vocabulary',
            href: `/questions?topic=${encodeURIComponent('Vocabulary (English and Tagalog)')}&numQuestions=10&difficulty=easy`,
          },
        ],
      },
      {
        title: 'Week 2: Tagalog & Idioms',
        steps: [
          {
            type: 'lesson',
            title: 'Pag-aralan ang Salawikain at Sawikain',
            href: '/lessons/vocabulary',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on Tagalog Vocabulary',
            href: `/questions?topic=${encodeURIComponent('Vocabulary (English and Tagalog)')}&numQuestions=10&difficulty=medium`,
          },
        ],
      },
    ],
  },
  clerical_analysis: {
    title: 'Clerical Analysis Study Plan',
    description: 'A 1-week plan to sharpen your clerical skills.',
    weeks: [
      {
        title: 'Week 1: Core Clerical Skills',
        steps: [
          {
            type: 'lesson',
            title: 'Master Alphabetical Filing Rules',
            href: '/lessons/clerical-analysis',
          },
          {
            type: 'lesson',
            title: 'Practice Spelling, Grammar, and Following Instructions',
            href: '/lessons/clerical-analysis',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on Clerical Analysis',
            href: `/questions?topic=${encodeURIComponent('Clerical Analysis')}&numQuestions=10&difficulty=medium`,
          },
        ],
      },
    ],
  },
  science: {
    title: 'Science Study Plan',
    description: 'A 1-week overview of key scientific concepts.',
    weeks: [
      {
        title: 'Week 1: Fundamental Science',
        steps: [
          {
            type: 'lesson',
            title: 'Review Earth Science and Biology Basics',
            href: '/lessons/science',
          },
          {
            type: 'lesson',
            title: 'Understand Basic Chemistry Concepts',
            href: '/lessons/science',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on General Science',
            href: `/questions?topic=${encodeURIComponent('Science')}&numQuestions=10&difficulty=medium`,
          },
        ],
      },
    ],
  },
  general_information: {
    title: 'General Information Study Plan',
    description: 'A 2-week guide to essential general knowledge.',
    weeks: [
      {
        title: 'Week 1: History and Governance',
        steps: [
          {
            type: 'lesson',
            title: 'Study Philippine History and Heroes',
            href: '/lessons/general-information',
          },
          {
            type: 'lesson',
            title: 'Review the Code of Conduct (R.A. 6713)',
            href: '/lessons/general-information',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on History & Governance',
            href: `/questions?topic=${encodeURIComponent('General Information')}&numQuestions=10&difficulty=medium`,
          },
        ],
      },
      {
        title: 'Week 2: Environment and Current Events',
        steps: [
          {
            type: 'lesson',
            title: 'Learn about Environmental Laws',
            href: '/lessons/general-information',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on General Knowledge',
            href: `/questions?topic=${encodeURIComponent('General Information')}&numQuestions=10&difficulty=hard`,
          },
        ],
      },
    ],
  },
  philippine_constitution: {
    title: 'Philippine Constitution Study Plan',
    description: 'A 2-week deep dive into the supreme law of the land.',
    weeks: [
      {
        title: 'Week 1: Foundations and Rights',
        steps: [
          {
            type: 'lesson',
            title: 'Understand the Preamble and National Territory',
            href: '/lessons/philippine-constitution',
          },
          {
            type: 'lesson',
            title: 'Deep Dive into the Bill of Rights (Article III)',
            href: '/lessons/philippine-constitution',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on Constitutional Rights',
            href: `/questions?topic=${encodeURIComponent('Philippine Constitution')}&numQuestions=10&difficulty=medium`,
          },
        ],
      },
      {
        title: 'Week 2: Government Structure',
        steps: [
          {
            type: 'lesson',
            title: 'Learn the Three Branches of Government',
            href: '/lessons/philippine-constitution',
          },
          {
            type: 'lesson',
            title: 'Review the rules on Citizenship',
            href: '/lessons/philippine-constitution',
          },
          {
            type: 'quiz',
            title: 'Take a 10-item quiz on Government Structure',
            href: `/questions?topic=${encodeURIComponent('Philippine Constitution')}&numQuestions=10&difficulty=hard`,
          },
        ],
      },
    ],
  },
};

const StepItem = ({
  step,
}: {
  step: { type: 'lesson' | 'quiz'; title: string; href?: string };
}) => {
  const Icon = step.type === 'lesson' ? Book : PencilRuler;
  const content = (
    <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors">
      <Icon className="w-5 h-5 text-primary" />
      <span className="flex-1">{step.title}</span>
      <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  if (step.href) {
    return (
      <Link href={step.href} className="group">
        {content}
      </Link>
    );
  }
  return <div className="group cursor-pointer">{content}</div>;
};

export default function StudyPlansPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Study Plans</h1>
        <p className="text-muted-foreground mt-2">
          Your step-by-step guide to mastering the Civil Service Exam subjects.
        </p>
      </div>

      {Object.values(studyPlans).map((plan) => (
        <Card key={plan.title}>
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-0">
              {plan.weeks.map((week, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-bold text-lg">
                    {week.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {week.steps.map((step, stepIndex) => (
                      <StepItem key={stepIndex} step={step} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

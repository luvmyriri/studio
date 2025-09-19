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
import { Book, PencilRuler, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Generate static params for all available subjects
export async function generateStaticParams() {
  const subjects = [
    'mathematics',
    'vocabulary', 
    'clerical-analysis',
    'science',
    'general-information',
    'philippine-constitution'
  ];
  
  return subjects.map((subject) => ({
    subject: subject,
  }));
}

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
  'clerical-analysis': {
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
  'general-information': {
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
  'philippine-constitution': {
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
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-gradient-to-r from-background/50 to-muted/30 hover:from-primary/5 hover:to-primary/10 hover:border-primary/30 transition-all duration-200 group">
      <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <span className="flex-1 font-medium text-foreground/90 group-hover:text-foreground">{step.title}</span>
      <CheckCircle className="w-5 h-5 text-green-500/70 opacity-0 group-hover:opacity-100 transition-all duration-200" />
    </div>
  );

  if (step.href) {
    return (
      <Link href={step.href} className="block">
        {content}
      </Link>
    );
  }
  return <div className="cursor-pointer">{content}</div>;
};

export default function IndividualStudyPlanPage({
  params,
}: {
  params: { subject: string };
}) {
  const plan = studyPlans[params.subject as keyof typeof studyPlans];

  if (!plan) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/study-plans">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Study Plans
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Study Plan Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sorry, we couldn't find the study plan you were looking for.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/study-plans">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Study Plans
          </Link>
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">{plan.title}</h1>
        <p className="text-muted-foreground mt-2">{plan.description}</p>
      </div>

      <Card className="bg-gradient-to-br from-card/90 to-card/50 border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {plan.title}
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                {plan.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {plan.weeks.length} {plan.weeks.length === 1 ? 'Week' : 'Weeks'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible defaultValue="item-0">
            {plan.weeks.map((week, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-primary/20">
                <AccordionTrigger className="font-semibold text-lg hover:text-primary transition-colors">
                  {week.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  {week.steps.map((step, stepIndex) => (
                    <StepItem key={stepIndex} step={step} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need lesson materials for this subject?{' '}
          <Link
            href={`/lessons/${params.subject}`}
            className="text-primary hover:underline"
          >
            View {plan.title.replace(' Study Plan', '')} Lessons →
          </Link>
        </p>
      </div>
    </div>
  );
}
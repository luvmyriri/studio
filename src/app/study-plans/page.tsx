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
import { Book, CheckCircle, PencilRuler } from 'lucide-react';
import Link from 'next/link';

const studyPlan = {
  mathematics: [
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
        { type: 'quiz', title: 'Take a 5-item quiz on Foundations' },
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
        { type: 'quiz', title: 'Take a 10-item quiz on Applications' },
      ],
    },
  ],
  vocabulary: [
    {
      title: 'Week 1: Core Concepts',
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
        { type: 'quiz', title: 'Take a 5-item quiz on Core Concepts' },
      ],
    },
  ],
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
  return <div className="group">{content}</div>;
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

      <Card>
        <CardHeader>
          <CardTitle>Mathematics Study Plan</CardTitle>
          <CardDescription>
            A 2-week plan to build your math confidence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-0">
            {studyPlan.mathematics.map((week, index) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Vocabulary Study Plan</CardTitle>
          <CardDescription>A 1-week plan to expand your vocabulary.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-0">
            {studyPlan.vocabulary.map((week, index) => (
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
    </div>
  );
}

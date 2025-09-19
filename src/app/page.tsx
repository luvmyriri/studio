import { Header } from '@/components/layout/Header';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BrainCircuit,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  ScanText,
  Gavel,
  CheckCircle,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const subjects = [
  {
    name: 'Mathematics',
    icon: Calculator,
    query: 'Mathematics',
    path: 'mathematics',
  },
  {
    name: 'Vocabulary',
    icon: Languages,
    query: 'Vocabulary (English and Tagalog)',
    path: 'vocabulary',
  },
  {
    name: 'Clerical Analysis',
    icon: ScanText,
    query: 'Clerical Analysis',
    path: 'clerical-analysis',
  },
  { name: 'Science', icon: FlaskConical, query: 'Science', path: 'science' },
  {
    name: 'General Information',
    icon: Globe,
    query: 'General Information',
    path: 'general-information',
  },
  {
    name: 'Philippine Constitution',
    icon: Gavel,
    query: 'Philippine Constitution',
    path: 'philippine-constitution',
  },
];

const features = [
  {
    icon: Target,
    title: 'AI-Powered Quizzes',
    description:
      'Generate limitless practice questions tailored to your chosen subject and difficulty. Our AI ensures you never run out of review material.',
  },
  {
    icon: BookOpen,
    title: 'In-Depth Lessons',
    description:
      'Access comprehensive, easy-to-understand lessons for all major subjects, covering the key concepts you need to know for the exam.',
  },
  {
    icon: CheckCircle,
    title: 'Realistic Mock Exams',
    description:
      'Simulate the actual exam experience with our pre-made mock tests, designed to test your knowledge across a wide range of topics.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in space-y-16 md:space-y-24 pb-24">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8 md:pt-12">
        <BrainCircuit className="mx-auto w-24 h-24 text-primary animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          BSOAD Civil Service Exam Reviewer
        </h1>
        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">
          Your AI-powered study partner for personalized quizzes, mock exams, and
          comprehensive lessons. Prepare smarter, not harder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link href="/questions?mode=mock">Start Mock Exam</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/study-plans">View Study Plans</Link>
          </Button>
        </div>
      </div>

      {/* What you get Section */}
      <div className="w-full max-w-6xl space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Everything You Need to Pass
          </h2>
          <p className="text-muted-foreground">
            One platform, all the tools for success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-card/50 backdrop-blur-sm border-border/50 text-center"
            >
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="pt-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Metrics/Progress Section */}
      <div className="w-full max-w-6xl px-4">
        <Card className="bg-gradient-to-r from-primary/10 via-background to-accent/10 p-8 md:p-12 border-border/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">
                Track Your Progress, Master Your Weaknesses
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Our platform gives you the insights you need to focus your study
                time. See your scores, identify challenging topics, and watch
                your performance improve over time.
              </p>
              <Button asChild className="mt-6" size="lg">
                <Link href="/progress">View Your Progress</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overall Score
                  </CardTitle>
                  <TrendingUp className="text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">82%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Weakest Subject
                  </CardTitle>
                  <Calculator className="text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Mathematics</div>
                  <p className="text-xs text-muted-foreground">
                    Focus on word problems and fractions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* Subjects Section */}
      <div
        id="subjects"
        className="w-full max-w-6xl space-y-8 px-4 scroll-mt-24"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Comprehensive Subject Coverage
          </h2>
          <p className="text-muted-foreground">
            Dive into lessons or generate a quiz for any exam topic.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className="flex flex-col hover:border-primary/50 transition-colors group bg-card/50 backdrop-blur-sm border-border/50"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <subject.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/lessons/${subject.path}`}>
                      <BookOpen /> Lesson
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={`/questions?topic=${encodeURIComponent(
                        subject.query
                      )}`}
                    >
                      Start Quiz
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

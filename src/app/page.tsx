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
  Bot,
  Sparkles,
  Zap,
  Brain,
  Stars,
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
    icon: Brain,
    title: 'Google Gemini AI Integration',
    description:
      'Real AI-powered question generation using Google\'s most advanced language model. Get unlimited, intelligent questions tailored to Philippine Civil Service Exam content.',
    highlight: true,
  },
  {
    icon: Target,
    title: 'Smart Personalization',
    description:
      'Our AI analyzes your performance to identify weak areas and adapts question difficulty. Study smarter with recommendations based on your progress.',
    highlight: false,
  },
  {
    icon: Sparkles,
    title: 'Adaptive Learning System',
    description:
      'Experience personalized study paths that evolve with your learning. Each quiz becomes more effective as the AI learns your strengths and weaknesses.',
    highlight: false,
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Content',
    description:
      'Access in-depth lessons covering all Civil Service Exam subjects with AI-generated examples and explanations tailored to your understanding level.',
    highlight: false,
  },
  {
    icon: CheckCircle,
    title: 'Realistic Mock Exams',
    description:
      'Simulate the actual exam experience with AI-enhanced mock tests that adapt to current exam trends and your performance history.',
    highlight: false,
  },
  {
    icon: Zap,
    title: 'Instant AI Feedback',
    description:
      'Get immediate, detailed explanations for every answer powered by Gemini AI, helping you understand not just what\'s correct, but why.',
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in space-y-16 md:space-y-24 pb-24">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8 md:pt-12">
        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 rounded-full px-4 py-2 mb-4">
          <Bot className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powered by Google Gemini AI
          </span>
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
        </div>
        
        <div className="relative">
          <BrainCircuit className="mx-auto w-24 h-24 text-primary animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
            <Stars className="w-6 h-6 text-white animate-spin" style={{animationDuration: '4s'}} />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600">
          AI-Powered Civil Service Exam Reviewer
        </h1>
        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl leading-relaxed">
          Experience the future of exam preparation with <span className="font-semibold text-blue-600">Google Gemini AI</span>. 
          Get personalized quizzes, smart recommendations, and adaptive learning 
          tailored specifically for the Philippine Civil Service Examination.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
            <Link href="/ai-quiz">
              <Brain className="mr-2 h-5 w-5" />
              Try AI Quiz Generator
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link href="/questions?mode=mock">Start Mock Exam</Link>
          </Button>
        </div>
      </div>

      {/* AI Showcase Section */}
      <div className="w-full max-w-6xl px-4">
        <Card className="relative bg-gradient-to-br from-blue-600/5 via-background/50 to-purple-600/5 border-2 border-blue-200/30 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">Google Gemini AI</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Experience True AI-Powered Learning
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our platform integrates Google's most advanced AI model to deliver 
                  personalized Civil Service Exam preparation. Every question is intelligently 
                  crafted based on your performance data and learning patterns.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Smart Question Generation</h4>
                      <p className="text-sm text-muted-foreground">AI creates unlimited practice questions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Performance Analysis</h4>
                      <p className="text-sm text-muted-foreground">Identifies and targets weak areas</p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/ai-quiz">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Try AI Quiz Now
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">AI Analysis</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Your Performance</div>
                        <div className="text-lg font-bold">Mathematics: 72%</div>
                        <div className="text-xs text-blue-600">🎯 Focus on word problems</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">AI Recommendation</div>
                        <div className="text-sm">"Generate 15 easy-level math questions focusing on fractions and percentages"</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-300/30">
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">🤖 Gemini AI</div>
                        <div className="text-sm">Generating personalized questions...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* What you get Section */}
      <div className="w-full max-w-6xl space-y-8 px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 rounded-full px-3 py-1">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Features</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">
            The Most Advanced Civil Service Exam Platform
          </h2>
          <p className="text-muted-foreground">
            Powered by Google Gemini AI for intelligent, personalized learning.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={`text-center relative overflow-hidden ${
                feature.highlight 
                  ? 'bg-gradient-to-br from-blue-50/80 via-card/50 to-purple-50/80 border-2 border-blue-200/50 shadow-lg shadow-blue-500/20' 
                  : 'bg-card/50 backdrop-blur-sm border-border/50'
              }`}
            >
              {feature.highlight && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    ✨ NEW
                  </div>
                </div>
              )}
              <CardHeader>
                <div className={`mx-auto p-3 rounded-full w-fit ${
                  feature.highlight 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                    : 'bg-primary/10'
                }`}>
                  <feature.icon className={`w-8 h-8 ${
                    feature.highlight ? 'text-blue-600' : 'text-primary'
                  }`} />
                </div>
                <CardTitle className="pt-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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

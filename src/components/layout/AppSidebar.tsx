'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  Book,
  Calculator,
  FlaskConical,
  Globe,
  Home,
  Languages,
  ScanText,
  BookOpen,
  PencilRuler,
  Gavel,
  ChevronDown,
  TrendingUp,
  ClipboardCheck,
  BookOpenCheck,
  FileQuestion,
  Users,
  Trophy,
  BarChart3,
  Brain,
  Settings,
  Gamepad2,
  MessageSquare,
  Play,
  Target,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';

const civilServiceSubjects = [
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
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();
  const [openSections, setOpenSections] = useState({
    studyPlans: false,
    lessons: false,
    questions: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => {
      // Close all sections first
      const newSections = { studyPlans: false, lessons: false, questions: false };
      // Then open the clicked section if it was previously closed
      newSections[section] = !prev[section];
      return newSections;
    });
  };

  return (
    <>
      <SidebarHeader>{/* Header */}</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'}>
              <Link href="/">
                <Home />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/progress'}>
              <Link href="/progress">
                <TrendingUp />
                Progress
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator />
        
        {/* Main Features */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/quiz'}>
              <Link href="/quiz">
                <Play />
                Practice Quiz
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/mock-exam'}>
              <Link href="/mock-exam">
                <Target />
                Mock Exam
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/ai-quiz'}>
              <Link href="/ai-quiz">
                <Brain />
                AI Quiz
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/materials'}>
              <Link href="/materials">
                <BookOpen />
                Study Materials
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator />
        
        {/* Community & Progress */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/community'}>
              <Link href="/community">
                <MessageSquare />
                Community
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/achievements'}>
              <Link href="/achievements">
                <Trophy />
                Achievements
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/analytics'}>
              <Link href="/analytics">
                <BarChart3 />
                Analytics
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator />
        
        <SidebarMenu>
          {/* Study Plans Section */}
          <SidebarMenuItem>
            <Collapsible
              open={openSections.studyPlans}
              onOpenChange={() => toggleSection('studyPlans')}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith('/study-plans')}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardCheck />
                    <span>Study Plans</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'transition-transform',
                      openSections.studyPlans && 'rotate-180'
                    )}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="py-1 pl-6 pr-2">
                <SidebarMenu>
                  {/* Main Study Plans link */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      size="sm"
                      isActive={pathname === '/study-plans'}
                      variant="ghost"
                    >
                      <Link href="/study-plans">
                        <ClipboardCheck />
                        All Study Plans
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* Individual subject study plans */}
                  {civilServiceSubjects.map((subject) => (
                    <SidebarMenuItem key={subject.path}>
                      <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={pathname === `/study-plans/${subject.path}`}
                        variant="ghost"
                      >
                        <Link href={`/study-plans/${subject.path}`}>
                          <subject.icon />
                          {subject.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Lessons Section */}
          <SidebarMenuItem>
            <Collapsible
              open={openSections.lessons}
              onOpenChange={() => toggleSection('lessons')}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith('/lessons')}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <BookOpenCheck />
                    <span>Lessons</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'transition-transform',
                      openSections.lessons && 'rotate-180'
                    )}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="py-1 pl-6 pr-2">
                <SidebarMenu>
                  {/* Main Lessons link */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      size="sm"
                      isActive={pathname === '/lessons'}
                      variant="ghost"
                    >
                      <Link href="/lessons">
                        <Book />
                        All Lessons
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* Individual subject links */}
                  {civilServiceSubjects.map((subject) => (
                    <SidebarMenuItem key={subject.path}>
                      <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={pathname === `/lessons/${subject.path}`}
                        variant="ghost"
                      >
                        <Link href={`/lessons/${subject.path}`}>
                          <subject.icon />
                          {subject.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Questions Section */}
          <SidebarMenuItem>
            <Collapsible
              open={openSections.questions}
              onOpenChange={() => toggleSection('questions')}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith('/questions')}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileQuestion />
                    <span>Questions</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'transition-transform',
                      openSections.questions && 'rotate-180'
                    )}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="py-1 pl-6 pr-2">
                 <SidebarMenu>
                    <SidebarMenuItem>
                       <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={pathname.includes('mode=mock')}
                        variant="ghost"
                      >
                        <Link href="/questions?mode=mock">
                          <PencilRuler/>
                          Mock Exam
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={pathname.includes('mode=ai')}
                        variant="ghost"
                      >
                        <Link href="/questions?mode=ai">
                          <Book/>
                          AI Generated
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Admin Section - Only visible to admins */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                  <Link href="/admin">
                    <Settings />
                    Admin Panel
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
    </>
  );
}

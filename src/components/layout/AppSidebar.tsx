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
import { CIVIL_SERVICE_SUBJECTS } from '@/lib/quiz-service';

// Create sidebar-specific subject configuration from centralized constants
const civilServiceSubjects = CIVIL_SERVICE_SUBJECTS.map((subject) => {
  const config = {
    name: subject,
    query: subject,
    path: subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    icon: Calculator // default icon
  };
  
  // Map specific icons for each subject
  switch (subject) {
    case 'Mathematics':
      config.icon = Calculator;
      break;
    case 'Vocabulary (English and Tagalog)':
      config.icon = Languages;
      config.name = 'Vocabulary';
      break;
    case 'Clerical Analysis':
      config.icon = ScanText;
      break;
    case 'Science':
      config.icon = FlaskConical;
      break;
    case 'General Information':
      config.icon = Globe;
      break;
    case 'Philippine Constitution':
      config.icon = Gavel;
      break;
  }
  
  return config;
});

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
            <SidebarMenuButton asChild isActive={pathname === '/ai-quiz'}>
              <Link href="/ai-quiz">
                <Brain />
                AI Personalized Quiz
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/mock-exam'}>
              <Link href="/mock-exam">
                <Target />
                Civil Service Mock Exam
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

          {/* Custom Quiz Section */}
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
                    <span>Custom Quiz</span>
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
                    {/* Individual subject quiz generators */}
                    {civilServiceSubjects.map((subject) => (
                      <SidebarMenuItem key={subject.path}>
                        <SidebarMenuButton
                          asChild
                          size="sm"
                          isActive={pathname === `/questions/${subject.path}`}
                          variant="ghost"
                        >
                          <Link href={`/questions?subject=${encodeURIComponent(subject.query)}&mode=custom`}>
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

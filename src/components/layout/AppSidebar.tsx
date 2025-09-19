'use client';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
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
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const civilServiceSubjects = [
  { name: 'Mathematics', icon: Calculator, query: 'Mathematics', path: 'mathematics' },
  { name: 'Vocabulary', icon: Languages, query: 'Vocabulary (English and Tagalog)', path: 'vocabulary' },
  { name: 'Clerical Analysis', icon: ScanText, query: 'Clerical Analysis', path: 'clerical-analysis' },
  { name: 'Science', icon: FlaskConical, query: 'Science', path: 'science' },
  { name: 'General Information', icon: Globe, query: 'General Information', path: 'general-information' },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        {/* You can add a header here if needed */}
      </SidebarHeader>
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
            <SidebarMenuButton asChild isActive={pathname === '/quiz'}>
              <Link href="/quiz">
                <PencilRuler />
                Take a Quiz
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Book /> AI-Generated Quiz
          </SidebarGroupLabel>
          <SidebarMenu>
            {civilServiceSubjects.map((subject) => (
              <SidebarMenuItem key={subject.name}>
                <SidebarMenuButton asChild>
                  <Link href={`/quiz?topic=${encodeURIComponent(subject.query)}`}>
                    <subject.icon />
                    {subject.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
           <SidebarGroupLabel className="flex items-center gap-2">
            <BookOpen /> Resources
          </SidebarGroupLabel>
          <SidebarMenu>
            {civilServiceSubjects.map((subject) => (
              <SidebarMenuItem key={subject.path}>
                <SidebarMenuButton asChild isActive={pathname === `/resources/${subject.path}`}>
                  <Link href={`/resources/${subject.path}`}>
                    <subject.icon />
                    {subject.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

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
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const civilServiceSubjects = [
  { name: 'Mathematics', icon: Calculator, query: 'Mathematics' },
  { name: 'Vocabulary', icon: Languages, query: 'Vocabulary (English and Tagalog)' },
  { name: 'Clerical Analysis', icon: ScanText, query: 'Clerical Analysis' },
  { name: 'Science', icon: FlaskConical, query: 'Science' },
  { name: 'General Information', icon: Globe, query: 'General Information' },
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
                  <Link href={`/?topic=${encodeURIComponent(subject.query)}`}>
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

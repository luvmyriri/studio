import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="py-4 px-6 border-b border-border bg-transparent flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <BrainCircuit className="w-8 h-8 text-primary group-hover:animate-pulse" />
          <h1 className="text-2xl font-bold text-foreground">
            Civil Service Reviewer
          </h1>
        </Link>
      </div>
    </header>
  );
}

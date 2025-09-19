'use client';

import { BrainCircuit, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useState } from 'react';
import { toast } from 'sonner';

export function Header() {
  const { currentUser, firebaseUser, logout, loginWithGoogle } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Successfully signed in with Google!');
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="py-4 px-6 border-b border-border bg-transparent flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Desktop Logo */}
          <div className="hidden sm:block relative w-12 h-12 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.svg"
              alt="BSOAD Logo"
              width={48}
              height={48}
              className="w-full h-full"
              priority
            />
          </div>
          {/* Mobile Logo */}
          <div className="sm:hidden relative w-8 h-8 group-hover:scale-105 transition-transform">
            <Image
              src="/icon.svg"
              alt="BSOAD Logo"
              width={32}
              height={32}
              className="w-full h-full"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-foreground leading-tight">
              BSOAD Civil Service Reviewer
            </h1>
            <p className="text-xs text-muted-foreground">
              Philippine Government Exam Preparation
            </p>
          </div>
          {/* Mobile Text */}
          <div className="sm:hidden">
            <h1 className="text-lg font-bold text-foreground">
              BSOAD
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {currentUser || firebaseUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={firebaseUser?.photoURL || ''} 
                      alt={currentUser?.displayName || firebaseUser?.displayName || 'User'} 
                    />
                    <AvatarFallback>
                      {(currentUser?.displayName || firebaseUser?.displayName || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {currentUser?.displayName || firebaseUser?.displayName || 'User'}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {currentUser?.email || firebaseUser?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/progress">Profile & Progress</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/achievements">Achievements</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/analytics">Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleGoogleLogin}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowLoginDialog(true)}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </header>
  );
}

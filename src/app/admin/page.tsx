'use client';

import { AdminPanel } from '@/components/admin/AdminPanel';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { isAdmin, loading } = useAdmin();

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!currentUser || !isAdmin) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You do not have permission to access this page.
          </p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This page is restricted to authorized administrators only. 
              If you believe you should have access, please contact the system administrator.
            </p>
            <Button asChild>
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin panel for authorized users
  return <AdminPanel />;
}

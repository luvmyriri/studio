import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin, isSuperAdmin, getAdminUser, ensureSuperAdminExists, type AdminUser } from '@/lib/admin';

export function useAdmin() {
  const { currentUser, firebaseUser } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!firebaseUser) {
        setAdminUser(null);
        setIsAdminUser(false);
        setIsSuperAdminUser(false);
        setLoading(false);
        return;
      }

      try {
        const userEmail = firebaseUser.email;
        const userId = firebaseUser.uid;
        
        console.log('useAdmin: Checking admin status for:', { userEmail, userId });
        
        if (!userEmail || !userId) {
          console.log('useAdmin: Missing email or uid');
          setAdminUser(null);
          setIsAdminUser(false);
          setIsSuperAdminUser(false);
          setLoading(false);
          return;
        }
        
        // Debug admin status
        const { debugAdminStatus, createSuperAdminRecord } = await import('@/lib/admin-setup');
        await debugAdminStatus(userId, userEmail);
        
        // Check if super admin
        const superAdmin = isSuperAdmin(userEmail);
        console.log('useAdmin: Super admin check result:', superAdmin);
        setIsSuperAdminUser(superAdmin);

        if (superAdmin) {
          console.log('useAdmin: Ensuring super admin record exists');
          // Ensure super admin record exists using both methods
          await ensureSuperAdminExists(userId, userEmail);
          await createSuperAdminRecord(userId, userEmail);
        }

        // Check if any type of admin
        console.log('useAdmin: Checking general admin status');
        const adminStatus = await isAdmin(userId, userEmail);
        console.log('useAdmin: Admin status result:', adminStatus);
        setIsAdminUser(adminStatus);

        // Get admin user data if admin
        if (adminStatus) {
          console.log('useAdmin: Getting admin user data');
          const adminData = await getAdminUser(userId);
          console.log('useAdmin: Admin data:', adminData);
          setAdminUser(adminData);
        } else {
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminUser(false);
        setIsSuperAdminUser(false);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [firebaseUser]);

  return {
    adminUser,
    isAdmin: isAdminUser,
    isSuperAdmin: isSuperAdminUser,
    loading,
    refetch: async () => {
      if (firebaseUser?.uid) {
        const adminData = await getAdminUser(firebaseUser.uid);
        setAdminUser(adminData);
      }
    }
  };
}
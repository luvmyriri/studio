import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminUser, DEFAULT_SUPER_ADMIN_PERMISSIONS } from '@/lib/admin';

/**
 * Manually create super admin record (for development/testing)
 * This should be called once to ensure the super admin record exists
 */
export async function createSuperAdminRecord(userId: string, email: string): Promise<void> {
  try {
    const adminRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      const superAdmin: AdminUser = {
        uid: userId,
        email: email,
        displayName: 'Super Administrator',
        role: 'super_admin',
        addedBy: 'system',
        addedAt: new Date(),
        permissions: DEFAULT_SUPER_ADMIN_PERMISSIONS,
        isActive: true,
      };

      await setDoc(adminRef, superAdmin);
      console.log('Super admin record created successfully');
    } else {
      console.log('Super admin record already exists');
    }
  } catch (error) {
    console.error('Error creating super admin record:', error);
    throw error;
  }
}

/**
 * Debug function to check admin status
 */
export async function debugAdminStatus(userId: string, email: string): Promise<void> {
  try {
    console.log('=== ADMIN DEBUG INFO ===');
    console.log('User ID:', userId);
    console.log('User Email:', email);
    console.log('Expected Super Admin Email:', 'vjlamsenlamsen28@gmail.com');
    console.log('Email Match:', email?.toLowerCase() === 'vjlamsenlamsen28@gmail.com');
    
    // Check if admin record exists
    const adminRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminRef);
    
    console.log('Admin Record Exists:', adminDoc.exists());
    if (adminDoc.exists()) {
      console.log('Admin Data:', adminDoc.data());
    }
    
    console.log('========================');
  } catch (error) {
    console.error('Error in admin debug:', error);
  }
}
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin';
  addedBy: string;
  addedAt: Date;
  permissions: AdminPermissions;
  isActive: boolean;
}

export interface AdminPermissions {
  manageUsers: boolean;
  manageContent: boolean;
  manageAdmins: boolean; // Only super admin
  viewAnalytics: boolean;
  exportData: boolean;
  systemSettings: boolean;
}

// Super admin email - this is you!
const SUPER_ADMIN_EMAIL = 'vjlamsenlamsen28@gmail.com';

export const DEFAULT_SUPER_ADMIN_PERMISSIONS: AdminPermissions = {
  manageUsers: true,
  manageContent: true,
  manageAdmins: true,
  viewAnalytics: true,
  exportData: true,
  systemSettings: true,
};

const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  manageUsers: true,
  manageContent: true,
  manageAdmins: false,
  viewAnalytics: true,
  exportData: true,
  systemSettings: false,
};

/**
 * Check if a user is the super admin
 */
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) {
    console.log('isSuperAdmin: No email provided');
    return false;
  }
  const result = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  console.log('isSuperAdmin: Checking', email, 'against', SUPER_ADMIN_EMAIL, '=', result);
  return result;
}

/**
 * Check if a user is any type of admin
 */
export async function isAdmin(userId: string, email: string): Promise<boolean> {
  try {
    // Super admin is always admin
    if (isSuperAdmin(email)) {
      // Ensure super admin record exists
      await ensureSuperAdminExists(userId, email);
      return true;
    }

    // Check if user exists in admins collection
    const adminRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminRef);
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data() as AdminUser;
      return adminData.isActive;
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get admin user data
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    const adminRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminRef);
    
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      return {
        ...data,
        addedAt: data.addedAt?.toDate() || new Date(),
      } as AdminUser;
    }

    return null;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
}

/**
 * Ensure super admin record exists
 */
export async function ensureSuperAdminExists(userId: string, email: string): Promise<void> {
  if (!isSuperAdmin(email)) return;

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

      await setDoc(adminRef, {
        ...superAdmin,
        addedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error ensuring super admin exists:', error);
  }
}

/**
 * Add a new admin user (only super admin can do this)
 */
export async function addAdminUser(
  currentUserId: string,
  currentUserEmail: string,
  newAdminEmail: string,
  displayName: string,
  permissions: Partial<AdminPermissions> = {}
): Promise<boolean> {
  try {
    // Only super admin can add admins
    if (!isSuperAdmin(currentUserEmail)) {
      throw new Error('Only super admin can add admin users');
    }

    // Check if user already exists
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', newAdminEmail)
    );
    const userDocs = await getDocs(usersQuery);
    
    if (userDocs.empty) {
      throw new Error('User must have an account first before becoming admin');
    }

    const userData = userDocs.docs[0];
    const userId = userData.id;

    // Check if already admin
    const existingAdmin = await getAdminUser(userId);
    if (existingAdmin) {
      throw new Error('User is already an admin');
    }

    // Create admin record
    const newAdmin: AdminUser = {
      uid: userId,
      email: newAdminEmail,
      displayName: displayName,
      role: 'admin',
      addedBy: currentUserId,
      addedAt: new Date(),
      permissions: {
        ...DEFAULT_ADMIN_PERMISSIONS,
        ...permissions,
        manageAdmins: false, // Regular admins can't manage other admins
      },
      isActive: true,
    };

    const adminRef = doc(db, 'admins', userId);
    await setDoc(adminRef, {
      ...newAdmin,
      addedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error adding admin user:', error);
    throw error;
  }
}

/**
 * Remove admin privileges from a user
 */
export async function removeAdminUser(
  currentUserId: string,
  currentUserEmail: string,
  adminUserId: string
): Promise<boolean> {
  try {
    // Only super admin can remove admins
    if (!isSuperAdmin(currentUserEmail)) {
      throw new Error('Only super admin can remove admin users');
    }

    // Can't remove super admin
    const adminToRemove = await getAdminUser(adminUserId);
    if (adminToRemove?.role === 'super_admin') {
      throw new Error('Cannot remove super admin privileges');
    }

    // Remove admin record
    const adminRef = doc(db, 'admins', adminUserId);
    await deleteDoc(adminRef);

    return true;
  } catch (error) {
    console.error('Error removing admin user:', error);
    throw error;
  }
}

/**
 * Update admin permissions
 */
export async function updateAdminPermissions(
  currentUserId: string,
  currentUserEmail: string,
  adminUserId: string,
  newPermissions: Partial<AdminPermissions>
): Promise<boolean> {
  try {
    // Only super admin can update permissions
    if (!isSuperAdmin(currentUserEmail)) {
      throw new Error('Only super admin can update admin permissions');
    }

    const adminRef = doc(db, 'admins', adminUserId);
    await updateDoc(adminRef, {
      permissions: {
        ...DEFAULT_ADMIN_PERMISSIONS,
        ...newPermissions,
        manageAdmins: false, // Regular admins can't manage other admins
      },
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error updating admin permissions:', error);
    throw error;
  }
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  try {
    const adminsQuery = query(collection(db, 'admins'));
    const adminDocs = await getDocs(adminsQuery);
    
    return adminDocs.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        addedAt: data.addedAt?.toDate() || new Date(),
      } as AdminUser;
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

/**
 * Transfer super admin ownership (only current super admin can do this)
 */
export async function transferSuperAdmin(
  currentUserId: string,
  currentUserEmail: string,
  newSuperAdminUserId: string
): Promise<boolean> {
  try {
    // Only current super admin can transfer ownership
    if (!isSuperAdmin(currentUserEmail)) {
      throw new Error('Only super admin can transfer ownership');
    }

    // Get new super admin data
    const newSuperAdmin = await getAdminUser(newSuperAdminUserId);
    if (!newSuperAdmin || !newSuperAdmin.isActive) {
      throw new Error('Target user must be an active admin');
    }

    // Update current super admin to regular admin
    const currentAdminRef = doc(db, 'admins', currentUserId);
    await updateDoc(currentAdminRef, {
      role: 'admin',
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      updatedAt: serverTimestamp(),
    });

    // Update new user to super admin
    const newAdminRef = doc(db, 'admins', newSuperAdminUserId);
    await updateDoc(newAdminRef, {
      role: 'super_admin',
      permissions: DEFAULT_SUPER_ADMIN_PERMISSIONS,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error transferring super admin:', error);
    throw error;
  }
}
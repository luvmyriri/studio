'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  UserPlus,
  Shield,
  Crown,
  Trash2,
  Settings,
  Users,
  Key,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllAdminUsers,
  addAdminUser,
  removeAdminUser,
  updateAdminPermissions,
  transferSuperAdmin,
  type AdminUser,
  type AdminPermissions,
} from '@/lib/admin';

export function AdminUserManager() {
  const { currentUser, firebaseUser } = useAuth();
  const { isSuperAdmin } = useAdmin();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Form states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPermissions, setNewUserPermissions] = useState<Partial<AdminPermissions>>({
    manageUsers: true,
    manageContent: true,
    viewAnalytics: true,
    exportData: true,
  });

  // Load admin users
  const loadAdminUsers = async () => {
    try {
      const users = await getAllAdminUsers();
      setAdminUsers(users);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  // Add new admin user
  const handleAddUser = async () => {
    if (!currentUser || !firebaseUser) return;
    if (!newUserEmail.trim() || !newUserName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setAddingUser(true);
    try {
      await addAdminUser(
        currentUser.uid,
        firebaseUser.email!,
        newUserEmail.trim(),
        newUserName.trim(),
        newUserPermissions
      );

      toast.success(`Successfully added ${newUserName} as admin`);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPermissions({
        manageUsers: true,
        manageContent: true,
        viewAnalytics: true,
        exportData: true,
      });
      setShowAddDialog(false);
      await loadAdminUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add admin user');
    } finally {
      setAddingUser(false);
    }
  };

  // Remove admin user
  const handleRemoveUser = async (adminUser: AdminUser) => {
    if (!currentUser || !firebaseUser) return;

    try {
      await removeAdminUser(currentUser.uid, firebaseUser.email!, adminUser.uid);
      toast.success(`Removed admin privileges from ${adminUser.displayName}`);
      await loadAdminUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove admin user');
    }
  };

  // Transfer super admin
  const handleTransferSuperAdmin = async (adminUser: AdminUser) => {
    if (!currentUser || !firebaseUser) return;

    try {
      await transferSuperAdmin(currentUser.uid, firebaseUser.email!, adminUser.uid);
      toast.success(`Transferred super admin privileges to ${adminUser.displayName}`);
      await loadAdminUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to transfer super admin');
    }
  };

  // Permission checkbox handler
  const handlePermissionChange = (permission: keyof AdminPermissions, checked: boolean) => {
    setNewUserPermissions(prev => ({
      ...prev,
      [permission]: checked,
    }));
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Super Admin Only</h3>
          <p className="text-sm text-muted-foreground">
            Only the super administrator can manage admin users.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin User Management</h2>
          <p className="text-muted-foreground">
            Manage administrator accounts and permissions
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>
                Add an existing user as an administrator. The user must already have an account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="space-y-3">
                  {[
                    { key: 'manageUsers' as const, label: 'User Management', desc: 'Manage user accounts and profiles' },
                    { key: 'manageContent' as const, label: 'Content Management', desc: 'Create and edit quiz content' },
                    { key: 'viewAnalytics' as const, label: 'View Analytics', desc: 'Access system analytics and reports' },
                    { key: 'exportData' as const, label: 'Export Data', desc: 'Export system data and reports' },
                  ].map((permission) => (
                    <div key={permission.key} className="flex items-start space-x-3">
                      <Checkbox
                        id={permission.key}
                        checked={newUserPermissions[permission.key] || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.key, checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor={permission.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={addingUser}>
                {addingUser && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Users ({adminUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {adminUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No admin users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                          {user.role === 'super_admin' ? (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Super Admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-x-1">
                          {user.permissions.manageUsers && <Badge variant="outline" className="text-xs">Users</Badge>}
                          {user.permissions.manageContent && <Badge variant="outline" className="text-xs">Content</Badge>}
                          {user.permissions.viewAnalytics && <Badge variant="outline" className="text-xs">Analytics</Badge>}
                          {user.permissions.exportData && <Badge variant="outline" className="text-xs">Export</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.addedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.role !== 'super_admin' && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Key className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Transfer Super Admin</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to transfer super admin privileges to {user.displayName}? 
                                      You will become a regular admin and lose super admin privileges.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleTransferSuperAdmin(user)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Transfer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-destructive">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Admin User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove admin privileges from {user.displayName}? 
                                      They will lose access to all admin features.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveUser(user)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {user.role === 'super_admin' && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
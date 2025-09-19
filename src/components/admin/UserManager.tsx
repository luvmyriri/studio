'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Crown,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Award,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';

interface ExtendedUser extends User {
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'banned';
  lastActive: Date;
  sessionsThisWeek: number;
  avgSessionTime: number;
  totalTimeSpent: number;
  completionRate: number;
  reportedIssues: number;
  forumPosts: number;
  helpfulVotes: number;
}

const sampleUsers: ExtendedUser[] = [
  {
    uid: 'user1',
    email: 'maria.santos@email.com',
    displayName: 'Maria Santos',
    photoURL: null,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-02-15'),
    studyStreak: 15,
    totalScore: 1250,
    totalQuizzesTaken: 25,
    achievements: ['streak_7', 'score_1000', 'quiz_master'],
    preferences: {
      theme: 'system',
      difficulty: 'medium',
      studyTime: 60,
      subjects: ['Mathematics', 'General Information'],
      notifications: { daily: true, weekly: true, achievements: true }
    },
    role: 'user',
    status: 'active',
    lastActive: new Date('2024-02-15T14:30:00'),
    sessionsThisWeek: 12,
    avgSessionTime: 45,
    totalTimeSpent: 1800,
    completionRate: 85,
    reportedIssues: 0,
    forumPosts: 8,
    helpfulVotes: 23
  },
  {
    uid: 'user2',
    email: 'john.delacruz@email.com',
    displayName: 'John Dela Cruz',
    photoURL: null,
    createdAt: new Date('2024-01-12'),
    lastLogin: new Date('2024-02-14'),
    studyStreak: 8,
    totalScore: 980,
    totalQuizzesTaken: 18,
    achievements: ['first_quiz', 'streak_7'],
    preferences: {
      theme: 'light',
      difficulty: 'hard',
      studyTime: 90,
      subjects: ['Philippine Constitution', 'Science'],
      notifications: { daily: false, weekly: true, achievements: true }
    },
    role: 'user',
    status: 'active',
    lastActive: new Date('2024-02-14T09:15:00'),
    sessionsThisWeek: 8,
    avgSessionTime: 62,
    totalTimeSpent: 1240,
    completionRate: 78,
    reportedIssues: 1,
    forumPosts: 12,
    helpfulVotes: 15
  },
  {
    uid: 'mod1',
    email: 'moderator@civilservice.com',
    displayName: 'Admin Moderator',
    photoURL: null,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-02-16'),
    studyStreak: 0,
    totalScore: 0,
    totalQuizzesTaken: 0,
    achievements: [],
    preferences: {
      theme: 'dark',
      difficulty: 'medium',
      studyTime: 60,
      subjects: [],
      notifications: { daily: true, weekly: true, achievements: false }
    },
    role: 'moderator',
    status: 'active',
    lastActive: new Date('2024-02-16T16:45:00'),
    sessionsThisWeek: 20,
    avgSessionTime: 120,
    totalTimeSpent: 8400,
    completionRate: 0,
    reportedIssues: 0,
    forumPosts: 45,
    helpfulVotes: 156
  }
];

const userAnalytics = {
  totalUsers: 1247,
  activeToday: 234,
  newThisWeek: 23,
  suspended: 5,
  avgSessionTime: 48,
  avgCompletionRate: 82,
  topPerformers: 15,
  moderators: 3
};

export function UserManager() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<ExtendedUser[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-yellow-100 text-yellow-800">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.uid === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const changeUserRole = (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    setUsers(prev => prev.map(user => 
      user.uid === userId 
        ? { ...user, role: newRole }
        : user
    ));
  };

  const viewUserDetails = (user: ExtendedUser) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const exportUserData = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Joined', 'Last Active', 'Quizzes', 'Score', 'Streak'],
      ...filteredUsers.map(user => [
        user.displayName || 'Anonymous',
        user.email,
        user.role,
        user.status,
        format(user.createdAt, 'yyyy-MM-dd'),
        format(user.lastActive, 'yyyy-MM-dd HH:mm'),
        user.totalQuizzesTaken.toString(),
        user.totalScore.toString(),
        user.studyStreak.toString()
      ])
    ]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage users, roles, and monitor platform activity
          </p>
        </div>
        <Button onClick={exportUserData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{userAnalytics.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +{userAnalytics.newThisWeek} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold">{userAnalytics.activeToday}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((userAnalytics.activeToday / userAnalytics.totalUsers) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                    <p className="text-2xl font-bold">{userAnalytics.avgSessionTime}m</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userAnalytics.avgCompletionRate}% completion rate
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issues</p>
                    <p className="text-2xl font-bold">{userAnalytics.suspended}</p>
                    <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      Suspended users
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map(user => (
                    <div key={user.uid} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.displayName || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">
                          Last active {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter(u => u.role === 'user')
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div key={user.uid} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          index === 0 ? "bg-yellow-500" : 
                          index === 1 ? "bg-gray-400" : 
                          index === 2 ? "bg-amber-600" : "bg-gray-300"
                        )}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.displayName || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.totalScore} points • {user.studyStreak} day streak
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{user.completionRate}%</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Users */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {filteredUsers.length} of {users.length} users
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.displayName || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {user.sessionsThisWeek} sessions this week
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg: {user.avgSessionTime}min • 
                            Last: {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {user.totalScore} points
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.completionRate}% completion • {user.studyStreak} streak
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(user.createdAt, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewUserDetails(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(user.uid)}
                          >
                            {user.status === 'active' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="font-bold text-green-600">+89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Month</span>
                    <span className="font-bold">+67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Growth Rate</span>
                    <span className="font-bold text-green-600">+33%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-bold">{userAnalytics.activeToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Session Time</span>
                    <span className="font-bold">{userAnalytics.avgSessionTime}min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention Rate</span>
                    <span className="font-bold text-green-600">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Performers</span>
                    <span className="font-bold text-green-600">{userAnalytics.topPerformers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Completion</span>
                    <span className="font-bold">{userAnalytics.avgCompletionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Need Support</span>
                    <span className="font-bold text-yellow-600">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Roles Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>User Roles Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Crown className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                  <p className="font-medium">Admins</p>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">0.08% of users</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="font-medium">Moderators</p>
                  <p className="text-2xl font-bold">{userAnalytics.moderators}</p>
                  <p className="text-xs text-muted-foreground">0.24% of users</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                  <p className="font-medium">Regular Users</p>
                  <p className="text-2xl font-bold">{userAnalytics.totalUsers - userAnalytics.moderators - 1}</p>
                  <p className="text-xs text-muted-foreground">99.68% of users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.displayName || 'this user'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
                  {selectedUser.displayName?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedUser.displayName || 'Anonymous'}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Joined {format(selectedUser.createdAt, 'MMM dd, yyyy')}</p>
                  <p>Last active {formatDistanceToNow(selectedUser.lastActive, { addSuffix: true })}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <Target className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-sm font-medium">Quizzes</p>
                  <p className="text-xl font-bold">{selectedUser.totalQuizzesTaken}</p>
                </div>
                
                <div className="text-center p-3 border rounded-lg">
                  <Award className="w-6 h-6 mx-auto text-yellow-600 mb-1" />
                  <p className="text-sm font-medium">Score</p>
                  <p className="text-xl font-bold">{selectedUser.totalScore}</p>
                </div>
                
                <div className="text-center p-3 border rounded-lg">
                  <Activity className="w-6 h-6 mx-auto text-green-600 mb-1" />
                  <p className="text-sm font-medium">Streak</p>
                  <p className="text-xl font-bold">{selectedUser.studyStreak}</p>
                </div>
                
                <div className="text-center p-3 border rounded-lg">
                  <Clock className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-sm font-medium">Avg Session</p>
                  <p className="text-xl font-bold">{selectedUser.avgSessionTime}m</p>
                </div>
              </div>

              {/* Activity & Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sessions this week:</span>
                      <span className="font-medium">{selectedUser.sessionsThisWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total time spent:</span>
                      <span className="font-medium">{Math.floor(selectedUser.totalTimeSpent / 60)}h {selectedUser.totalTimeSpent % 60}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion rate:</span>
                      <span className="font-medium">{selectedUser.completionRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Community</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Forum posts:</span>
                      <span className="font-medium">{selectedUser.forumPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Helpful votes:</span>
                      <span className="font-medium">{selectedUser.helpfulVotes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issues reported:</span>
                      <span className="font-medium">{selectedUser.reportedIssues}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div>
                <h4 className="font-semibold mb-3">Role Management</h4>
                <div className="flex gap-2">
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value: 'admin' | 'moderator' | 'user') => 
                      changeUserRole(selectedUser.uid, value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => toggleUserStatus(selectedUser.uid)}
                  >
                    {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
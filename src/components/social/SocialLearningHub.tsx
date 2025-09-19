'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Users,
  MessageSquare,
  Trophy,
  Crown,
  Medal,
  Star,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Share2,
  Plus,
  Search,
  Filter,
  Flame,
  Target,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { StudyGroup, ForumPost, ForumReply } from '@/lib/types';

// Sample data
const sampleForumPosts: ForumPost[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Maria Santos',
    title: 'Tips for solving algebraic word problems?',
    content: 'I\'m struggling with word problems in mathematics. Any strategies that worked for you?',
    subject: 'Mathematics',
    tags: ['algebra', 'word-problems', 'tips'],
    votes: 15,
    replies: [
      {
        id: '1-1',
        authorId: 'user2',
        authorName: 'John Dela Cruz',
        content: 'Try breaking down the problem into steps: 1) Identify what you\'re looking for, 2) Define variables, 3) Set up equations, 4) Solve',
        votes: 8,
        createdAt: new Date('2024-02-15'),
      },
      {
        id: '1-2',
        authorId: 'user3',
        authorName: 'Ana Reyes',
        content: 'Practice with the mock problems in the study materials section. They have good explanations!',
        votes: 5,
        createdAt: new Date('2024-02-15'),
      }
    ],
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '2',
    authorId: 'user4',
    authorName: 'Carlos Rodriguez',
    title: 'Philippine Constitution memorization techniques',
    content: 'What are your best methods for memorizing constitutional articles and sections?',
    subject: 'Philippine Constitution',
    tags: ['memorization', 'constitution', 'study-techniques'],
    votes: 23,
    replies: [
      {
        id: '2-1',
        authorId: 'user5',
        authorName: 'Lisa Garcia',
        content: 'I use flashcards and mnemonics. Also, understanding the historical context helps a lot!',
        votes: 12,
        createdAt: new Date('2024-02-13'),
      }
    ],
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-13')
  }
];

const sampleStudyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'Math Masters 2024',
    description: 'Focused group for mastering mathematics for the civil service exam',
    creatorId: 'user1',
    members: ['user1', 'user2', 'user3', 'user4', 'user5'],
    isPublic: true,
    subject: 'Mathematics',
    createdAt: new Date('2024-01-15'),
    activities: [
      {
        id: 'a1',
        type: 'quiz_challenge',
        title: 'Weekly Math Challenge #3',
        description: '20 questions on algebra and geometry',
        createdBy: 'user1',
        createdAt: new Date('2024-02-10'),
        participants: ['user1', 'user2', 'user3'],
        data: { quizId: 'math_challenge_3', scores: [85, 92, 78] }
      }
    ]
  },
  {
    id: '2',
    name: 'Constitution Study Circle',
    description: 'Deep dive into Philippine Constitution and laws',
    creatorId: 'user6',
    members: ['user6', 'user7', 'user8'],
    isPublic: true,
    subject: 'Philippine Constitution',
    createdAt: new Date('2024-01-20'),
    activities: []
  }
];

const leaderboardData = [
  { rank: 1, userId: 'user1', name: 'Maria Santos', avatar: '/avatars/maria.jpg', score: 2450, streak: 28, quizzesTaken: 45, averageScore: 87 },
  { rank: 2, userId: 'user2', name: 'John Dela Cruz', avatar: '/avatars/john.jpg', score: 2380, streak: 25, quizzesTaken: 42, averageScore: 85 },
  { rank: 3, userId: 'user3', name: 'Ana Reyes', avatar: '/avatars/ana.jpg', score: 2290, streak: 22, quizzesTaken: 38, averageScore: 89 },
  { rank: 4, userId: 'user4', name: 'Carlos Rodriguez', avatar: '/avatars/carlos.jpg', score: 2180, streak: 19, quizzesTaken: 35, averageScore: 82 },
  { rank: 5, userId: 'user5', name: 'Lisa Garcia', avatar: '/avatars/lisa.jpg', score: 2120, streak: 15, quizzesTaken: 33, averageScore: 84 },
];

export function SocialLearningHub() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('forums');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(sampleForumPosts);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(sampleStudyGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  // New post/group dialogs
  const [showNewPost, setShowNewPost] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);

  // Form states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSubject, setNewPostSubject] = useState('General Information');
  const [newPostTags, setNewPostTags] = useState('');

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('Mathematics');

  const subjects = [
    'All Subjects',
    'Mathematics',
    'Vocabulary (English and Tagalog)',
    'Clerical Analysis',
    'Science',
    'General Information',
    'Philippine Constitution'
  ];

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || post.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleNewPost = () => {
    if (!newPostTitle || !newPostContent) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      authorId: currentUser?.uid || 'anonymous',
      authorName: currentUser?.displayName || 'Anonymous',
      title: newPostTitle,
      content: newPostContent,
      subject: newPostSubject,
      tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      votes: 0,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setForumPosts(prev => [newPost, ...prev]);
    setShowNewPost(false);
    resetPostForm();
  };

  const resetPostForm = () => {
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostSubject('General Information');
    setNewPostTags('');
  };

  const handleNewGroup = () => {
    if (!newGroupName || !newGroupDescription) return;

    const newGroup: StudyGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      description: newGroupDescription,
      creatorId: currentUser?.uid || 'anonymous',
      members: [currentUser?.uid || 'anonymous'],
      isPublic: true,
      subject: newGroupSubject,
      createdAt: new Date(),
      activities: []
    };

    setStudyGroups(prev => [newGroup, ...prev]);
    setShowNewGroup(false);
    resetGroupForm();
  };

  const resetGroupForm = () => {
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupSubject('Mathematics');
  };

  const voteOnPost = (postId: string, increment: number) => {
    setForumPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, votes: post.votes + increment } : post
    ));
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Social Learning</h1>
        <p className="text-muted-foreground">
          Connect with fellow learners, share knowledge, and study together
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forums" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussion Forums
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Discussion Forums */}
        <TabsContent value="forums" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Discussion Forums</CardTitle>
                <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                      <DialogDescription>
                        Share a question, tip, or start a discussion with the community
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="postTitle" className="text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="postTitle"
                          placeholder="Enter a descriptive title..."
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postSubject" className="text-sm font-medium">
                            Subject
                          </label>
                          <select
                            id="postSubject"
                            value={newPostSubject}
                            onChange={(e) => setNewPostSubject(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            {subjects.filter(s => s !== 'All Subjects').map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="postTags" className="text-sm font-medium">
                            Tags (comma separated)
                          </label>
                          <Input
                            id="postTags"
                            placeholder="e.g., tips, algebra, help"
                            value={newPostTags}
                            onChange={(e) => setNewPostTags(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="postContent" className="text-sm font-medium">
                          Content
                        </label>
                        <Textarea
                          id="postContent"
                          placeholder="Share your thoughts, questions, or knowledge..."
                          rows={6}
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowNewPost(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleNewPost}
                          disabled={!newPostTitle || !newPostContent}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Forum Posts */}
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => voteOnPost(post.id, 1)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-bold">{post.votes}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => voteOnPost(post.id, -1)}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{post.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                by {post.authorName} • {format(post.createdAt, 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{post.subject}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {post.replies.length} replies
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{post.content}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Groups */}
        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Study Groups</CardTitle>
                <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Study Group</DialogTitle>
                      <DialogDescription>
                        Create a group to study together and share resources
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="groupName" className="text-sm font-medium">
                          Group Name
                        </label>
                        <Input
                          id="groupName"
                          placeholder="e.g., Math Study Circle"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="groupSubject" className="text-sm font-medium">
                          Primary Subject
                        </label>
                        <select
                          id="groupSubject"
                          value={newGroupSubject}
                          onChange={(e) => setNewGroupSubject(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          {subjects.filter(s => s !== 'All Subjects').map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="groupDescription" className="text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id="groupDescription"
                          placeholder="Describe the group's purpose and goals..."
                          rows={4}
                          value={newGroupDescription}
                          onChange={(e) => setNewGroupDescription(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowNewGroup(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleNewGroup}
                          disabled={!newGroupName || !newGroupDescription}
                        >
                          Create Group
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search study groups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Study Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map(group => (
                  <Card key={group.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {group.members.length} members
                          </p>
                        </div>
                        <Badge variant="outline">{group.subject}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4">
                        {group.description}
                      </p>
                      
                      <div className="text-xs text-muted-foreground mb-4">
                        Created {format(group.createdAt, 'MMM dd, yyyy')}
                      </div>
                      
                      <div className="mt-auto">
                        <Button className="w-full" size="sm">
                          Join Group
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map(user => (
                  <div key={user.userId} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getRankIcon(user.rank)}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Score: {user.score.toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          {user.streak} day streak
                        </span>
                        <span>{user.quizzesTaken} quizzes</span>
                        <span>Avg: {user.averageScore}%</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        #{user.rank}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">This Week's Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Crown className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                      <h4 className="font-semibold">Top Scorer</h4>
                      <p className="text-sm text-muted-foreground">Maria Santos</p>
                      <p className="text-xs text-muted-foreground">95% average this week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                      <h4 className="font-semibold">Longest Streak</h4>
                      <p className="text-sm text-muted-foreground">John Dela Cruz</p>
                      <p className="text-xs text-muted-foreground">25 consecutive days</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <h4 className="font-semibold">Most Active</h4>
                      <p className="text-sm text-muted-foreground">Ana Reyes</p>
                      <p className="text-xs text-muted-foreground">12 quizzes this week</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
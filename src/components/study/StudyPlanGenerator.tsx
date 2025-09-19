'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Calendar as CalendarIcon,
  Clock,
  Target,
  BookOpen,
  Brain,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Zap,
  Award,
} from 'lucide-react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { StudyPlan, StudySubject, Milestone } from '@/lib/types';

// Sample study plans data
const sampleStudyPlans: StudyPlan[] = [
  {
    id: '1',
    userId: 'user123',
    title: '30-Day Civil Service Intensive',
    subjects: [
      {
        name: 'Mathematics',
        priority: 'high',
        hoursAllocated: 20,
        hoursCompleted: 8,
        targetScore: 85,
        currentScore: 78,
        lessons: []
      },
      {
        name: 'Philippine Constitution',
        priority: 'high',
        hoursAllocated: 15,
        hoursCompleted: 12,
        targetScore: 80,
        currentScore: 85,
        lessons: []
      },
      {
        name: 'General Information',
        priority: 'medium',
        hoursAllocated: 12,
        hoursCompleted: 5,
        targetScore: 80,
        currentScore: 72,
        lessons: []
      }
    ],
    startDate: new Date('2024-02-01'),
    targetDate: new Date('2024-03-02'),
    dailyGoal: 90, // minutes
    completionRate: 45,
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10')
  }
];

const subjects = [
  'Mathematics',
  'Vocabulary (English and Tagalog)',
  'Clerical Analysis',
  'Science',
  'General Information',
  'Philippine Constitution'
];

const studyPlanTemplates = [
  {
    id: 'intensive-30',
    name: '30-Day Intensive',
    description: 'High-intensity preparation for upcoming exam',
    duration: 30,
    dailyHours: 3,
    subjects: subjects.map(s => ({ name: s, priority: 'medium' as const, hours: 15 }))
  },
  {
    id: 'balanced-60',
    name: '60-Day Balanced',
    description: 'Comprehensive preparation with balanced coverage',
    duration: 60,
    dailyHours: 2,
    subjects: subjects.map(s => ({ name: s, priority: 'medium' as const, hours: 20 }))
  },
  {
    id: 'extended-90',
    name: '90-Day Extended',
    description: 'Thorough preparation with ample time for practice',
    duration: 90,
    dailyHours: 1.5,
    subjects: subjects.map(s => ({ name: s, priority: 'medium' as const, hours: 22 }))
  }
];

export function StudyPlanGenerator() {
  const { currentUser } = useAuth();
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(sampleStudyPlans);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(studyPlans[0]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Create plan form state
  const [planTitle, setPlanTitle] = useState('');
  const [examDate, setExamDate] = useState<Date>();
  const [dailyStudyTime, setDailyStudyTime] = useState('60');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [weakAreas, setWeakAreas] = useState<string[]>(['Mathematics', 'Philippine Constitution']);

  const handleCreatePlan = () => {
    if (!planTitle || !examDate || selectedSubjects.length === 0) return;

    const daysUntilExam = differenceInDays(examDate, new Date());
    const totalStudyHours = (parseInt(dailyStudyTime) * daysUntilExam) / 60;
    const hoursPerSubject = totalStudyHours / selectedSubjects.length;

    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      userId: currentUser?.uid || 'anonymous',
      title: planTitle,
      subjects: selectedSubjects.map(subject => ({
        name: subject,
        priority: weakAreas.includes(subject) ? 'high' : 'medium',
        hoursAllocated: Math.round(hoursPerSubject),
        hoursCompleted: 0,
        targetScore: weakAreas.includes(subject) ? 85 : 80,
        currentScore: Math.floor(Math.random() * 20) + 60, // Random current score
        lessons: []
      })),
      startDate: new Date(),
      targetDate: examDate,
      dailyGoal: parseInt(dailyStudyTime),
      completionRate: 0,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setStudyPlans(prev => [...prev, newPlan]);
    setShowCreateDialog(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setPlanTitle('');
    setExamDate(undefined);
    setDailyStudyTime('60');
    setSelectedSubjects([]);
  };

  const activatePlan = (planId: string) => {
    setStudyPlans(prev => prev.map(plan => ({
      ...plan,
      isActive: plan.id === planId ? true : false
    })));
    setSelectedPlan(studyPlans.find(p => p.id === planId) || null);
  };

  const deletePlan = (planId: string) => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== planId));
    if (selectedPlan?.id === planId) {
      setSelectedPlan(studyPlans.find(p => p.id !== planId) || null);
    }
  };

  const generateAIPlan = (template: typeof studyPlanTemplates[0]) => {
    const examDate = addDays(new Date(), template.duration);
    
    setPlanTitle(`${template.name} Study Plan`);
    setExamDate(examDate);
    setDailyStudyTime((template.dailyHours * 60).toString());
    setSelectedSubjects(subjects);
    setShowCreateDialog(true);
  };

  const getTodaysStudyTasks = () => {
    if (!selectedPlan) return [];
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const daysInPlan = differenceInDays(selectedPlan.targetDate, selectedPlan.startDate);
    const daysPassed = differenceInDays(new Date(), selectedPlan.startDate);
    
    // Simple algorithm to distribute subjects across days
    const tasksForToday = selectedPlan.subjects
      .filter((subject, index) => (daysPassed + index) % selectedPlan.subjects.length < 3)
      .map(subject => ({
        subject: subject.name,
        estimatedTime: Math.round((selectedPlan.dailyGoal * subject.hoursAllocated) / selectedPlan.subjects.reduce((sum, s) => sum + s.hoursAllocated, 0)),
        priority: subject.priority,
        isCompleted: Math.random() > 0.7 // Random completion status
      }));

    return tasksForToday;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Planning</h1>
          <p className="text-muted-foreground">
            Create and manage personalized study plans for exam success
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Study Plan</DialogTitle>
              <DialogDescription>
                Design a personalized study plan tailored to your needs and schedule
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planTitle">Plan Title</Label>
                  <Input
                    id="planTitle"
                    placeholder="e.g., March 2024 CSE Prep"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Target Exam Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {examDate ? format(examDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={examDate}
                        onSelect={setExamDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Daily Study Time (minutes)</Label>
                <Select value={dailyStudyTime} onValueChange={setDailyStudyTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subjects to Include</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubjects(prev => [...prev, subject]);
                          } else {
                            setSelectedSubjects(prev => prev.filter(s => s !== subject));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePlan} disabled={!planTitle || !examDate || selectedSubjects.length === 0}>
                  Create Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Template Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Quick Start Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyPlanTemplates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>Duration: {template.duration} days</div>
                    <div>Daily commitment: {template.dailyHours}h</div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => generateAIPlan(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Plans List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Study Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyPlans.map(plan => (
                <Card key={plan.id} className={cn(
                  "p-4 cursor-pointer transition-all",
                  plan.isActive && "border-primary bg-primary/5",
                  selectedPlan?.id === plan.id && "ring-2 ring-primary"
                )} onClick={() => setSelectedPlan(plan)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{plan.title}</h3>
                        {plan.isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Target: {format(plan.targetDate, 'MMM dd, yyyy')}</div>
                        <div>Daily Goal: {plan.dailyGoal} minutes</div>
                        <div>{plan.subjects.length} subjects</div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Progress</span>
                          <span className="text-xs text-muted-foreground">{plan.completionRate}%</span>
                        </div>
                        <Progress value={plan.completionRate} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      {!plan.isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            activatePlan(plan.id);
                          }}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Study Plan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{plan.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePlan(plan.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule & Plan Details */}
        <div className="space-y-4">
          {selectedPlan && (
            <>
              {/* Today's Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getTodaysStudyTasks().map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{task.subject}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {task.estimatedTime} min
                          <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      {task.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Plan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {differenceInDays(selectedPlan.targetDate, new Date())}
                      </div>
                      <div className="text-xs text-blue-800">Days Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(selectedPlan.subjects.reduce((sum, s) => sum + s.hoursCompleted, 0))}h
                      </div>
                      <div className="text-xs text-green-800">Hours Completed</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Subject Progress</h4>
                    {selectedPlan.subjects.map(subject => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <Badge variant="outline" className={getPriorityColor(subject.priority)}>
                            {subject.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{subject.hoursCompleted}h / {subject.hoursAllocated}h</span>
                          <span>Score: {subject.currentScore}% → {subject.targetScore}%</span>
                        </div>
                        <Progress 
                          value={(subject.hoursCompleted / subject.hoursAllocated) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
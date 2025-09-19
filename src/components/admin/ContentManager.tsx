'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  Download,
  FileText,
  Database,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Edit,
  Copy,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Settings,
  Zap,
  Brain,
  FileCheck,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Question } from '@/lib/types';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'delete' | 'update';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  processed: number;
  created: Date;
  result?: ImportResult;
}

const sampleBulkOperations: BulkOperation[] = [
  {
    id: 'op1',
    type: 'import',
    status: 'completed',
    progress: 100,
    total: 150,
    processed: 150,
    created: new Date('2024-02-15T10:30:00'),
    result: {
      total: 150,
      success: 147,
      failed: 3,
      errors: ['Question 15: Missing correct answer', 'Question 87: Invalid format', 'Question 142: Duplicate question']
    }
  },
  {
    id: 'op2',
    type: 'export',
    status: 'completed',
    progress: 100,
    total: 500,
    processed: 500,
    created: new Date('2024-02-14T15:45:00')
  },
  {
    id: 'op3',
    type: 'update',
    status: 'running',
    progress: 67,
    total: 300,
    processed: 201,
    created: new Date('2024-02-16T09:15:00')
  }
];

export function ContentManager() {
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>(sampleBulkOperations);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [importFormat, setImportFormat] = useState('csv');
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Generation states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSubject, setAiSubject] = useState('Mathematics');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiCount, setAiCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const subjects = [
    'Mathematics',
    'Vocabulary (English and Tagalog)',
    'Clerical Analysis',
    'Science',
    'General Information',
    'Philippine Constitution'
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'import':
        return <Upload className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create new bulk operation
      const newOperation: BulkOperation = {
        id: `op_${Date.now()}`,
        type: 'import',
        status: 'completed',
        progress: 100,
        total: 50, // Simulated
        processed: 50,
        created: new Date(),
        result: {
          total: 50,
          success: 47,
          failed: 3,
          errors: ['Row 12: Invalid difficulty level', 'Row 28: Missing subject', 'Row 41: Duplicate question']
        }
      };

      setBulkOperations(prev => [newOperation, ...prev]);
      setUploadProgress(100);
      
      toast.success(`Successfully imported ${newOperation.result.success} questions`);
      setShowImportDialog(false);
    } catch (error) {
      toast.error('Failed to import questions');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    
    try {
      // Create export operation
      const exportOperation: BulkOperation = {
        id: `exp_${Date.now()}`,
        type: 'export',
        status: 'running',
        progress: 0,
        total: 500,
        processed: 0,
        created: new Date()
      };

      setBulkOperations(prev => [exportOperation, ...prev]);

      // Simulate export progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          
          // Update operation as completed
          setBulkOperations(prev => prev.map(op => 
            op.id === exportOperation.id 
              ? { ...op, status: 'completed', progress: 100, processed: 500 }
              : op
          ));
          
          // Trigger download
          const csvContent = generateSampleCSV();
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `questions_export_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          toast.success('Questions exported successfully');
        }

        setBulkOperations(prev => prev.map(op => 
          op.id === exportOperation.id 
            ? { ...op, progress, processed: Math.floor((progress / 100) * 500) }
            : op
        ));
      }, 300);

      setShowExportDialog(false);
    } catch (error) {
      toast.error('Failed to export questions');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSampleCSV = () => {
    const headers = ['Question', 'Answer A', 'Answer B', 'Answer C', 'Answer D', 'Correct Answer', 'Subject', 'Difficulty', 'Explanation', 'Tags'];
    const sampleData = [
      [
        'What is the capital of the Philippines?',
        'Manila',
        'Cebu',
        'Davao',
        'Quezon City',
        'Manila',
        'General Information',
        'easy',
        'Manila is the national capital of the Philippines.',
        'geography,philippines,capital'
      ],
      [
        'Solve: 2x + 5 = 17',
        'x = 6',
        'x = 8',
        'x = 10',
        'x = 12',
        'x = 6',
        'Mathematics',
        'medium',
        'Subtract 5 from both sides: 2x = 12, then divide by 2: x = 6',
        'algebra,equations,solving'
      ]
    ];

    return [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const handleAiGeneration = async () => {
    setIsGenerating(true);

    try {
      // Create AI generation operation
      const aiOperation: BulkOperation = {
        id: `ai_${Date.now()}`,
        type: 'import',
        status: 'running',
        progress: 0,
        total: aiCount,
        processed: 0,
        created: new Date()
      };

      setBulkOperations(prev => [aiOperation, ...prev]);

      // Simulate AI generation progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          
          // Update operation as completed
          setBulkOperations(prev => prev.map(op => 
            op.id === aiOperation.id 
              ? { 
                  ...op, 
                  status: 'completed', 
                  progress: 100, 
                  processed: aiCount,
                  result: {
                    total: aiCount,
                    success: aiCount - 1,
                    failed: 1,
                    errors: ['Generated question 7: Requires manual review for accuracy']
                  }
                }
              : op
          ));
          
          toast.success(`Successfully generated ${aiCount - 1} questions using AI`);
        }

        setBulkOperations(prev => prev.map(op => 
          op.id === aiOperation.id 
            ? { ...op, progress, processed: Math.floor((progress / 100) * aiCount) }
            : op
        ));
      }, 500);

      setShowAiDialog(false);
    } catch (error) {
      toast.error('Failed to generate questions using AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadTemplate = (format: string) => {
    const content = format === 'csv' ? generateSampleCSV() : generateSampleJSON();
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
    const extension = format === 'csv' ? 'csv' : 'json';
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question_template.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Template downloaded: question_template.${extension}`);
  };

  const generateSampleJSON = () => {
    const sampleData = [
      {
        question: "What is the capital of the Philippines?",
        answers: ["Manila", "Cebu", "Davao", "Quezon City"],
        correctAnswer: "Manila",
        subject: "General Information",
        difficulty: "easy",
        explanation: "Manila is the national capital of the Philippines.",
        tags: ["geography", "philippines", "capital"]
      }
    ];
    return JSON.stringify(sampleData, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">
            Import, export, and manage questions in bulk
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
            <DialogTrigger asChild>
              <Button>
                <Brain className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Question Generation</DialogTitle>
                <DialogDescription>
                  Use AI to automatically generate questions based on your requirements
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Topic/Prompt</Label>
                  <Textarea
                    placeholder="Describe the topic or provide specific instructions for question generation..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Subject</Label>
                    <Select value={aiSubject} onValueChange={setAiSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={aiDifficulty} onValueChange={setAiDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Count</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={aiCount}
                      onChange={(e) => setAiCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setShowAiDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAiGeneration}
                    disabled={isGenerating || !aiPrompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Questions</DialogTitle>
                <DialogDescription>
                  Upload questions from CSV or JSON files
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Format</Label>
                  <Select value={importFormat} onValueChange={setImportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate(importFormat)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={importFormat === 'csv' ? '.csv' : '.json'}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  
                  {uploadProgress > 0 ? (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your file here, or
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>

                {!isProcessing && (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Questions</DialogTitle>
                <DialogDescription>
                  Download questions in your preferred format
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subjects (Optional)</Label>
                  <Select onValueChange={(value) => {
                    if (value === 'all') {
                      setSelectedSubjects([]);
                    } else {
                      setSelectedSubjects(prev => 
                        prev.includes(value) 
                          ? prev.filter(s => s !== value)
                          : [...prev, value]
                      );
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        selectedSubjects.length === 0 
                          ? "All subjects" 
                          : `${selectedSubjects.length} selected`
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty Levels (Optional)</Label>
                  <Select onValueChange={(value) => {
                    if (value === 'all') {
                      setSelectedDifficulties([]);
                    } else {
                      setSelectedDifficulties(prev => 
                        prev.includes(value) 
                          ? prev.filter(d => d !== value)
                          : [...prev, value]
                      );
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        selectedDifficulties.length === 0 
                          ? "All difficulties" 
                          : `${selectedDifficulties.length} selected`
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All difficulties</SelectItem>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleExport}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export Questions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                <p className="text-xl font-bold">2,456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Imported Today</p>
                <p className="text-xl font-bold">147</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Generated</p>
                <p className="text-xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkOperations.map(operation => (
              <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getOperationIcon(operation.type)}
                  <div>
                    <p className="font-medium">
                      {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)} Operation
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {operation.created.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {operation.processed} / {operation.total}
                    </p>
                    {operation.status === 'running' && (
                      <Progress value={operation.progress} className="w-24 mt-1" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(operation.status)}
                    
                    {operation.result && operation.result.failed > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Operation Errors</DialogTitle>
                            <DialogDescription>
                              {operation.result.failed} errors occurred during this operation
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {operation.result.errors.map((error, index) => (
                              <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                                {error}
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Content Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="font-medium">Valid Questions</p>
                <p className="text-2xl font-bold text-green-600">2,341</p>
                <p className="text-xs text-muted-foreground">95.3%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <AlertCircle className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <p className="font-medium">Needs Review</p>
                <p className="text-2xl font-bold text-yellow-600">103</p>
                <p className="text-xs text-muted-foreground">4.2%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <XCircle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <p className="font-medium">Invalid</p>
                <p className="text-2xl font-bold text-red-600">12</p>
                <p className="text-xs text-muted-foreground">0.5%</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline">
              <FileCheck className="w-4 h-4 mr-2" />
              Run Full Validation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
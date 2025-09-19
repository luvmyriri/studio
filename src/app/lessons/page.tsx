import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Book, 
  Calculator, 
  Languages, 
  ScanText, 
  FlaskConical, 
  Globe, 
  Gavel, 
  Lightbulb 
} from 'lucide-react';
import Link from 'next/link';
import resources from '@/lib/resources.json';

type ResourceContent = {
  type: 'h3' | 'p';
  text: string;
};

type Resource = {
  title: string;
  content: ResourceContent[];
};

type ResourcesData = {
  [key: string]: Resource;
};

// Subject mapping with icons and display info
const subjectMapping = [
  {
    key: 'mathematics',
    title: 'Mathematics',
    icon: Calculator,
    path: 'mathematics',
    description: 'Master fundamental math concepts for the exam',
  },
  {
    key: 'vocabulary',
    title: 'Vocabulary (English & Tagalog)',
    icon: Languages,
    path: 'vocabulary',
    description: 'Expand your English and Filipino vocabulary',
  },
  {
    key: 'clerical_analysis',
    title: 'Clerical Analysis',
    icon: ScanText,
    path: 'clerical-analysis',
    description: 'Develop essential clerical and analytical skills',
  },
  {
    key: 'science',
    title: 'Science',
    icon: FlaskConical,
    path: 'science',
    description: 'Review basic concepts in earth science, biology, and chemistry',
  },
  {
    key: 'general_information',
    title: 'General Information',
    icon: Globe,
    path: 'general-information',
    description: 'Learn about Philippine history, laws, and current events',
  },
  {
    key: 'philippine_constitution',
    title: 'Philippine Constitution',
    icon: Gavel,
    path: 'philippine-constitution',
    description: 'Study the supreme law of the Philippines',
  },
];

// Component to render a single resource item
const ResourceItem = ({ item }: { item: ResourceContent }) => {
  if (item.type === 'h3') {
    return (
      <h4 className="text-lg font-semibold mt-4 mb-2 text-primary">
        {item.text}
      </h4>
    );
  }
  return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.text}</p>;
};

export default function LessonsPage() {
  const resourcesData = resources as ResourcesData;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">All Lessons</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive study materials for all Civil Service Exam subjects.
        </p>
      </div>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>For Your Guidance</AlertTitle>
        <AlertDescription>
          These are AI-generated reviewers. While helpful, it's recommended to
          consult official and comprehensive study materials for the best
          preparation. Click on any subject card to view detailed lessons.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjectMapping.map((subject) => {
          const resourceData = resourcesData[subject.key];
          const Icon = subject.icon;
          
          if (!resourceData) return null;

          return (
            <Card key={subject.key} className="h-fit hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{subject.title}</CardTitle>
                    <CardDescription className="mt-1">{subject.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Show a preview of the first few content items */}
                {resourceData.content.slice(0, 4).map((item, index) => (
                  <ResourceItem key={index} item={item} />
                ))}
                
                {/* Show more indicator if there are more items */}
                {resourceData.content.length > 4 && (
                  <p className="text-xs text-muted-foreground italic">
                    ...and {resourceData.content.length - 4} more topics
                  </p>
                )}
                
                {/* Link to detailed view */}
                <div className="pt-3 mt-4 border-t border-border">
                  <Link
                    href={`/lessons/${subject.path}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    <Book className="w-4 h-4" />
                    View detailed lesson →
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Want a structured approach? Check out our{' '}
          <Link href="/study-plans" className="text-primary hover:underline">
            Study Plans
          </Link>{' '}
          for step-by-step learning paths.
        </p>
      </div>
    </div>
  );
}
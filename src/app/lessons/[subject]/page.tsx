import { Header } from '@/components/layout/Header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';
import resources from '@/lib/resources.json';

// Generate static params for all available subjects
export async function generateStaticParams() {
  const subjects = [
    'mathematics',
    'vocabulary',
    'clerical-analysis',
    'science',
    'general-information',
    'philippine-constitution'
  ];
  
  return subjects.map((subject) => ({
    subject: subject,
  }));
}

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

// Component to render a single resource item
const ResourceItem = ({ item }: { item: ResourceContent }) => {
  if (item.type === 'h3') {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2 text-primary">
        {item.text}
      </h3>
    );
  }
  return <p className="text-foreground/90 leading-relaxed">{item.text}</p>;
};

export default function LessonPage({
  params,
}: {
  params: { subject: string };
}) {
  const subjectKey = params.subject.replace('-', '_');
  const resourceData = (resources as ResourcesData)[subjectKey];

  if (!resourceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lesson Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn't find the lesson you were looking for.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto animate-fade-in bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          {resourceData.title}
        </CardTitle>
        <CardDescription className="text-center">
          Key concepts and topics for the Civil Service Exam.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>For Your Guidance</AlertTitle>
          <AlertDescription>
            This is an AI-generated reviewer. While helpful, it's recommended to
            consult official and comprehensive study materials for the best
            preparation.
          </AlertDescription>
        </Alert>
        {resourceData.content.map((item, index) => (
          <ResourceItem key={index} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}

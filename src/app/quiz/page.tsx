import { Header } from '@/components/layout/Header';
import { QuizFlow } from '@/components/quiz/QuizFlow';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function QuizPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-1 container mx-auto p-4 md:p-8">
            <QuizFlow />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

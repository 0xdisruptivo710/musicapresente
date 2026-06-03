import { QuizChat } from "@/features/quiz/components/quiz-chat";
import { AppShell } from "@/features/shell/components/app-shell";

export default function CriarPage() {
  return (
    <AppShell>
      <QuizChat />
    </AppShell>
  );
}

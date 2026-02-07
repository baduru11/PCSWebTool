import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-4xl font-bold">PSC Study Companion</h1>
        <p className="text-lg text-muted-foreground">
          Master the Putonghua Proficiency Test with AI-powered practice and your personal anime study companion.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-8">
          <div className="p-3 rounded-lg border">
            <p className="font-medium text-foreground">5 PSC Components</p>
            <p>Full exam coverage</p>
          </div>
          <div className="p-3 rounded-lg border">
            <p className="font-medium text-foreground">AI Speech Scoring</p>
            <p>Real-time pronunciation feedback</p>
          </div>
          <div className="p-3 rounded-lg border">
            <p className="font-medium text-foreground">Character Companions</p>
            <p>Anime-style study partners</p>
          </div>
          <div className="p-3 rounded-lg border">
            <p className="font-medium text-foreground">Gamified Learning</p>
            <p>XP, unlocks, and rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
}

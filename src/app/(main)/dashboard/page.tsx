import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const COMPONENTS = [
  { number: 1, name: "Monosyllabic Characters", chinese: "\u8BFB\u5355\u97F3\u8282\u5B57\u8BCD", path: "/component-1" },
  { number: 2, name: "Multisyllabic Words", chinese: "\u8BFB\u591A\u97F3\u8282\u8BCD\u8BED", path: "/component-2" },
  { number: 3, name: "Judgment", chinese: "\u9009\u62E9\u5224\u65AD", path: "/component-3" },
  { number: 4, name: "Passage Reading", chinese: "\u6717\u8BFB\u77ED\u6587", path: "/component-4" },
  { number: 5, name: "Prompted Speaking", chinese: "\u547D\u9898\u8BF4\u8BDD", path: "/component-5" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  const { data: selectedCharacter } = await supabase
    .from("user_characters")
    .select("*, characters(*)")
    .eq("user_id", user.id)
    .eq("is_selected", true)
    .single();

  const progressMap = new Map(
    (progress || []).map((p: { component: number }) => [p.component, p])
  );

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
          {selectedCharacter?.characters?.name || "No character"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile?.display_name || "Student"}!
          </h1>
          <p className="text-muted-foreground">
            Ready to practice your Putonghua today?
          </p>
        </div>
      </div>

      {/* Component Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map((comp) => {
          const p = progressMap.get(comp.number) as { questions_attempted: number; questions_correct: number } | undefined;
          const accuracy = p && p.questions_attempted > 0
            ? Math.round((p.questions_correct / p.questions_attempted) * 100)
            : 0;

          return (
            <Card key={comp.number}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Component {comp.number}: {comp.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{comp.chinese}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{p?.questions_attempted || 0} attempted</span>
                    <span>{accuracy}% accuracy</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                  <Link href={comp.path}>
                    <Button className="w-full" size="sm">
                      Practice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/mock-exam">
          <Button variant="outline">Mock Exam</Button>
        </Link>
        <Link href="/characters">
          <Button variant="outline">Character Gallery</Button>
        </Link>
      </div>
    </div>
  );
}

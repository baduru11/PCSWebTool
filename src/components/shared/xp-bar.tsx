"use client";

import { Progress } from "@/components/ui/progress";
import { getUserLevel } from "@/lib/gamification/xp";

export function XPBar({ totalXP }: { totalXP: number }) {
  const { level, name, xpToNext } = getUserLevel(totalXP);
  const currentLevelXP = totalXP;
  const nextLevelXP = xpToNext ? totalXP + xpToNext : totalXP;
  const progress = xpToNext ? ((currentLevelXP) / nextLevelXP) * 100 : 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold">Lv.{level}</span>
        <span className="text-xs text-muted-foreground">{name}</span>
      </div>
      <Progress value={progress} className="h-2 w-24" />
      <span className="text-xs text-muted-foreground">{totalXP} XP</span>
    </div>
  );
}

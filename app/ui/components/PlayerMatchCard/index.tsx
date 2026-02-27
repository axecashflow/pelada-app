import { useState } from "react";
import { motion } from 'framer-motion';
import { Goal, Target, Footprints, ChevronRight } from 'lucide-react';

import { MatchStatViewModelType, PlayerViewModelType } from "@/app/application/matches/view-models/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/ui/components/sheet";
import { ImpactEnum, StatTypeEnum } from "@/app/domain/matches/enum/Stats";

import StatBox from "./StatBox";
import DetailSection from "./DetailSection";
import { TeamId } from "../../../(pages)/liveMatch/[id]/types";
import { getAssists, getGoals, getPreAssists } from "./utils";

import {
  getStatCategory,
  getStatLabel,
  STAT_CATEGORY_CONFIG,
  StatCategory
} from "./statIconMapper";

type PlayerMatchCardProps = {
  team: TeamId;
  player: PlayerViewModelType;
  stats: MatchStatViewModelType[];
  index: number;
}

function PlayerMatchCard({ player, stats, index, team }: PlayerMatchCardProps) {
  const [open, setOpen] = useState(false);
  const teamColor = team === 'teamA' ? 'text-green-500' : 'text-blue-500';
  const teamBg = team === 'teamA' ? 'bg-green-500/10' : 'bg-blue-500/10';

  const goals = getGoals(stats);
  const assists = getAssists(stats);
  const preAssists = getPreAssists(stats);

  // Group stats by category
  const statsByCategory = stats.reduce((acc, stat) => {
    const category = getStatCategory(stat.type as StatTypeEnum);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(stat);
    return acc;
  }, {} as Record<StatCategory, MatchStatViewModelType[]>);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        onClick={() => setOpen(true)}
        className="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/40 transition-colors text-left"
      >
        <div className={`w-9 h-9 rounded-full ${teamBg} flex items-center justify-center shrink-0`}>
          <span className={`text-sm font-bold ${teamColor}`}>
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{player.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {goals > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                <Goal className="w-3 h-3 text-primary" /> {goals}
              </span>
            )}

            {assists > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                <Target className="w-3 h-3" /> {assists}
              </span>
            )}

            {preAssists > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                <Footprints className="w-3 h-3" /> {preAssists}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-foreground">{player.rating}</p>
          <p className="text-[10px] text-muted-foreground uppercase">pts</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh] overflow-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${teamBg} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${teamColor}`}>
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {player.name}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-2">
              <StatBox label="Pontos" value={player.rating} highlight />
              <StatBox label="Gols" value={goals} />
              <StatBox label="Assist." value={assists} />
              <StatBox label="Pré-Assist." value={preAssists} />
            </div>

            {Object.entries(statsByCategory).map(([category, categoryStats]) => {
              const config = STAT_CATEGORY_CONFIG[category as StatCategory];
              return (
                <DetailSection
                  key={category}
                  icon={<span className={config.color}>{config.icon}</span>}
                  title={config.label}
                  items={categoryStats.map((stat) => ({
                    main: getStatLabel(stat.type as StatTypeEnum),
                    sub: `${stat.impact === ImpactEnum.POSITIVE ? '+' : '-'}${stat.weight} pts`,
                  }))}
                />
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default PlayerMatchCard;

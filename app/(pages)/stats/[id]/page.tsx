"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Target,
  Shield,
  Goal,
  Star,
  Swords,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";

import { MatchViewModelType } from "@/app/application/matches/view-models/types";
import MatchResultCard from "./components/MatchResultCard";
import { useToast } from "@/app/ui/hooks/use-toast";

import { getDayMatches } from "./actions";
import { DayHighlight } from "./types";

import {
  calculatePlayerStats,
  getTopScorer,
  getTopAssister,
  getTopDefender,
  getMostGoalParticipations,
  getTopDribbler,
  getBestAvgRating,
} from "./utils";

type DaySummaryProps = {
  id: string;
};

export default function DaySummary() {
  const router = useRouter();
  const { toast } = useToast();

  const params = useParams<DaySummaryProps>();

  const [todayMatches, setTodayMatches] = useState<MatchViewModelType[]>([]);

  const today = new Date();

  const highlights = useMemo(() => {
    if (todayMatches.length === 0) return [];

    const playerStats = calculatePlayerStats(todayMatches);
    const result: DayHighlight[] = [];

    const topScorer = getTopScorer(playerStats);
    if (topScorer) {
      result.push({
        icon: <Goal className="w-5 h-5 text-green-500" />,
        label: "Artilheiro",
        playerName: topScorer.playerName,
        value: topScorer.goals,
        suffix: topScorer.goals === 1 ? "gol" : "gols",
      });
    }

    const topAssister = getTopAssister(playerStats);
    if (topAssister) {
      result.push({
        icon: <Target className="w-5 h-5 text-blue-500" />,
        label: "Líder de Assistências",
        playerName: topAssister.playerName,
        value: topAssister.assists,
        suffix: topAssister.assists === 1 ? "assist." : "assists.",
      });
    }

    const topDefender = getTopDefender(playerStats);
    if (topDefender) {
      result.push({
        icon: <Shield className="w-5 h-5 text-red-500" />,
        label: "Melhor Defensor",
        playerName: topDefender.playerName,
        value: topDefender.tackles,
        suffix:
          topDefender.tackles === 1
            ? "desarme/recuperação/corte"
            : "desarmes/recuperações/cortes",
      });
    }

    const mostParticipations = getMostGoalParticipations(playerStats);
    if (mostParticipations) {
      result.push({
        icon: <Trophy className="w-5 h-5 text-yellow-500" />,
        label: "Mais Participações",
        playerName: mostParticipations.playerName,
        value: mostParticipations.goalParticipations,
        suffix: "G+A",
      });
    }

    const topDribbler = getTopDribbler(playerStats);
    if (topDribbler) {
      result.push({
        icon: <Zap className="w-5 h-5 text-purple-500" />,
        label: "Melhor Driblador",
        playerName: topDribbler.playerName,
        value: topDribbler.dribblesAttempted,
        suffix: `${topDribbler.dribbleSuccessRate}%`,
      });
    }

    const bestRating = getBestAvgRating(playerStats);
    if (bestRating) {
      result.push({
        icon: <Star className="w-5 h-5 text-orange-500" />,
        label: "Melhor Jogador",
        playerName: bestRating.playerName,
        value: parseFloat(bestRating.avgRating.toFixed(1)),
        suffix: "pts",
      });
    }

    return result;
  }, [todayMatches]);

  const handleGetMatches = async () => {
    try {
      const match = await getDayMatches(params.id, today);

      setTodayMatches(match);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da partida.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    handleGetMatches();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Resumo do Dia</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </motion.div>
      </header>

      <main className="flex-1 px-4 py-6 overflow-auto">
        <div className="max-w-md mx-auto space-y-6">
          {todayMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Swords className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma partida finalizada hoje
              </p>
            </motion.div>
          ) : (
            <>
              {/* Highlights */}
              {highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-primary" /> Destaques do Dia
                  </h2>
                  <div className="grid gap-2">
                    {highlights.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {h.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {h.label}
                          </p>
                          <p className="text-sm font-bold text-foreground truncate">
                            {h.playerName}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-primary">
                            {h.value}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {h.suffix}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Matches */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Partidas ({todayMatches.length})
                </h2>

                {todayMatches.map((match, i) => (
                  <MatchResultCard key={match.id} match={match} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

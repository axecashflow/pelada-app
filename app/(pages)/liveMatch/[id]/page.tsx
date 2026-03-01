"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  MatchViewModelType,
  PlayerViewModelType,
} from "@/app/application/matches/view-models/types";

import { useToast } from "@/app/ui/hooks/use-toast";
import { cn, domainErrorMessages } from "@/app/ui/lib/utils";
import { DomainErrorName } from "@/app/domain/shared/DomainError";
import { SportButton } from "@/app/ui/components/SportButton";
import { GroupViewModelType } from "@/app/application/group/view-models/types";
import { PlayerPresenceInMatch } from "@/app/domain/matches/enum/Player";

import {
  getMatchById,
  recordMatchEvents,
  getGroupDetails,
  substitutePlayer,
} from "./actions";

import {
  LiveMatchProps,
  RecordEventInputType,
  SubstitutionFormType,
  TeamId,
} from "./types";

import {
  countGoalsFromTeam,
  getPlayerStats,
  getTeamPlayers,
  statCategories,
  StatCategoryTagType,
} from "./utils";

import AddGoalsInsideBox from "./components/AddGoalsInsideBox";
import PlayerMatchCard from "../../../ui/components/PlayerMatchCard";
import AddGoalsOutsideBox from "./components/AddGoalsOutsideBox";
import ShotHitPost from "./components/ShotHitPost";
import Tackle from "./components/Tackle";
import DribbleFailed from "./components/DribbleFailed";
import DribbleSuccess from "./components/DribbleSuccess";
import Nutmeg from "./components/Nutmeg";
import Lob from "./components/Lob";
import BigChanceMissed from "./components/BigChanceMissed";
import FoulCommited from "./components/FoulCommited";
import ShotOnTarget from "./components/ShotOnTarget";
import ShotOffTarget from "./components/ShotOffTarget";
import BigChanceCreated from "./components/BigChanceCreated";
import PassCompleted from "./components/PassCompleted";
import PassFailed from "./components/PassFailed";
import DuelWon from "./components/DuelWon";
import OwnGoal from "./components/OwnGoal";
import SubstitutionPanel from "./components/SubstitutionPanel";
import ShotBlocked from "./components/ShotBlocked";
import SaveInsideBox from "./components/SaveInsideBox";
import SaveOutsideBox from "./components/SaveOutsideBox";
import GoalConceded from "./components/GoalConceded";
import Save from "./components/Save";
import PenaltyCommited from "./components/PenaltyCommited";
import PenaltyScored from "./components/PenaltyScored";
import FreeKickScored from "./components/FreeKickScored";
import YellowCard from "./components/YellowCard";
import SecondYellowCard from "./components/SecondYellowCard";
import RedCard from "./components/RedCard";
import Clearance from "./components/Clearance";
import { MatchTimer } from "./components/MatchTimer";

export default function LiveMatch() {
  const router = useRouter();
  const params = useParams<LiveMatchProps>();
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] =
    useState<StatCategoryTagType>("goal");

  const [currentMatch, setCurrentMatch] = useState<MatchViewModelType | null>(
    null,
  );

  const [currentGroup, setCurrentGroup] = useState<GroupViewModelType | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const teamPlayers = (team: TeamId) => getTeamPlayers(team, currentMatch);
  const teamLabel = (team: TeamId) => (team === "teamA" ? "Time A" : "Time B");

  const teamAPlayers = teamPlayers("teamA");
  const teamBPlayers = teamPlayers("teamB");

  const bench: PlayerViewModelType[] = (currentGroup?.members ?? [])
    .filter(
      (member) =>
        !teamAPlayers.some((player) => player.id === member.id) &&
        !teamBPlayers.some((player) => player.id === member.id),
    )
    .map((member) => ({
      id: member.id,
      name: member.name,
      presence: PlayerPresenceInMatch.SUBSTITUTED_IN,
      rating: 6,
    }));

  const teamIcon = (playerId: string) => {
    if (teamAPlayers.some((player) => player.id === playerId)) {
      return "🟢";
    }

    if (teamBPlayers.some((player) => player.id === playerId)) {
      return "🔵";
    }

    return "";
  };

  const handleGetGroupDetails = async () => {
    try {
      const response = await getGroupDetails(currentMatch!.groupId);

      setCurrentGroup(response);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os grupos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetMatch = async () => {
    try {
      const match = await getMatchById(params.id);

      setCurrentMatch(match);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da partida.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordMatchEvents = async (events: RecordEventInputType[]) => {
    setLoading(true);

    try {
      await recordMatchEvents(events);

      await handleGetMatch();
    } catch (error) {
      const defaultMessage =
        "Erro ao criar estatística da partida. Tente novamente.";

      const errorMessage =
        error instanceof Error
          ? (domainErrorMessages[error.message as DomainErrorName] ??
            defaultMessage)
          : defaultMessage;

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubstitution = async (substitution: SubstitutionFormType) => {
    setLoading(true);

    try {
      await substitutePlayer(currentMatch!.id, substitution);

      await handleGetMatch();
    } catch (error) {
      const defaultMessage =
        "Erro ao criar estatística da partida. Tente novamente.";

      const errorMessage =
        error instanceof Error
          ? (domainErrorMessages[error.message as DomainErrorName] ??
            defaultMessage)
          : defaultMessage;

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActiveCategoryStatButton = () => {
    switch (activeCategory) {
      case "goal":
        return (
          <div className="space-y-2">
            <AddGoalsInsideBox
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <AddGoalsOutsideBox
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <OwnGoal
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      case "pass":
        return (
          <div className="space-y-2">
            <BigChanceCreated
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <PassCompleted
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <PassFailed
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      case "shot":
        return (
          <div className="space-y-2">
            <ShotOnTarget
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <ShotOffTarget
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <ShotHitPost
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <BigChanceMissed
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <ShotBlocked
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      case "defense":
        return (
          <div className="space-y-2">
            <Tackle
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <Clearance
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <DuelWon
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      case "dribble":
        return (
          <div className="space-y-2">
            <DribbleSuccess
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <Nutmeg
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <Lob
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <DribbleFailed
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      case "goalkeeper":
        return (
          <div className="space-y-2">
            <Save
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <SaveInsideBox
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <SaveOutsideBox
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <GoalConceded
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      case "free_kick":
        return (
          <div className="space-y-2">
            <FoulCommited
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <PenaltyCommited
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <PenaltyScored
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <FreeKickScored
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <YellowCard
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
            <RedCard
              currentMatch={currentMatch}
              recordMatchEvents={handleRecordMatchEvents}
            />
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    handleGetMatch();
  }, []);

  useEffect(() => {
    if (currentMatch?.groupId) {
      handleGetGroupDetails();
    }
  }, [currentMatch?.groupId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
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

          {loading ? (
            <div className="h-7 w-40 bg-muted animate-pulse rounded" />
          ) : (
            <h1 className="text-2xl font-bold text-foreground">
              Partida ao Vivo
            </h1>
          )}
        </motion.div>
      </header>

      <main className="flex-1 px-4 py-6 overflow-auto">
        <div className="max-w-md mx-auto space-y-6">
          {loading ? (
            <>
              <div className="flex items-center justify-center gap-6">
                <div className="h-16 w-20 bg-muted animate-pulse rounded-xl" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                <div className="h-16 w-20 bg-muted animate-pulse rounded-xl" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 text-center">
                    <span className="text-2xl">🟢</span>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      Time A
                    </p>
                    <p className="text-4xl font-bold text-foreground mt-2">
                      {countGoalsFromTeam("teamA", currentMatch)}
                    </p>
                  </div>

                  <div className="text-2xl font-bold text-muted-foreground">
                    ×
                  </div>

                  <div className="flex-1 text-center">
                    <span className="text-2xl">🔵</span>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      Time B
                    </p>
                    <p className="text-4xl font-bold text-foreground mt-2">
                      {countGoalsFromTeam("teamB", currentMatch)}
                    </p>
                  </div>
                </div>
              </div>

              <MatchTimer defaultMinutes={10} />

              <div className="flex flex-wrap gap-2">
                {statCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {renderActiveCategoryStatButton()}

              {(["teamA", "teamB"] as const).map((team) => {
                const players = teamPlayers(team);

                return (
                  <div key={team} className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                      {teamIcon(team)} {teamLabel(team)}
                    </h2>

                    <div className="space-y-1.5">
                      {players.map((player, index) => (
                        <PlayerMatchCard
                          key={player.id}
                          player={player}
                          stats={getPlayerStats(player.id, currentMatch)}
                          index={index}
                          team={team}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              <SubstitutionPanel
                bench={bench}
                teamA={teamPlayers("teamA")}
                teamB={teamPlayers("teamB")}
                onSubstitute={handleSubstitution}
              />
            </motion.div>
          )}
        </div>
      </main>

      {!loading && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-6 border-t border-border bg-card"
        >
          <div className="max-w-2xl mx-auto">
            <SportButton
              onClick={() => router.push(`/group/${currentMatch?.groupId}`)}
              size="lg"
              className="w-full"
            >
              <Check className="w-5 h-5 mr-2" />
              Terminar Partida
            </SportButton>
          </div>
        </motion.footer>
      )}
    </div>
  );
}

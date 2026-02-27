import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ArrowLeftRight, X, Check } from "lucide-react";

import { SportButton } from "@/app/ui/components/SportButton";
import { PlayerViewModelType } from "@/app/application/matches/view-models/types";
import { PlayerPresenceInMatch } from "@/app/domain/matches/enum/Player";

import { SubstitutionFormType, TeamId } from "../../types";

interface SubstitutionPanelProps {
  teamA: PlayerViewModelType[];
  teamB: PlayerViewModelType[];
  bench: PlayerViewModelType[];
  onSubstitute: (sub: SubstitutionFormType) => void;
}

type Substitution = {
  team: TeamId;
  player: PlayerViewModelType;
};

function SubstitutionPanel({
  teamA,
  teamB,
  bench,
  onSubstitute,
}: SubstitutionPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);
  const [playerOutId, setPlayerOutId] = useState("");
  const [playerInId, setPlayerInId] = useState("");

  const teamPlayers = (team: TeamId) => (team === "teamA" ? teamA : teamB);
  const teamLabel = (team: TeamId) => (team === "teamA" ? "Time A" : "Time B");
  const teamIcon = (team: TeamId) => (team === "teamA" ? "🟢" : "🔵");

  const substitutions: Substitution[] = [...teamA, ...teamB]
    .filter((player) => player.presence !== PlayerPresenceInMatch.STARTER)
    .map((player) => {
      const team = teamA.find((p) => p.id === player.id) ? "teamA" : "teamB";
      return { team, player };
    });

  const openForm = (team: TeamId) => {
    setSelectedTeam(team);
    setPlayerOutId("");
    setPlayerInId("");
    setShowForm(true);
  };

  const handleSubstitute = () => {
    if (!selectedTeam || !playerOutId || !playerInId) return;

    const playerOut = teamPlayers(selectedTeam).find(
      (p) => p.id === playerOutId,
    );

    const playerIn = bench.find((p) => p.id === playerInId);

    if (!playerOut || !playerIn) return;

    onSubstitute({
      team: selectedTeam,
      playerOut,
      playerIn,
    });

    setShowForm(false);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        <ArrowLeftRight className="w-3.5 h-3.5" /> Substituições
      </h2>

      {bench.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          <SportButton
            onClick={() => openForm("teamA")}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Sub Time A
          </SportButton>

          <SportButton
            onClick={() => openForm("teamB")}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Sub Time B
          </SportButton>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-3 opacity-60">
          Nenhum jogador no banco
        </p>
      )}

      {substitutions.length > 0 && (
        <div className="space-y-1.5">
          <AnimatePresence>
            {substitutions.map((sub, index) => {
              const nextSub = substitutions[index + 1];

              if (sub.player.presence === PlayerPresenceInMatch.SUBSTITUTED_IN)
                return null;

              return (
                <motion.div
                  key={`${sub.team}-${sub.player.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                >
                  <span className="text-lg">{teamIcon(sub.team)}</span>
                  <div className="flex-1 min-w-0 flex items-center gap-2 text-sm">
                    <span className=" font-medium truncate">
                      {sub.player.name} (titular)
                    </span>

                    <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

                    <span className=" font-medium truncate">
                      {nextSub?.player.name} (reserva)
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Substitution Modal */}
      <AnimatePresence>
        {showForm && selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {teamIcon(selectedTeam)} Substituição -{" "}
                  {teamLabel(selectedTeam)}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Jogador que sai <span className="text-destructive">*</span>
                </label>
                <select
                  value={playerOutId}
                  onChange={(e) => setPlayerOutId(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {teamPlayers(selectedTeam).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Jogador que entra <span className="text-destructive">*</span>
                </label>
                <select
                  value={playerInId}
                  onChange={(e) => setPlayerInId(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {bench.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <SportButton
                onClick={handleSubstitute}
                className="w-full"
                disabled={!playerOutId || !playerInId}
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmar Substituição
              </SportButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubstitutionPanel;

'use client';

import { SubmitEventHandler, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Target, X } from "lucide-react";

import { SportButton } from "@/app/ui/components/SportButton";
import { MatchViewModelType } from "@/app/application/matches/view-models/types";
import { useToast } from "@/app/ui/hooks/use-toast";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

import { RecordEventInputType, TeamId } from "../../types";
import { getTeamPlayers } from "../../utils";

type PenaltyCommitedProps = {
  currentMatch: MatchViewModelType | null;
  recordMatchEvents: (events: RecordEventInputType[]) => Promise<void>;
}

const PenaltyCommited = ({ currentMatch, recordMatchEvents }: PenaltyCommitedProps) => {
  const { toast } = useToast();

  const [showEventModal, setShowEventModal] = useState<TeamId | null>(null);

  const teamPlayers = (team: TeamId) => getTeamPlayers(team, currentMatch);

  const opponentPlayers = (team: TeamId) => {
    const opponentTeam = team === 'teamA' ? 'teamB' : 'teamA';
    return getTeamPlayers(opponentTeam, currentMatch);
  };

  const teamLabel = (team: TeamId) => (team === 'teamA' ? 'Time A' : 'Time B');

  const teamIcon = (teamId: TeamId) => {
    if (teamId === 'teamA') {
      return '🟢';
    }

    if (teamId === 'teamB') {
      return '🔵';
    }

    return '';
  };

  const handleAddEvent: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const scorerId = formData.get('scorerId') as string;
    const opponentId = formData.get('opponentId') as string;

    if (!scorerId) {
      toast({
        title: 'Erro',
        description: 'Selecione o autor da falta dentro da área.',
        variant: 'destructive',
      });
      return;
    }

    if (!opponentId) {
      toast({
        title: 'Erro',
        description: 'Selecione quem sofreu o pênalti.',
        variant: 'destructive',
      });
      return;
    }

    const eventsToRecord: RecordEventInputType[] = [];

    eventsToRecord.push({
      matchId: currentMatch!.id,
      playerId: scorerId,
      statType: StatTypeEnum.PENALTY_CONCEDED,
      opponentPlayerId: opponentId,
    });

    await recordMatchEvents(eventsToRecord);

    setShowEventModal(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <SportButton
          onClick={() => setShowEventModal('teamA')}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Pênalti cometido
        </SportButton>

        <SportButton
          onClick={() => setShowEventModal('teamB')}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Pênalti cometido
        </SportButton>
      </div>

      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
            onClick={() => setShowEventModal(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">
                  {teamIcon(showEventModal)} Pênalti do {teamLabel(showEventModal)}
                </h3>
                <button
                  onClick={() => setShowEventModal(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-5">
                {/* Scorer (required) */}
                <div className="space-y-2">
                  <label htmlFor="scorerId" className="block text-sm font-medium text-foreground">
                    Autor da falta <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="scorerId"
                    name="scorerId"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {teamPlayers(showEventModal).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="opponentId" className="block text-sm font-medium text-foreground">
                    Quem sofreu o pênalti? <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="opponentId"
                    name="opponentId"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {opponentPlayers(showEventModal).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <SportButton
                  type="submit"
                  className="w-full"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Registrar pênalti cometido
                </SportButton>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
};

export default PenaltyCommited;

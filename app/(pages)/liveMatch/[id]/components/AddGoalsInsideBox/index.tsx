'use client';

import { SubmitEventHandler, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Goal, Plus, X } from "lucide-react";

import { SportButton } from "@/app/ui/components/SportButton";
import { MatchViewModelType } from "@/app/application/matches/view-models/types";
import { useToast } from "@/app/ui/hooks/use-toast";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

import { RecordEventInputType, TeamId } from "../../types";
import { getTeamPlayers } from "../../utils";

type AddGoalsInsideBoxProps = {
  currentMatch: MatchViewModelType | null;
  recordMatchEvents: (events: RecordEventInputType[]) => Promise<void>;
}

const AddGoalsInsideBox = ({ currentMatch, recordMatchEvents }: AddGoalsInsideBoxProps) => {
  const { toast } = useToast();

  const [showGoalForm, setShowGoalForm] = useState<TeamId | null>(null);

  const teamPlayers = (team: TeamId) => getTeamPlayers(team, currentMatch);
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

  const handleAddGoal: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const scorerId = formData.get('scorerId') as string;
    const assistId = formData.get('assistId') as string;
    const preAssistId = formData.get('preAssistId') as string;

    if (!scorerId) {
      toast({
        title: 'Erro',
        description: 'Selecione o autor do gol.',
        variant: 'destructive',
      });
      return;
    }

    const eventsToRecord: RecordEventInputType[] = [];

    eventsToRecord.push({
      matchId: currentMatch!.id,
      playerId: scorerId,
      statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
    });

    if (assistId) {
      eventsToRecord.push({
        matchId: currentMatch!.id,
        playerId: assistId,
        statType: StatTypeEnum.ASSIST,
      });
    }

    if (preAssistId) {
      eventsToRecord.push({
        matchId: currentMatch!.id,
        playerId: preAssistId,
        statType: StatTypeEnum.PRE_ASSIST,
      });
    }

    await recordMatchEvents(eventsToRecord);

    setShowGoalForm(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <SportButton
          onClick={() => setShowGoalForm('teamA')}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Gol de dentro da área
        </SportButton>

        <SportButton
          onClick={() => setShowGoalForm('teamB')}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Gol de dentro da área
        </SportButton>
      </div>

      <AnimatePresence>
        {showGoalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
            onClick={() => setShowGoalForm(null)}
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
                  {teamIcon(showGoalForm)} Gol do {teamLabel(showGoalForm)}
                </h3>
                <button
                  onClick={() => setShowGoalForm(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-5">
                {/* Scorer (required) */}
                <div className="space-y-2">
                  <label htmlFor="scorerId" className="block text-sm font-medium text-foreground">
                    Autor do gol <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="scorerId"
                    name="scorerId"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {teamPlayers(showGoalForm).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assist (optional) */}
                <div className="space-y-2">
                  <label htmlFor="assistId" className="block text-sm font-medium text-foreground">
                    Assistência <span className="text-xs text-muted-foreground">(opcional)</span>
                  </label>
                  <select
                    id="assistId"
                    name="assistId"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Nenhuma</option>
                    {teamPlayers(showGoalForm).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pre-assist (optional) */}
                <div className="space-y-2">
                  <label htmlFor="preAssistId" className="block text-sm font-medium text-foreground">
                    Pré-assistência <span className="text-xs text-muted-foreground">(opcional)</span>
                  </label>
                  <select
                    id="preAssistId"
                    name="preAssistId"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Nenhuma</option>
                    {teamPlayers(showGoalForm).map((p) => (
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
                  <Goal className="w-5 h-5 mr-2" />
                  Registrar Gol
                </SportButton>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
};

export default AddGoalsInsideBox;
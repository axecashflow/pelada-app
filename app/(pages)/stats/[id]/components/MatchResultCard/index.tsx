import { motion } from 'framer-motion';
import { Target, Goal, Footprints, Swords } from 'lucide-react';

import { MatchViewModelType } from '@/app/application/matches/view-models/types';

import { countAssistsFromPlayer, countGoalsFromPlayer, countGoalsFromTeam, countPreAssistsFromPlayer } from '../../utils';

function MatchResultCard({ match, index }: { match: MatchViewModelType; index: number }) {

  const allStats = [
    ...match.teamA.players.map(p => ({ ...p, team: 'teamA' })),
    ...match.teamB.players.map(p => ({ ...p, team: 'teamB' }))
  ].sort((a, b) => b.rating - a.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Score header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">
            Partida {index + 1}
          </p>
          <Swords className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-center">
            <span className="text-xl">🟢</span>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Time A</p>
            <p className="text-3xl font-bold text-foreground mt-1">{countGoalsFromTeam('teamA', match)}</p>
          </div>
          <div className="text-xl font-bold text-muted-foreground">×</div>
          <div className="flex-1 text-center">
            <span className="text-xl">🔵</span>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Time B</p>
            <p className="text-3xl font-bold text-foreground mt-1">{countGoalsFromTeam('teamB', match)}</p>
          </div>
        </div>
      </div>

      {/* Player stats table */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Desempenho Individual</h4>
        <div className="space-y-1.5">
          {allStats.map((s) => {

            const goals = countGoalsFromPlayer(s.id, match);
            const assists = countAssistsFromPlayer(s.id, match);
            const preAssists = countPreAssistsFromPlayer(s.id, match);

            return (
              <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/30">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${s.team === 'teamA' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-foreground flex-1 truncate">{s.name}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {goals > 0 && <span className="flex items-center gap-0.5"><Goal className="w-3 h-3 text-primary" />{goals}</span>}
                  {assists > 0 && <span className="flex items-center gap-0.5"><Target className="w-3 h-3" />{assists}</span>}
                  {preAssists > 0 && <span className="flex items-center gap-0.5"><Footprints className="w-3 h-3" />{preAssists}</span>}
                </div>
                <span className="text-sm font-bold text-foreground w-8 text-right">{s.rating}</span>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default MatchResultCard; 

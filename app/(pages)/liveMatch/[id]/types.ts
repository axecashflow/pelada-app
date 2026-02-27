import { PlayerPosition } from "@/app/domain/matches/enum/Player";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

export type TeamId = 'teamA' | 'teamB';

export type LiveMatchProps = {
  id: string;
}

export type RecordEventInputType = {
  matchId: string;
  playerId: string;
  statType: StatTypeEnum;
  opponentPlayerId?: string;
  playerPosition?: PlayerPosition;
};

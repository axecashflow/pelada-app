import { PlayerViewModelType } from "@/app/application/matches/view-models/types";
import { PlayerPosition } from "@/app/domain/matches/enum/Player";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

export type TeamId = "teamA" | "teamB";

export type LiveMatchProps = {
  id: string;
};

export type RecordEventInputType = {
  matchId: string;
  playerId: string;
  statType: StatTypeEnum;
  opponentPlayerId?: string;
  playerPosition?: PlayerPosition;
};

export type SubstitutionFormType = {
  team: TeamId;
  playerOut: PlayerViewModelType;
  playerIn: PlayerViewModelType;
};

import { PlayerPosition, PlayerPresenceInMatch } from "@/app/domain/matches/enum/Player";
import { StatTypeEnum, ImpactEnum } from "@/app/domain/matches/enum/Stats";

export type PlayerViewModelType = {
  id: string;
  name: string;
  rating: number;
  position?: PlayerPosition;
  presence: PlayerPresenceInMatch;
};

export type TeamViewModelType = {
  id: string;
  players: PlayerViewModelType[];
};

export type MatchStatViewModelType = {
  playerId: string;
  type: StatTypeEnum;
  value: number;
  weight: number;
  impact: ImpactEnum;
};

export type MatchViewModelType = {
  id: string;
  groupId: string;
  teamA: TeamViewModelType;
  teamB: TeamViewModelType;
  stats: MatchStatViewModelType[];
};

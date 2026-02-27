export interface MatchPlayerPersistence {
  id: string;
  playerId: string;
  teamId: string;
  name: string;
  position: string | null;
  presence: string;
  rating: string;
}

export interface MatchStatPersistence {
  id: string;
  matchId: string;
  playerId: string;
  type: string;
  value: string;
  weight: string;
  impact: string;
}

export interface TeamPersistence {
  id: string;
  matchId: string;
  teamType: string;
  players: MatchPlayerPersistence[];
}

export interface MatchPersistence {
  id: string;
  groupId: string;
  matchDate: Date;
  createdAt: Date;
  teams: TeamPersistence[];
  stats: MatchStatPersistence[];
}

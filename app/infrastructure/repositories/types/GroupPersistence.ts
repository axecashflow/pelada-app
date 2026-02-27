import { GameModePersistence } from './GameModePersistence';

export interface MemberPersistence {
  id: string;
  name: string;
  status: string;
}

export interface GroupPersistence {
  id: string;
  name: string;
  gameMode: GameModePersistence;
  status: string;
  createdAt: Date;
  members?: MemberPersistence[];
  ownerId: string;
}

import { GameModePersistence } from './GameModePersistence';

export interface MemberUserLinkPersistence {
  userId: string;
  memberId: string;
}

export interface MemberPersistence {
  id: string;
  name: string;
  status: string;
  userLink?: MemberUserLinkPersistence;
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

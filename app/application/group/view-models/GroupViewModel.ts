import { Group } from "@/app/domain/group/aggregates/Group";

import { GameModeViewModel } from "./GameModeViewModel";
import { MemberViewModel } from "./MemberViewModel";

export class GroupViewModel {
  static toObject(group: Group) {
    return {
      id: group.id.value,
      name: group.name,
      status: group.status,
      ownerId: group.ownerId,
      gameMode: GameModeViewModel.toObject(group.gameMode),
      members: group.members.map(MemberViewModel.toObject),
      createdAt: group.createdAt,
    };
  }
}
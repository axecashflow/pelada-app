import { Group } from "../aggregates/Group";

export interface GroupRepository {
  save(group: Group): Promise<void>;
  findById(id: string): Promise<Group | null>;
  findListByOwnerId(ownerId: string): Promise<Group[]>;
}
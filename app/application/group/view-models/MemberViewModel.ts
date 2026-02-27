import { Member } from "@/app/domain/group/entities/Member";

export class MemberViewModel {
  static toObject(member: Member) {
    return {
      id: member.id.value,
      name: member.name,
      status: member.status,
    }
  }
}
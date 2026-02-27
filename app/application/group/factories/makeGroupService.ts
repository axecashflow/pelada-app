import { DrizzleGroupRepository } from "@/app/infrastructure/repositories/DrizzleGroupRepository";
import { GroupService } from "../services/GroupService";

const makeGroupService = () => {
  const groupRepository = new DrizzleGroupRepository();
  const groupService = new GroupService(groupRepository);

  return groupService;
};

export default makeGroupService;

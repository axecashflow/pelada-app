import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { PlayerPosition } from "@/app/domain/matches/enum/Player";

import { DefaultPolicy } from "./policies/DefaultPolicy";
import { GoalkeeperPolicy } from "./policies/GoalkeeperPolicy";
import { DefenderPolicy } from "./policies/DefenderPolicy";
import { MidfielderPolicy } from "./policies/MidfielderPolicy";
import { ForwardPolicy } from "./policies/ForwardPolicy";

export class StatScorePolicy {
  static getWeight(stat: StatTypeEnum, position?: PlayerPosition): number {
    const policyMap = {
      [PlayerPosition.GOALKEEPER]: GoalkeeperPolicy,
      [PlayerPosition.DEFENDER]: DefenderPolicy,
      [PlayerPosition.MIDFIELDER]: MidfielderPolicy,
      [PlayerPosition.FORWARD]: ForwardPolicy,
    };

    const policy = position ? policyMap[position] : null;
    
    if (policy) {
      return policy.getWeight(stat);
    }
    
    return DefaultPolicy.getWeight(stat);
  }
}
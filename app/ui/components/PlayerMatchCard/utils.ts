import { MatchStatViewModelType } from "@/app/application/matches/view-models/types";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

export const getGoals = (stats: MatchStatViewModelType[]): number => {
  const goals = [
    StatTypeEnum.GOAL_FROM_INSIDE_BOX,
    StatTypeEnum.GOAL_FROM_OUTSIDE_BOX,
    StatTypeEnum.FREE_KICK_SCORED,
    StatTypeEnum.PENALTY_SCORED,
  ];

  return stats.filter((stat) => goals.includes(stat.type)).length;
};

export const getAssists = (stats: MatchStatViewModelType[]): number => {
  return stats.filter((stat) => stat.type === StatTypeEnum.ASSIST).length;
};

export const getPreAssists = (stats: MatchStatViewModelType[]): number => {
  return stats.filter((stat) => stat.type === StatTypeEnum.PRE_ASSIST).length;
};

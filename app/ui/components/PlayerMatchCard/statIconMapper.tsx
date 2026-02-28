import { ReactNode } from 'react';

import {
  Goal,
  Target,
  Shield,
  Zap,
  Send,
  Hand,
} from 'lucide-react';

import { StatTypeEnum } from '@/app/domain/matches/enum/Stats';

export enum StatCategory {
  GOALS = 'goals',
  ASSISTS = 'assists',
  DRIBBLES = 'dribbles',
  PASSES = 'passes',
  DEFENSIVE = 'defensive',
  GOALKEEPER = 'goalkeeper',
  FREE_KICK = 'free_kick',
}

type StatCategoryConfig = {
  icon: ReactNode;
  label: string;
  color: string;
};

export const STAT_CATEGORY_CONFIG: Record<StatCategory, StatCategoryConfig> = {
  [StatCategory.GOALS]: {
    icon: <Goal className="w-4 h-4" />,
    label: 'Finalizações',
    color: 'text-green-500',
  },
  [StatCategory.ASSISTS]: {
    icon: <Target className="w-4 h-4" />,
    label: 'Assistências',
    color: 'text-blue-500',
  },
  [StatCategory.DRIBBLES]: {
    icon: <Zap className="w-4 h-4" />,
    label: 'Dribles',
    color: 'text-yellow-500',
  },
  [StatCategory.PASSES]: {
    icon: <Send className="w-4 h-4" />,
    label: 'Passes',
    color: 'text-cyan-500',
  },
  [StatCategory.DEFENSIVE]: {
    icon: <Shield className="w-4 h-4" />,
    label: 'Defensivas',
    color: 'text-red-500',
  },
  [StatCategory.GOALKEEPER]: {
    icon: <Hand className="w-4 h-4" />,
    label: 'Goleiro',
    color: 'text-purple-500',
  },
  [StatCategory.FREE_KICK]: {
    icon: <Zap className="w-4 h-4" />,
    label: 'Bola parada',
    color: 'text-orange-500',
  },
};

export function getStatCategory(statType: StatTypeEnum): StatCategory {
  const categoryMap: Record<StatTypeEnum, StatCategory> = {
    // Goals
    [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: StatCategory.GOALS,
    [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: StatCategory.GOALS,
    [StatTypeEnum.OWN_GOAL]: StatCategory.GOALS,
    [StatTypeEnum.SHOT_ON_TARGET]: StatCategory.GOALS,
    [StatTypeEnum.SHOT_OFF_TARGET]: StatCategory.GOALS,
    [StatTypeEnum.SHOT_BLOCKED]: StatCategory.GOALS,
    [StatTypeEnum.SHOT_HIT_POST]: StatCategory.GOALS,
    [StatTypeEnum.BIG_CHANCE_MISSED]: StatCategory.GOALS,

    // Assists
    [StatTypeEnum.ASSIST]: StatCategory.ASSISTS,
    [StatTypeEnum.PRE_ASSIST]: StatCategory.ASSISTS,
    [StatTypeEnum.BIG_CHANCE_CREATED]: StatCategory.ASSISTS,
    [StatTypeEnum.KEY_PASS]: StatCategory.ASSISTS,

    // Dribbles
    [StatTypeEnum.DRIBBLE_SUCCESS]: StatCategory.DRIBBLES,
    [StatTypeEnum.DRIBBLE_FAILED]: StatCategory.DRIBBLES,

    // Passes
    [StatTypeEnum.PASS_COMPLETED]: StatCategory.PASSES,
    [StatTypeEnum.PASS_FAILED]: StatCategory.PASSES,
    [StatTypeEnum.LONG_PASS_COMPLETED]: StatCategory.PASSES,
    [StatTypeEnum.LONG_PASS_FAILED]: StatCategory.PASSES,
    [StatTypeEnum.CROSS_COMPLETED]: StatCategory.PASSES,
    [StatTypeEnum.CROSS_FAILED]: StatCategory.PASSES,
    [StatTypeEnum.PROGRESSIVE_PASS]: StatCategory.PASSES,

    // Defensive
    [StatTypeEnum.TACKLE]: StatCategory.DEFENSIVE,
    [StatTypeEnum.INTERCEPTION]: StatCategory.DEFENSIVE,
    [StatTypeEnum.BLOCK]: StatCategory.DEFENSIVE,
    [StatTypeEnum.CLEARANCE]: StatCategory.DEFENSIVE,
    [StatTypeEnum.DUEL_WON]: StatCategory.DEFENSIVE,
    [StatTypeEnum.DUEL_LOST]: StatCategory.DEFENSIVE,
    [StatTypeEnum.AERIAL_DUEL_WON]: StatCategory.DEFENSIVE,
    [StatTypeEnum.AERIAL_DUEL_LOST]: StatCategory.DEFENSIVE,
    [StatTypeEnum.POSSESSION_LOST]: StatCategory.DEFENSIVE,
    [StatTypeEnum.BALL_RECOVERY]: StatCategory.DEFENSIVE,

    // Goalkeeper
    [StatTypeEnum.SAVE]: StatCategory.GOALKEEPER,
    [StatTypeEnum.SAVE_INSIDE_BOX]: StatCategory.GOALKEEPER,
    [StatTypeEnum.SAVE_OUTSIDE_BOX]: StatCategory.GOALKEEPER,
    [StatTypeEnum.PENALTY_SAVE]: StatCategory.GOALKEEPER,
    [StatTypeEnum.GOAL_CONCEDED]: StatCategory.GOALKEEPER,

    // Free Kick
    [StatTypeEnum.PENALTY_CONCEDED]: StatCategory.FREE_KICK,
    [StatTypeEnum.FOUL_COMMITTED]: StatCategory.FREE_KICK,
    [StatTypeEnum.FOUL_SUFFERED]: StatCategory.FREE_KICK,
    [StatTypeEnum.PENALTY_WON]: StatCategory.FREE_KICK,
    [StatTypeEnum.PENALTY_MISSED]: StatCategory.FREE_KICK,
    [StatTypeEnum.PENALTY_SCORED]: StatCategory.FREE_KICK,
    [StatTypeEnum.FREE_KICK_SCORED]: StatCategory.FREE_KICK,
    
    // Other
    [StatTypeEnum.ERROR_LEADING_TO_GOAL]: StatCategory.DEFENSIVE,
    [StatTypeEnum.ERROR_LEADING_TO_SHOT]: StatCategory.DEFENSIVE,
    [StatTypeEnum.YELLOW_CARD]: StatCategory.DEFENSIVE,
    [StatTypeEnum.SECOND_YELLOW_CARD]: StatCategory.DEFENSIVE,
    [StatTypeEnum.RED_CARD]: StatCategory.DEFENSIVE,
  };

  return categoryMap[statType] || StatCategory.DEFENSIVE;
}

export function getStatLabel(statType: StatTypeEnum): string {
  const labelMap: Record<StatTypeEnum, string> = {
    // Goals
    [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: 'Gol (dentro da área)',
    [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: 'Gol (fora da área)',
    [StatTypeEnum.OWN_GOAL]: 'Gol contra',
    [StatTypeEnum.SHOT_ON_TARGET]: 'Finalização no gol',
    [StatTypeEnum.SHOT_OFF_TARGET]: 'Finalização pra fora',
    [StatTypeEnum.SHOT_BLOCKED]: 'Finalização bloqueado',
    [StatTypeEnum.SHOT_HIT_POST]: 'Finalização na trave',
    [StatTypeEnum.BIG_CHANCE_MISSED]: 'Grande chance perdida',

    // Assists
    [StatTypeEnum.ASSIST]: 'Assistência',
    [StatTypeEnum.PRE_ASSIST]: 'Pré-assistência',
    [StatTypeEnum.BIG_CHANCE_CREATED]: 'Grande chance criada',
    [StatTypeEnum.KEY_PASS]: 'Passe-chave',

    // Dribbles
    [StatTypeEnum.DRIBBLE_SUCCESS]: 'Drible certo',
    [StatTypeEnum.DRIBBLE_FAILED]: 'Drible errado',

    // Passes
    [StatTypeEnum.PASS_COMPLETED]: 'Passe certo',
    [StatTypeEnum.PASS_FAILED]: 'Passe errado',
    [StatTypeEnum.LONG_PASS_COMPLETED]: 'Lançamento certo',
    [StatTypeEnum.LONG_PASS_FAILED]: 'Lançamento errado',
    [StatTypeEnum.CROSS_COMPLETED]: 'Cruzamento certo',
    [StatTypeEnum.CROSS_FAILED]: 'Cruzamento errado',
    [StatTypeEnum.PROGRESSIVE_PASS]: 'Passe progressivo',

    // Defensive
    [StatTypeEnum.TACKLE]: 'Desarme',
    [StatTypeEnum.INTERCEPTION]: 'Interceptação',
    [StatTypeEnum.BLOCK]: 'Bloqueio',
    [StatTypeEnum.CLEARANCE]: 'Corte',
    [StatTypeEnum.DUEL_WON]: 'Duelo ganho',
    [StatTypeEnum.DUEL_LOST]: 'Duelo perdido',
    [StatTypeEnum.AERIAL_DUEL_WON]: 'Duelo aéreo ganho',
    [StatTypeEnum.AERIAL_DUEL_LOST]: 'Duelo aéreo perdido',
    [StatTypeEnum.POSSESSION_LOST]: 'Bola perdida',
    [StatTypeEnum.BALL_RECOVERY]: 'Bola recuperada',

    // Goalkeeper
    [StatTypeEnum.SAVE]: 'Defesa difícil',
    [StatTypeEnum.SAVE_INSIDE_BOX]: 'Defesa (dentro da área)',
    [StatTypeEnum.SAVE_OUTSIDE_BOX]: 'Defesa (fora da área)',
    [StatTypeEnum.PENALTY_SAVE]: 'Pênalti defendido',
    [StatTypeEnum.GOAL_CONCEDED]: 'Frango',
    [StatTypeEnum.PENALTY_CONCEDED]: 'Falta dentro da área',

    // Other
    [StatTypeEnum.ERROR_LEADING_TO_GOAL]: 'Erro que resultou em gol',
    [StatTypeEnum.ERROR_LEADING_TO_SHOT]: 'Erro que resultou em finalização',
    [StatTypeEnum.FOUL_COMMITTED]: 'Falta cometida',
    [StatTypeEnum.FOUL_SUFFERED]: 'Falta sofrida',
    [StatTypeEnum.YELLOW_CARD]: 'Cartão amarelo',
    [StatTypeEnum.SECOND_YELLOW_CARD]: 'Segundo amarelo',
    [StatTypeEnum.RED_CARD]: 'Cartão vermelho',
    [StatTypeEnum.PENALTY_WON]: 'Pênalti sofrido',
    [StatTypeEnum.PENALTY_MISSED]: 'Pênalti perdido',
    [StatTypeEnum.PENALTY_SCORED]: 'Pênalti convertido',
    [StatTypeEnum.FREE_KICK_SCORED]: 'Falta convertida',
  };

  return labelMap[statType] || statType;
}

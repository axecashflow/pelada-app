import { DrizzleMatchRepository } from '@/app/infrastructure/repositories/DrizzleMatchRepository';
import { MatchService } from '../services/MatchService';

const makeMatchService = () => {
  const matchRepository = new DrizzleMatchRepository();

  const matchService = new MatchService(matchRepository);

  return matchService;
};

export default makeMatchService;

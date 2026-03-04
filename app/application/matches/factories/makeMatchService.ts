import { DrizzleMatchRepository } from '@/app/infrastructure/repositories/DrizzleMatchRepository';
import { MatchService } from '../services/MatchService';
import { domainEventDispatcher } from '@/app/application/shared/getDomainEventDispatcher';

const makeMatchService = () => {
  const matchRepository = new DrizzleMatchRepository();

  const matchService = new MatchService(matchRepository, domainEventDispatcher);

  return matchService;
};

export default makeMatchService;

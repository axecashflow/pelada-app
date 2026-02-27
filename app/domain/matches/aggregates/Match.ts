import { AggregateRoot } from "@/app/domain/shared/AggregateRoot";
import { MatchId } from "@/app/domain/matches/value-objects/MatchId";
import { Player } from "@/app/domain/matches/entities/Player";
import { MatchStat } from "@/app/domain/matches/value-objects/MatchStat";
import { PlayerId } from "@/app/domain/matches/value-objects/PlayerId";
import { StatWeight } from "@/app/domain/matches/value-objects/StatWeight";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { MatchEventRules } from "@/app/domain/matches/services/MatchEventRules";
import { StatScorePolicy } from "@/app/domain/matches/services/StatScorePolicy";
import { DomainError } from "@/app/domain/shared/DomainError";
import { PlayerPosition, PlayerPresenceInMatch } from "@/app/domain/matches/enum/Player";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";

import { Team } from "./Team";

interface MatchProps {
  groupId: GroupId;
  teamA: Team;
  teamB: Team;
  stats: MatchStat[];
}

export class Match extends AggregateRoot<MatchId> {
  private props: MatchProps;

  private constructor(id: MatchId, props: MatchProps) {
    super(id);
    this.props = props;
  }

  static create(id: MatchId, groupId: GroupId, teamA: Team, teamB: Team): Match {
    return new Match(id, { groupId, teamA, teamB, stats: [] });
  }

  get groupId(): GroupId {
    return this.props.groupId;
  }

  get teamA(): Team {
    return this.props.teamA;
  }

  get teamB(): Team {
    return this.props.teamB;
  }

  get stats(): MatchStat[] {
    return this.props.stats;
  }

  private findPlayerInMatch(playerId: PlayerId): Player | undefined {
    return (
      this.teamA.players.find(p => p.id.equals(playerId)) ||
      this.teamB.players.find(p => p.id.equals(playerId))
    );
  }

  recordEvent(
    primaryPlayerId: PlayerId,
    statType: StatTypeEnum,
    opponentPlayerId?: PlayerId,
    position?: PlayerPosition
  ): void {
    const primaryPlayer = this.findPlayerInMatch(primaryPlayerId);

    if (!primaryPlayer) {
      throw new DomainError('PlayerNotFoundInTeam');
    }

    const eventRule = MatchEventRules.getEventRule(statType);

    const primaryWeight = StatScorePolicy.getWeight(statType, position);
    const primaryStat = MatchStat.create({
      playerId: primaryPlayerId,
      type: eventRule.primary.type,
      value: 1,
      weight: StatWeight.create(primaryWeight),
      impact: eventRule.primary.impact,
    });

    this.props.stats.push(primaryStat);

    const primaryScoreDelta = primaryWeight * eventRule.primary.impact;
    primaryPlayer.updateScore(primaryPlayer.rating.add(primaryScoreDelta));

    if (eventRule.counterpart && opponentPlayerId) {
      const counterpartPlayer = this.findPlayerInMatch(opponentPlayerId)

      if (counterpartPlayer) {
        const counterpartWeight = StatScorePolicy.getWeight(eventRule.counterpart.type, position);
        const counterpartStat = MatchStat.create({
          playerId: counterpartPlayer.id,
          type: eventRule.counterpart.type,
          value: 1,
          weight: StatWeight.create(counterpartWeight),
          impact: eventRule.counterpart.impact,
        });

        this.props.stats.push(counterpartStat);

        const counterpartScoreDelta = counterpartWeight * eventRule.counterpart.impact;
        counterpartPlayer.updateScore(counterpartPlayer.rating.add(counterpartScoreDelta));
      }
    }
  }

  substitutePlayerInTeamA(playerOut: Player, playerIn: Player): void {
    const player = this.teamA.players.find(p => p.id.equals(playerOut.id));

    if (!player) {
      throw new DomainError('PlayerNotFoundInTeam');
    }

    player.changePresence(PlayerPresenceInMatch.SUBSTITUTED_OUT);
    playerIn.changePresence(PlayerPresenceInMatch.SUBSTITUTED_IN);
    this.teamA.addPlayer(playerIn);
  }

  substitutePlayerInTeamB(playerOut: Player, playerIn: Player): void {
    const player = this.teamB.players.find(p => p.id.equals(playerOut.id));

    if (!player) {
      throw new DomainError('PlayerNotFoundInTeam');
    }

    player.changePresence(PlayerPresenceInMatch.SUBSTITUTED_OUT);
    playerIn.changePresence(PlayerPresenceInMatch.SUBSTITUTED_IN);
    this.teamB.addPlayer(playerIn);
  }
}
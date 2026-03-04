import { AggregateRoot } from "@/app/domain/shared/AggregateRoot";
import { UserId } from "../values-objects/UserId";
import { OutfieldPlayerStats } from "../values-objects/OutfieldPlayerStats";

export interface ProfileStatsProps {
  userId: UserId;
  stats: OutfieldPlayerStats;
}

export class ProfileStats extends AggregateRoot<UserId> {
  private props: ProfileStatsProps;

  private constructor(userId: UserId, props: ProfileStatsProps) {
    super(userId);
    this.props = props;
  }

  static create(userId: UserId): ProfileStats {
    return new ProfileStats(userId, {
      userId,
      stats: OutfieldPlayerStats.empty(),
    });
  }

  static restore(userId: UserId, stats: OutfieldPlayerStats): ProfileStats {
    return new ProfileStats(userId, {
      userId,
      stats,
    });
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get stats(): OutfieldPlayerStats {
    return this.props.stats;
  }

  addMatchPlayed(): void {
    this.props.stats = this.props.stats.incrementNumberOfMatches();
  }

  addAssist(): void {
    this.props.stats = this.props.stats.incrementAssists();
  }

  addShotOnTarget(): void {
    this.props.stats = this.props.stats.incrementShotsOnTarget();
  }

  addShotOffTarget(): void {
    this.props.stats = this.props.stats.incrementShotsOffTarget();
  }

  addShotHitPost(): void {
    this.props.stats = this.props.stats.incrementShotsHitPost();
  }

  addGoalFromInsideBox(): void {
    this.props.stats = this.props.stats.incrementGoalFromInsideBox();
  }

  addGoalFromOutsideBox(): void {
    this.props.stats = this.props.stats.incrementGoalFromOutsideBox();
  }

  addOwnGoal(): void {
    this.props.stats = this.props.stats.incrementOwnGoal();
  }

  addDribbleSuccess(): void {
    this.props.stats = this.props.stats.incrementDribbleSuccess();
  }

  addDribbleFailed(): void {
    this.props.stats = this.props.stats.incrementDribbleFailed();
  }

  addPassCompleted(): void {
    this.props.stats = this.props.stats.incrementPassCompleted();
  }

  addPassFailed(): void {
    this.props.stats = this.props.stats.incrementPassFailed();
  }

  addTackle(): void {
    this.props.stats = this.props.stats.incrementTackle();
  }

  addInterception(): void {
    this.props.stats = this.props.stats.incrementInterception();
  }

  addBlock(): void {
    this.props.stats = this.props.stats.incrementBlock();
  }

  addPossessionLost(): void {
    this.props.stats = this.props.stats.incrementPossessionLost();
  }

  addBallRecovery(): void {
    this.props.stats = this.props.stats.incrementBallRecovery();
  }

  addFoulCommitted(): void {
    this.props.stats = this.props.stats.incrementFoulCommitted();
  }

  addFoulSuffered(): void {
    this.props.stats = this.props.stats.incrementFoulSuffered();
  }

  addYellowCard(): void {
    this.props.stats = this.props.stats.incrementYellowCard();
  }

  addRedCard(): void {
    this.props.stats = this.props.stats.incrementRedCard();
  }

  addPenaltyWon(): void {
    this.props.stats = this.props.stats.incrementPenaltyWon();
  }

  addPenaltyMissed(): void {
    this.props.stats = this.props.stats.incrementPenaltyMissed();
  }

  addPenaltyScored(): void {
    this.props.stats = this.props.stats.incrementPenaltyScored();
  }

  addPenaltyConceded(): void {
    this.props.stats = this.props.stats.incrementPenaltyConceded();
  }

  addFreeKickScored(): void {
    this.props.stats = this.props.stats.incrementFreeKickScored();
  }

  addNutmeg(): void {
    this.props.stats = this.props.stats.incrementNutmeg();
  }

  addLob(): void {
    this.props.stats = this.props.stats.incrementLob();
  }

  addSave(): void {
    this.props.stats = this.props.stats.incrementSave();
  }

  addSaveInsideBox(): void {
    this.props.stats = this.props.stats.incrementSaveInsideBox();
  }

  addSaveOutsideBox(): void {
    this.props.stats = this.props.stats.incrementSaveOutsideBox();
  }

  addPenaltySave(): void {
    this.props.stats = this.props.stats.incrementPenaltySave();
  }

  addGoalConceded(): void {
    this.props.stats = this.props.stats.incrementGoalConceded();
  }
}

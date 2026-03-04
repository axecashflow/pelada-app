import { ValueObject } from "@/app/domain/shared/ValueObject";

export interface ProfileStatsProps {
  numberOfMatches: number;
  assists: number;
  shotsOnTarget: number;
  shotsOffTarget: number;
  shotsHitPost: number;
  goalFromInsideBox: number;
  goalFromOutsideBox: number;
  ownGoal: number;
  dribbleSuccess: number;
  dribbleFailed: number;
  passCompleted: number;
  passFailed: number;
  tackle: number;
  interception: number;
  block: number;
  possessionLost: number;
  ballRecovery: number;
  foulCommitted: number;
  foulSuffered: number;
  yellowCard: number;
  redCard: number;
  penaltyWon: number;
  penaltyMissed: number;
  penaltyScored: number;
  penaltyConceded: number;
  freeKickScored: number;
  nutmeg: number;
  lob: number;
  // Goalkeeper
  save: number;
  saveInsideBox: number;
  saveOutsideBox: number;
  penaltySave: number;
  goalConceded: number;
}

export class OutfieldPlayerStats extends ValueObject<ProfileStatsProps> {
  get numberOfMatches() {
    return this.props.numberOfMatches;
  }

  get assists() {
    return this.props.assists;
  }

  get shotsOnTarget() {
    return this.props.shotsOnTarget;
  }

  get shotsOffTarget() {
    return this.props.shotsOffTarget;
  }

  get shotsHitPost() {
    return this.props.shotsHitPost;
  }

  get goalFromInsideBox() {
    return this.props.goalFromInsideBox;
  }

  get goalFromOutsideBox() {
    return this.props.goalFromOutsideBox;
  }

  get ownGoal() {
    return this.props.ownGoal;
  }

  get dribbleSuccess() {
    return this.props.dribbleSuccess;
  }

  get dribbleFailed() {
    return this.props.dribbleFailed;
  }

  get passCompleted() {
    return this.props.passCompleted;
  }

  get passFailed() {
    return this.props.passFailed;
  }

  get tackle() {
    return this.props.tackle;
  }

  get interception() {
    return this.props.interception;
  }

  get block() {
    return this.props.block;
  }

  get possessionLost() {
    return this.props.possessionLost;
  }

  get ballRecovery() {
    return this.props.ballRecovery;
  }

  get foulCommitted() {
    return this.props.foulCommitted;
  }

  get foulSuffered() {
    return this.props.foulSuffered;
  }

  get yellowCard() {
    return this.props.yellowCard;
  }

  get redCard() {
    return this.props.redCard;
  }

  get penaltyWon() {
    return this.props.penaltyWon;
  }

  get penaltyMissed() {
    return this.props.penaltyMissed;
  }

  get penaltyScored() {
    return this.props.penaltyScored;
  }

  get penaltyConceded() {
    return this.props.penaltyConceded;
  }

  get freeKickScored() {
    return this.props.freeKickScored;
  }

  get nutmeg() {
    return this.props.nutmeg;
  }

  get lob() {
    return this.props.lob;
  }

  get save() {
    return this.props.save;
  }

  get saveInsideBox() {
    return this.props.saveInsideBox;
  }

  get saveOutsideBox() {
    return this.props.saveOutsideBox;
  }

  get penaltySave() {
    return this.props.penaltySave;
  }

  get goalConceded() {
    return this.props.goalConceded;
  }

  incrementNumberOfMatches(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      numberOfMatches: this.props.numberOfMatches + 1,
    });
  }

  incrementAssists(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      assists: this.props.assists + 1,
    });
  }

  incrementShotsOnTarget(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      shotsOnTarget: this.props.shotsOnTarget + 1,
    });
  }

  incrementShotsOffTarget(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      shotsOffTarget: this.props.shotsOffTarget + 1,
    });
  }

  incrementShotsHitPost(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      shotsHitPost: this.props.shotsHitPost + 1,
    });
  }

  incrementGoalFromInsideBox(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      goalFromInsideBox: this.props.goalFromInsideBox + 1,
    });
  }

  incrementGoalFromOutsideBox(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      goalFromOutsideBox: this.props.goalFromOutsideBox + 1,
    });
  }

  incrementOwnGoal(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      ownGoal: this.props.ownGoal + 1,
    });
  }

  incrementDribbleSuccess(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      dribbleSuccess: this.props.dribbleSuccess + 1,
    });
  }

  incrementDribbleFailed(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      dribbleFailed: this.props.dribbleFailed + 1,
    });
  }

  incrementPassCompleted(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      passCompleted: this.props.passCompleted + 1,
    });
  }

  incrementPassFailed(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      passFailed: this.props.passFailed + 1,
    });
  }

  incrementTackle(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      tackle: this.props.tackle + 1,
    });
  }

  incrementInterception(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      interception: this.props.interception + 1,
    });
  }

  incrementBlock(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      block: this.props.block + 1,
    });
  }

  incrementPossessionLost(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      possessionLost: this.props.possessionLost + 1,
    });
  }

  incrementBallRecovery(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      ballRecovery: this.props.ballRecovery + 1,
    });
  }

  incrementFoulCommitted(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      foulCommitted: this.props.foulCommitted + 1,
    });
  }

  incrementFoulSuffered(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      foulSuffered: this.props.foulSuffered + 1,
    });
  }

  incrementYellowCard(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      yellowCard: this.props.yellowCard + 1,
    });
  }

  incrementRedCard(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      redCard: this.props.redCard + 1,
    });
  }

  incrementPenaltyWon(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      penaltyWon: this.props.penaltyWon + 1,
    });
  }

  incrementPenaltyMissed(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      penaltyMissed: this.props.penaltyMissed + 1,
    });
  }

  incrementPenaltyScored(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      penaltyScored: this.props.penaltyScored + 1,
    });
  }

  incrementPenaltyConceded(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      penaltyConceded: this.props.penaltyConceded + 1,
    });
  }

  incrementFreeKickScored(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      freeKickScored: this.props.freeKickScored + 1,
    });
  }

  incrementNutmeg(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      nutmeg: this.props.nutmeg + 1,
    });
  }

  incrementLob(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      lob: this.props.lob + 1,
    });
  }

  incrementSave(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      save: this.props.save + 1,
    });
  }

  incrementSaveInsideBox(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      saveInsideBox: this.props.saveInsideBox + 1,
    });
  }

  incrementSaveOutsideBox(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      saveOutsideBox: this.props.saveOutsideBox + 1,
    });
  }

  incrementPenaltySave(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      penaltySave: this.props.penaltySave + 1,
    });
  }

  incrementGoalConceded(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      ...this.props,
      goalConceded: this.props.goalConceded + 1,
    });
  }

  static create(props: ProfileStatsProps): OutfieldPlayerStats {
    return new OutfieldPlayerStats(props);
  }

  static empty(): OutfieldPlayerStats {
    return new OutfieldPlayerStats({
      numberOfMatches: 0,
      assists: 0,
      shotsOnTarget: 0,
      shotsOffTarget: 0,
      shotsHitPost: 0,
      goalFromInsideBox: 0,
      goalFromOutsideBox: 0,
      ownGoal: 0,
      dribbleSuccess: 0,
      dribbleFailed: 0,
      passCompleted: 0,
      passFailed: 0,
      tackle: 0,
      interception: 0,
      block: 0,
      possessionLost: 0,
      ballRecovery: 0,
      foulCommitted: 0,
      foulSuffered: 0,
      yellowCard: 0,
      redCard: 0,
      penaltyWon: 0,
      penaltyMissed: 0,
      penaltyScored: 0,
      penaltyConceded: 0,
      freeKickScored: 0,
      nutmeg: 0,
      lob: 0,
      save: 0,
      saveInsideBox: 0,
      saveOutsideBox: 0,
      penaltySave: 0,
      goalConceded: 0,
    });
  }
}

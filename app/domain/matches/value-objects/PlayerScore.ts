import { ValueObject } from "@/app/domain/shared/ValueObject";

interface PlayerScoreProps {
  score: number;
}

export class PlayerScore extends ValueObject<PlayerScoreProps> {
  private constructor(props: PlayerScoreProps) {
    super(props);
  }

  static initial(): PlayerScore {
    return new PlayerScore({ score: 6 });
  }

  static create(value: number): PlayerScore {
    if (value < 0 || value > 10) {
      throw new Error("Score must be between 0 and 10");
    }

    return new PlayerScore({
      score: Number(value.toFixed(2)),
    });
  }

  add(delta: number): PlayerScore {
    const updated = this.props.score + delta;
    const clamped = Math.min(10, Math.max(0, updated));

    return PlayerScore.create(clamped);
  }

  get score(): number {
    return this.props.score;
  }
}
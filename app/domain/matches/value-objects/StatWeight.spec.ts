import { StatWeight } from './StatWeight';

describe('StatWeight Value Object', () => {
  it('should create a valid stat weight', () => {
    const weight = StatWeight.create(2.5);

    expect(weight.value).toBe(2.5);
  });

  it('should create weight with integer value', () => {
    const weight = StatWeight.create(3);

    expect(weight.value).toBe(3);
  });

  it('should create weight with small decimal value', () => {
    const weight = StatWeight.create(0.5);

    expect(weight.value).toBe(0.5);
  });

  it('should throw error if weight is zero', () => {
    expect(() => StatWeight.create(0)).toThrow('WeightMustBePositive');
  });

  it('should throw error if weight is negative', () => {
    expect(() => StatWeight.create(-1)).toThrow('WeightMustBePositive');
  });

  it('should throw error if weight is negative decimal', () => {
    expect(() => StatWeight.create(-0.5)).toThrow('WeightMustBePositive');
  });

  it('should consider two weights with same value as equal', () => {
    const weight1 = StatWeight.create(2.5);
    const weight2 = StatWeight.create(2.5);

    expect(weight1.equals(weight2)).toBe(true);
  });

  it('should consider two weights with different values as not equal', () => {
    const weight1 = StatWeight.create(2.5);
    const weight2 = StatWeight.create(3.0);

    expect(weight1.equals(weight2)).toBe(false);
  });
});

import { Unit } from '@/types/Unit';

export default function calculateFactor(unit: Unit, amount: number): number {
  if (unit === Unit.GRAM || unit === Unit.MILLILITER) {
    return amount / 100;
  } else if (unit === Unit.PIECE) {
    return amount;
  }
  return 1;
}

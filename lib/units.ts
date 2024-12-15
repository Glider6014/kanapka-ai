export enum Unit {
  GRAM = 'g',
  MILLILITER = 'ml',
  PIECE = 'piece',
}

export const unitsList = Object.values(Unit);

export const unitToFactor: Record<Unit | string, number> = {
  [Unit.GRAM]: 100,
  [Unit.MILLILITER]: 100,
  [Unit.PIECE]: 1,
};

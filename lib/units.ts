export enum Unit {
  GRAM = 'g',
  MILLILITER = 'ml',
  PIECE = 'piece',
}

// Zod doesn't support normal array type, so got to make this... thing.
export const unitsList = Object.values(Unit) as unknown as readonly [string, ...string[]];

export const unitToFactor: Record<Unit | string, number> = {
  [Unit.GRAM]: 100,
  [Unit.MILLILITER]: 100,
  [Unit.PIECE]: 1,
};

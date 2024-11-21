export default function calculateFactor(unit: string, amount: number): number {
  if (unit === "g" || unit === "ml") {
    return amount / 100;
  } else if (unit === "piece") {
    return amount;
  }
  return 1;
}

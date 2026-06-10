export function getSpinScore(
  spin: any,
): number {

  let score = 0;

  if (spin?.situation) score += 25;
  if (spin?.problem) score += 25;
  if (spin?.implication) score += 25;
  if (spin?.need_payoff) score += 25;

  return score;

}
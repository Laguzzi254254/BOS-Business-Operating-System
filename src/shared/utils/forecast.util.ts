export function getForecastBand(
  oqs: number,
): string {

  if (oqs >= 80) {
    return 'COMMIT';
  }

  if (oqs >= 60) {
    return 'BEST_CASE';
  }

  return 'PIPELINE';

}
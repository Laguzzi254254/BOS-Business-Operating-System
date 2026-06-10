export interface OQSInput {
  meddpiccScore: number;
  stageScore: number;
  spinScore: number;
}

export function calculateOQS(
  input: OQSInput,
): number {

  const oqs =
    (input.meddpiccScore * 0.60) +
    (input.stageScore * 0.25) +
    (input.spinScore * 0.15);

  return Math.round(oqs);

}
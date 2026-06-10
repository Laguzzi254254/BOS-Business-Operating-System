export function getStageScore(
  stage?: string,
): number {

  switch (stage) {

    case 'Lead':
      return 20;

    case 'Qualified':
      return 40;

    case 'Proposal':
      return 60;

    case 'Negotiation':
      return 80;

    case 'Closed Won':
      return 100;

    default:
      return 0;

  }

}
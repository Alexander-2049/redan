type DriverWithIRating = {
  id: number;
  position: number; // 1 = first place, 2 = second, etc.
  rating: number;
};

type iRatingChange = {
  id: number;
  ratingChange: number;
};

export function calculateIRatingChanges(drivers: DriverWithIRating[]): iRatingChange[] {
  const iRatingChanges: iRatingChange[] = [];
  const magicNumber = 2308.087; // Equivalent to 1600 / ln(2)
  const driverCount = drivers.length;

  // Precompute exponentials to avoid redundant calculations
  const expMap = new Map<number, number>();
  const oneMinusExpMap = new Map<number, number>();

  for (const driver of drivers) {
    const rating = driver.rating;
    if (!expMap.has(rating)) {
      const expVal = Math.exp(-rating / magicNumber);
      expMap.set(rating, expVal);
      oneMinusExpMap.set(rating, 1 - expVal);
    }
  }

  for (const driver of drivers) {
    const currentRating = driver.rating;
    const currentPosition = driver.position;

    const expCurrent = expMap.get(currentRating);
    const oneMinusExpCurrent = oneMinusExpMap.get(currentRating);

    if (expCurrent === undefined || oneMinusExpCurrent === undefined) continue;

    let expectedScore = -0.5;

    for (const opponent of drivers) {
      const opponentRating = opponent.rating;

      const expOpponent = expMap.get(opponentRating);
      const oneMinusExpOpponent = oneMinusExpMap.get(opponentRating);

      if (expOpponent === undefined || oneMinusExpOpponent === undefined) continue;

      const numerator = oneMinusExpCurrent * expOpponent;
      const denominator = oneMinusExpOpponent * expCurrent + oneMinusExpCurrent * expOpponent;

      expectedScore += numerator / denominator;
    }

    const fudgeFactor = (driverCount / 2 - currentPosition) / 100;
    const ratingDelta =
      ((driverCount - currentPosition - expectedScore - fudgeFactor) * 200) / driverCount;

    iRatingChanges.push({
      id: driver.id,
      ratingChange: Math.round(ratingDelta),
    });
  }

  return iRatingChanges;
}

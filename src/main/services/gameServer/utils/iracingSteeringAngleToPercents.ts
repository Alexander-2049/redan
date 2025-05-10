export function iracingSteeringAngleToPercents(rotation: number): number {
  const clampedRotation = Math.max(
    -9.42477798461914,
    Math.min(rotation, 9.42477798461914),
  );
  const percent = (clampedRotation / 9.42477798461914) * 150;

  return percent;
}

export function getTrackLengthInMeters(trackLengthStr: string): number {
  const match = trackLengthStr.match(/^([\d.]+)\s*(\w+)$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  const conversions: Record<string, number> = {
    m: 1,
    meters: 1,
    km: 1000,
    kilometers: 1000,
    mi: 1609.34,
    miles: 1609.34,
    ft: 0.3048,
    feet: 0.3048,
  };

  return value * (conversions[unit] ?? 1);
}

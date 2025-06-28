import { iRacingSessionData } from '@/main/shared/types/iRacing';

const FRAME_COUNT = 20;

function calculateTrackTempC(i: number): number {
  return 32.5 + 2 * Math.sin((i / FRAME_COUNT) * 2 * Math.PI);
}

function calculateAirTempC(i: number): number {
  return 28 + 2 * Math.sin((i / FRAME_COUNT + 0.25) * 2 * Math.PI);
}

function cToF(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

function formatTemp(temp: number, unit: 'C' | 'F'): string {
  return `${temp.toFixed(1)}°${unit}`;
}

export const iRacingSessionMock: iRacingSessionData[] = [];

for (let i = 0; i < FRAME_COUNT; i++) {
  const trackTempC = calculateTrackTempC(i);
  const airTempC = calculateAirTempC(i);
  const trackTempF = cToF(trackTempC);
  const airTempF = cToF(airTempC);

  iRacingSessionMock.push({
    trackName: 'Daytona International Speedway',
    wetnessString: 'Dry',
    wetnessLevel: 0,
    trackTempC,
    trackTempF,
    airTempC,
    airTempF,
    trackTempCString: formatTemp(trackTempC, 'C'),
    trackTempFString: formatTemp(trackTempF, 'F'),
    airTempCString: formatTemp(airTempC, 'C'),
    airTempFString: formatTemp(airTempF, 'F'),
  });
}

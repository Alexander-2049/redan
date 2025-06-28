import { iRacingDriversMock } from './drivers';
import { iRacingRealtimeMock } from './realtime';
import { iRacingSessionMock } from './session';

import { iRacingData } from '@/main/shared/types/iRacing';

export const iRacingMockData: iRacingData[] = [];

for (let i = 0; i < 20; i++) {
  iRacingMockData.push({
    game: 'iRacing',
    drivers: iRacingDriversMock[i % iRacingDriversMock.length],
    realtime: iRacingRealtimeMock[i % iRacingRealtimeMock.length],
    session: iRacingSessionMock[i % iRacingSessionMock.length],
  });
}

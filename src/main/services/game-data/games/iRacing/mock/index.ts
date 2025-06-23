import { IRacingData } from "../schema";
import { iRacingDriversMock } from "./drivers-mock";
import { iRacingRealtimeMock } from "./realtime-mock";
import { iRacingSessionMock } from "./session-mock";

export const iRacingMockData: IRacingData[] = [];

for (let i = 0; i < 20; i++) {
  iRacingMockData.push({
    game: "iRacing",
    drivers: iRacingDriversMock[i % iRacingDriversMock.length],
    realtime: iRacingRealtimeMock[i % iRacingRealtimeMock.length],
    session: iRacingSessionMock[i % iRacingSessionMock.length],
  });
}

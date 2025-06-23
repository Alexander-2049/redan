import { IRacingRealtimeData } from "../schema";

const FRAME_COUNT = 20;
const MID = FRAME_COUNT / 2;

const rpmStageFirst = 6700;
const rpmStageBlink = 8700;
const rpmStageShift = 8500;

function calculateRpm(i: number): number {
  const t = i / MID;
  const curve = i <= MID ? Math.pow(t, 2) : Math.pow(2 - t, 2);
  const value = rpmStageFirst + curve * (rpmStageBlink - rpmStageFirst - 200);
  return Math.min(Math.max(value, rpmStageFirst), rpmStageBlink);
}

function calculateThrottle(i: number): number {
  return 0.9 + 0.1 * Math.sin((i / FRAME_COUNT) * 2 * Math.PI);
}

function calculateBrake(i: number): number {
  return i % 10 < 2 ? 0.2 + 0.1 * Math.random() : 0;
}

function calculateSteering(i: number): number {
  return 0.02 * Math.sin((i / FRAME_COUNT) * 4 * Math.PI);
}

function calculateGear(i: number): number {
  const maxGear = 6;
  return 2 + Math.floor((i / FRAME_COUNT) * (maxGear - 2));
}

function calculateSpeedKph(i: number): number {
  const rpm = calculateRpm(i);
  return 250 + ((rpm - rpmStageFirst) / (rpmStageBlink - rpmStageFirst)) * 30;
}

export const iRacingRealtimeMock: IRacingRealtimeData[] = [];

for (let i = 0; i < FRAME_COUNT; i++) {
  const rpm = calculateRpm(i);
  const speedKph = calculateSpeedKph(i);

  iRacingRealtimeMock.push({
    throttle: calculateThrottle(i),
    brake: calculateBrake(i),
    steeringAnglePct: calculateSteering(i),
    gear: calculateGear(i),
    speedKph,
    speedMph: speedKph * 0.621371,
    rpm,
    rpmStageFirst,
    rpmStageShift,
    rpmStageLast: rpmStageShift,
    rpmStageBlink,
    displayUnits: "METRIC",
    absActive: false,
    isOnTrack: true,
    isInReplay: true,
    spectateCarId: 12,
    lapTimes: {
      lapBestLap: 0,
      lapBestLapTime: 0,
      lapLastLapTime: 0,
      lapCurrentLapTime: 0,
      lapLasNLapSeq: 0,
      lapLastNLapTime: 0,
      lapBestNLapLap: 0,
      lapBestNLapTime: 0,
      lapDeltaToBestLap: 0,
      lapDeltaToBestLap_DD: 0,
      lapDeltaToBestLap_OK: false,
      lapDeltaToOptimalLap: 0,
      lapDeltaToOptimalLap_DD: 0,
      lapDeltaToOptimalLap_OK: false,
      lapDeltaToSessionBestLap: 0,
      lapDeltaToSessionBestLap_DD: 0,
      lapDeltaToSessionBestLap_OK: false,
      lapDeltaToSessionOptimalLap: 0,
      lapDeltaToSessionOptimalLap_DD: 0,
      lapDeltaToSessionOptimalLap_OK: false,
      lapDeltaToSessionLastlLap: 0,
      lapDeltaToSessionLastlLap_DD: 0,
      lapDeltaToSessionLastlLap_OK: false,
    },
  });
}

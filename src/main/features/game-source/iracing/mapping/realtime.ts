import { TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

import { iracingSteeringAngleToPercents } from '../calculations/iracingSteeringAngleToPercents';

import { SpeedConverter } from '@/main/entities/speed-converter';
import { iRacingRealtimeData } from '@/main/shared/types/iRacing';

export function getRealtimeFields(telemetry: TelemetryValues): iRacingRealtimeData {
  return {
    throttle: telemetry.Throttle,
    brake: telemetry.Brake,
    steeringAnglePct: iracingSteeringAngleToPercents(telemetry.SteeringWheelAngle),
    gear: telemetry.Gear,
    speedKph:
      Math.floor(
        SpeedConverter.convert(telemetry.Speed, 'METERS_PER_SECOND', 'KILOMETERS_PER_HOUR') * 100,
      ) / 100,
    rpm: Math.floor(telemetry.RPM * 100) / 100,
    rpmStageFirst: telemetry.PlayerCarSLFirstRPM,
    rpmStageShift: telemetry.PlayerCarSLShiftRPM,
    rpmStageLast: telemetry.PlayerCarSLLastRPM,
    rpmStageBlink: telemetry.PlayerCarSLBlinkRPM,
    displayUnits: telemetry.DisplayUnits === 0 ? 'IMPERIAL' : 'METRIC',
    absActive: telemetry.BrakeABSactive,
    isOnTrack: telemetry.IsOnTrack || telemetry.PlayerTrackSurface !== 'NotInWorld',
    isInReplay: telemetry.IsReplayPlaying && !telemetry.IsOnTrackCar,
    spectateCarId: telemetry.CamCarIdx,
    lapTimes: {
      lapBestLap: telemetry.LapBestLap,
      lapBestLapTime: telemetry.LapBestLapTime,
      lapLastLapTime: telemetry.LapLastLapTime,
      lapCurrentLapTime: telemetry.LapCurrentLapTime,
      lapLasNLapSeq: telemetry.LapLasNLapSeq,
      lapLastNLapTime: telemetry.LapLastNLapTime,
      lapBestNLapLap: telemetry.LapBestNLapLap,
      lapBestNLapTime: telemetry.LapBestNLapTime,
      lapDeltaToBestLap: telemetry.LapDeltaToBestLap,
      lapDeltaToBestLap_DD: telemetry.LapDeltaToBestLap_DD,
      lapDeltaToBestLap_OK: telemetry.LapDeltaToBestLap_OK,
      lapDeltaToOptimalLap: telemetry.LapDeltaToOptimalLap,
      lapDeltaToOptimalLap_DD: telemetry.LapDeltaToOptimalLap_DD,
      lapDeltaToOptimalLap_OK: telemetry.LapDeltaToOptimalLap_OK,
      lapDeltaToSessionBestLap: telemetry.LapDeltaToSessionBestLap,
      lapDeltaToSessionBestLap_DD: telemetry.LapDeltaToSessionBestLap_DD,
      lapDeltaToSessionBestLap_OK: telemetry.LapDeltaToSessionBestLap_OK,
      lapDeltaToSessionOptimalLap: telemetry.LapDeltaToSessionOptimalLap,
      lapDeltaToSessionOptimalLap_DD: telemetry.LapDeltaToSessionOptimalLap_DD,
      lapDeltaToSessionOptimalLap_OK: telemetry.LapDeltaToSessionOptimalLap_OK,
      lapDeltaToSessionLastlLap: telemetry.LapDeltaToSessionLastlLap,
      lapDeltaToSessionLastlLap_DD: telemetry.LapDeltaToSessionLastlLap_DD,
      lapDeltaToSessionLastlLap_OK: telemetry.LapDeltaToSessionLastlLap_OK,
    },
    test: telemetry,
  };
}

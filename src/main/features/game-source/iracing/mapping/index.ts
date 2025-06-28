import { SessionInfoData, TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

import { getDriversFields } from './drivers';
import { getRealtimeFields } from './realtime';
import { getSessionFields } from './session';

import { iRacingData } from '@/main/shared/types/iRacing';

export function mapDataFromIRacing(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): iRacingData {
  return {
    game: 'iRacing',
    realtime: getRealtimeFields(telemetry),
    drivers: getDriversFields(telemetry, sessionInfo),
    session: getSessionFields(telemetry, sessionInfo),
  };
}

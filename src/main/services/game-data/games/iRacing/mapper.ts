import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { SpeedConverter } from "../../utils/SpeedConverter";
import { iracingSteeringAngleToPercents } from "../../utils/iracingSteeringAngleToPercents";
import { EntryListElement, MappedGameData } from "../../types/GameData";

export function mapDataFromIRacing(
  c: boolean,
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): MappedGameData {
  const entrylist: EntryListElement[] = [];
  for (let i = 0; i < sessionInfo.DriverInfo.Drivers.length; i++) {
    const driver = sessionInfo.DriverInfo.Drivers[i];
    telemetry;

    let username: string[] = [];
    if (typeof driver.UserName === "string")
      username = driver.UserName.split(" ");
    let firstName = "";
    let middleName = "";
    let lastName = "";

    if (username.length > 0) {
      firstName = username[0];
      lastName = username[username.length - 1];
      if (username.length > 2) {
        middleName = username.slice(1, -1).join(" ");
      }
    }

    entrylist.push({
      position: i + 1,
      firstName,
      middleName,
      lastName,
    });
  }

  return {
    isConnected: c,
    game: "iRacing",
    realtime: {
      throttle: telemetry.Throttle,
      brake: telemetry.Brake,
      steeringAnglePct: iracingSteeringAngleToPercents(
        telemetry.SteeringWheelAngle,
      ),
      gear: telemetry.Gear,
      speedKph: SpeedConverter.convert(
        telemetry.Speed,
        "METERS_PER_SECOND",
        "KILOMETERS_PER_HOUR",
      ),
      speedMph: SpeedConverter.convert(
        telemetry.Speed,
        "METERS_PER_SECOND",
        "MILES_PER_HOUR",
      ),
      rpm: telemetry.RPM,
      rpmStageFirst: telemetry.PlayerCarSLFirstRPM,
      rpmStageShift: telemetry.PlayerCarSLShiftRPM,
      rpmStageLast: telemetry.PlayerCarSLLastRPM,
      rpmStageBlink: telemetry.PlayerCarSLBlinkRPM,
      displayUnits: telemetry.DisplayUnits === 0 ? "IMPERIAL" : "METRIC",
      absActive: telemetry.BrakeABSactive,
      isOnTrack:
        telemetry.IsOnTrack || telemetry.PlayerTrackSurface !== "NotInWorld",
      isInReplay: telemetry.IsReplayPlaying && !telemetry.IsOnTrackCar,
    },
    entrylist,
  };
}

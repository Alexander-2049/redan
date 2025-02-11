import { z } from "zod";

export const weekendOptionsSchema = z.object({
  NumStarters: z.number(),
  StartingGrid: z.string(),
  QualifyScoring: z.string(),
  CourseCautions: z.string(),
  StandingStart: z.number(),
  ShortParadeLap: z.number(),
  Restarts: z.string(),
  WeatherType: z.string(),
  Skies: z.string(),
  WindDirection: z.string(),
  WindSpeed: z.string(),
  WeatherTemp: z.string(),
  RelativeHumidity: z.string(),
  FogLevel: z.string(),
  TimeOfDay: z.string(),
  Date: z.string(),
  EarthRotationSpeedupFactor: z.number(),
  Unofficial: z.number(),
  CommercialMode: z.string(),
  NightMode: z.string(),
  IsFixedSetup: z.number(),
  StrictLapsChecking: z.string(),
  HasOpenRegistration: z.number(),
  HardcoreLevel: z.number(),
  NumJokerLaps: z.number(),
  IncidentLimit: z.string(),
  FastRepairsLimit: z.string(),
  GreenWhiteCheckeredLimit: z.number(),
});

export const telemetryOptionsSchema = z.object({
  TelemetryDiskFile: z.string(),
});

export const resultsFastestLapSchema = z.object({
  CarIdx: z.number(),
  FastestLap: z.number(),
  FastestTime: z.number(),
});

export const cameraSchema = z.object({
  CameraNum: z.number(),
  CameraName: z.string(),
});

export const frequencySchema = z.object({
  FrequencyNum: z.number(),
  FrequencyName: z.string(),
  Priority: z.number(),
  CarIdx: z.number(),
  EntryIdx: z.number(),
  ClubID: z.number(),
  CanScan: z.number(),
  CanSquawk: z.number(),
  Muted: z.number(),
  IsMutable: z.number(),
  IsDeletable: z.number(),
});

export const driverSchema = z.object({
  CarIdx: z.number(),
  UserName: z.string(),
  AbbrevName: z.string().nullable(),
  Initials: z.string().nullable(),
  UserID: z.number(),
  TeamID: z.number(),
  TeamName: z.string(),
  CarNumber: z.string(),
  CarNumberRaw: z.number(),
  CarPath: z.string(),
  CarClassID: z.number(),
  CarID: z.number(),
  CarIsPaceCar: z.number(),
  CarIsAI: z.number(),
  CarIsElectric: z.number(),
  CarScreenName: z.string(),
  CarScreenNameShort: z.string(),
  CarClassShortName: z.string().nullable(),
  CarClassRelSpeed: z.number(),
  CarClassLicenseLevel: z.number(),
  CarClassMaxFuelPct: z.string(),
  CarClassWeightPenalty: z.string(),
  CarClassPowerAdjust: z.string(),
  CarClassDryTireSetLimit: z.string(),
  CarClassColor: z.number(),
  CarClassEstLapTime: z.number(),
  IRating: z.number(),
  LicLevel: z.number(),
  LicSubLevel: z.number(),
  LicString: z.string(),
  LicColor: z.number(),
  IsSpectator: z.number(),
  CarDesignStr: z.string(),
  HelmetDesignStr: z.string(),
  SuitDesignStr: z.string(),
  BodyType: z.number(),
  FaceType: z.number(),
  HelmetType: z.number(),
  CarNumberDesignStr: z.string(),
  CarSponsor_1: z.number(),
  CarSponsor_2: z.number(),
  CurDriverIncidentCount: z.number(),
  TeamIncidentCount: z.number(),
});

export const sectorSchema = z.object({
  SectorNum: z.number(),
  SectorStartPct: z.number(),
});

export const tireTypeSchema = z.object({
  TireType: z.string(),
});

export const leftFrontSchema = z.object({
  StartingPressure: z.string(),
  LastHotPressure: z.string(),
  LastTempsOMI: z.string(),
  TreadRemaining: z.string(),
});

export const leftRearSchema = z.object({
  StartingPressure: z.string(),
  LastHotPressure: z.string(),
  LastTempsOMI: z.string(),
  TreadRemaining: z.string(),
});

export const rightFrontSchema = z.object({
  StartingPressure: z.string(),
  LastHotPressure: z.string(),
  LastTempsIMO: z.string(),
  TreadRemaining: z.string(),
});

export const rightRearSchema = z.object({
  StartingPressure: z.string(),
  LastHotPressure: z.string(),
  LastTempsIMO: z.string(),
  TreadRemaining: z.string(),
});

export const frontSchema = z.object({
  ArbSetting: z.number(),
  ToeIn: z.string(),
  FuelLevel: z.string(),
  CrossWeight: z.string(),
  FrontWeight: z.string(),
});

export const leftFront2Schema = z.object({
  CornerWeight: z.string(),
  RideHeight: z.string(),
  SpringPerchOffset: z.string(),
  Camber: z.string(),
});

export const leftRear2Schema = z.object({
  CornerWeight: z.string(),
  RideHeight: z.string(),
  SpringPerchOffset: z.string(),
  Camber: z.string(),
  ToeIn: z.string(),
});

export const brakesInCarDialsSchema = z.object({
  DisplayPage: z.string(),
  BrakePressureBias: z.string(),
});

export const rightFront2Schema = z.object({
  CornerWeight: z.string(),
  RideHeight: z.string(),
  SpringPerchOffset: z.string(),
  Camber: z.string(),
});

export const rightRear2Schema = z.object({
  CornerWeight: z.string(),
  RideHeight: z.string(),
  SpringPerchOffset: z.string(),
  Camber: z.string(),
  ToeIn: z.string(),
});

export const rearSchema = z.object({
  ArbSetting: z.number(),
  WingSetting: z.number(),
});

export const weekendInfoSchema = z.object({
  TrackName: z.string(),
  TrackID: z.number(),
  TrackLength: z.string(),
  TrackLengthOfficial: z.string(),
  TrackDisplayName: z.string(),
  TrackDisplayShortName: z.string(),
  TrackConfigName: z.string().nullable(),
  TrackCity: z.string(),
  TrackCountry: z.string(),
  TrackAltitude: z.string(),
  TrackLatitude: z.string(),
  TrackLongitude: z.string(),
  TrackNorthOffset: z.string(),
  TrackNumTurns: z.number(),
  TrackPitSpeedLimit: z.string(),
  TrackType: z.string(),
  TrackDirection: z.string(),
  TrackWeatherType: z.string(),
  TrackSkies: z.string(),
  TrackSurfaceTemp: z.string(),
  TrackAirTemp: z.string(),
  TrackAirPressure: z.string(),
  TrackWindVel: z.string(),
  TrackWindDir: z.string(),
  TrackRelativeHumidity: z.string(),
  TrackFogLevel: z.string(),
  TrackPrecipitation: z.string(),
  TrackCleanup: z.number(),
  TrackDynamicTrack: z.number(),
  TrackVersion: z.string(),
  SeriesID: z.number(),
  SeasonID: z.number(),
  SessionID: z.number(),
  SubSessionID: z.number(),
  LeagueID: z.number(),
  Official: z.number(),
  RaceWeek: z.number(),
  EventType: z.string(),
  Category: z.string(),
  SimMode: z.string(),
  TeamRacing: z.number(),
  MinDrivers: z.number(),
  MaxDrivers: z.number(),
  DCRuleSet: z.string(),
  QualifierMustStartRace: z.number(),
  NumCarClasses: z.number(),
  NumCarTypes: z.number(),
  HeatRacing: z.number(),
  BuildType: z.string(),
  BuildTarget: z.string(),
  BuildVersion: z.string(),
  RaceFarm: z.string().nullable(),
  WeekendOptions: weekendOptionsSchema,
  TelemetryOptions: telemetryOptionsSchema,
});

export const sessionSchema = z.object({
  SessionNum: z.number(),
  SessionLaps: z.string(),
  SessionTime: z.string(),
  SessionNumLapsToAvg: z.number(),
  SessionType: z.string(),
  SessionTrackRubberState: z.string(),
  SessionName: z.string(),
  SessionSubType: z.string().nullable(),
  SessionSkipped: z.number(),
  SessionRunGroupsUsed: z.number(),
  SessionEnforceTireCompoundChange: z.number(),
  ResultsFastestLap: z.array(resultsFastestLapSchema),
  ResultsAverageLapTime: z.number(),
  ResultsNumCautionFlags: z.number(),
  ResultsNumCautionLaps: z.number(),
  ResultsNumLeadChanges: z.number(),
  ResultsLapsComplete: z.number(),
  ResultsOfficial: z.number(),
});

export const groupSchema = z.object({
  GroupNum: z.number(),
  GroupName: z.string(),
  Cameras: z.array(cameraSchema),
  IsScenic: z.boolean().optional(),
});

export const radioSchema = z.object({
  RadioNum: z.number(),
  HopCount: z.number(),
  NumFrequencies: z.number(),
  TunedToFrequencyNum: z.number(),
  ScanningIsOn: z.number(),
  Frequencies: z.array(frequencySchema),
});

export const driverInfoSchema = z.object({
  DriverCarIdx: z.number(),
  DriverUserID: z.number(),
  PaceCarIdx: z.number(),
  DriverHeadPosX: z.number(),
  DriverHeadPosY: z.number(),
  DriverHeadPosZ: z.number(),
  DriverCarIsElectric: z.number(),
  DriverCarIdleRPM: z.number(),
  DriverCarRedLine: z.number(),
  DriverCarEngCylinderCount: z.number(),
  DriverCarFuelKgPerLtr: z.number(),
  DriverCarFuelMaxLtr: z.number(),
  DriverCarMaxFuelPct: z.number(),
  DriverCarGearNumForward: z.number(),
  DriverCarGearNeutral: z.number(),
  DriverCarGearReverse: z.number(),
  DriverCarSLFirstRPM: z.number(),
  DriverCarSLShiftRPM: z.number(),
  DriverCarSLLastRPM: z.number(),
  DriverCarSLBlinkRPM: z.number(),
  DriverCarVersion: z.string(),
  DriverPitTrkPct: z.number(),
  DriverCarEstLapTime: z.number(),
  DriverSetupName: z.string(),
  DriverSetupIsModified: z.number(),
  DriverSetupLoadTypeName: z.string(),
  DriverSetupPassedTech: z.number(),
  DriverIncidentCount: z.number(),
  Drivers: z.array(driverSchema),
});

export const splitTimeInfoSchema = z.object({
  Sectors: z.array(sectorSchema),
});

export const tiresAeroSchema = z.object({
  TireType: tireTypeSchema,
  LeftFront: leftFrontSchema,
  LeftRear: leftRearSchema,
  RightFront: rightFrontSchema,
  RightRear: rightRearSchema,
});

export const chassisSchema = z.object({
  Front: frontSchema,
  LeftFront: leftFront2Schema,
  LeftRear: leftRear2Schema,
  BrakesInCarDials: brakesInCarDialsSchema,
  RightFront: rightFront2Schema,
  RightRear: rightRear2Schema,
  Rear: rearSchema,
});

export const sessionInfoFieldSchema = z.object({
  Sessions: z.array(sessionSchema),
});

export const cameraInfoSchema = z.object({
  Groups: z.array(groupSchema),
});

export const radioInfoSchema = z.object({
  SelectedRadioNum: z.number(),
  Radios: z.array(radioSchema),
});

export const carSetupSchema = z.object({
  UpdateCount: z.number(),
  TiresAero: tiresAeroSchema,
  Chassis: chassisSchema,
});

export const sessionInfoSchema = z.object({
  WeekendInfo: weekendInfoSchema,
  SessionInfo: sessionInfoFieldSchema,
  CameraInfo: cameraInfoSchema,
  RadioInfo: radioInfoSchema,
  DriverInfo: driverInfoSchema,
  SplitTimeInfo: splitTimeInfoSchema,
  CarSetup: carSetupSchema,
});

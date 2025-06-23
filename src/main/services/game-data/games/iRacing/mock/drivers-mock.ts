import { IRacingDriverData } from "../schema";

const FRAME_COUNT = 3;
const DRIVERS_COUNT = 5;

function generateName(i: number): [string, string, string] {
  const first = ["Alex", "Ben", "Chris", "Daniel", "Eli"];
  const last = ["Smith", "Johnson", "Brown", "Williams", "Jones"];
  const middle = ["", "A.", "B.", "C.", "D."];
  return [
    first[i % first.length],
    last[i % last.length],
    middle[i % middle.length],
  ];
}

function calculateLapDistPct(driverIndex: number, frameIndex: number): number {
  const base = (frameIndex * 0.05 + driverIndex * 0.02) % 1;
  return base;
}

function calculateLapDistTotalPct(
  driverIndex: number,
  frameIndex: number,
): number {
  const lapsCompleted = 3 + frameIndex + Math.floor(driverIndex / 2);
  const lapDist = calculateLapDistPct(driverIndex, frameIndex);
  return (lapsCompleted + lapDist) / 10;
}

function calculateIRating(base: number, frameIndex: number): number {
  return base + Math.sin(frameIndex / 2) * 20;
}

function generateDriver(
  driverIndex: number,
  frameIndex: number,
): IRacingDriverData {
  const [firstName, lastName, middleName] = generateName(driverIndex);
  const carId = 100 + driverIndex;
  const carNumber = 10 + driverIndex;
  const lapDistPct = calculateLapDistPct(driverIndex, frameIndex);
  const lapDistTotalPct = calculateLapDistTotalPct(driverIndex, frameIndex);
  const lapsCompleted = Math.floor(lapDistTotalPct * 10);
  const currentLap = lapsCompleted + 1;
  const position = driverIndex + 1;
  const classPosition = driverIndex + 1;
  const baseIRating = 1500 + driverIndex * 100;

  return {
    carId,
    carNumber,
    firstName,
    lastName,
    middleName,
    lapDistPct,
    lapDistTotalPct,
    lapsCompleted,
    currentLap,
    position,
    classPosition,
    isCarOnTrack: true,
    iRating: Math.round(calculateIRating(baseIRating, frameIndex)),
    iRatingChange: Math.round(Math.sin(frameIndex + driverIndex) * 15),
    carClassShortName: "GT3",
    carClassId: 101,
    iRacingLicString: "A 3.56",
    iRacingLicSubLevel: 3,
  };
}

export const iRacingDriversMock: IRacingDriverData[][] = [];

for (let frame = 0; frame < FRAME_COUNT; frame++) {
  const frameDrivers: IRacingDriverData[] = [];
  for (let driver = 0; driver < DRIVERS_COUNT; driver++) {
    frameDrivers.push(generateDriver(driver, frame));
  }
  iRacingDriversMock.push(frameDrivers);
}

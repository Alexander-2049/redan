import Game from "../Game";
import {
  MappedGameData,
  RealtimeGameData,
  DriverElement,
  Session,
} from "../../types/GameData";
import { GameName } from "../../types/GameName";

const EMULATOR_GAME_NAME: GameName = "Emulator"; // Change as needed

const TICK_RATE = 333;

const speedKphArray = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
  180, 190, 200,
];
const rpmArray = [
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000,
];
const gearArray = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
const throttleArray = [0, 0.1, 0.3, 0.6, 1, 0.8, 0.5, 0.2, 0];
const brakeArray = [0, 0.1, 0.25, 0.5, 0.3, 0.1, 0];
const isOnTrackArray = [
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  false,
  true,
];
const isInReplayArray = [
  false,
  false,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
  true,
];

const driverTemplate: DriverElement = {
  carId: 1,
  position: 1,
  classPosition: 1,
  firstName: "Alex",
  lastName: "Emulator",
  lapDistPct: 0,
  lapDistTotalPct: 0,
  isCarOnTrack: true,
};

const sessionTemplate: Session = {
  trackName: "Emulator Raceway",
};

function getMockRealtimeData(frame: number): RealtimeGameData {
  return {
    speedKph: speedKphArray[frame % speedKphArray.length],
    speedMph: speedKphArray[frame % speedKphArray.length] * 0.621371,
    rpm: rpmArray[frame % rpmArray.length],
    gear: gearArray[frame % gearArray.length],
    throttle: throttleArray[frame % throttleArray.length],
    brake: brakeArray[frame % brakeArray.length],
    isOnTrack: isOnTrackArray[frame % isOnTrackArray.length],
    isInReplay: isInReplayArray[frame % isInReplayArray.length],
    displayUnits: "METRIC",
  };
}

function getMockDriversData(frame: number): DriverElement[] {
  return [
    {
      ...driverTemplate,
      position: 1 + (frame % 5),
      lapDistPct: ((frame * 2) % 100) / 100,
      lapDistTotalPct: ((frame * 7) % 1000) / 1000,
      isCarOnTrack: isOnTrackArray[frame % isOnTrackArray.length],
    },
  ];
}

export default class EmulatorGame extends Game {
  private interval: NodeJS.Timeout | null = null;
  private frame = 0;

  connect(): void {
    if (this.interval) return;

    this.isConnected = true;

    this.interval = setInterval(() => {
      const realtime = getMockRealtimeData(this.frame);
      const drivers = getMockDriversData(this.frame);

      const data: MappedGameData = {
        game: EMULATOR_GAME_NAME,
        realtime,
        drivers,
        session: sessionTemplate,
      };

      this.emit("data", data);

      this.isInReplay = !!realtime.isInReplay;
      this.isOnTrack = !!realtime.isOnTrack;

      // Use the longest array length to avoid early wrapping
      const maxLength = Math.max(
        speedKphArray.length,
        rpmArray.length,
        gearArray.length,
        throttleArray.length,
        brakeArray.length,
        isOnTrackArray.length,
        isInReplayArray.length,
      );
      this.frame = (this.frame + 1) % maxLength;
    }, TICK_RATE);
  }

  disconnect(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isConnected = false;
    this.frame = 0;
  }
}

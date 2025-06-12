import { CACHE_PATH } from "@/main/main-constants";
import path from "path";

type CarIdx = number;
type CarId = number;
type LapNumber = number;
type LapDistPct = number;
type SessionTime = number;
type TrackId = number;
type WeatherId = number;
type SessionId = string;
type Lap = {
  samples: Sample[];
  trackId: TrackId;
  carId: CarId;
  weatherId: WeatherId;
};

type Sample = [LapDistPct, SessionTime];
type Laps = Map<LapNumber, Lap>;

interface AddSampleProps {
  lapDistPct: LapDistPct;
  sessionTime: SessionTime;
  lapNumber: LapNumber;
  trackId: TrackId;
  carId: CarId;
  carIdx: CarIdx;
  weatherId: WeatherId;
  sessionId: SessionId;
}

export class LapTimeRecorder {
  private sessionId: SessionId = "";
  private cars: Map<CarIdx, Laps> = new Map();

  private getFilePath(trackId: TrackId, carId: CarId, weatherId: WeatherId) {
    const filePath = path.join(
      CACHE_PATH,
      "iRacing",
      "LapTimeReplays",
      `${trackId}`,
      `${carId}-${weatherId}.json`,
    );
    return filePath;
  }

  public saveLapToCache(lap: Lap) {
    const filePath = this.getFilePath(lap.trackId, lap.carId, lap.weatherId);
    console.log(filePath);
    // ...
  }

  private setSessionId(sessionId: SessionId) {
    if (this.sessionId !== sessionId) {
      this.cars.clear();
      this.sessionId = sessionId;
    }
  }

  public addSample({
    sessionId,
    carId,
    carIdx,
    lapDistPct,
    lapNumber,
    sessionTime,
    trackId,
    weatherId,
  }: AddSampleProps) {
    this.setSessionId(sessionId);

    if (!this.cars.has(carIdx)) {
      this.cars.set(carIdx, new Map());
    }

    const laps = this.cars.get(carIdx);
    if (!laps) return;

    if (!laps.has(lapNumber)) {
      laps.set(lapNumber, {
        samples: [],
        trackId,
        carId,
        weatherId,
      });
    }

    const lap = laps.get(lapNumber);
    if (!lap) return;

    lap.samples.push([lapDistPct, sessionTime]);
  }
}

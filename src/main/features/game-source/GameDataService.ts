import fs from 'fs';
import path from 'path';

import { LoggerService } from '../logger/LoggerService';
import { PathService } from '../paths/PathService';

import { iRacing } from './iracing';

import { Game, GameData } from '@/main/entities/game';
import { GameDataEmitter } from '@/main/entities/game-data-emitter';
import { GameName } from '@/main/shared/types/GameName';

const GAME_DATA_UPDATE_INTERVAL = 1000 / 144;

export class GameDataHandler extends GameDataEmitter {
  private game: Game | null = null;
  private _gameName: GameName | null = null;
  private logger = LoggerService.getLogger('game-source');

  private recording: {
    stream: fs.WriteStream;
    firstChunk: boolean;
    lastWriteTime: number;
    frameInterval: number;
  } | null = null;

  private static readonly games: {
    name: GameName;
    class: new () => Game;
  }[] = [{ name: 'iRacing', class: iRacing }];

  public getMock(tick: number): GameData {
    if (this.game) {
      return this.game.getMock(tick);
    }
    return {
      drivers: [],
      game: 'None',
      realtime: {},
      session: {},
    };
  }

  public getSelectedGame() {
    return this._gameName;
  }

  public selectGame(gameName: GameName | null): boolean {
    if (gameName === this._gameName) return false;

    this.disconnectCurrentGame();

    const gameEntry = GameDataHandler.games.find(g => g.name === gameName);

    if (gameEntry) {
      this.game = new gameEntry.class();
      this._gameName = gameName;
      this.emit('game', this._gameName);
      this.forwardEventsFromGame(this.game);
      this.game.connect(GAME_DATA_UPDATE_INTERVAL);
      return true;
    } else {
      this.game = null;
      this._gameName = gameName;
      this.emit('game', this._gameName);
      return false;
    }
  }

  private forwardEventsFromGame(game: Game) {
    game.on('data', data => {
      this.emit('data', data);
      this.recordData(data);
    });
    game.on('isConnected', state => {
      if (state !== this.isConnected && !state) {
        this.emit('data', {
          drivers: [],
          game: 'iRacing',
          realtime: {},
          session: {},
        });
      }
      this.isConnected = state;
    });
    game.on('isInReplay', state => (this.isInReplay = state));
    game.on('isOnTrack', state => (this.isOnTrack = state));
  }

  private disconnectCurrentGame() {
    if (this.game) {
      this.game.disconnect();
      this.game.removeAllListeners();
      this.game = null;
    }
  }

  /**
   * Start recording to a file
   * @param filename - Optional filename (default: 'recording.json')
   * @param fps - Optional recording FPS (default: 10)
   */
  public startRecording(filename = 'replay.json', fps = 10) {
    if (this.recording) return;

    if (!fs.existsSync(PathService.getPath('REPLAYS'))) {
      fs.mkdirSync(PathService.getPath('REPLAYS'), { recursive: true });
    }

    const filePath = path.join(PathService.getPath('REPLAYS'), filename);
    const stream = fs.createWriteStream(filePath, { flags: 'w' });
    stream.write('[\n');

    this.recording = {
      stream,
      firstChunk: true,
      lastWriteTime: 0,
      frameInterval: 1000 / fps,
    };

    this.logger.info(`[GameDataHandler] Started recording to ${filePath} at ${fps} FPS`);
  }

  public stopRecording() {
    if (!this.recording) return;

    const { stream } = this.recording;
    stream.write('\n]');
    stream.end();
    this.recording = null;

    this.logger.info('[GameDataHandler] Stopped recording');
  }

  private recordData(data: GameData) {
    if (!this.recording) return;

    const now = Date.now();
    if (now - this.recording.lastWriteTime < this.recording.frameInterval) {
      return; // Throttle based on desired FPS
    }

    const { stream, firstChunk } = this.recording;
    const json = JSON.stringify(data);

    if (!firstChunk) {
      stream.write(',\n');
    }

    stream.write(json);
    this.recording.firstChunk = false;
    this.recording.lastWriteTime = now;
  }

  public get gameName() {
    return this._gameName;
  }
}

const gameDataHandler = new GameDataHandler();
export default gameDataHandler;

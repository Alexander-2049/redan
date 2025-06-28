import { z } from 'zod';
import { GameName } from '../shared/types/GameName';
import { Overlay } from './Overlay';
import { layoutFileSchema } from '../shared/schemas/layout-file-schema';
import { JsonFileService } from '../features/json-files/JsonFileService';
import { LayoutOverlay } from '../shared/types/LayoutOverlay';
import { PathService } from '../features/paths/PathService';

export interface LayoutProperties {
  filename: string;
  game: GameName;
  screen: {
    width: number;
    height: number;
  };
}

export class Layout {
  private _game: GameName = 'None'; // Defines which game this layout used for
  private _title: string | null = null;
  private _filename: string | null = null;
  private _overlays: Overlay[] = [];
  private _screenWidth: number = 0;
  private _screenHeight: number = 0;

  constructor(props: LayoutProperties) {
    this._game = props.game;
    this._filename = props.filename;
    this._screenWidth = props.screen.width;
    this._screenHeight = props.screen.height;
  }

  get screen(): { readonly width: number; readonly height: number } {
    return {
      width: this._screenWidth,
      height: this._screenHeight,
    };
  }

  save() {
    return new Promise((resolve, reject) => {
      if (this._game === 'None') return reject('Game name is not specified');
      if (this.screen.width === 0 || this.screen.height === 0)
        return reject('Screen dimentions are not specified');
      if (this._filename === null) return reject('Filename is not specified');
      if (this._title === null) return reject('Title is not specified');

      const data: z.infer<typeof layoutFileSchema> = {
        game: this._game,
        title: this._title,
        overlays: this._overlays.map(overlay => {
          return this.getPropertiesFromOverlay(overlay);
        }),
        screen: {
          height: this.screen.height,
          width: this.screen.width,
        },
      };
      layoutFileSchema.parse({});

      JsonFileService.write(
        JsonFileService.path.join(PathService.getPath('LAYOUTS'), this._filename),
        data,
      );
    });
  }

  private getPropertiesFromOverlay(overlay: Overlay): LayoutOverlay {
    return overlay.properties;
  }
}

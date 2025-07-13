import { GameName } from '@/main/shared/types/GameName';

export interface LayoutProperties {
  filename: string;
  game: GameName;
  screen: {
    width: number;
    height: number;
  };
}

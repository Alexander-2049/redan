import { GameName } from '@/main/shared/types/GameName';

export interface LayoutProperties {
  filename: string;
  title?: string;
  game: GameName;
  screen: {
    width: number;
    height: number;
  };
}

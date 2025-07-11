import { useCallback } from 'react';

import { useCreateLayout } from '../api/layouts/create-layout';
import { useLayouts } from '../api/layouts/get-layouts';
import { LayoutSelector } from '../components/my-layouts/layout-selector';

import { GameName } from '@/main/shared/types/GameName';
import { getRandomRacingWords } from '@/main/shared/utils/get-random-racing-words';

const LayoutsRoute = () => {
  const { data } = useLayouts('iRacing');
  const { mutate: createLayout } = useCreateLayout();

  const handleCreateLayout = useCallback(() => {
    const game: GameName = 'iRacing';
    const words = getRandomRacingWords();
    const filename = `${words[0]}${words[1]}${words[3]}.json`;

    createLayout({ filename, game, title: filename });
  }, [createLayout]);

  return (
    <div className="flex h-full w-full flex-row">
      <LayoutSelector layouts={data} handleCreateLayout={handleCreateLayout} />
    </div>
  );
};

export default LayoutsRoute;

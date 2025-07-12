import { useCallback, useMemo } from 'react';

import { useCreateLayout } from '../api/layouts/create-layout';
import { useDeleteLayout } from '../api/layouts/delete-layout';
import { useLayouts } from '../api/layouts/get-layouts';
import { useLayoutsOrder } from '../api/layouts/get-layouts-order';
import { useReorderLayouts } from '../api/layouts/reorder-layouts';
import { useUpdateLayout } from '../api/layouts/update-layout';
import { LayoutSelector } from '../components/my-layouts/layout-selector';

import { GameName } from '@/main/shared/types/GameName';
import { getRandomRacingWords } from '@/main/shared/utils/get-random-racing-words';

const LayoutsRoute = () => {
  const game: GameName = 'iRacing';

  const { data: layouts } = useLayouts(game);
  const { data: layoutOrder } = useLayoutsOrder(game);
  const { mutate: createLayout } = useCreateLayout();
  const { mutate: reorderLayouts } = useReorderLayouts();
  const { mutate: deleteLayout } = useDeleteLayout();
  const { mutate: updateLayout } = useUpdateLayout();

  const sortedLayouts = useMemo(() => {
    if (!layouts || !layoutOrder) return layouts || [];

    const orderMap = new Map(layoutOrder.map((filename, index) => [filename, index]));

    return [...layouts].sort((a, b) => {
      const indexA = orderMap.get(a.filename) ?? Infinity;
      const indexB = orderMap.get(b.filename) ?? Infinity;
      return indexA - indexB;
    });
  }, [layouts, layoutOrder]);

  const handleCreateLayout = useCallback(() => {
    const words = getRandomRacingWords();
    const filename = `${words[0]}${words[1]}${words[3]}.json`;

    createLayout({ filename, game, title: filename });
  }, [createLayout, game]);

  const handleReorderLayouts = useCallback(
    (filenames: string[]) => {
      reorderLayouts({ filenames, game });
    },
    [reorderLayouts, game],
  );

  const handleDeleteLayout = useCallback((filename: string) => {
    deleteLayout({ filename, game });
  }, []);

  const handleRenameLayout = useCallback(
    (filename: string, newTitle: string) => {
      const layout = layouts?.find(e => e.filename === filename);
      if (!layout) return;
      updateLayout({
        filename,
        game,
        data: {
          ...layout,
          title: newTitle,
        },
      });
    },
    [layouts],
  );

  return (
    <div className="flex h-full w-full flex-row">
      <LayoutSelector
        layouts={sortedLayouts}
        handleCreateLayout={handleCreateLayout}
        handleReorderLayouts={handleReorderLayouts}
        handleDeleteLayout={handleDeleteLayout}
        handleRenameLayout={handleRenameLayout}
      />
    </div>
  );
};

export default LayoutsRoute;

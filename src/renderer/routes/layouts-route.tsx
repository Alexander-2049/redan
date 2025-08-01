import { useCallback, useMemo, useState } from 'react';

import { useCreateLayout } from '../api/layouts/create-layout';
import { useDeleteLayout } from '../api/layouts/delete-layout';
import { useActiveLayout } from '../api/layouts/get-active-layout';
import { useLayouts } from '../api/layouts/get-layouts';
import { useLayoutsOrder } from '../api/layouts/get-layouts-order';
import { useReorderLayouts } from '../api/layouts/reorder-layouts';
import { useSetActiveLayout } from '../api/layouts/set-active-layout';
import { useUpdateLayout } from '../api/layouts/update-layout';
import { LayoutSelector } from '../components/my-layouts/layout-selector';
import OverlayList from '../components/my-layouts/overlay-list/overlay-list';
import OverlaySelector from '../components/my-layouts/overlay-selector/overlay-selector';

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
  const { data: activeLayout } = useActiveLayout();
  const { mutate: setActiveLayout } = useSetActiveLayout();

  const [overlayOpen, setOverlayOpen] = useState<string | null>(null);
  const [isOverlaySelectorOpen, setIsOverlaySelectorOpen] = useState(true);

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

  const handleSelectLayout = useCallback(
    (filename: string) => {
      setActiveLayout({ filename, game });
    },
    [setActiveLayout, game],
  );

  const handleOverlayOpen = useCallback(
    (overlayFolderName: string) => {
      setOverlayOpen(overlayFolderName);
    },
    [setOverlayOpen],
  );

  const handleOverlayClose = useCallback(() => {
    setOverlayOpen(null);
  }, [setOverlayOpen]);

  const handleOpenOverlaySelector = useCallback(() => {
    setIsOverlaySelectorOpen(true);
  }, [setIsOverlaySelectorOpen]);

  const handleCloseOverlaySelector = useCallback(() => {
    setIsOverlaySelectorOpen(false);
  }, [setIsOverlaySelectorOpen]);

  return (
    <div className="flex h-full w-full flex-row justify-between">
      <LayoutSelector
        layouts={sortedLayouts}
        activeLayoutFilename={activeLayout?.filename}
        handleCreateLayout={handleCreateLayout}
        handleReorderLayouts={handleReorderLayouts}
        handleDeleteLayout={handleDeleteLayout}
        handleRenameLayout={handleRenameLayout}
        handleSelectLayout={handleSelectLayout}
      />
      <OverlayList overlays={[]} openOverlay={handleOverlayOpen} />
      <OverlaySelector isOpen={isOverlaySelectorOpen} close={handleCloseOverlaySelector} />
    </div>
  );
};

export default LayoutsRoute;

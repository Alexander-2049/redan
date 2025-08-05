import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCreateLayout } from '../api/layouts/create-layout';
import { useDeleteLayout } from '../api/layouts/delete-layout';
import { useActiveLayout } from '../api/layouts/get-active-layout';
import { useLayouts } from '../api/layouts/get-layouts';
import { useLayoutsOrder } from '../api/layouts/get-layouts-order';
import { useReorderLayouts } from '../api/layouts/reorder-layouts';
import { useSetActiveLayout } from '../api/layouts/set-active-layout';
import { useUpdateLayout } from '../api/layouts/update-layout';
import { useOverlayList } from '../api/overlays/get-overlays';
import { useWorkshopItems } from '../api/steam/workshop-get-items';
import { LayoutSelector } from '../components/my-layouts/layout-selector';
import OverlayList from '../components/my-layouts/overlay-list/overlay-list';
import OverlaySelector from '../components/my-layouts/overlay-selector/overlay-selector';

import { GameName } from '@/main/shared/types/GameName';
import { getRandomRacingWords } from '@/main/shared/utils/get-random-racing-words';
import { HTTP_SERVER_PORT } from '@/shared/constants';
import { LayoutOverlayWithPreviewUrl as LayoutOverlay } from '@/shared/types/LayoutOverlayWithPreviewUrl';
import type { OverlayExtended } from '@/shared/types/OverlayExtended';
import type { SettingsMap } from '@/shared/types/SettingValue';

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
  const {
    data: overlays = [],
    isLoading: isOverlaysLoading,
    error: overlaysError,
  } = useOverlayList();
  const { data: workshopItemsResult } = useWorkshopItems(
    overlays.map(overlay => overlay.folderName),
  );

  const [overlayOpen, setOverlayOpen] = useState<string | null>(null);
  const [isOverlaySelectorOpen, setIsOverlaySelectorOpen] = useState(false);
  const [selectedOverlayForSettings, setSelectedOverlayForSettings] =
    useState<LayoutOverlay | null>(null);
  const [overlaysWithWorkshopData, setOverlaysWithWorkshopData] = useState<OverlayExtended[]>([]);

  useEffect(() => {
    setOverlaysWithWorkshopData(
      overlays.map(overlay => {
        const workshopItem = workshopItemsResult?.items.find(
          item => item?.publishedFileId.toString() === overlay.folderName,
        );

        return {
          ...overlay,
          workshop: workshopItem || undefined,
        };
      }),
    );
  }, [overlays, workshopItemsResult]);

  const sortedLayouts = useMemo(() => {
    if (!layouts || !layoutOrder) return layouts || [];

    const orderMap = new Map(layoutOrder.map((filename, index) => [filename, index]));

    return [...layouts].sort((a, b) => {
      const indexA = orderMap.get(a.filename) ?? Infinity;
      const indexB = orderMap.get(b.filename) ?? Infinity;
      return indexA - indexB;
    });
  }, [layouts, layoutOrder]);

  const handleAddOverlay = (overlay: OverlayExtended) => {
    if (!activeLayout || !overlay.manifest) return;

    const id = Date.now().toString(36) + Math.random().toString(36); // unique id
    const x = 100; // random value between 50 and 200
    const y = 100; // random value between 50 and 200
    const width = overlay.manifest.dimentions.defaultWidth;
    const height = overlay.manifest.dimentions.defaultHeight;

    updateLayout({
      filename: activeLayout.config.filename,
      game: activeLayout.config.game,
      data: {
        ...activeLayout.data,
        overlays: [
          ...activeLayout.data.overlays,
          {
            id,
            title: overlay.manifest.title,
            baseUrl: `http://localhost:${HTTP_SERVER_PORT}/overlays/${overlay.folderName}/index.html`,
            folderName: overlay.folderName,
            position: {
              x,
              y,
            },
            size: {
              width,
              height,
            },
            settings: [],
            visible: true,
          },
        ],
      },
    });
    // const newLayoutOverlay: LayoutOverlay = {
    //   id: `overlay-${Date.now()}`,
    //   overlayId: overlay.folderName,
    //   title: overlay.manifest.name,
    //   author: overlay.manifest.author,
    //   enabled: true,
    //   position: { x: 100, y: 100 },
    //   size: {
    //     width: overlay.manifest.dimentions.defaultWidth,
    //     height: overlay.manifest.dimentions.defaultHeight,
    //   },
    //   settings:
    //     overlay.manifest.settings?.reduce((acc, setting) => {
    //       acc[setting.id] = setting.defaultValue;
    //       return acc;
    //     }, {} as SettingsMap) || {},
    //   manifest: {
    //     dimentions: overlay.manifest.dimentions,
    //     settings: overlay.manifest.settings || [],
    //   },
    // };
    // setLayoutOverlays(prev => [...prev, newLayoutOverlay]);
  };

  const handleDeleteOverlay = (overlayId: string) => {
    if (!activeLayout || !game) return;

    updateLayout({
      filename: activeLayout.config.filename,
      game,
      data: {
        ...activeLayout.data,
        overlays: activeLayout.data.overlays.filter(overlay => overlay.id !== overlayId),
      },
    });
  };

  const handleOverlayClick = (overlay: LayoutOverlay) => {
    setSelectedOverlayForSettings(overlay);
  };

  const handleSaveSettings = (overlayId: string, settings: SettingsMap) => {
    // setLayoutOverlays(prev =>
    //   prev.map(overlay => (overlay.id === overlayId ? { ...overlay, settings } : overlay)),
    // );
  };

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
    <div className="relative h-full w-full overflow-hidden">
      <div className="flex h-full">
        <div className="min-w-0 flex-1">
          <LayoutSelector
            layouts={sortedLayouts}
            activeLayoutFilename={activeLayout?.config?.filename}
            handleCreateLayout={handleCreateLayout}
            handleReorderLayouts={handleReorderLayouts}
            handleDeleteLayout={handleDeleteLayout}
            handleRenameLayout={handleRenameLayout}
            handleSelectLayout={handleSelectLayout}
          />
        </div>
        <OverlayList
          overlays={activeLayout?.data.overlays || []}
          onOverlayClick={handleOverlayClick}
          onDeleteOverlay={handleDeleteOverlay}
          onAddOverlay={handleOpenOverlaySelector}
        />
      </div>

      <OverlaySelector
        isOpen={isOverlaySelectorOpen}
        close={() => setIsOverlaySelectorOpen(false)}
        overlays={overlaysWithWorkshopData}
        isLoading={isOverlaysLoading}
        error={overlaysError}
        onAddOverlay={handleAddOverlay}
      />

      {/* <OverlaySettingsPopup
        overlay={selectedOverlayForSettings}
        isOpen={!!selectedOverlayForSettings}
        onClose={() => setSelectedOverlayForSettings(null)}
        onSave={handleSaveSettings}
      /> */}
    </div>
  );
};

export default LayoutsRoute;

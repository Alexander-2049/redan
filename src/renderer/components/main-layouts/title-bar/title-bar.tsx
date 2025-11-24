import { Minus, X, Square } from '@mynaui/icons-react';

import { useBuildVersion } from '@/renderer/api/app/get-build-version';
import { cn } from '@/renderer/lib/utils';
import { ASSETS_ROUTE } from '@/shared/constants';

export const TitleBar = () => {
  const buttonClassName =
    'flex h-full w-12 items-center justify-center hover:cursor-default transition-colors duration-200';
  const buttonHoverEffect = 'hover:bg-slate-300';
  const closeButtonHoverEffect = 'hover:bg-red-500';
  const iconSize = 16;

  const { data: buildVersion } = useBuildVersion();

  return (
    <div className={cn('drag flex h-9 w-full shrink-0 flex-row justify-between bg-slate-200')}>
      <div className="flex grow">
        <div className="flex items-center gap-1">
          <div className="ml-1.5 flex aspect-square h-full items-center justify-center p-1.5">
            <img src={`${ASSETS_ROUTE}/logo.svg`} />
          </div>
          <span className="text-muted-foreground font-sans text-xl">Redan</span>
        </div>
        <span className="text-muted-foreground m-auto inline-block grow text-center">
          Build {buildVersion}
        </span>
      </div>
      <div className="flex h-full flex-row">
        <button
          className={[buttonClassName, buttonHoverEffect].join(' ')}
          onClick={() => {
            window.actions.minimize();
          }}
        >
          <Minus width={iconSize} />
        </button>
        <button
          className={[buttonClassName, buttonHoverEffect].join(' ')}
          onClick={() => {
            window.actions.restore();
          }}
        >
          <Square width={iconSize / 1.3} />
        </button>
        <button
          className={[buttonClassName, closeButtonHoverEffect].join(' ')}
          onClick={() => {
            window.actions.close();
          }}
        >
          <X width={iconSize} />
        </button>
      </div>
    </div>
  );
};

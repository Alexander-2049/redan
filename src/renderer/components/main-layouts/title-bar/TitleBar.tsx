import { Minus, X, Square } from '@mynaui/icons-react';

import { cn } from '@/renderer/lib/utils';

export const TitleBar = () => {
  const buttonClassName =
    'flex h-full w-12 items-center justify-center hover:cursor-default transition-colors duration-200';
  const buttonHoverEffect = 'hover:bg-slate-300';
  const closeButtonHoverEffect = 'hover:bg-red-500';
  const iconSize = 16;

  return (
    <div className={cn('drag flex h-9 w-full shrink-0 flex-row justify-between bg-slate-200')}>
      <div className="grow"></div>
      <div className="flex h-full flex-row">
        <button
          className={[buttonClassName, buttonHoverEffect].join(' ')}
          onClick={() => {
            window.action.minimize();
          }}
        >
          <Minus width={iconSize} />
        </button>
        <button
          className={[buttonClassName, buttonHoverEffect].join(' ')}
          onClick={() => {
            window.action.restore();
          }}
        >
          <Square width={iconSize / 1.3} />
        </button>
        <button
          className={[buttonClassName, closeButtonHoverEffect].join(' ')}
          onClick={() => {
            window.action.close();
          }}
        >
          <X width={iconSize} />
        </button>
      </div>
    </div>
  );
};

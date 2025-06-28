import { useState } from 'react';
import { Lock, Unlock, ChevronUp } from 'lucide-react';
import { ASSETS_SERVER_PORT } from '@/shared/constants';
import { useSelectedGame } from '../api/game-select/get-selected-game';
import { useSetSelectedGame } from '../api/game-select/set-selected-game';
import { GameName } from '@/main/_/game-data/types/game-name-schema';
import { useOverlaysLocked } from '../api/overlays-windows-locker/get-overlays-lock';
import { useSetOverlaysLocked } from '../api/overlays-windows-locker/set-overlays-lock';

interface Game {
  name: GameName;
  logo: string;
}

const games: Game[] = [
  {
    name: 'iRacing',
    logo: `http://localhost:${ASSETS_SERVER_PORT}/images/logo-iracing.png`,
  },
];

export default function GameSelect() {
  const selectedGame = useSelectedGame();
  const { mutate: setSelectedGame } = useSetSelectedGame();

  const isLocked = useOverlaysLocked();
  const { mutate: setIsLocked } = useSetOverlaysLocked();

  const [isExpanded, setIsExpanded] = useState(false);

  const selectedGameData = games.find(game => game.name === selectedGame.data);

  const handleGameSelect = (gameName: GameName) => {
    setSelectedGame({ gameName });
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleLock = () => {
    setIsLocked({
      isLocked: !isLocked.data,
    });
  };

  if (selectedGame.isLoading || isLocked.isLoading) return;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className={`relative transition-all duration-300 ease-out ${isExpanded ? 'mb-2' : ''}`}>
        {/* Expanded Game List */}
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 transition-all duration-300 ease-out ${
            isExpanded
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-4 opacity-0'
          }`}
        >
          <div className="border-border/50 bg-background/90 flex items-center gap-2 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-1">
              {games.map(game => (
                <button
                  key={game.name}
                  onClick={() => handleGameSelect(game.name)}
                  className={`group hover:bg-accent/50 relative flex min-w-0 flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 hover:scale-105 ${
                    selectedGame.data === game.name ? 'bg-primary/10 ring-primary/20 ring-2' : ''
                  }`}
                >
                  {/* Game Logo Container */}
                  <div className="bg-muted/50 group-hover:ring-primary/30 relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg ring-2 ring-transparent transition-all duration-200">
                    <img
                      src={game.logo || '/placeholder.svg'}
                      alt={`${game.name} logo`}
                      className="object-cover transition-transform duration-200 group-hover:scale-110"
                      sizes="48px"
                    />
                    {/* Hover overlay */}
                    <div className="bg-primary/0 group-hover:bg-primary/10 absolute inset-0 transition-colors duration-200" />
                  </div>

                  {/* Game Name */}
                  <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium whitespace-nowrap transition-colors duration-200">
                    {game.name}
                  </span>

                  {/* Selection indicator */}
                  {selectedGame.data === game.name && (
                    <div className="bg-primary absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-all duration-200" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Control Bar */}
        <div className="border-border/50 bg-background/90 flex items-center gap-2 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl">
          {/* Lock/Unlock Button */}
          <button
            onClick={toggleLock}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 ${
              isLocked.data
                ? 'bg-red-500/10 text-red-500 ring-2 ring-red-500/20 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-500 ring-2 ring-green-500/20 hover:bg-green-500/20'
            }`}
            title={isLocked.data ? 'Unlock Overlays' : 'Lock Overlays'}
          >
            {isLocked.data ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
          </button>

          {/* Separator */}
          <div className="bg-border/50 h-8 w-px" />

          {/* Selected Game Display */}
          {selectedGameData && (
            <button
              onClick={toggleExpanded}
              className="group hover:bg-accent/50 flex items-center gap-3 rounded-xl p-2 transition-all duration-200"
            >
              {/* Selected Game Logo */}
              <div className="bg-muted/50 relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={selectedGameData.logo || '/placeholder.svg'}
                  alt={`${selectedGameData.name} logo`}
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              {/* Selected Game Info */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{selectedGameData.name}</span>
                <span className="text-muted-foreground text-xs">
                  {isLocked.data ? 'Overlays Locked' : 'Overlays Unlocked'}
                </span>
              </div>

              {/* Expand/Collapse Icon */}
              <ChevronUp
                className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="absolute -top-2 -right-2">
          <div
            className={`h-3 w-3 rounded-full ${isLocked.data ? 'bg-red-500' : 'bg-green-500'} shadow-lg`}
          >
            <div
              className={`h-3 w-3 animate-ping rounded-full ${isLocked.data ? 'bg-red-500' : 'bg-green-500'}`}
            />
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="from-primary/20 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-t via-transparent to-transparent blur-xl" />
    </div>
  );
}

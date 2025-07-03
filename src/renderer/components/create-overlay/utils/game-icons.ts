// Temporary game icons - replace with real ones later
export const getGameIcon = (gameName: string): string => {
  const icons: Record<string, string> = {
    iRacing: '🏎️',
    'Assetto Corsa': '🏁',
    'Assetto Corsa Competizione': '🏆',
    'F1 23': '🏎️',
    'Gran Turismo': '🎮',
    'Forza Motorsport': '🚗',
    'rFactor 2': '🏁',
    'Project CARS': '🚙',
    'Dirt Rally': '🚗',
    'BeamNG.drive': '🚗',
  };

  return icons[gameName] || '🎮';
};

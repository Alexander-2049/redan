export function toValidWindowsFileName(input: string): string {
  const reservedNames = new Set([
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ]);

  // Remove control characters manually
  let cleaned = [...input]
    .filter(char => char >= ' ' && char <= '~') // Keep only printable ASCII
    .join('');

  // Replace reserved characters with underscores
  cleaned = cleaned.replace(/[<>:"/\\|?*]/g, '_');

  // Remove trailing dots or spaces
  cleaned = cleaned.replace(/[. ]+$/, '');

  cleaned = cleaned.trim();

  // Avoid reserved names
  if (reservedNames.has(cleaned.toUpperCase())) {
    cleaned = '_' + cleaned;
  }

  // Truncate to 255 characters
  if (cleaned.length > 255) {
    cleaned = cleaned.slice(0, 255);
  }

  return cleaned || 'untitled';
}

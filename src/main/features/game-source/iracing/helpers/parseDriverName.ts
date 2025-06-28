export function parseDriverName(fullName: string) {
  const parts = fullName.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts[parts.length - 1] || '';
  const middleName = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';

  return { firstName, middleName, lastName };
}

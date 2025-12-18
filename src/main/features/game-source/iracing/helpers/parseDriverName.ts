export function parseDriverName(fullName: string | null) {
  if (!fullName) {
    return { firstName: '', middleName: '', lastName: '' };
  }

  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(p => p.length > 0);

  if (parts.length === 0) {
    return { firstName: '', middleName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], middleName: '', lastName: '' };
  }

  if (parts.length === 2) {
    return { firstName: parts[0], middleName: '', lastName: parts[1] };
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

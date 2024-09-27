export function formatDateAndTime(dateString: any, mode: 'date' | 'time') {
  const date = new Date(dateString);
  
  if (mode === 'date') {
    return date.toISOString().split('T')[0];
  } else if (mode === 'time') {
    return date.toTimeString().split(' ')[0];
  }
  return '';
}

export function timeToTimestamp(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, seconds || 0, 0);
  return now.getTime();
}



export function formatDateAndTime(dateString: any, mode: 'date' | 'time') {
 
    const date = new Date(dateString);
    
    if (mode === 'date') {
      return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    } else if (mode === 'time') {
      return date.toTimeString().split(' ')[0]; // Format: HH:MM:SS
    }
    return '';
  }
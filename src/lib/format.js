export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

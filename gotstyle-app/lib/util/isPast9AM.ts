export function isPast9AM(): boolean {
  const now = new Date();
  return now.getHours() >= 9;
}

export function formatDate(dateString: Date | string) {
  const date = new Date(dateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffInMs = Number(today) - Number(date);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) return "Today";
  else if (diffInDays === 1) return "Yesterday";
  else return `${date.getDate()}/${date.getMonth() + 1}`;
}

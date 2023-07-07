function formatTimeStamp(date: Date): String {
  const timestamp = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Los_Angeles',
    // year: 'numeric',
    // month: '2-digit',
    // day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit'
  };

  return timestamp.toLocaleString('en-US', options).replace(",", "");
}

export {
  formatTimeStamp,
};
export function calculateStreak(logs: { date: string; completed: boolean }[]) {
  const sortedLogs = [...logs]
    .filter(log => log.completed)
    .map(log => ({ ...log, date: new Date(log.date) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (sortedLogs[0] && sortedLogs[0].date.getTime() === currentDate.getTime()) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  for (let i = streak; i < sortedLogs.length; i++) {
    const logDate = sortedLogs[i].date;
    const expectedDate = new Date(currentDate);
    expectedDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === expectedDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateCompletion(logs: { date: string; completed: boolean }[], days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let completed = 0;

  for (let i = 0; i < days; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);

    const log = logs.find((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === targetDate.getTime() && log.completed;
    });

    if (log) completed++;
  }

  const percentage = Math.round((completed / days) * 100);
  return { percentage, completed, total: days };
}

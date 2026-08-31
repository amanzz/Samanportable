export function longTaskRows(run, tasks = []) {
  return tasks.filter(task => task.duration > 50).map(task => ({ checkpoint:run.checkpoint, mode:run.mode, run:run.run, startMs:task.startTime, durationMs:task.duration, attribution:JSON.stringify(task.attribution||[]), blockingContributionMs:Math.max(0,task.duration-50) }));
}

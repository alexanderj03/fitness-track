// Display formatting for macro figures. Every number the app shows is rounded to
// a whole unit — tenths of a gram are noise on a phone at arm's length.

export function num(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export function pct(consumed: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.round((consumed / goal) * 100);
}

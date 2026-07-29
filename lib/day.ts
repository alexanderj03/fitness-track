export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function dayKey(date: Date = new Date()): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function lastNDays(n: number, from: Date = new Date()): Date[] {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = startOfDay(from);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export function last7Days(from: Date = new Date()): Date[] {
  return lastNDays(7, from);
}

export function shortWeekday(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Masthead date line, e.g. "Tuesday 28 July"
export function dateStamp(date: Date = new Date()): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

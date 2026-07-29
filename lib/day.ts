/**
 * Day boundaries for the tracker.
 *
 * Every function here works in APP_TIME_ZONE, never in the host's local time.
 * The host matters otherwise: Vercel functions run in UTC, so `setHours(0,0,0,0)`
 * there would start "today" at 10am Sydney, and everything logged before that
 * would land on the previous day.
 */

export const APP_TIME_ZONE = process.env.APP_TIME_ZONE ?? "Australia/Sydney";

type Ymd = { year: number; month: number; day: number };

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** The wall-clock fields an observer in APP_TIME_ZONE would read off a clock. */
function wallClock(date: Date) {
  const parts = partsFormatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    // Intl reports midnight as hour 24 in some engines; normalise it.
    hour: read("hour") % 24,
    minute: read("minute"),
    second: read("second"),
  };
}

/** How far APP_TIME_ZONE is ahead of UTC at this instant, in ms. */
function zoneOffset(date: Date): number {
  const wall = wallClock(date);
  const asIfUtc = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );
  // Second precision is enough — no zone has sub-minute offsets.
  return asIfUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** The instant at which the given wall-clock time occurs in APP_TIME_ZONE. */
function instantOf({ year, month, day }: Ymd, endOfDayInstead = false): Date {
  const wall = endOfDayInstead
    ? Date.UTC(year, month - 1, day, 23, 59, 59, 999)
    : Date.UTC(year, month - 1, day);

  // Two passes settle the DST edge cases: the first guess uses the offset at
  // the wrong instant, the second uses the offset at (nearly) the right one.
  let instant = wall - zoneOffset(new Date(wall));
  instant = wall - zoneOffset(new Date(instant));
  return new Date(instant);
}

function ymd(date: Date): Ymd {
  const wall = wallClock(date);
  return { year: wall.year, month: wall.month, day: wall.day };
}

export function startOfDay(date: Date = new Date()): Date {
  return instantOf(ymd(date));
}

export function endOfDay(date: Date = new Date()): Date {
  return instantOf(ymd(date), true);
}

/** Stable "YYYY-MM-DD" key for the day this instant falls on locally. */
export function dayKey(date: Date = new Date()): string {
  const { year, month, day } = ymd(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function lastNDays(n: number, from: Date = new Date()): Date[] {
  const today = ymd(from);
  const days: Date[] = [];

  for (let i = n - 1; i >= 0; i--) {
    // Step back on the calendar, not by 24h, so a DST change doesn't drop or
    // duplicate a day. Date.UTC normalises month/year rollover for us.
    const stepped = new Date(
      Date.UTC(today.year, today.month - 1, today.day - i),
    );
    days.push(
      instantOf({
        year: stepped.getUTCFullYear(),
        month: stepped.getUTCMonth() + 1,
        day: stepped.getUTCDate(),
      }),
    );
  }

  return days;
}

export function last7Days(from: Date = new Date()): Date[] {
  return lastNDays(7, from);
}

export function shortWeekday(date: Date): string {
  return date.toLocaleDateString("en-US", {
    timeZone: APP_TIME_ZONE,
    weekday: "short",
  });
}

/** Clock time in APP_TIME_ZONE, e.g. "9:50 pm". */
export function timeStamp(date: Date = new Date()): string {
  return date.toLocaleTimeString("en-AU", {
    timeZone: APP_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * The zone's current abbreviation, e.g. "AEST" in winter and "AEDT" in summer.
 * Shown in the app so a wrong offset is visible rather than silent.
 */
export function zoneLabel(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: APP_TIME_ZONE,
    timeZoneName: "short",
  }).formatToParts(date);

  return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
}

// Masthead date line, e.g. "Tuesday 28 July"
export function dateStamp(date: Date = new Date()): string {
  return date.toLocaleDateString("en-GB", {
    timeZone: APP_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

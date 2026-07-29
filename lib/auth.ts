import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

export { PIN_LENGTH, isValidPin } from "@/lib/pin";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 32;
const MAX_FAILED_PINS = 5;
const LOCKOUT_MINUTES = 5;

/**
 * A 4-digit PIN is only 10,000 combinations, so the hash is deliberately slow
 * and the User row carries a lockout counter. Both matter: without the counter
 * an attacker just grinds the login endpoint.
 */
export async function hashPin(pin: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(pin, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const derived = (await scryptAsync(pin, salt, KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;

  return timingSafeEqual(derived, expected);
}

export function isLocked(lockedUntil: Date | null): boolean {
  return lockedUntil !== null && lockedUntil.getTime() > Date.now();
}

export function lockoutAfter(failedPins: number): Date | null {
  if (failedPins < MAX_FAILED_PINS) return null;
  return new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
}

export function minutesUntil(date: Date): number {
  return Math.max(1, Math.ceil((date.getTime() - Date.now()) / 60000));
}

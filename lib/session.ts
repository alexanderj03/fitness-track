import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "mt_user";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const DEV_SECRET = "macro-tracker-insecure-dev-secret";

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }
  return DEV_SECRET;
}

function sign(userId: string): string {
  const mac = createHmac("sha256", secret()).update(userId).digest("hex");
  return `${userId}.${mac}`;
}

function unsign(value: string): string | null {
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;

  const userId = value.slice(0, separator);
  const mac = Buffer.from(value.slice(separator + 1), "hex");
  const expected = createHmac("sha256", secret()).update(userId).digest();
  if (mac.length !== expected.length) return null;

  return timingSafeEqual(mac, expected) ? userId : null;
}

/** Sets the year-long identity cookie. Only callable from a route handler. */
export function setSessionCookie(userId: string): void {
  cookies().set(COOKIE_NAME, sign(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(COOKIE_NAME);
}

/** The signed user id, or null. Does not check that the user still exists. */
export function sessionUserId(): string | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  return raw ? unsign(raw) : null;
}

export type SessionUser = { id: string; name: string };

/** For API routes: the current user, or null when unauthenticated. */
export async function currentUser(): Promise<SessionUser | null> {
  const id = sessionUserId();
  if (!id) return null;

  return prisma.user.findUnique({ where: { id }, select: { id: true, name: true } });
}

/** For pages: the current user, or a redirect to the picker. */
export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/who");
  return user;
}

/**
 * The signed user id with no database round trip. Pages that are about to
 * query for their own data use this and fold the existence check into that
 * query — four round trips to Neon is three too many for one screen.
 */
export function requireUserId(): string {
  const id = sessionUserId();
  if (!id) redirect("/who");
  return id;
}

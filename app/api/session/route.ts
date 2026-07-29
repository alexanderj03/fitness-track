import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isLocked,
  isValidPin,
  lockoutAfter,
  minutesUntil,
  verifyPin,
} from "@/lib/auth";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = typeof body.userId === "string" ? body.userId : null;

  if (!userId || !isValidPin(body.pin)) {
    return NextResponse.json(
      { error: "Enter your 4-digit PIN." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json(
      { error: "That person no longer exists on this tracker." },
      { status: 404 },
    );
  }

  if (isLocked(user.lockedUntil)) {
    return NextResponse.json(
      {
        error: `Too many wrong PINs. Try again in ${minutesUntil(user.lockedUntil!)} min.`,
      },
      { status: 429 },
    );
  }

  if (!(await verifyPin(body.pin, user.pinHash))) {
    const failedPins = user.failedPins + 1;
    const lockedUntil = lockoutAfter(failedPins);
    await prisma.user.update({
      where: { id: user.id },
      data: { failedPins: lockedUntil ? 0 : failedPins, lockedUntil },
    });

    return NextResponse.json(
      {
        error: lockedUntil
          ? `Too many wrong PINs. Try again in ${minutesUntil(lockedUntil)} min.`
          : "Wrong PIN.",
      },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedPins: 0, lockedUntil: null },
  });

  setSessionCookie(user.id);
  return NextResponse.json({ id: user.id, name: user.name });
}

export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}

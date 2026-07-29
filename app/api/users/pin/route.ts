import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPin, isValidPin, verifyPin } from "@/lib/auth";
import { currentUser } from "@/lib/session";

export async function PUT(request: NextRequest) {
  const session = await currentUser();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  if (!isValidPin(body.currentPin) || !isValidPin(body.newPin)) {
    return NextResponse.json(
      { error: "Both PINs must be exactly 4 digits." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !(await verifyPin(body.currentPin, user.pinHash))) {
    return NextResponse.json({ error: "Current PIN is wrong." }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { pinHash: await hashPin(body.newPin), failedPins: 0, lockedUntil: null },
  });

  return NextResponse.json({ ok: true });
}

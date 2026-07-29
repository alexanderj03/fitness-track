import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPin, isValidPin } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (name.length < 1 || name.length > 24) {
    return NextResponse.json(
      { error: "Enter a name of 1–24 characters." },
      { status: 400 },
    );
  }

  if (!isValidPin(body.pin)) {
    return NextResponse.json(
      { error: "A PIN must be exactly 4 digits." },
      { status: 400 },
    );
  }

  const taken = await prisma.user.findFirst({
    where: { name: { equals: name } },
    select: { id: true },
  });
  if (taken) {
    return NextResponse.json(
      { error: `"${name}" is already on this tracker. Pick another name.` },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      pinHash: await hashPin(body.pin),
      profile: { create: {} },
    },
  });

  setSessionCookie(user.id);
  return NextResponse.json({ id: user.id, name: user.name }, { status: 201 });
}

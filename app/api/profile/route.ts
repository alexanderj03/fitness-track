import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/session";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      ...(body.calorieGoal !== undefined && { calorieGoal: body.calorieGoal }),
      ...(body.proteinGoal !== undefined && { proteinGoal: body.proteinGoal }),
      ...(body.carbGoal !== undefined && { carbGoal: body.carbGoal }),
      ...(body.fatGoal !== undefined && { fatGoal: body.fatGoal }),
    },
    create: {
      userId: user.id,
      calorieGoal: body.calorieGoal ?? undefined,
      proteinGoal: body.proteinGoal ?? undefined,
      carbGoal: body.carbGoal ?? undefined,
      fatGoal: body.fatGoal ?? undefined,
    },
  });

  return NextResponse.json(profile);
}

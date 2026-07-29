import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, lastNDays } from "@/lib/day";
import { currentUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rangeDays = request.nextUrl.searchParams.get("rangeDays");

  const start = rangeDays ? lastNDays(Number(rangeDays))[0] : startOfDay();
  const end = endOfDay();

  const entries = await prisma.foodEntry.findMany({
    where: {
      userId: user.id,
      loggedAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { loggedAt: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();

  const entry = await prisma.foodEntry.create({
    data: {
      userId: user.id,
      name: body.name,
      calories: body.calories,
      protein: body.protein,
      carbs: body.carbs ?? null,
      fat: body.fat ?? null,
      note: body.note ?? null,
      mealType: body.mealType ?? "SNACK",
      loggedAt: body.loggedAt ? new Date(body.loggedAt) : new Date(),
    },
  });

  if (body.saveAsFavorite) {
    await prisma.favoriteFood.create({
      data: {
        userId: user.id,
        name: body.name,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs ?? null,
        fat: body.fat ?? null,
        note: body.note ?? null,
      },
    });
  }

  return NextResponse.json(entry, { status: 201 });
}

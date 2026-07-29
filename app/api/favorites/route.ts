import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/session";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const favorites = await prisma.favoriteFood.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();

  const favorite = await prisma.favoriteFood.create({
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

  return NextResponse.json(favorite, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();

  // Scoped by userId so an entry id belonging to someone else matches nothing.
  const { count } = await prisma.foodEntry.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.calories !== undefined && { calories: body.calories }),
      ...(body.protein !== undefined && { protein: body.protein }),
      ...(body.carbs !== undefined && { carbs: body.carbs }),
      ...(body.fat !== undefined && { fat: body.fat }),
      ...(body.note !== undefined && { note: body.note }),
      ...(body.mealType !== undefined && { mealType: body.mealType }),
      ...(body.loggedAt !== undefined && { loggedAt: new Date(body.loggedAt) }),
    },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  const entry = await prisma.foodEntry.findUnique({ where: { id: params.id } });
  return NextResponse.json(entry);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { count } = await prisma.foodEntry.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

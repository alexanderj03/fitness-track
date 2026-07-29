import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/session";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { count } = await prisma.favoriteFood.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Favorite not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

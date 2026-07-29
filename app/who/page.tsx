import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import WhoPicker from "@/components/WhoPicker";

export const dynamic = "force-dynamic";

export default async function WhoPage() {
  const signedIn = await currentUser();
  if (signedIn) redirect("/");

  const people = await prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="px-4 pt-10">
      <header className="border-b-4 border-ink pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          Macro Tracker
        </p>
        <h1 className="text-xl font-extrabold tracking-tight">
          {people.length === 0 ? "Set up this tracker" : "Whose phone is this?"}
        </h1>
      </header>

      <p className="mt-3 text-sm text-ink/70">
        {people.length === 0
          ? "Create the first person. Everyone keeps their own entries, favorites and goals."
          : "Pick your name once on this phone. It stays signed in for a year."}
      </p>

      <div className="mt-6">
        <WhoPicker people={people} />
      </div>
    </main>
  );
}

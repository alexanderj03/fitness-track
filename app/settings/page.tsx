import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { DEFAULT_GOALS } from "@/lib/goals";
import SettingsForm from "@/components/SettingsForm";
import FavoritesList from "@/components/FavoritesList";
import AccountPanel from "@/components/AccountPanel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      profile: true,
      favorites: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/who");

  const profile = user.profile ?? DEFAULT_GOALS;
  const favorites = user.favorites;

  return (
    <main className="px-4 pt-6">
      <header className="border-b-2 border-ink pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          Signed in as {user.name}
        </p>
        <h1 className="text-xl font-extrabold tracking-tight">Settings</h1>
      </header>

      <section>
        <h2 className="mt-6 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          Daily Goals
        </h2>
        <SettingsForm profile={profile} />
      </section>

      <section>
        <h2 className="mt-8 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          Favorites
        </h2>
        <FavoritesList favorites={favorites} />
      </section>

      <section>
        <h2 className="mt-8 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          This Person
        </h2>
        <AccountPanel name={user.name} />
      </section>
    </main>
  );
}

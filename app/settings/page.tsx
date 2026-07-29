import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import SettingsForm from "@/components/SettingsForm";
import FavoritesList from "@/components/FavoritesList";
import AccountPanel from "@/components/AccountPanel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  const [profile, favorites] = await Promise.all([
    prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    }),
    prisma.favoriteFood.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

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

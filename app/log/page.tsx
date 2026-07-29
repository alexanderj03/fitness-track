import { requireUser } from "@/lib/session";
import LogForm from "@/components/LogForm";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  await requireUser();

  return (
    <main className="px-4 pt-6">
      <h1 className="text-xl font-extrabold tracking-tight">Log Food</h1>
      <LogForm />
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Profile } from "@prisma/client";

export default function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const carbGoal = form.get("carbGoal");
    const fatGoal = form.get("fatGoal");

    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calorieGoal: Number(form.get("calorieGoal")),
        proteinGoal: Number(form.get("proteinGoal")),
        carbGoal: carbGoal ? Number(carbGoal) : null,
        fatGoal: fatGoal ? Number(fatGoal) : null,
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Calorie Goal">
          <input
            name="calorieGoal"
            type="number"
            defaultValue={profile.calorieGoal}
            required
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
        <Field label="Protein Goal (g)">
          <input
            name="proteinGoal"
            type="number"
            defaultValue={profile.proteinGoal}
            required
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Carb Goal (g)">
          <input
            name="carbGoal"
            type="number"
            defaultValue={profile.carbGoal ?? ""}
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
        <Field label="Fat Goal (g)">
          <input
            name="fatGoal"
            type="number"
            defaultValue={profile.fatGoal ?? ""}
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full border-2 border-ink bg-ink py-3 text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-40"
      >
        {saving ? "Saving…" : saved ? "Saved" : "Save Goals"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink/60">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

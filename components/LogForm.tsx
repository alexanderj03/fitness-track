"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { MealType } from "@prisma/client";

const MEAL_OPTIONS: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export default function LogForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const calories = Number(form.get("calories"));
    const protein = Number(form.get("protein"));

    if (!name || Number.isNaN(calories) || Number.isNaN(protein)) {
      setError("Name, calories, and protein are required.");
      return;
    }

    const carbsRaw = form.get("carbs");
    const fatRaw = form.get("fat");
    const noteRaw = String(form.get("note") || "").trim();

    setSubmitting(true);
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        calories,
        protein,
        carbs: carbsRaw ? Number(carbsRaw) : null,
        fat: fatRaw ? Number(fatRaw) : null,
        note: noteRaw || null,
        mealType: form.get("mealType"),
        saveAsFavorite: form.get("saveAsFavorite") === "on",
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      setError("Could not save entry.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Field label="Name">
        <input
          name="name"
          type="text"
          required
          className="w-full border border-ink bg-paper px-2 py-2 text-sm"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Calories">
          <input
            name="calories"
            type="number"
            inputMode="numeric"
            required
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
        <Field label="Protein (g)">
          <input
            name="protein"
            type="number"
            step="0.1"
            inputMode="decimal"
            required
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Carbs (g)">
          <input
            name="carbs"
            type="number"
            step="0.1"
            inputMode="decimal"
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
        <Field label="Fat (g)">
          <input
            name="fat"
            type="number"
            step="0.1"
            inputMode="decimal"
            className="w-full border border-ink bg-paper px-2 py-2 text-sm tabular-nums"
          />
        </Field>
      </div>

      <Field label="Note">
        <input
          name="note"
          type="text"
          placeholder="e.g. 1.5 cups"
          className="w-full border border-ink bg-paper px-2 py-2 text-sm"
        />
      </Field>

      <Field label="Meal">
        <select
          name="mealType"
          defaultValue="SNACK"
          className="w-full border border-ink bg-paper px-2 py-2 text-sm"
        >
          {MEAL_OPTIONS.map((meal) => (
            <option key={meal} value={meal}>
              {meal.charAt(0) + meal.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input name="saveAsFavorite" type="checkbox" />
        Save as favorite
      </label>

      {error && <p className="text-sm text-over">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full border-2 border-ink bg-ink py-3 text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-40"
      >
        {submitting ? "Saving…" : "Save Entry"}
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

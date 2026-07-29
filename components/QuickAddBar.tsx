"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FavoriteFood } from "@prisma/client";
import { num } from "@/lib/format";

export default function QuickAddBar({
  favorites,
}: {
  favorites: FavoriteFood[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (favorites.length === 0) return null;

  async function handleAdd(favorite: FavoriteFood) {
    setPendingId(favorite.id);
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: favorite.name,
        calories: favorite.calories,
        protein: favorite.protein,
        carbs: favorite.carbs,
        fat: favorite.fat,
        note: favorite.note,
      }),
    });
    setPendingId(null);
    router.refresh();
  }

  return (
    <div className="mt-5">
      <h3 className="flex items-baseline justify-between gap-3 border-b border-ink pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          Quick Add
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          One tap
        </span>
      </h3>
      <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
        {favorites.map((favorite) => (
          <button
            key={favorite.id}
            type="button"
            onClick={() => handleAdd(favorite)}
            disabled={pendingId === favorite.id}
            className="group min-h-[44px] shrink-0 border border-ink px-3 py-2 text-left active:bg-ink active:text-paper disabled:opacity-40"
          >
            <div className="text-sm font-medium">{favorite.name}</div>
            <div className="text-xs tabular-nums text-ink/70 group-active:text-paper">
              {num(favorite.calories)} kcal &middot; {num(favorite.protein)}g
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

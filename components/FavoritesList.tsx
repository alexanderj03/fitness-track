"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FavoriteFood } from "@prisma/client";

export default function FavoritesList({
  favorites,
}: {
  favorites: FavoriteFood[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setPendingId(id);
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
    setPendingId(null);
    router.refresh();
  }

  if (favorites.length === 0) {
    return <p className="mt-2 text-sm text-ink/50">No favorites saved yet.</p>;
  }

  return (
    <ul className="mt-2">
      {favorites.map((favorite) => (
        <li
          key={favorite.id}
          className="flex items-center justify-between border-b border-line py-2"
        >
          <div>
            <div className="text-sm font-medium">{favorite.name}</div>
            <div className="text-xs tabular-nums text-ink/60">
              {Math.round(favorite.calories)} kcal · {Math.round(favorite.protein)}g protein
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(favorite.id)}
            disabled={pendingId === favorite.id}
            className="px-2 text-ink/40 disabled:opacity-40"
            aria-label="Delete favorite"
          >
            &times;
          </button>
        </li>
      ))}
    </ul>
  );
}

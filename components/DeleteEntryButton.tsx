"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteEntryButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      aria-label="Delete entry"
      className="flex h-11 w-11 items-center justify-center text-lg leading-none text-ink/70 active:bg-ink active:text-paper disabled:opacity-40"
    >
      &times;
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PinPad from "@/components/PinPad";

type Stage = "idle" | "current" | "next" | "confirm";

export default function AccountPanel({ name }: { name: string }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [currentPin, setCurrentPin] = useState("");
  const [nextPin, setNextPin] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function step(to: Stage) {
    setAttempt((n) => n + 1);
    setStage(to);
  }

  async function submit(confirmed: string) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/users/pin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPin, newPin: confirmed }),
    });
    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not change the PIN. Try again.");
      setCurrentPin("");
      setNextPin("");
      step("current");
      return;
    }

    setCurrentPin("");
    setNextPin("");
    setDone(true);
    step("idle");
  }

  function handlePin(pin: string) {
    if (stage === "current") {
      setCurrentPin(pin);
      step("next");
    } else if (stage === "next") {
      setNextPin(pin);
      step("confirm");
    } else if (stage === "confirm") {
      if (pin !== nextPin) {
        setError("The two PINs did not match. Enter the new one again.");
        setNextPin("");
        step("next");
        return;
      }
      void submit(pin);
    }
  }

  async function switchPerson() {
    setBusy(true);
    await fetch("/api/session", { method: "DELETE" });
    router.replace("/who");
    router.refresh();
  }

  return (
    <div className="mt-3">
      <p className="text-sm">
        Entries, favorites and goals on this device belong to{" "}
        <span className="font-semibold">{name}</span>.
      </p>

      {stage === "idle" ? (
        <div className="mt-4 space-y-2">
          {done && (
            <p className="border border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
              PIN changed
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setError(null);
              step("current");
            }}
            className="min-h-[44px] w-full border border-ink px-3 text-sm font-semibold active:bg-ink active:text-paper"
          >
            Change PIN
          </button>
          <button
            type="button"
            onClick={switchPerson}
            disabled={busy}
            className="min-h-[44px] w-full border border-ink px-3 text-sm font-semibold active:bg-ink active:text-paper disabled:opacity-40"
          >
            Switch person
          </button>
          <p className="pt-1 text-xs text-ink/70">
            Switching signs this device out. You will need the other person&rsquo;s
            PIN to get back in.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
            {stage === "current"
              ? "Enter current PIN"
              : stage === "next"
                ? "Enter new PIN"
                : "Confirm new PIN"}
          </p>
          <div className="mt-3">
            <PinPad onComplete={handlePin} busy={busy} resetToken={attempt} />
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-over">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setCurrentPin("");
              setNextPin("");
              step("idle");
            }}
            className="mt-4 min-h-[44px] w-full text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70 active:text-ink"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

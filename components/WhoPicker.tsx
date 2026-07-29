"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import PinPad from "@/components/PinPad";
import { PIN_LENGTH } from "@/lib/pin";

type Person = { id: string; name: string };
type Step =
  | { kind: "list" }
  | { kind: "pin"; person: Person }
  | { kind: "new-name" }
  | { kind: "new-pin"; name: string }
  | { kind: "new-confirm"; name: string; pin: string };

export default function WhoPicker({ people }: { people: Person[] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(
    people.length === 0 ? { kind: "new-name" } : { kind: "list" },
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [name, setName] = useState("");

  const signIn = useCallback(
    async (person: Person, pin: string) => {
      setBusy(true);
      setError(null);
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: person.id, pin }),
      });
      setBusy(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not sign in. Try again.");
        setAttempt((n) => n + 1);
        return;
      }

      router.replace("/");
      router.refresh();
    },
    [router],
  );

  const createPerson = useCallback(
    async (personName: string, pin: string) => {
      setBusy(true);
      setError(null);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: personName, pin }),
      });
      setBusy(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not create this person. Try again.");
        setStep({ kind: "new-name" });
        return;
      }

      router.replace("/");
      router.refresh();
    },
    [router],
  );

  const handlePin = useCallback(
    (pin: string) => {
      if (step.kind === "pin") {
        void signIn(step.person, pin);
      } else if (step.kind === "new-pin") {
        setError(null);
        setStep({ kind: "new-confirm", name: step.name, pin });
        setAttempt((n) => n + 1);
      } else if (step.kind === "new-confirm") {
        if (pin !== step.pin) {
          setError("The two PINs did not match. Set it again.");
          setAttempt((n) => n + 1);
          setStep({ kind: "new-pin", name: step.name });
          return;
        }
        void createPerson(step.name, pin);
      }
    },
    [step, signIn, createPerson],
  );

  function back() {
    setError(null);
    setAttempt((n) => n + 1);
    setStep(people.length === 0 ? { kind: "new-name" } : { kind: "list" });
  }

  if (step.kind === "list") {
    return (
      <div>
        <ul className="border-t border-ink">
          {people.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAttempt((n) => n + 1);
                  setStep({ kind: "pin", person });
                }}
                className="flex min-h-[56px] w-full items-center justify-between border-b border-ink px-3 text-left active:bg-ink active:text-paper"
              >
                <span className="text-lg font-extrabold tracking-tight">
                  {person.name}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Enter PIN &rarr;
                </span>
              </button>
            </li>
          ))}
        </ul>

        {error && <Notice>{error}</Notice>}

        <button
          type="button"
          onClick={() => {
            setError(null);
            setName("");
            setStep({ kind: "new-name" });
          }}
          className="mt-6 min-h-[44px] w-full border border-ink px-3 text-sm font-semibold active:bg-ink active:text-paper"
        >
          + New person
        </button>
      </div>
    );
  }

  if (step.kind === "new-name") {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = name.trim();
          if (!trimmed) {
            setError("Enter a name first.");
            return;
          }
          setError(null);
          setAttempt((n) => n + 1);
          setStep({ kind: "new-pin", name: trimmed });
        }}
      >
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
            Name
          </span>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            className="mt-1 w-full border border-ink bg-paper px-2 py-3 text-base"
          />
        </label>

        {error && <Notice>{error}</Notice>}

        <button
          type="submit"
          className="mt-4 min-h-[48px] w-full border-2 border-ink bg-ink text-sm font-bold uppercase tracking-[0.12em] text-paper active:bg-paper active:text-ink"
        >
          Set a PIN
        </button>

        {people.length > 0 && <BackButton onClick={back} />}
      </form>
    );
  }

  const heading =
    step.kind === "pin"
      ? step.person.name
      : step.kind === "new-confirm"
        ? "Confirm PIN"
        : "Set a PIN";

  const instruction =
    step.kind === "pin"
      ? `Enter ${step.person.name}'s ${PIN_LENGTH}-digit PIN`
      : step.kind === "new-confirm"
        ? "Enter the same PIN once more"
        : `Choose ${PIN_LENGTH} digits for ${step.name}`;

  return (
    <div>
      <div className="border-b-2 border-ink pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          {instruction}
        </p>
        <h2 className="text-xl font-extrabold tracking-tight">{heading}</h2>
      </div>

      <div className="mt-6">
        <PinPad onComplete={handlePin} busy={busy} resetToken={attempt} />
      </div>

      {error && <Notice>{error}</Notice>}

      {step.kind !== "pin" && (
        <p className="mt-4 text-xs text-ink/70">
          There is no PIN reset. Forget it and this person&rsquo;s log can only be
          reached from the database.
        </p>
      )}

      <BackButton onClick={back} />
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-4 text-sm font-medium text-over">
      {children}
    </p>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 min-h-[44px] w-full text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70 active:text-ink"
    >
      &larr; Back
    </button>
  );
}

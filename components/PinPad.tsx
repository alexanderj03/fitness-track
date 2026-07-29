"use client";

import { useEffect, useState } from "react";
import { PIN_LENGTH } from "@/lib/pin";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function PinPad({
  onComplete,
  busy = false,
  resetToken,
}: {
  onComplete: (pin: string) => void;
  busy?: boolean;
  /** Change this value to clear the entered digits (e.g. after a wrong PIN). */
  resetToken?: string | number;
}) {
  const [pin, setPin] = useState("");

  useEffect(() => {
    setPin("");
  }, [resetToken]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) onComplete(pin);
  }, [pin, onComplete]);

  function press(key: string) {
    setPin((current) =>
      current.length >= PIN_LENGTH ? current : current + key,
    );
  }

  return (
    <div>
      <div
        className="flex justify-center gap-3"
        role="status"
        aria-label={`${pin.length} of ${PIN_LENGTH} digits entered`}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <span
            key={index}
            className="flex h-12 w-12 items-center justify-center border-2 border-ink"
          >
            {index < pin.length && (
              <span className="h-4 w-4 bg-ink" aria-hidden="true" />
            )}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <PadButton key={key} onClick={() => press(key)} disabled={busy}>
            {key}
          </PadButton>
        ))}
        <PadButton
          onClick={() => setPin("")}
          disabled={busy || pin.length === 0}
          muted
        >
          Clear
        </PadButton>
        <PadButton onClick={() => press("0")} disabled={busy}>
          0
        </PadButton>
        <PadButton
          onClick={() => setPin((current) => current.slice(0, -1))}
          disabled={busy || pin.length === 0}
          muted
          label="Delete last digit"
        >
          &larr;
        </PadButton>
      </div>
    </div>
  );
}

function PadButton({
  children,
  onClick,
  disabled,
  muted = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  muted?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`min-h-[56px] border border-ink tabular-nums active:bg-ink active:text-paper disabled:opacity-40 ${
        muted
          ? "text-[11px] font-semibold uppercase tracking-[0.12em]"
          : "text-xl font-bold"
      }`}
    >
      {children}
    </button>
  );
}

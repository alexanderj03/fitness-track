// Shared by client and server, so this file must stay free of node imports.

export const PIN_LENGTH = 4;

export function isValidPin(pin: unknown): pin is string {
  return typeof pin === "string" && new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

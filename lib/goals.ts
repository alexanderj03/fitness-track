// Mirrors the Profile defaults in schema.prisma. Used when a page reads a user
// whose profile row somehow doesn't exist yet, so a screen never blocks on a
// write just to render.

export const DEFAULT_GOALS = {
  calorieGoal: 2200,
  proteinGoal: 160,
  carbGoal: null as number | null,
  fatGoal: null as number | null,
};

export type Goals = typeof DEFAULT_GOALS;

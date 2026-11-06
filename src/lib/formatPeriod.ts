/**
 * B6 — normalise free-text resume periods for display.
 *
 * Editors sometimes enter a year plus a duration ("2024 - 3 months"), which
 * reads like a broken date range on the homepage. Render it as
 * "2024 · 3 months" so the intent is clear without touching the stored value.
 */
export function formatPeriod(period: string | null | undefined): string {
  const value = (period ?? "").trim();
  if (!value) return "";

  const yearAndDuration = value.match(
    /^(\d{4})\s*[-–—]\s*(\d+\s*(?:months?|years?))$/i,
  );
  if (yearAndDuration) {
    return `${yearAndDuration[1]} · ${yearAndDuration[2]}`;
  }

  return value;
}

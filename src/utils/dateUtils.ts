const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

// Accepts both date-only strings ("2026-05-19") and full ISO timestamps.
// Date-only parses as UTC midnight per spec; timeZone:'UTC' on the formatter
// keeps the rendered day stable across local timezones (the original bug).
export function formatIsoDateShort(iso: string | null | undefined): string {
  if (!iso) return '---';
  return SHORT_DATE_FORMATTER.format(new Date(iso));
}

export function mondayOfIsoWeek(iso: string): string {
  // Date-only task data is stored as UTC ISO dates; keep week math in UTC to
  // avoid local timezone shifts moving Monday completions into the prior week.
  const d = new Date(iso);
  const day = d.getUTCDay() || 7;
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

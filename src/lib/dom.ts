/**
 * With Cache Components, Next.js keeps recently visited routes mounted but hidden
 * (React <Activity>), so an id like "custom-trip-quote" can exist more than once.
 * Always resolve to the copy that is actually rendered.
 */
export function visibleById(id: string): HTMLElement | null {
  const list = document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`);
  for (const el of list) if (el.getClientRects().length) return el;
  return null;
}

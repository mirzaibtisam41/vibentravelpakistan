/**
 * WebGL scenes (hero photo transitions, floating island) are skipped on phones to keep
 * scrolling smooth; phones get CSS photo slideshows / photo cards instead.
 * Set to true to run WebGL on phones as well.
 */
export const WEBGL_ON_PHONES = false;

export const subscribeNoop = () => () => {};

/** Client-only check; pair with useSyncExternalStore(subscribeNoop, canUseWebGL, () => false). */
export function canUseWebGL() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ((navigator.hardwareConcurrency ?? 4) < 4) return false;
  if (!WEBGL_ON_PHONES && window.matchMedia("(pointer: coarse) and (max-width: 767px)").matches) return false;
  return true;
}

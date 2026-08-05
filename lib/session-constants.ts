/**
 * Session constants with no runtime dependencies.
 *
 * Separate from lib/session.ts because that module imports node:crypto, which
 * cannot be bundled into Next middleware's Edge runtime. Middleware needs the
 * cookie name, not the signer, so the shared values live here and lib/session.ts
 * re-exports them — existing importers are unaffected.
 */

export const SESSION_COOKIE = "lace_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

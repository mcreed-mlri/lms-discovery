/**
 * Name of the short-lived cookie that carries the post-login destination across
 * the Brightspace OAuth round trip. Its own module so the OAuth start route and
 * the callback share one constant without importing each other.
 */
export const RETURN_TO_COOKIE = "lace_return_to";

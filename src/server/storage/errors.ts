import "server-only";

/** Deliberately safe messages only; provider errors are never returned to callers. */
export class MediaError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}
export class ObjectCollisionError extends Error {}

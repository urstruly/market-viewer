/**
 * Simple function to return a random UUID.
 *
 * Note - May not be perfect but will do for now.
 */
export function getRandomUUID() {
  return crypto ? crypto.randomUUID() : Date.now.toString();
}

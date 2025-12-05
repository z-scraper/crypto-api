/**
 * Types of client-side errors.
 */
export enum ClientErrorType {
  /** Error returned by the API (e.g., error message in response body). */
  API = 'api',
  /** HTTP error (e.g., 404, 500). */
  HTTP = 'http',
  /** Network connectivity error. */
  NETWORK = 'network',
  /** Configuration error (e.g., missing API key). */
  CONFIG = 'config',
  /** Unknown error type. */
  UNKNOWN = 'unknown',
}

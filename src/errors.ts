import { ClientErrorType } from './enums/errors.js';
import type {
  IClientApiError,
  IClientConfigError,
  IClientError,
  IClientHttpError,
  IClientNetworkError,
} from './types/errors.js';

/**
 * Base class for all client-side errors in the Crypto API SDK.
 */
export class ClientError extends Error {
  /** The type of the error. */
  public readonly type: ClientErrorType;
  /** The HTTP status code, if applicable. */
  public readonly statusCode?: number;
  /** Additional details about the error. */
  public readonly details?: unknown;
  /** The underlying cause of the error. */
  public readonly cause?: unknown;

  constructor(options: IClientError) {
    super(options.message);
    this.name = 'ClientError';
    this.type = options.type;
    this.statusCode = options.statusCode;
    this.details = options.details;
    this.cause = options.cause;
  }
}

/**
 * Error thrown when an HTTP request fails (e.g., 4xx or 5xx status codes).
 */
export class ClientHttpError extends ClientError {
  constructor({ message, details, statusCode }: IClientHttpError) {
    super({
      type: ClientErrorType.HTTP,
      message,
      statusCode,
      details,
    });
    this.name = 'HttpError';
  }
}

/**
 * Error thrown when the API returns a response with an error status.
 */
export class ClientApiError extends ClientError {
  constructor({ message }: IClientApiError) {
    super({
      type: ClientErrorType.API,
      message,
    });
    this.name = 'ApiError';
  }
}

/**
 * Error thrown when there is a network issue or the request cannot be made.
 */
export class ClientNetworkError extends ClientError {
  constructor({ message, details, statusCode }: IClientNetworkError) {
    super({
      type: ClientErrorType.NETWORK,
      message,
      details,
      statusCode,
    });
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when the client is misconfigured (e.g., missing API key).
 */
export class ClientConfigError extends ClientError {
  constructor({ message }: IClientConfigError) {
    super({
      type: ClientErrorType.CONFIG,
      message,
    });
    this.name = 'ConfigError';
  }
}

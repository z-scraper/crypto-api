import { ClientErrorType } from './enums/errors.js';
import type {
  IClientApiError,
  IClientConfigError,
  IClientError,
  IClientHttpError,
  IClientNetworkError,
} from './types/errors.js';

export class ClientError extends Error {
  public readonly type: ClientErrorType;
  public readonly statusCode?: number;
  public readonly details?: unknown;
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

export class ClientApiError extends ClientError {
  constructor({ message }: IClientApiError) {
    super({
      type: ClientErrorType.API,
      message,
    });
    this.name = 'ApiError';
  }
}

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

export class ClientConfigError extends ClientError {
  constructor({ message }: IClientConfigError) {
    super({
      type: ClientErrorType.CONFIG,
      message,
    });
    this.name = 'ConfigError';
  }
}

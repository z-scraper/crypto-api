import type { ClientErrorType } from '../enums/errors.js';

export interface IClientError {
  type: ClientErrorType;
  message: string;
  statusCode?: number;
  details?: unknown;
  cause?: unknown;
}

export interface IClientHttpError {
  message: string;
  statusCode: number;
  details?: unknown;
}

export interface IClientApiError {
  message: string;
}

export interface IClientNetworkError {
  message: string;
  statusCode?: number;
  details?: unknown;
  cause?: unknown;
}

export interface IClientConfigError {
  message: string;
}

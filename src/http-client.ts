import type { AxiosInstance } from 'axios';
import axios from 'axios';
import {
  HTTP_DEFAULT_BASE_URL,
  HTTP_DEFAULT_TIMEOUT,
  HTTP_LIMIT_DEFAULT,
  HTTP_PAGE_DEFAULT,
} from './constants/http.js';
import { Routes } from './constants/routes.js';
import { ClientErrorType } from './enums/errors.js';
import { ResponseStatus } from './enums/response.js';
import {
  ClientApiError,
  ClientConfigError,
  ClientError,
  ClientHttpError,
  ClientNetworkError,
} from './errors.js';
import type { IArticlesResponse } from './types/client.js';
import type { IHttpClientOptions } from './types/http.js';
import type {
  IArticle,
  IArticleDetail,
  IPaginatedArticles,
  IQueryBitcoinist,
  IQueryBitcoinistSentiment,
  IQueryCoinDesk,
  IQueryCoinDeskSentiment,
  IQueryCointelegraph,
  IQueryCointelegraphSentiment,
  IQueryCryptoDaily,
  IQueryCryptoDailySentiment,
  IQueryCryptoNews,
  IQueryCryptoNewsSentiment,
  IQueryDecrypt,
  IQueryDecryptSentiment,
  IQuerySentimentDefault,
  IResponse,
  ISentimentResult,
} from './types/response.js';

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly apiKey: string;

  constructor(options: IHttpClientOptions) {
    if (!options.apiKey) throw new ClientConfigError({ message: 'apiKey is required' });

    this.apiKey = options.apiKey;

    this.axiosInstance = axios.create({
      baseURL: options.baseURL ?? HTTP_DEFAULT_BASE_URL,
      timeout: options.timeout ?? HTTP_DEFAULT_TIMEOUT,
    });
  }

  async getArticles(params: IQuerySentimentDefault): Promise<IArticle[]> {
    this.ensureRequired(params.interval, 'interval');
    return await this.fetchArticles(Routes.articles.list, params);
  }

  async getArticlesSentiment(params: IQuerySentimentDefault): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return this.request<ISentimentResult>(Routes.articles.sentiment, params);
  }

  async getBitcoinistArticles(params?: IQueryBitcoinist): Promise<IArticlesResponse> {
    const data = await this.fetchPaginated(Routes.bitcoinist.list, params);
    return {
      articles: data.data ?? [],
      hasMore: data.hasNextPage ?? false,
    };
  }

  async getBitcoinistArticle(slug: string): Promise<IArticleDetail> {
    this.ensureRequired(slug, 'slug');
    return await this.fetchArticleDetail(Routes.bitcoinist.detail(slug));
  }

  async getBitcoinistSentiment(params: IQueryBitcoinistSentiment): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return this.request<ISentimentResult>(Routes.bitcoinist.sentiment, params);
  }

  async getCoinDeskArticles(params?: IQueryCoinDesk): Promise<IArticlesResponse> {
    const data = await this.fetchPaginated(Routes.coinDesk.list, params);
    return {
      articles: data.data ?? [],
      hasMore: data.hasNextPage ?? false,
    };
  }

  async getCoinDeskSentiment(params: IQueryCoinDeskSentiment): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return await this.request<ISentimentResult>(Routes.coinDesk.sentiment, params);
  }

  async getCointelegraphArticles(params?: IQueryCointelegraph): Promise<IArticlesResponse> {
    const data = await this.fetchPaginated(Routes.cointelegraph.list, params);
    return {
      articles: data.data ?? [],
      hasMore: data.hasNextPage ?? false,
    };
  }

  async getCointelegraphArticle(slug: string): Promise<IArticleDetail> {
    this.ensureRequired(slug, 'slug');
    return await this.fetchArticleDetail(Routes.cointelegraph.detail(slug));
  }

  async getCointelegraphSentiment(params: IQueryCointelegraphSentiment): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return await this.request<ISentimentResult>(Routes.cointelegraph.sentiment, params);
  }

  async getCryptoDailyArticles(params?: IQueryCryptoDaily): Promise<IArticlesResponse> {
    const data = await this.fetchPaginated(Routes.cryptoDaily.list, params);
    return {
      articles: data.data ?? [],
      hasMore: data.hasNextPage ?? false,
    };
  }

  async getCryptoDailyArticleDetail(url: string): Promise<IArticleDetail> {
    this.ensureRequired(url, 'url');
    return await this.fetchArticleDetail(Routes.cryptoDaily.detail, { url });
  }

  async getCryptoDailySentiment(params: IQueryCryptoDailySentiment): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return await this.request<ISentimentResult>(Routes.cryptoDaily.sentiment, params);
  }

  async getCryptoNewsArticles(params?: IQueryCryptoNews): Promise<IArticlesResponse> {
    const data = await this.fetchPaginated(Routes.cryptoNews.list, params);
    return {
      articles: data.data ?? [],
      hasMore: data.hasNextPage ?? false,
    };
  }

  async getCryptoNewsArticle(slug: string): Promise<IArticleDetail> {
    this.ensureRequired(slug, 'slug');
    return await this.fetchArticleDetail(Routes.cryptoNews.detail(slug));
  }

  async getCryptoNewsSentiment(params: IQueryCryptoNewsSentiment): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return await this.request<ISentimentResult>(Routes.cryptoNews.sentiment, params);
  }

  async getDecryptArticles(params?: IQueryDecrypt): Promise<IArticlesResponse> {
    const data = await this.fetchPaginated(Routes.decrypt.list, params);
    return {
      articles: data.data ?? [],
      hasMore: data.hasNextPage ?? false,
    };
  }

  async getDecryptArticle(id: string): Promise<IArticleDetail> {
    this.ensureRequired(id, 'id');
    return await this.fetchArticleDetail(Routes.decrypt.detail(id));
  }

  async getDecryptSentiment(params: IQueryDecryptSentiment): Promise<ISentimentResult> {
    this.ensureRequired(params.interval, 'interval');
    return await this.request<ISentimentResult>(Routes.decrypt.sentiment, params);
  }

  private async request<T>(url: string, params?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.get<IResponse<T>>(url, {
        params,
        headers: {
          'X-RapidAPI-Key': this.apiKey,
        },
      });
      const { data } = response;

      if (!data || data.status !== ResponseStatus.SUCCESS) {
        const message = !data ? 'Empty response from API' : (data.message ?? 'API error');
        throw new ClientApiError({ message });
      }

      return data.data;
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new ClientHttpError({
            message: error.message,
            statusCode: error.response.status,
            details: error.response.data,
          });
        }

        throw new ClientNetworkError({
          message: error.message,
          cause: error,
        });
      }

      throw new ClientError({
        type: ClientErrorType.UNKNOWN,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        cause: error,
      });
    }
  }

  private async fetchPaginated(url: string, params?: unknown): Promise<IPaginatedArticles> {
    if (!(params as Record<string, unknown>)?.page) {
      (params as Record<string, unknown>).page = HTTP_PAGE_DEFAULT;
    }
    if (!(params as Record<string, unknown>)?.limit) {
      (params as Record<string, unknown>).limit = HTTP_LIMIT_DEFAULT;
    }
    return await this.request<IPaginatedArticles>(url, params);
  }

  private async fetchArticleDetail(url: string, params?: unknown): Promise<IArticleDetail> {
    return await this.request<IArticleDetail>(url, params);
  }

  private async fetchArticles(url: string, params?: unknown): Promise<IArticle[]> {
    return await this.request<IArticle[]>(url, params);
  }

  private ensureRequired(value: string | undefined, field: string): void {
    if (!value) {
      throw new ClientConfigError({ message: `${field} is required` });
    }
  }
}

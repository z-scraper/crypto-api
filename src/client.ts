import { ClientErrorType } from './enums/errors.js';
import { CryptoSource } from './enums/source.js';
import { ClientConfigError, ClientError } from './errors.js';
import { HttpClient } from './http-client.js';
import type {
  IArticlesResponse,
  IClient,
  IClientOptions,
  IOptionNews,
  IOptionNewsDetail,
  IOptionSentiment,
} from './types/client.js';
import type {
  IArticle,
  IArticleDetail,
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
  ISentimentResult,
} from './types/response';

/**
 * The main client class for interacting with the Crypto API.
 * Provides methods to fetch aggregated news, article details, and sentiment analysis.
 */
export class CryptoClient implements IClient {
  private readonly httpClient: HttpClient;

  /**
   * Creates a new instance of CryptoClient.
   * @param options - Configuration options for the client.
   * @throws {ClientConfigError} If the API key is missing.
   */
  constructor(options: IClientOptions) {
    if (!options.apiKey) throw new ClientConfigError({ message: 'apiKey is required' });

    this.httpClient = new HttpClient({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      timeout: options.timeout,
    });
  }

  /**
   * Fetches aggregated articles for a specific time interval.
   * @param interval - The time interval to fetch articles for (e.g., '1d', '1w').
   * @returns A promise that resolves to an array of articles.
   */
  getArticles(interval: string): Promise<IArticle[]> {
    return this.httpClient.getArticles({ interval });
  }

  /**
   * Fetches aggregated sentiment analysis for a specific time interval.
   * @param interval - The time interval for sentiment analysis.
   * @returns A promise that resolves to the sentiment result.
   */
  getArticlesSentiment(interval: string): Promise<ISentimentResult> {
    return this.httpClient.getArticlesSentiment({ interval });
  }

  /**
   * Fetches news articles from a specific source with optional filters.
   * @param options - Options specifying the source and filters (e.g., category, limit).
   * @returns A promise that resolves to a paginated response of articles.
   * @throws {ClientError} If the crypto source is invalid.
   */
  getNews(options: IOptionNews): Promise<IArticlesResponse> {
    const { cryptoSource, ...params } = options;

    switch (cryptoSource) {
      case CryptoSource.Bitcoinist:
        return this.httpClient.getBitcoinistArticles(params as IQueryBitcoinist);
      case CryptoSource.CoinDesk:
        return this.httpClient.getCoinDeskArticles(params as IQueryCoinDesk);
      case CryptoSource.Cointelegraph:
        return this.httpClient.getCointelegraphArticles(params as IQueryCointelegraph);
      case CryptoSource.CryptoDaily:
        return this.httpClient.getCryptoDailyArticles(params as IQueryCryptoDaily);
      case CryptoSource.CryptoNews:
        return this.httpClient.getCryptoNewsArticles(params as IQueryCryptoNews);
      case CryptoSource.Decrypt:
        return this.httpClient.getDecryptArticles(params as IQueryDecrypt);
      default:
        throw new ClientError({
          type: ClientErrorType.UNKNOWN,
          message: 'Invalid crypto source',
        });
    }
  }

  /**
   * Fetches the details of a specific article from a supported source.
   * @param options - Options identifying the article (source and slug/id/url).
   * @returns A promise that resolves to the article details.
   * @throws {ClientError} If the crypto source is invalid.
   */
  getNewsDetail(options: IOptionNewsDetail): Promise<IArticleDetail> {
    switch (options.cryptoSource) {
      case CryptoSource.CryptoDaily:
        return this.httpClient.getCryptoDailyArticleDetail(options.url);
      case CryptoSource.Decrypt:
        return this.httpClient.getDecryptArticle(options.id);
      case CryptoSource.Cointelegraph:
        return this.httpClient.getCointelegraphArticle(options.slug);
      case CryptoSource.CryptoNews:
        return this.httpClient.getCryptoNewsArticle(options.slug);
      case CryptoSource.Bitcoinist:
        return this.httpClient.getBitcoinistArticle(options.slug);
      default:
        throw new ClientError({
          type: ClientErrorType.UNKNOWN,
          message: 'Invalid crypto source',
        });
    }
  }

  /**
   * Fetches sentiment analysis for a specific source and interval.
   * @param options - Options specifying the source, interval, and optional category.
   * @returns A promise that resolves to the sentiment result.
   * @throws {ClientError} If the crypto source is invalid.
   */
  getSentiment(options: IOptionSentiment): Promise<ISentimentResult> {
    const { cryptoSource, ...params } = options;

    switch (cryptoSource) {
      case CryptoSource.Bitcoinist:
        return this.httpClient.getBitcoinistSentiment(params as IQueryBitcoinistSentiment);
      case CryptoSource.CoinDesk:
        return this.httpClient.getCoinDeskSentiment(params as IQueryCoinDeskSentiment);
      case CryptoSource.Cointelegraph:
        return this.httpClient.getCointelegraphSentiment(params as IQueryCointelegraphSentiment);
      case CryptoSource.CryptoDaily:
        return this.httpClient.getCryptoDailySentiment(params as IQueryCryptoDailySentiment);
      case CryptoSource.CryptoNews:
        return this.httpClient.getCryptoNewsSentiment(params as IQueryCryptoNewsSentiment);
      case CryptoSource.Decrypt:
        return this.httpClient.getDecryptSentiment(params as IQueryDecryptSentiment);
      default:
        throw new ClientError({
          type: ClientErrorType.UNKNOWN,
          message: 'Invalid crypto source',
        });
    }
  }
}

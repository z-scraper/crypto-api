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
} from './types/response.js';

export class CryptoClient implements IClient {
  private readonly httpClient: HttpClient;

  constructor(options: IClientOptions) {
    if (!options.apiKey) throw new ClientConfigError({ message: 'apiKey is required' });

    this.httpClient = new HttpClient({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      timeout: options.timeout,
    });
  }

  getArticles(interval: string): Promise<IArticle[]> {
    return this.httpClient.getArticles({ interval });
  }

  getArticlesSentiment(interval: string): Promise<ISentimentResult> {
    return this.httpClient.getArticlesSentiment({ interval });
  }

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

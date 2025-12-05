import type { CryptoSource } from '../enums/source.js';
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
  IQuerySentimentDefault,
  ISentimentResult,
} from './response.js';

/**
 * Options for fetching news from Bitcoinist.
 */
interface OptionNewsBitcoinist extends IQueryBitcoinist {
  /** The source of the news (Bitcoinist). */
  cryptoSource: CryptoSource.Bitcoinist;
}

/**
 * Options for fetching news from CoinDesk.
 */
interface OptionNewsCoinDesk extends IQueryCoinDesk {
  /** The source of the news (CoinDesk). */
  cryptoSource: CryptoSource.CoinDesk;
}

/**
 * Options for fetching news from Cointelegraph.
 */
interface OptionNewsCointelegraph extends IQueryCointelegraph {
  /** The source of the news (Cointelegraph). */
  cryptoSource: CryptoSource.Cointelegraph;
}

/**
 * Options for fetching news from CryptoDaily.
 */
interface OptionNewsCryptoDaily extends IQueryCryptoDaily {
  /** The source of the news (CryptoDaily). */
  cryptoSource: CryptoSource.CryptoDaily;
}

/**
 * Options for fetching news from CryptoNews.
 */
interface OptionNewsCryptoNews extends IQueryCryptoNews {
  /** The source of the news (CryptoNews). */
  cryptoSource: CryptoSource.CryptoNews;
}

/**
 * Options for fetching news from Decrypt.
 */
interface OptionNewsDecrypt extends IQueryDecrypt {
  /** The source of the news (Decrypt). */
  cryptoSource: CryptoSource.Decrypt;
}

/**
 * Union type for all news fetching options across different sources.
 */
export type IOptionNews =
  | OptionNewsBitcoinist
  | OptionNewsCoinDesk
  | OptionNewsCointelegraph
  | OptionNewsCryptoDaily
  | OptionNewsCryptoNews
  | OptionNewsDecrypt;

/**
 * Options for fetching article details from CryptoDaily.
 */
interface OptionNewsDetailCryptoDaily {
  /** The source of the news (CryptoDaily). */
  cryptoSource: CryptoSource.CryptoDaily;
  /** The URL of the article to fetch details for. */
  url: string;
}

/**
 * Options for fetching article details from Decrypt.
 */
interface OptionNewsDetailDecrypt {
  /** The source of the news (Decrypt). */
  cryptoSource: CryptoSource.Decrypt;
  /** The ID of the article to fetch details for. */
  id: string;
}

/**
 * Options for fetching article details from sources that use a slug (Bitcoinist, CoinDesk, Cointelegraph, CryptoNews).
 */
interface OptionNewsDetailDefault {
  /** The source of the news. */
  cryptoSource: Exclude<
    CryptoSource,
    CryptoSource.CryptoDaily | CryptoSource.Decrypt | CryptoSource.CoinDesk
  >;
  /** The slug of the article to fetch details for. */
  slug: string;
}

/**
 * Union type for all article detail fetching options.
 */
export type IOptionNewsDetail =
  | OptionNewsDetailCryptoDaily
  | OptionNewsDetailDecrypt
  | OptionNewsDetailDefault;

/**
 * Options for fetching sentiment analysis for Bitcoinist articles.
 */
interface OptionSentimentBitcoinist extends IQueryBitcoinistSentiment {
  /** The source of the news (Bitcoinist). */
  cryptoSource: CryptoSource.Bitcoinist;
}

/**
 * Options for fetching sentiment analysis for CoinDesk articles.
 */
interface OptionSentimentCoinDesk extends IQueryCoinDeskSentiment {
  /** The source of the news (CoinDesk). */
  cryptoSource: CryptoSource.CoinDesk;
}

/**
 * Options for fetching sentiment analysis for Cointelegraph articles.
 */
interface OptionSentimentCointelegraph extends IQueryCointelegraphSentiment {
  /** The source of the news (Cointelegraph). */
  cryptoSource: CryptoSource.Cointelegraph;
}

/**
 * Options for fetching sentiment analysis for CryptoDaily articles.
 */
interface OptionSentimentCryptoDaily extends IQueryCryptoDailySentiment {
  /** The source of the news (CryptoDaily). */
  cryptoSource: CryptoSource.CryptoDaily;
}

/**
 * Options for fetching sentiment analysis for CryptoNews articles.
 */
interface OptionSentimentCryptoNews extends IQueryCryptoNewsSentiment {
  /** The source of the news (CryptoNews). */
  cryptoSource: CryptoSource.CryptoNews;
}

/**
 * Options for fetching sentiment analysis for Decrypt articles.
 */
interface OptionSentimentDecrypt extends IQueryDecryptSentiment {
  /** The source of the news (Decrypt). */
  cryptoSource: CryptoSource.Decrypt;
}

/**
 * Union type for all sentiment analysis fetching options.
 */
export type IOptionSentiment =
  | OptionSentimentBitcoinist
  | OptionSentimentCoinDesk
  | OptionSentimentCointelegraph
  | OptionSentimentCryptoDaily
  | OptionSentimentCryptoNews
  | OptionSentimentDecrypt;

/**
 * Represents a paginated response of articles.
 */
export interface IArticlesResponse {
  /** The list of articles. */
  articles: IArticle[];
  /** Indicates if there are more articles available. */
  hasMore: boolean;
}

/**
 * Configuration options for the CryptoClient.
 */
export interface IClientOptions {
  /**
   * Your RapidAPI key for accessing the Crypto API.
   */
  apiKey: string;
  /**
   * The base URL for the API. Defaults to the official Crypto API endpoint.
   */
  baseURL?: string;
  /**
   * Request timeout in milliseconds.
   */
  timeout?: number;
}

/**
 * Interface defining the methods available on the CryptoClient.
 */
export abstract class IClient {
  /**
   * Fetches a list of news articles based on the provided options.
   * @param options - The options for fetching news, including source and filters.
   * @returns A promise that resolves to a paginated response of articles.
   */
  abstract getNews(options: IOptionNews): Promise<IArticlesResponse>;

  /**
   * Fetches the details of a specific news article.
   * @param options - The options for identifying the article (e.g., source, slug, url, id).
   * @returns A promise that resolves to the detailed information of the article.
   */
  abstract getNewsDetail(options: IOptionNewsDetail): Promise<IArticleDetail>;

  /**
   * Fetches sentiment analysis data for news articles.
   * @param options - The options for fetching sentiment, including source and interval.
   * @returns A promise that resolves to the sentiment analysis result.
   */
  abstract getSentiment(options: IOptionSentiment): Promise<ISentimentResult>;

  /**
   * Fetches aggregated articles for a specific interval.
   * @param interval - The time interval for the articles (e.g., "1d", "1w").
   * @returns A promise that resolves to a list of articles.
   */
  abstract getArticles(interval: string): Promise<IArticle[]>;

  /**
   * Fetches aggregated sentiment analysis for articles within a specific interval.
   * @param interval - The time interval for sentiment analysis.
   * @returns A promise that resolves to the sentiment analysis result.
   */
  abstract getArticlesSentiment(interval: string): Promise<ISentimentResult>;
}

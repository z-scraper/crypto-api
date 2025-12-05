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
  ISentimentResult,
} from './response.js';

interface OptionNewsBitcoinist extends IQueryBitcoinist {
  cryptoSource: CryptoSource.Bitcoinist;
}

interface OptionNewsCoinDesk extends IQueryCoinDesk {
  cryptoSource: CryptoSource.CoinDesk;
}

interface OptionNewsCointelegraph extends IQueryCointelegraph {
  cryptoSource: CryptoSource.Cointelegraph;
}

interface OptionNewsCryptoDaily extends IQueryCryptoDaily {
  cryptoSource: CryptoSource.CryptoDaily;
}

interface OptionNewsCryptoNews extends IQueryCryptoNews {
  cryptoSource: CryptoSource.CryptoNews;
}

interface OptionNewsDecrypt extends IQueryDecrypt {
  cryptoSource: CryptoSource.Decrypt;
}

export type IOptionNews =
  | OptionNewsBitcoinist
  | OptionNewsCoinDesk
  | OptionNewsCointelegraph
  | OptionNewsCryptoDaily
  | OptionNewsCryptoNews
  | OptionNewsDecrypt;

interface OptionNewsDetailCryptoDaily {
  cryptoSource: CryptoSource.CryptoDaily;
  url: string;
}

interface OptionNewsDetailDecrypt {
  cryptoSource: CryptoSource.Decrypt;
  id: string;
}

interface OptionNewsDetailDefault {
  cryptoSource: Exclude<
    CryptoSource,
    CryptoSource.CryptoDaily | CryptoSource.Decrypt | CryptoSource.CoinDesk
  >;
  slug: string;
}

export type IOptionNewsDetail =
  | OptionNewsDetailCryptoDaily
  | OptionNewsDetailDecrypt
  | OptionNewsDetailDefault;

interface OptionSentimentBitcoinist extends IQueryBitcoinistSentiment {
  cryptoSource: CryptoSource.Bitcoinist;
}

interface OptionSentimentCoinDesk extends IQueryCoinDeskSentiment {
  cryptoSource: CryptoSource.CoinDesk;
}

interface OptionSentimentCointelegraph extends IQueryCointelegraphSentiment {
  cryptoSource: CryptoSource.Cointelegraph;
}

interface OptionSentimentCryptoDaily extends IQueryCryptoDailySentiment {
  cryptoSource: CryptoSource.CryptoDaily;
}

interface OptionSentimentCryptoNews extends IQueryCryptoNewsSentiment {
  cryptoSource: CryptoSource.CryptoNews;
}

interface OptionSentimentDecrypt extends IQueryDecryptSentiment {
  cryptoSource: CryptoSource.Decrypt;
}

export type IOptionSentiment =
  | OptionSentimentBitcoinist
  | OptionSentimentCoinDesk
  | OptionSentimentCointelegraph
  | OptionSentimentCryptoDaily
  | OptionSentimentCryptoNews
  | OptionSentimentDecrypt;

export interface IArticlesResponse {
  articles: IArticle[];
  hasMore: boolean;
}

export interface IClientOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export abstract class IClient {
  abstract getNews(options: IOptionNews): Promise<IArticlesResponse>;
  abstract getNewsDetail(options: IOptionNewsDetail): Promise<IArticleDetail>;
  abstract getSentiment(options: IOptionSentiment): Promise<ISentimentResult>;

  abstract getArticles(interval: string): Promise<IArticle[]>;
  abstract getArticlesSentiment(interval: string): Promise<ISentimentResult>;
}

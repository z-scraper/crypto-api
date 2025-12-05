import type {
  BitcoinistCategory,
  CoinDeskCategory,
  CointelegraphCategory,
  CryptoDailyCategory,
  CryptoNewsCategory,
  DecryptCategory,
  DecryptSort,
} from '../enums/article.js';
import type { ContentBlockType } from '../enums/content-block.js';
import type { ResponseStatus } from '../enums/response.js';
import type { SentimentType } from '../enums/sentiment.js';
import type { CryptoSource } from '../enums/source.js';

export interface IArticle {
  id: any;
  slug: string;
  title: string;
  summary: string;
  time?: Date;
  timeStr?: string;
  url: string;
  thumbnailUrl: string;
  source: CryptoSource;
}

export interface IArticleDetail {
  id: any;
  title: string;
  summary: string;
  thumbnailUrl: string;
  url: string;
  publishedAt: Date;
  author: string;
  category?: string;
  contentRaw: string;
  content: IContentBlock[];
  source: CryptoSource;
}

export interface IContentBlock {
  type: ContentBlockType;
  text?: string;
  level?: number;
  url?: string;
  alt?: string;
  caption?: string;
  author?: string;
  ordered?: boolean;
  items?: string[];
  code?: string;
  provider?: string;
  content?: IContentBlock[];
}

export interface ISentimentItem {
  type: SentimentType;
  count: number;
  percentage: number;
}

export interface ISentimentResult {
  interval: string;
  totalArticles: number;
  sentimentSummary: ISentimentItem[];
}

export interface IResponseError {
  status: ResponseStatus.ERROR;
  message: string;
  processingTimeSec?: number;
}

export interface IResponseSuccess<T> {
  status: ResponseStatus.SUCCESS;
  processingTimeSec?: number;
  data: T;
}

export type IResponse<T> = IResponseSuccess<T> | IResponseError;

interface QueryDefault {
  page?: number;
  limit?: number;
  search?: string;
  paginationToken?: string;
}

export interface IQueryBitcoinist extends QueryDefault {
  category?: BitcoinistCategory;
}

export interface IQueryCoinDesk extends QueryDefault {
  category?: CoinDeskCategory;
}

export interface IQueryCointelegraph extends QueryDefault {
  category?: CointelegraphCategory;
}

export interface IQueryCryptoDaily extends QueryDefault {
  category?: CryptoDailyCategory;
}

export interface IQueryCryptoNews extends QueryDefault {
  category?: CryptoNewsCategory;
}

export interface IQueryDecrypt extends QueryDefault {
  category?: DecryptCategory;
  sort?: DecryptSort;
  isEditorPick?: boolean;
}

export interface IQuerySentimentDefault {
  interval: string;
}

export interface IQueryBitcoinistSentiment extends IQuerySentimentDefault {
  category?: BitcoinistCategory;
}

export interface IQueryCoinDeskSentiment extends IQuerySentimentDefault {
  category?: CoinDeskCategory;
}

export interface IQueryCointelegraphSentiment extends IQuerySentimentDefault {
  category?: CointelegraphCategory;
}

export interface IQueryCryptoDailySentiment extends IQuerySentimentDefault {
  category?: CryptoDailyCategory;
}

export interface IQueryCryptoNewsSentiment extends IQuerySentimentDefault {
  category?: CryptoNewsCategory;
}

export interface IQueryDecryptSentiment extends IQuerySentimentDefault {
  category?: DecryptCategory;
}

export interface IPaginatedArticles {
  data?: IArticle[];
  totalPages?: number;
  hasNextPage?: boolean;
  currentPages?: number;
  limit?: number;
  paginationToken?: string;
}

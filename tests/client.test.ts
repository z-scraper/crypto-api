import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CryptoClient } from '../src/client.js';
import { ClientErrorType } from '../src/enums/errors.js';
import { CryptoSource } from '../src/enums/source.js';
import { ClientConfigError, ClientError } from '../src/errors.js';

const httpClientMocks = vi.hoisted(() => {
  const createHttpClientMethods = () => ({
    getArticles: vi.fn().mockResolvedValue([]),
    getArticlesSentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
    getBitcoinistArticles: vi.fn().mockResolvedValue({ articles: [], hasMore: false }),
    getCoinDeskArticles: vi.fn().mockResolvedValue({ articles: [], hasMore: false }),
    getCointelegraphArticles: vi.fn().mockResolvedValue({ articles: [], hasMore: false }),
    getCryptoDailyArticles: vi.fn().mockResolvedValue({ articles: [], hasMore: false }),
    getCryptoNewsArticles: vi.fn().mockResolvedValue({ articles: [], hasMore: false }),
    getDecryptArticles: vi.fn().mockResolvedValue({ articles: [], hasMore: false }),
    getBitcoinistArticle: vi.fn().mockResolvedValue({ id: 'btc' }),
    getCointelegraphArticle: vi.fn().mockResolvedValue({ id: 'ct' }),
    getCryptoDailyArticleDetail: vi.fn().mockResolvedValue({ id: 'cd' }),
    getCryptoNewsArticle: vi.fn().mockResolvedValue({ id: 'cn' }),
    getDecryptArticle: vi.fn().mockResolvedValue({ id: 'dec' }),
    getBitcoinistSentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
    getCoinDeskSentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
    getCointelegraphSentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
    getCryptoDailySentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
    getCryptoNewsSentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
    getDecryptSentiment: vi
      .fn()
      .mockResolvedValue({ interval: '1h', totalArticles: 0, sentimentSummary: [] }),
  });

  const state = { instance: createHttpClientMethods() };
  const HttpClientMock = vi.fn(function mockHttpClient() {
    return state.instance;
  });

  return { createHttpClientMethods, state, HttpClientMock };
});

vi.mock('../src/http-client.js', () => ({
  HttpClient: httpClientMocks.HttpClientMock,
}));

let httpClientInstance = httpClientMocks.state.instance;

describe('CryptoClient', () => {
  beforeEach(() => {
    httpClientInstance = httpClientMocks.createHttpClientMethods();
    httpClientMocks.state.instance = httpClientInstance;
    httpClientMocks.HttpClientMock.mockClear();
    httpClientMocks.HttpClientMock.mockImplementation(function () {
      return httpClientInstance;
    });
  });

  it('requires an apiKey', () => {
    expect(() => new CryptoClient({ apiKey: '' as unknown as string })).toThrow(ClientConfigError);
  });

  it('passes configuration to HttpClient', () => {
    new CryptoClient({ apiKey: 'secret', baseURL: 'http://example.com', timeout: 1234 });

    expect(httpClientMocks.HttpClientMock).toHaveBeenCalledWith({
      apiKey: 'secret',
      baseURL: 'http://example.com',
      timeout: 1234,
    });
  });

  it('delegates article and sentiment helpers', async () => {
    const client = new CryptoClient({ apiKey: 'secret' });
    httpClientInstance.getArticles.mockResolvedValueOnce(['article']);
    httpClientInstance.getArticlesSentiment.mockResolvedValueOnce('sentiment' as any);

    const articles = await client.getArticles('24h');
    const sentiment = await client.getArticlesSentiment('24h');

    expect(httpClientInstance.getArticles).toHaveBeenCalledWith({ interval: '24h' });
    expect(httpClientInstance.getArticlesSentiment).toHaveBeenCalledWith({ interval: '24h' });
    expect(articles).toEqual(['article']);
    expect(sentiment).toEqual('sentiment');
  });

  describe('getNews routing', () => {
    it.each([
      {
        options: { cryptoSource: CryptoSource.Bitcoinist, category: 'BITCOIN', search: 'btc' },
        method: 'getBitcoinistArticles',
        expectedArgs: { category: 'BITCOIN', search: 'btc' },
        response: { articles: ['btc-news'], hasMore: false },
      },
      {
        options: { cryptoSource: CryptoSource.CoinDesk, category: 'MARKETS' },
        method: 'getCoinDeskArticles',
        expectedArgs: { category: 'MARKETS' },
        response: { articles: ['cd-news'], hasMore: true },
      },
      {
        options: { cryptoSource: CryptoSource.Cointelegraph, category: 'BITCOIN' },
        method: 'getCointelegraphArticles',
        expectedArgs: { category: 'BITCOIN' },
        response: { articles: ['ct-news'], hasMore: false },
      },
      {
        options: { cryptoSource: CryptoSource.CryptoDaily, category: 'DEFI' },
        method: 'getCryptoDailyArticles',
        expectedArgs: { category: 'DEFI' },
        response: { articles: ['daily-news'], hasMore: true },
      },
      {
        options: { cryptoSource: CryptoSource.CryptoNews, category: 'ALTCOIN' },
        method: 'getCryptoNewsArticles',
        expectedArgs: { category: 'ALTCOIN' },
        response: { articles: ['cn-news'], hasMore: false },
      },
      {
        options: { cryptoSource: CryptoSource.Decrypt, category: 'NEWS' },
        method: 'getDecryptArticles',
        expectedArgs: { category: 'NEWS' },
        response: { articles: ['dec-news'], hasMore: true },
      },
    ])('routes to $method', async ({ options, method, expectedArgs, response }) => {
      const client = new CryptoClient({ apiKey: 'secret' });
      (httpClientInstance as any)[method].mockResolvedValueOnce(response);

      const result = await client.getNews(options as any);

      expect((httpClientInstance as any)[method]).toHaveBeenCalledWith(expectedArgs);
      expect(result).toEqual(response);
    });

    it('throws for invalid crypto source', () => {
      const client = new CryptoClient({ apiKey: 'secret' });

      try {
        client.getNews({ cryptoSource: 'UNKNOWN' } as any);
        throw new Error('Should throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ClientError);
        expect((error as ClientError).type).toBe(ClientErrorType.UNKNOWN);
      }
    });
  });

  describe('getNewsDetail routing', () => {
    it.each([
      {
        options: { cryptoSource: CryptoSource.CryptoDaily, url: 'https://detail' },
        method: 'getCryptoDailyArticleDetail',
        expectedArgs: 'https://detail',
      },
      {
        options: { cryptoSource: CryptoSource.Decrypt, id: '123' },
        method: 'getDecryptArticle',
        expectedArgs: '123',
      },
      {
        options: { cryptoSource: CryptoSource.Cointelegraph, slug: 'telegraph' },
        method: 'getCointelegraphArticle',
        expectedArgs: 'telegraph',
      },
      {
        options: { cryptoSource: CryptoSource.CryptoNews, slug: 'crypto-news' },
        method: 'getCryptoNewsArticle',
        expectedArgs: 'crypto-news',
      },
      {
        options: { cryptoSource: CryptoSource.Bitcoinist, slug: 'bitcoinist' },
        method: 'getBitcoinistArticle',
        expectedArgs: 'bitcoinist',
      },
    ])('routes detail to $method', async ({ options, method, expectedArgs }) => {
      const client = new CryptoClient({ apiKey: 'secret' });
      (httpClientInstance as any)[method].mockResolvedValueOnce({ id: method });

      const result = await client.getNewsDetail(options as any);

      expect((httpClientInstance as any)[method]).toHaveBeenCalledWith(expectedArgs);
      expect(result).toEqual({ id: method });
    });

    it('throws for unsupported detail source', () => {
      const client = new CryptoClient({ apiKey: 'secret' });

      try {
        client.getNewsDetail({ cryptoSource: 'UNKNOWN', slug: 'slug' } as any);
        throw new Error('Should throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ClientError);
        expect((error as ClientError).type).toBe(ClientErrorType.UNKNOWN);
      }
    });
  });

  describe('getSentiment routing', () => {
    it.each([
      {
        options: { cryptoSource: CryptoSource.Bitcoinist, interval: '1h', category: 'BITCOIN' },
        method: 'getBitcoinistSentiment',
      },
      {
        options: { cryptoSource: CryptoSource.CoinDesk, interval: '1h', category: 'MARKETS' },
        method: 'getCoinDeskSentiment',
      },
      {
        options: { cryptoSource: CryptoSource.Cointelegraph, interval: '1h', category: 'BLOCKCHAIN' },
        method: 'getCointelegraphSentiment',
      },
      {
        options: { cryptoSource: CryptoSource.CryptoDaily, interval: '1h', category: 'DEFI' },
        method: 'getCryptoDailySentiment',
      },
      {
        options: { cryptoSource: CryptoSource.CryptoNews, interval: '1h', category: 'ALTCOIN' },
        method: 'getCryptoNewsSentiment',
      },
      {
        options: { cryptoSource: CryptoSource.Decrypt, interval: '1h', category: 'NEWS' },
        method: 'getDecryptSentiment',
      },
    ])('routes sentiment to $method', async ({ options, method }) => {
      const client = new CryptoClient({ apiKey: 'secret' });
      (httpClientInstance as any)[method].mockResolvedValueOnce({ interval: '1h', source: method });

      const result = await client.getSentiment(options as any);

      expect((httpClientInstance as any)[method]).toHaveBeenCalledWith({
        interval: '1h',
        category: (options as any).category,
      });
      expect(result).toEqual({ interval: '1h', source: method });
    });

    it('throws for unsupported sentiment source', () => {
      const client = new CryptoClient({ apiKey: 'secret' });

      try {
        client.getSentiment({ cryptoSource: 'UNKNOWN', interval: '1h' } as any);
        throw new Error('Should throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ClientError);
        expect((error as ClientError).type).toBe(ClientErrorType.UNKNOWN);
      }
    });
  });
});

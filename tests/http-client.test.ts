import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  HTTP_DEFAULT_BASE_URL,
  HTTP_DEFAULT_TIMEOUT,
  HTTP_LIMIT_DEFAULT,
  HTTP_PAGE_DEFAULT,
} from '../src/constants/http.js';
import { Routes } from '../src/constants/routes.js';
import { ClientErrorType } from '../src/enums/errors.js';
import { ResponseStatus } from '../src/enums/response.js';
import {
  ClientApiError,
  ClientConfigError,
  ClientError,
  ClientHttpError,
  ClientNetworkError,
} from '../src/errors.js';
import { HttpClient } from '../src/http-client.js';

const axiosMocks = vi.hoisted(() => {
  const getMock = vi.fn();
  const axiosInstance = { get: getMock };
  const createMock = vi.fn(() => axiosInstance);
  const isAxiosErrorMock = (error: unknown) => Boolean((error as any)?.isAxiosError);

  return { getMock, axiosInstance, createMock, isAxiosErrorMock };
});

vi.mock('axios', () => ({
  default: {
    create: axiosMocks.createMock,
    isAxiosError: axiosMocks.isAxiosErrorMock,
  },
  create: axiosMocks.createMock,
  isAxiosError: axiosMocks.isAxiosErrorMock,
  __esModule: true,
}));

const { getMock, createMock } = axiosMocks;

const successResponse = <T>(data: T) => ({
  data: { status: ResponseStatus.SUCCESS, data },
});

describe('HttpClient', () => {
  beforeEach(() => {
    getMock.mockReset();
    createMock.mockClear();
    getMock.mockResolvedValue(successResponse({}));
  });

  it('throws config error when apiKey is missing', () => {
    expect(() => new HttpClient({ apiKey: '' as unknown as string })).toThrow(ClientConfigError);
  });

  it('uses default HTTP configuration', () => {
    new HttpClient({ apiKey: 'test-key' });

    expect(createMock).toHaveBeenCalledWith({
      baseURL: HTTP_DEFAULT_BASE_URL,
      timeout: HTTP_DEFAULT_TIMEOUT,
    });
  });

  it('applies custom HTTP configuration when provided', () => {
    new HttpClient({ apiKey: 'test-key', baseURL: 'http://example.com', timeout: 5000 });

    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'http://example.com',
      timeout: 5000,
    });
  });

  it('fetches articles with interval and headers', async () => {
    const articles = [{ id: 1 }];
    getMock.mockResolvedValue(successResponse(articles));
    const client = new HttpClient({ apiKey: 'secret' });

    const result = await client.getArticles({ interval: '24h' });

    expect(result).toEqual(articles);
    expect(getMock).toHaveBeenCalledWith(Routes.articles.list, {
      params: { interval: '24h' },
      headers: { 'X-RapidAPI-Key': 'secret' },
    });
  });

  it('throws when required values are missing', async () => {
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '' })).rejects.toBeInstanceOf(ClientConfigError);
    await expect(client.getBitcoinistArticle('')).rejects.toBeInstanceOf(ClientConfigError);
  });

  it('applies default pagination when params are absent', async () => {
    const paginated = { data: [{ id: 1 }], hasNextPage: true };
    getMock.mockResolvedValue(successResponse(paginated));
    const client = new HttpClient({ apiKey: 'secret' });

    const result = await client.getCryptoNewsArticles({});

    expect(result).toEqual({ articles: paginated.data, hasMore: true });
    expect(getMock).toHaveBeenCalledWith(Routes.cryptoNews.list, {
      params: { page: HTTP_PAGE_DEFAULT, limit: HTTP_LIMIT_DEFAULT },
      headers: { 'X-RapidAPI-Key': 'secret' },
    });
  });

  describe('list endpoints', () => {
    it('keeps provided pagination params intact', async () => {
      getMock.mockResolvedValue(successResponse({ data: [], hasNextPage: false }));
      const client = new HttpClient({ apiKey: 'secret' });

      await client.getBitcoinistArticles({ page: 2, limit: 5 });

      expect(getMock).toHaveBeenCalledWith(Routes.bitcoinist.list, {
        params: { page: 2, limit: 5 },
        headers: { 'X-RapidAPI-Key': 'secret' },
      });
    });

    it.each([
      {
        name: 'bitcoinist',
        call: (client: HttpClient) => client.getBitcoinistArticles({}),
        url: Routes.bitcoinist.list,
      },
      {
        name: 'coin desk',
        call: (client: HttpClient) => client.getCoinDeskArticles({}),
        url: Routes.coinDesk.list,
      },
      {
        name: 'cointelegraph',
        call: (client: HttpClient) => client.getCointelegraphArticles({}),
        url: Routes.cointelegraph.list,
      },
      {
        name: 'crypto daily',
        call: (client: HttpClient) => client.getCryptoDailyArticles({}),
        url: Routes.cryptoDaily.list,
      },
      {
        name: 'crypto news',
        call: (client: HttpClient) => client.getCryptoNewsArticles({}),
        url: Routes.cryptoNews.list,
      },
      {
        name: 'decrypt',
        call: (client: HttpClient) => client.getDecryptArticles({}),
        url: Routes.decrypt.list,
      },
    ])('fetches $name list with pagination defaults', async ({ call, url }) => {
      const paginated = { data: [{ id: 1 }], hasNextPage: false };
      getMock.mockResolvedValue(successResponse(paginated));
      const client = new HttpClient({ apiKey: 'secret' });

      const result = await call(client);

      expect(result).toEqual({ articles: paginated.data, hasMore: false });
      expect(getMock).toHaveBeenCalledWith(url, {
        params: { page: HTTP_PAGE_DEFAULT, limit: HTTP_LIMIT_DEFAULT },
        headers: { 'X-RapidAPI-Key': 'secret' },
      });
    });
  });

  it('returns empty defaults when paginated payload is missing', async () => {
    getMock.mockResolvedValue(successResponse({}));
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getBitcoinistArticles({})).resolves.toEqual({ articles: [], hasMore: false });
    await expect(client.getCoinDeskArticles({})).resolves.toEqual({ articles: [], hasMore: false });
    await expect(client.getCointelegraphArticles({})).resolves.toEqual({ articles: [], hasMore: false });
    await expect(client.getCryptoDailyArticles({})).resolves.toEqual({ articles: [], hasMore: false });
    await expect(client.getCryptoNewsArticles({})).resolves.toEqual({ articles: [], hasMore: false });
    await expect(client.getDecryptArticles({})).resolves.toEqual({ articles: [], hasMore: false });
  });

  describe('article detail endpoints', () => {
    it.each([
      {
        name: 'bitcoinist',
        call: (client: HttpClient) => client.getBitcoinistArticle('slug value'),
        url: Routes.bitcoinist.detail('slug value'),
        params: undefined,
      },
      {
        name: 'cointelegraph',
        call: (client: HttpClient) => client.getCointelegraphArticle('coin-telegraph'),
        url: Routes.cointelegraph.detail('coin-telegraph'),
        params: undefined,
      },
      {
        name: 'crypto news',
        call: (client: HttpClient) => client.getCryptoNewsArticle('crypto-news'),
        url: Routes.cryptoNews.detail('crypto-news'),
        params: undefined,
      },
      {
        name: 'decrypt',
        call: (client: HttpClient) => client.getDecryptArticle('123'),
        url: Routes.decrypt.detail('123'),
        params: undefined,
      },
      {
        name: 'crypto daily',
        call: (client: HttpClient) => client.getCryptoDailyArticleDetail('https://example.com'),
        url: Routes.cryptoDaily.detail,
        params: { url: 'https://example.com' },
      },
    ])('calls correct route for $name detail', async ({ call, url, params }) => {
      getMock.mockResolvedValue(successResponse({ id: 'abc' }));
      const client = new HttpClient({ apiKey: 'secret' });

      await call(client);

      expect(getMock).toHaveBeenCalledWith(url, {
        params,
        headers: { 'X-RapidAPI-Key': 'secret' },
      });
    });
  });

  describe('sentiment endpoints', () => {
    it.each([
      {
        name: 'articles sentiment',
        call: (client: HttpClient) => client.getArticlesSentiment({ interval: '1h' }),
        url: Routes.articles.sentiment,
        expectedParams: { interval: '1h' },
      },
      {
        name: 'bitcoinist sentiment',
        call: (client: HttpClient) =>
          client.getBitcoinistSentiment({ interval: '1h', category: undefined }),
        url: Routes.bitcoinist.sentiment,
        expectedParams: { interval: '1h', category: undefined },
      },
      {
        name: 'coin desk sentiment',
        call: (client: HttpClient) =>
          client.getCoinDeskSentiment({ interval: '1h', category: undefined }),
        url: Routes.coinDesk.sentiment,
        expectedParams: { interval: '1h', category: undefined },
      },
      {
        name: 'cointelegraph sentiment',
        call: (client: HttpClient) =>
          client.getCointelegraphSentiment({ interval: '1h', category: undefined }),
        url: Routes.cointelegraph.sentiment,
        expectedParams: { interval: '1h', category: undefined },
      },
      {
        name: 'crypto daily sentiment',
        call: (client: HttpClient) =>
          client.getCryptoDailySentiment({ interval: '1h', category: undefined }),
        url: Routes.cryptoDaily.sentiment,
        expectedParams: { interval: '1h', category: undefined },
      },
      {
        name: 'crypto news sentiment',
        call: (client: HttpClient) =>
          client.getCryptoNewsSentiment({ interval: '1h', category: undefined }),
        url: Routes.cryptoNews.sentiment,
        expectedParams: { interval: '1h', category: undefined },
      },
      {
        name: 'decrypt sentiment',
        call: (client: HttpClient) =>
          client.getDecryptSentiment({ interval: '1h', category: undefined }),
        url: Routes.decrypt.sentiment,
        expectedParams: { interval: '1h', category: undefined },
      },
    ])('calls correct route for $name', async ({ call, url, expectedParams }) => {
      getMock.mockResolvedValue(successResponse({ interval: '1h', sentimentSummary: [] }));
      const client = new HttpClient({ apiKey: 'secret' });

      await call(client);

      expect(getMock).toHaveBeenCalledWith(url, {
        params: expectedParams,
        headers: { 'X-RapidAPI-Key': 'secret' },
      });
    });
  });

  it('throws ClientApiError when API reports an error', async () => {
    getMock.mockResolvedValue({
      data: { status: ResponseStatus.ERROR, message: 'API error' },
    });
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '1h' })).rejects.toMatchObject({
      name: 'ApiError',
      type: ClientErrorType.API,
    });
  });

  it('throws ClientApiError when API responds without payload', async () => {
    getMock.mockResolvedValue({ data: undefined });
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '1h' })).rejects.toMatchObject({
      name: 'ApiError',
      type: ClientErrorType.API,
    });
  });

  it('wraps HTTP errors from axios', async () => {
    const error = Object.assign(new Error('Request failed'), {
      isAxiosError: true,
      response: { status: 500, data: { error: 'server' } },
    });
    getMock.mockRejectedValue(error);
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '1h' })).rejects.toBeInstanceOf(ClientHttpError);
  });

  it('wraps network errors from axios', async () => {
    const error = Object.assign(new Error('Network down'), { isAxiosError: true });
    getMock.mockRejectedValue(error);
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '1h' })).rejects.toBeInstanceOf(ClientNetworkError);
  });

  it('wraps unexpected errors as ClientError', async () => {
    getMock.mockRejectedValue(new Error('Unknown failure'));
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '1h' })).rejects.toBeInstanceOf(ClientError);
  });

  it('wraps non-error values as unknown ClientError', async () => {
    getMock.mockRejectedValue('Unknown failure');
    const client = new HttpClient({ apiKey: 'secret' });

    await expect(client.getArticles({ interval: '1h' })).rejects.toMatchObject({
      type: ClientErrorType.UNKNOWN,
      message: 'An unknown error occurred',
    });
  });
});

# @z-scraper/crypto-api

> TypeScript/JavaScript SDK for the **Crypto API** – aggregate crypto news from multiple sources with **AI-powered sentiment analysis** via RapidAPI.

[![npm version](https://img.shields.io/npm/v/@z-scraper/crypto-api.svg)](https://www.npmjs.com/package/@z-scraper/crypto-api)
[![npm downloads](https://img.shields.io/npm/dm/@z-scraper/crypto-api.svg)](https://www.npmjs.com/package/@z-scraper/crypto-api)
[![CI](https://github.com/z-scraper/crypto-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/z-scraper/crypto-api/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/z-scraper/crypto-api/badge.svg?branch=main)](https://coveralls.io/github/z-scraper/crypto-api?branch=main)
[![License](https://img.shields.io/github/license/z-scraper/crypto-api.svg)](https://github.com/z-scraper/crypto-api/blob/main/LICENSE)

👉 Live API on RapidAPI: **[Crypto API](https://rapidapi.com/zscraper/api/z-crypto-news)**

The `@z-scraper/crypto-api` package provides a simple, type-safe client for the **Crypto API**, which aggregates cryptocurrency news from multiple major sources and enriches it with **AI sentiment (positive / negative / neutral)**.

This SDK is designed for developers building:

- 🧠 **Trading bots** that use news + sentiment as signals
- 📊 **Dashboards & alerting systems**
- 📚 **Research tools & data pipelines**

---

## Features

- 📡 **Single client** for all Crypto API endpoints
- 📰 **Aggregated news** from multiple sources (e.g. CoinDesk, Cointelegraph, etc.)
- 🧠 **AI-powered sentiment** per article
- 🎯 Easy filter parameters (source, sentiment, date range, limit, pagination…)
- ✅ First-class **TypeScript types** for inputs & responses
- 🧪 **100% unit test coverage** with Vitest and strict coverage thresholds

---

## Installation

```bash
npm install @z-scraper/crypto-api
# or
yarn add @z-scraper/crypto-api
# or
pnpm add @z-scraper/crypto-api
```

> **Node.js**: `>=18` is recommended.

---

## Getting started

### 1. Get your RapidAPI key

1. Go to the **Crypto API** listing on RapidAPI
2. Subscribe to a plan
3. Copy your `x-rapidapi-key`

### 2. Create a client

```ts
import { CryptoApiClient } from '@z-scraper/crypto-api';

const client = new CryptoApiClient({
  apiKey: process.env.RAPIDAPI_KEY as string,
  // Optional: override baseURL if needed
  // baseURL: "https://z-crypto-news.p.rapidapi.com",
});
```

---

## Quickstart

### Fetch latest news

```ts
import { CryptoApiClient } from '@z-scraper/crypto-api';

async function main() {
  const client = new CryptoApiClient({
    apiKey: process.env.RAPIDAPI_KEY as string,
  });

  const news = await client.getNews();

  console.log(`Fetched ${news.articles.length} articles`);
  console.log(news.articles[0]);
}

main().catch(console.error);
```

### Filter by source & sentiment

```ts
const res = await client.getNews({
  source: 'coindesk',
  sentiment: 'positive',
  limit: 20,
});

for (const article of res.articles) {
  console.log(`[${article.sentiment}] ${article.title}`);
}
```

### Fetch a single article by ID

```ts
const article = await client.getArticleById('ARTICLE_ID_HERE');

console.log(article.title);
console.log(article.content);
```

---

## API

> ⚠️ The exact shape of responses and available filters may evolve as the Crypto API grows.  
> Always refer to the official API docs on RapidAPI for the latest details.

### `CryptoApiClient`

```ts
new CryptoApiClient(options: CryptoApiClientOptions)
```

#### `CryptoApiClientOptions`

```ts
interface CryptoApiClientOptions {
  /**
   * Your RapidAPI key for the Crypto API.
   */
  apiKey: string;

  /**
   * Optional base URL override.
   * Defaults to the public Crypto API base URL.
   */
  baseURL?: string;

  /**
   * Optional request timeout in milliseconds.
   * Default: 10_000 (10 seconds)
   */
  timeoutMs?: number;
}
```

---

### `client.getNews(params?)`

Fetches a list of news articles, optionally filtered by source, sentiment, or date range.

```ts
interface GetNewsParams {
  source?: string; // e.g. "coindesk", "cointelegraph"
  sentiment?: 'positive' | 'negative' | 'neutral';
  from?: string; // ISO 8601 date, e.g. "2025-01-01"
  to?: string; // ISO 8601 date
  limit?: number; // number of articles to return
  page?: number; // pagination
}

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string; // ISO 8601
  sentiment?: 'positive' | 'negative' | 'neutral';
  summary?: string;
  content?: string;
  [key: string]: unknown;
}

interface GetNewsResponse {
  articles: NewsArticle[];
  total?: number;
  page?: number;
  hasMore?: boolean;
}
```

**Example:**

```ts
const result = await client.getNews({
  source: 'coindesk',
  sentiment: 'negative',
  limit: 10,
});

console.log(result.articles.map((a) => a.title));
```

---

### `client.getArticleById(id)`

Fetch full details for a single article.

```ts
const article = await client.getArticleById('some-article-id');

console.log(article.title);
console.log(article.sentiment);
console.log(article.content);
```

---

## Configuration

### Environment variables

Typical `.env`:

```bash
RAPIDAPI_KEY=your_rapidapi_key_here
```

Usage:

```ts
const client = new CryptoApiClient({
  apiKey: process.env.RAPIDAPI_KEY as string,
});
```

### Custom base URL

If you run your own gateway / proxy:

```ts
const client = new CryptoApiClient({
  apiKey: process.env.RAPIDAPI_KEY as string,
  baseURL: 'https://my-proxy.example.com/crypto-api',
});
```

---

## Error handling

All methods throw on HTTP or API-level errors.

```ts
try {
  const result = await client.getNews({ source: 'coindesk' });
  console.log(result.articles.length);
} catch (err: any) {
  // Example:
  // - invalid API key
  // - rate limit exceeded
  // - network error, etc.
  console.error('Crypto API request failed:', err.message || err);
}
```

If you need more control, you can inspect `err.response` when using Axios under the hood (depending on implementation).

---

## TypeScript support

This SDK is written in **TypeScript** and ships its own type definitions:

```ts
import type { GetNewsParams, NewsArticle } from '@z-scraper/crypto-api';
```

You get autocompletion and type checking out of the box in modern editors.

---

## Testing

This repository is configured to use:

- [Vitest](https://vitest.dev/) for unit tests
- [Nock](https://github.com/nock/nock) to mock HTTP calls

### Run all tests

```bash
npm test
# or
npm run test
```

### Recommended structure

```txt
src/
  index.ts
  client.ts
test/
  unit/
    client.test.ts
  integration/
    client.integration.test.ts
```

- **Unit tests** mock HTTP requests and do **not** hit the real API.
- **Integration tests** (optional) can call the real API using `RAPIDAPI_KEY` from your environment.

---

## Versioning & stability

The SDK currently follows **0.x** versioning while the API and client surface are being refined.

- `0.0.x`: prototype / internal testing
- `0.1.x`: early public use, **breaking changes possible**
- `1.x`: stable, semver guarantees for the public API surface

Breaking changes in `0.x` may happen without a major version bump. Check the changelog and release notes when upgrading.

---

## Roadmap

Planned improvements:

- ✅ Basic news listing & article detail helpers
- ✅ 100% unit test coverage with strict thresholds
- ⏳ Convenience methods for sentiment-only / summary views
- ⏳ Built-in pagination helpers
- ⏳ Additional utilities for trading-bot workflows

Feature requests & PRs are very welcome!

---

## License

This SDK is released under the [MIT License](./LICENSE).

---

## Support

If you run into issues:

- Open an [Issue](https://github.com/z-scraper/crypto-api/issues)
- Describe:
  - SDK version
  - Node version
  - Example code
  - Full error message

If this SDK is useful to you, a ⭐ on the repo helps a lot!

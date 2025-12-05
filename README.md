# @z-scraper/crypto-api

> TypeScript/JavaScript SDK for the **Crypto API** – aggregate crypto news from multiple sources with **AI-powered sentiment analysis** via RapidAPI.

[![npm version](https://img.shields.io/npm/v/@z-scraper/crypto-api.svg)](https://www.npmjs.com/package/@z-scraper/crypto-api)
[![npm downloads](https://img.shields.io/npm/dm/@z-scraper/crypto-api.svg)](https://www.npmjs.com/package/@z-scraper/crypto-api)
[![CI](https://github.com/z-scraper/crypto-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/z-scraper/crypto-api/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/z-scraper/crypto-api/badge.svg?branch=main)](https://coveralls.io/github/z-scraper/crypto-api?branch=main)
[![License](https://img.shields.io/github/license/z-scraper/crypto-api.svg)](https://github.com/z-scraper/crypto-api/blob/main/LICENSE)
The `@z-scraper/crypto-api` package provides a simple, type-safe client for the **Crypto API**, which aggregates cryptocurrency news from multiple major sources and enriches it with **AI sentiment (positive / negative / neutral)**.

The SDK is designed for:

- 🧠 **Trading bots** that use news + sentiment as signals
- 📊 **Dashboards & alerting systems**
- 📚 **Research tools & data pipelines**
- 🧪 Local development with **100% unit test coverage** (Vitest + coverage thresholds)

---

## Features

- 📡 **Single client** for all Crypto API endpoints
- 📰 **Aggregated news** from multiple sources (e.g. CoinDesk, Cointelegraph, etc.)
- 🧠 **AI-powered sentiment** per article
- 🧩 Easy filter parameters (source, sentiment, date range, limit…)
- ✅ First-class **TypeScript types**
- 🛡️ Typed errors for API, HTTP, network, and config issues
- 🧪 Built-in support for **unit tests** (Vitest with coverage thresholds)

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

1. Go to the **[Crypto API](https://rapidapi.com/zscraper/api/z-crypto-news)** listing on RapidAPI
2. Subscribe to a plan
3. Copy your `x-rapidapi-key`

### 2. Create a client

```ts
import { CryptoClient } from '@z-scraper/crypto-api';

const client = new CryptoClient({
  apiKey: process.env.RAPIDAPI_KEY as string,
  // Optional: override baseURL if needed
  // baseURL: "https://your-crypto-api-endpoint",
});
```

---

## Quickstart

### Fetch latest news from a source

```ts
import { CryptoClient, CryptoSource } from '@z-scraper/crypto-api';

async function main() {
  const client = new CryptoClient({
    apiKey: process.env.RAPIDAPI_KEY as string,
  });

  const news = await client.getNews({
    cryptoSource: CryptoSource.Bitcoinist,
    limit: 20,
  });

  console.log(`Fetched ${news.articles.length} articles`);
  console.log(news.articles[0]);
}

main().catch(console.error);
```

### Get sentiment for a source

```ts
import { CryptoSource } from '@z-scraper/crypto-api';

const sentiment = await client.getSentiment({
  cryptoSource: CryptoSource.CoinDesk,
  interval: '1d',
});

console.log(sentiment.sentimentSummary);
```

### Fetch article detail

```ts
import { CryptoSource } from '@z-scraper/crypto-api';

const article = await client.getNewsDetail({
  cryptoSource: CryptoSource.Cointelegraph,
  slug: 'bitcoin-price-surges-to-new-high',
});

console.log(article.title);
console.log(article.content);
```

### Get aggregated articles (all sources)

```ts
const articles = await client.getArticles('3h');
console.log(articles.length);
```

---

## API

> ⚠️ The exact shape of responses and available filters may evolve as the Crypto API grows.  
> Always refer to the official API docs on RapidAPI for the latest details.

### `CryptoClient`

```ts
new CryptoClient(options: CryptoClientOptions)
```

#### `CryptoClientOptions`

```ts
interface CryptoClientOptions {
  /**
   * Your RapidAPI key for the Crypto API.
   */
  apiKey: string;

  /**
   * Optional base URL override.
   * Defaults to the public RapidAPI Crypto API base URL.
   */
  baseURL?: string;

  /**
   * Optional request timeout in milliseconds.
   * Default: 10_000 (10 seconds)
   */
  timeout?: number;
}
```

Defaults used internally:

- `baseURL`: `https://z-crypto-news.p.rapidapi.com`
- `timeout`: `10000` ms
- Pagination fallback: `page = 1`, `limit = 10`

---

### `client.getNews(options)`

Fetches paginated news for one source. `options.cryptoSource` is required and drives the rest of the params:

- `CryptoSource.Bitcoinist | CoinDesk | Cointelegraph | CryptoDaily | CryptoNews`: supports `page`, `limit`, `search`, and source-specific `category`. CoinDesk/Bitcoinist/CryptoNews also accept `paginationToken`.
- `CryptoSource.Decrypt`: supports `page`, `limit`, `search`, `category`, `sort`, `isEditorPick`.

Returns `{ articles: Article[]; hasMore: boolean }`. Date-like fields are returned as `Date` instances (`time`, `publishedAt`).

---

### `client.getNewsDetail(options)`

Fetch full article detail for a single source:

- `CryptoDaily`: `{ cryptoSource: CryptoSource.CryptoDaily; url: string }`
- `Decrypt`: `{ cryptoSource: CryptoSource.Decrypt; id: string }`
- Others: `{ cryptoSource: CryptoSource.<Source>; slug: string }`

---

### `client.getSentiment(options)`

Returns sentiment summary for a source: `{ interval, totalArticles, sentimentSummary }`. Requires `interval` (e.g. `1d`, `3h`) and optional `category` depending on source.

---

### `client.getArticles(interval)`

Aggregated articles across all sources (ULTRA/MEGA plans). `interval` is required (e.g. `3h`). Returns `Article[]`.

### `client.getArticlesSentiment(interval)`

Aggregated sentiment across all sources. `interval` required.

---

## Supported sources & enums

The SDK exposes enums to keep your calls type-safe:

- `CryptoSource`: `Bitcoinist`, `CoinDesk`, `Cointelegraph`, `CryptoDaily`, `CryptoNews`, `Decrypt`
- Categories: `BitcoinistCategory`, `CoinDeskCategory`, `CointelegraphCategory`, `CryptoDailyCategory`, `CryptoNewsCategory`, `DecryptCategory`
- Sentiment: `SentimentType` (`POSITIVE`, `NEUTRAL`, `NEGATIVE`)
- Response status: `ResponseStatus` (`SUCCESS`, `ERROR`)
- Content blocks in rich article bodies: `ContentBlockType` (`HEADING`, `PARAGRAPH`, `IMAGE`, etc.)

Example:

```ts
import { CryptoSource, BitcoinistCategory } from '@z-scraper/crypto-api';

await client.getNews({
  cryptoSource: CryptoSource.Bitcoinist,
  category: BitcoinistCategory.BITCOIN_PRICE,
  limit: 5,
});
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
const client = new CryptoClient({
  apiKey: process.env.RAPIDAPI_KEY as string,
});
```

### Custom base URL

If you run your own gateway / proxy:

```ts
const client = new CryptoClient({
  apiKey: process.env.RAPIDAPI_KEY as string,
  baseURL: 'https://my-proxy.example.com/crypto-api',
});
```

---

## Error handling

All methods throw on HTTP or API-level errors.

```ts
try {
  const result = await client.getNews({ cryptoSource: CryptoSource.CoinDesk });
  console.log(result.articles.length);
} catch (err: any) {
  // Example:
  // - invalid API key
  // - rate limit exceeded
  // - network error, etc.
  console.error('Crypto API request failed:', err.message || err);
}
```

You can also inspect `err.response` when using Axios under the hood (depending on implementation).

---

## TypeScript support

This SDK is written in **TypeScript** and ships its own type definitions:

```ts
import { CryptoSource } from '@z-scraper/crypto-api';
import type { IOptionNews, IArticlesResponse } from '@z-scraper/crypto-api';
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
tests/
  http-client.test.ts
  client.test.ts
  index.test.ts
```

- **Unit tests** mock HTTP requests and do **not** hit the real API.
- Coverage thresholds are enforced at **95%+** (current suite is 100% statements/lines).
- **Integration tests** (optional) can call the real API using `RAPIDAPI_KEY` from your environment.

---

## Coverage reporting (Coveralls)

This repo is configured to push coverage to Coveralls from the generated `coverage/lcov.info`.

```bash
export COVERALLS_REPO_TOKEN=your_token   # if not using CI service injection
npm run report:coveralls
```

In CI (GitHub Actions, etc.), make sure `COVERALLS_REPO_TOKEN` or the relevant CI-specific token is available and that `npm run report:coveralls` runs after tests.

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) covers:

- PRs and pushes to `main` / `develop`: install, run tests with coverage, send `coverage/lcov.info` to Coveralls.
- Tags starting with `v*`: repeat tests/coverage then publish to npm.

Required secrets:

- `COVERALLS_REPO_TOKEN` – for Coveralls uploads (public repos may work with `GITHUB_TOKEN`, but set this for private repos).
- `NPM_TOKEN` – npm access token with publish rights.

To release: create a tag `vX.Y.Z` (aligned with `package.json` version) and push it; the workflow will publish automatically.

---

## Versioning & stability

The SDK currently follows **0.x** versioning while the API and client surface are being refined.

- `0.0.1`: prototype / internal testing
- `0.1.x`: early public use, **breaking changes possible**
- `1.x`: stable, semver guarantees for the public API surface

Breaking changes in `0.x` may happen without a major version bump. Check the changelog and release notes when upgrading.

---

## Roadmap

Planned improvements:

- ✅ Basic news listing & article detail helpers
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

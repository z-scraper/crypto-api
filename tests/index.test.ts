import { describe, expect, it } from 'vitest';
import * as sdk from '../src/index.js';
import { ContentBlockType } from '../src/enums/content-block.js';
import { SentimentType } from '../src/enums/sentiment.js';

describe('package exports', () => {
  it('exposes primary client and enums', () => {
    expect(sdk.CryptoClient).toBeDefined();
    expect(sdk.CryptoSource.Decrypt).toBe('DECRYPT');
    expect(sdk.BitcoinistCategory.BITCOIN).toBe('BITCOIN');
    expect(SentimentType.NEGATIVE).toBe('NEGATIVE');
    expect(ContentBlockType.IMAGE).toBe('IMAGE');
  });
});

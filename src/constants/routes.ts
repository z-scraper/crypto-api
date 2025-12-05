const API_BASE = '/api/v1';

export const Routes = {
  articles: {
    list: `${API_BASE}/articles`,
    sentiment: `${API_BASE}/articles/sentiment-analysis`,
  },
  bitcoinist: {
    list: `${API_BASE}/bitcoinist`,
    detail: (slug: string) => `${API_BASE}/bitcoinist/${encodeURIComponent(slug)}`,
    sentiment: `${API_BASE}/bitcoinist/sentiment-analysis`,
  },
  coinDesk: {
    list: `${API_BASE}/coin-desk`,
    sentiment: `${API_BASE}/coin-desk/sentiment-analysis`,
  },
  cointelegraph: {
    list: `${API_BASE}/cointelegraph`,
    detail: (slug: string) => `${API_BASE}/cointelegraph/${encodeURIComponent(slug)}`,
    sentiment: `${API_BASE}/cointelegraph/sentiment-analysis`,
  },
  cryptoDaily: {
    list: `${API_BASE}/crypto-daily`,
    detail: `${API_BASE}/crypto-daily/detail`,
    sentiment: `${API_BASE}/crypto-daily/sentiment-analysis`,
  },
  cryptoNews: {
    list: `${API_BASE}/crypto-news`,
    detail: (slug: string) => `${API_BASE}/crypto-news/${encodeURIComponent(slug)}`,
    sentiment: `${API_BASE}/crypto-news/sentiment-analysis`,
  },
  decrypt: {
    list: `${API_BASE}/decrypt`,
    detail: (id: string) => `${API_BASE}/decrypt/${encodeURIComponent(id)}`,
    sentiment: `${API_BASE}/decrypt/sentiment-analysis`,
  },
} as const;

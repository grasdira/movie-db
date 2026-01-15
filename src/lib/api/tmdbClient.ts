const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const language: string = 'en-US';

/**
 * APIError Class
 */
export class APIError extends Error {
  status?: number;
  statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * 建立完整的 API URL
 */
function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${BASE_URL}${path}`);

  // 將參數加入 URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

/**
 * 通用的 fetch function
 */
async function fetchAPI<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = buildUrl(path, params);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 用 API request failed 明確指出錯誤來自 API fetching
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

/**
 * TMDB API Client
 * 只負責 API 呼叫，不處理資料轉換
 */
export const tmdbClient = {
  /**
   * 獲取正在上映的電影
   */
  getNowPlaying: (page: number = 1) =>
    fetchAPI(`/movie/now_playing`, {
      page: String(page),
      language,
    }),

  /**
   * 獲取熱門電影
   */
  getPopular: (page: number = 1) =>
    fetchAPI(`/movie/popular`, {
      page: String(page),
      language,
    }),

  /**
   * 獲取高評分電影
   */
  getTopRated: (page: number = 1) =>
    fetchAPI(`/movie/top_rated`, {
      page: String(page),
      language,
    }),

  /**
   * 獲取即將上映的電影
   */
  getUpcoming: (page: number = 1) =>
    fetchAPI(`/movie/upcoming`, {
      page: String(page),
      language,
    }),
};

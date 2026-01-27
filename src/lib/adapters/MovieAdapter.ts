import type {
  TMDBMovie,
  TMDBMovieListResponse,
  TMDBMovieDetailFull,
} from '@/lib/api/types';
import type {
  Movie,
  SearchResult,
  MovieDetail,
  Cast,
  Crew,
  Video,
  Review,
  ReviewList,
  Genre,
} from '@/features/movies/types/movie';

const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

/**
 * MovieAdapter 負責將 TMDB API 的資料格式轉換成應用程式內部使用的格式
 */
export class MovieAdapter {
  /**
   * 組合完整的圖片 URL
   * 支援不同尺寸以優化效能
   */
  private static getImageUrl(
    path: string | null,
    size: string = 'w500'
  ): string | null {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  /**
   * 建立空的評論列表
   */
  static createEmptyReviewList(): ReviewList {
    return {
      page: 1,
      reviews: [],
      totalPages: 1,
      totalResults: 0,
    };
  }

  /**
   * 將 TMDB 電影列表回應轉換為應用程式格式，適用於所有列表類 API
   */
  static toSearchResult(response: TMDBMovieListResponse): SearchResult {
    const movies = response.results.map((movie) => this.toMovie(movie));

    return {
      page: response.page,
      movies,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * 提取共用的基本欄位轉換邏輯
   */
  private static extractMovieBaseFields(
    movie: TMDBMovie | TMDBMovieDetailFull
  ): Pick<
    Movie,
    | 'id'
    | 'title'
    | 'originalTitle'
    | 'originalLanguage'
    | 'overview'
    | 'posterUrl'
    | 'backdropUrl'
    | 'releaseDate'
    | 'rating'
    | 'voteCount'
    | 'popularity'
  > {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      overview: movie.overview,
      posterUrl: this.getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: this.getImageUrl(movie.backdrop_path, 'w1280'),
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
    };
  }

  /**
   * 將單一 TMDB 電影資料轉換為應用程式格式
   */
  private static toMovie(movie: TMDBMovie): Movie {
    return {
      ...this.extractMovieBaseFields(movie),
      genreIds: movie.genre_ids,
    };
  }

  /**
   * 轉換電影類型
   */
  private static toGenres(
    genres: Array<{ id: number; name: string }>
  ): Genre[] {
    return genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
    }));
  }

  /**
   * 轉換演員資訊
   * 只取前 20 位演員
   */
  private static toCast(cast: TMDBMovieDetailFull['credits']['cast']): Cast[] {
    return cast.slice(0, 20).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profileUrl: this.getImageUrl(member.profile_path, 'w185'),
      order: member.order,
    }));
  }

  /**
   * 轉換劇組資訊
   * 只取重要職位:導演、編劇、製片人
   */
  private static toCrew(crew: TMDBMovieDetailFull['credits']['crew']): Crew[] {
    const importantJobs = ['Director', 'Screenplay', 'Writer', 'Producer'];

    return crew
      .filter((member) => importantJobs.includes(member.job))
      .map((member) => ({
        id: member.id,
        name: member.name,
        job: member.job,
        department: member.department,
        profileUrl: this.getImageUrl(member.profile_path, 'w185'),
      }));
  }

  /**
   * 轉換影片/預告片資訊
   * 只取 YouTube 官方預告片,並按照類型排序(Trailer > Teaser > Clip)
   */
  private static toVideos(
    videos: TMDBMovieDetailFull['videos']['results']
  ): Video[] {
    const typeOrder = { Trailer: 0, Teaser: 1, Clip: 2 };

    return videos
      .filter((video) => video.site === 'YouTube')
      .sort((a, b) => {
        // 優先顯示官方影片
        if (a.official !== b.official) {
          return a.official ? -1 : 1;
        }
        // 然後按照類型排序
        const aOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 999;
        const bOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 999;
        return aOrder - bOrder;
      })
      .slice(0, 6) // 只取前 6 個影片
      .map((video) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        official: video.official,
      }));
  }

  /**
   * 轉換評論資訊
   */
  private static toReviews(
    reviews: TMDBMovieDetailFull['reviews']['results']
  ): Review[] {
    return reviews.map((review) => ({
      id: review.id,
      author: review.author,
      authorUsername: review.author_details.username,
      avatarUrl: review.author_details.avatar_path
        ? this.getImageUrl(review.author_details.avatar_path, 'w185')
        : null,
      rating: review.author_details.rating,
      content: review.content,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    }));
  }

  /**
   * 轉換評論列表
   */
  static toReviewList(reviewsData: TMDBMovieDetailFull['reviews']): ReviewList {
    return {
      page: reviewsData.page,
      reviews: this.toReviews(reviewsData.results),
      totalPages: reviewsData.total_pages,
      totalResults: reviewsData.total_results,
    };
  }

  /**
   * 將 TMDB 電影詳細資訊轉換為應用程式格式
   */
  static toMovieDetail(response: TMDBMovieDetailFull): MovieDetail {
    return {
      ...this.extractMovieBaseFields(response),
      tagline: response.tagline,
      runtime: response.runtime,
      budget: response.budget,
      revenue: response.revenue,
      status: response.status,
      genres: this.toGenres(response.genres),
      cast: response.credits ? this.toCast(response.credits.cast) : [],
      crew: response.credits ? this.toCrew(response.credits.crew) : [],
      videos: response.videos ? this.toVideos(response.videos.results) : [],
      reviews: response.reviews
        ? this.toReviewList(response.reviews)
        : this.createEmptyReviewList(),
    };
  }
}

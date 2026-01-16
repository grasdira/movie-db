export interface Movie {
  id: number;
  title: string;
  originalLanguage: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
}

export interface MovieList {
  page: number;
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}

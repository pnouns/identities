export interface QueryResult<T> {
  isLoading: boolean;
  error: Error | null,
  data?: T,
}

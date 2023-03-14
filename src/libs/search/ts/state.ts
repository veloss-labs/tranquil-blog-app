export interface SearchStateOption<S> {
  initialQuery?: any;
  parser?: (query: Partial<S>) => S;
}

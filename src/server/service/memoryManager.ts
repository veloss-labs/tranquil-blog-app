class MemoryManager {
  private _cache: Map<string, boolean> = new Map();

  getItem(key: string) {
    return this._cache.get(key);
  }

  setItem(key: string, value: boolean) {
    this._cache.set(key, value);
  }

  removeItem(key: string) {
    this._cache.delete(key);
  }

  get length() {
    return this._cache.size;
  }

  makeLikeKey(key: string) {
    return `like_${key}`;
  }

  makeViewKey(key: string) {
    return `view_${key}`;
  }

  has(key: string) {
    return this._cache.has(key);
  }

  key(idx: number) {
    return [...this._cache.keys()][idx];
  }

  keys() {
    return [...this._cache.keys()];
  }

  clear() {
    this._cache.clear();
  }
}

export const memoryManager = new MemoryManager();

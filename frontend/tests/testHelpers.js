export const createStorageMock = () => {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    get length() {
      return store.size;
    },
    dump() {
      return Object.fromEntries(store.entries());
    },
  };
};

export const installBrowserStubs = () => {
  const localStorage = createStorageMock();
  const sessionStorage = createStorageMock();

  globalThis.window = {
    localStorage,
    sessionStorage,
    dispatchEvent() {},
    addEventListener() {},
    removeEventListener() {},
  };

  globalThis.localStorage = localStorage;
  globalThis.sessionStorage = sessionStorage;

  globalThis.Event = class Event {
    constructor(type) {
      this.type = type;
    }
  };

  globalThis.CustomEvent = class CustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.detail = options.detail;
    }
  };
};
import { InMemoryKeyStore, KeyStore, MergeKeyStore } from '@near-js/keystores';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

/** @hidden @module */

declare const browserIndex_BrowserLocalStorageKeyStore: typeof BrowserLocalStorageKeyStore;
declare const browserIndex_InMemoryKeyStore: typeof InMemoryKeyStore;
declare const browserIndex_KeyStore: typeof KeyStore;
declare const browserIndex_MergeKeyStore: typeof MergeKeyStore;
declare namespace browserIndex {
  export { browserIndex_BrowserLocalStorageKeyStore as BrowserLocalStorageKeyStore, browserIndex_InMemoryKeyStore as InMemoryKeyStore, browserIndex_KeyStore as KeyStore, browserIndex_MergeKeyStore as MergeKeyStore };
}

export { browserIndex as b };

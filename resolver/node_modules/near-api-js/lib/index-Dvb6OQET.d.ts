import { InMemoryKeyStore, KeyStore, MergeKeyStore } from '@near-js/keystores';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';

/** @ignore @module */

declare const index_BrowserLocalStorageKeyStore: typeof BrowserLocalStorageKeyStore;
declare const index_InMemoryKeyStore: typeof InMemoryKeyStore;
declare const index_KeyStore: typeof KeyStore;
declare const index_MergeKeyStore: typeof MergeKeyStore;
declare const index_UnencryptedFileSystemKeyStore: typeof UnencryptedFileSystemKeyStore;
declare namespace index {
  export { index_BrowserLocalStorageKeyStore as BrowserLocalStorageKeyStore, index_InMemoryKeyStore as InMemoryKeyStore, index_KeyStore as KeyStore, index_MergeKeyStore as MergeKeyStore, index_UnencryptedFileSystemKeyStore as UnencryptedFileSystemKeyStore };
}

export { index as i };

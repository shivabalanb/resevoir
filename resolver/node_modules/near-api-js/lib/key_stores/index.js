"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var key_stores_exports = {};
__export(key_stores_exports, {
  BrowserLocalStorageKeyStore: () => import_browser_local_storage_key_store.BrowserLocalStorageKeyStore,
  InMemoryKeyStore: () => import_in_memory_key_store.InMemoryKeyStore,
  KeyStore: () => import_keystore.KeyStore,
  MergeKeyStore: () => import_merge_key_store.MergeKeyStore,
  UnencryptedFileSystemKeyStore: () => import_unencrypted_file_system_keystore.UnencryptedFileSystemKeyStore
});
module.exports = __toCommonJS(key_stores_exports);
var import_keystore = require('./keystore.js');
var import_in_memory_key_store = require('./in_memory_key_store.js');
var import_browser_local_storage_key_store = require('./browser_local_storage_key_store.js');
var import_unencrypted_file_system_keystore = require('./unencrypted_file_system_keystore.js');
var import_merge_key_store = require('./merge_key_store.js');
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserLocalStorageKeyStore,
  InMemoryKeyStore,
  KeyStore,
  MergeKeyStore,
  UnencryptedFileSystemKeyStore
});

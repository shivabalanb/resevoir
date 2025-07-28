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
var index_exports = {};
__export(index_exports, {
  BrowserLocalStorageKeyStore: () => import_browser_local_storage_key_store.BrowserLocalStorageKeyStore,
  MultiContractBrowserLocalStorageKeyStore: () => import_multi_contract_browser_local_storage_key_store.MultiContractBrowserLocalStorageKeyStore
});
module.exports = __toCommonJS(index_exports);
var import_browser_local_storage_key_store = require('./browser_local_storage_key_store.cjs');
var import_multi_contract_browser_local_storage_key_store = require('./multi_contract_browser_local_storage_key_store.cjs');
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserLocalStorageKeyStore,
  MultiContractBrowserLocalStorageKeyStore
});

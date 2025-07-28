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
var browser_local_storage_key_store_exports = {};
__export(browser_local_storage_key_store_exports, {
  BrowserLocalStorageKeyStore: () => import_keystores_browser.BrowserLocalStorageKeyStore
});
module.exports = __toCommonJS(browser_local_storage_key_store_exports);
var import_keystores_browser = require("@near-js/keystores-browser");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserLocalStorageKeyStore
});

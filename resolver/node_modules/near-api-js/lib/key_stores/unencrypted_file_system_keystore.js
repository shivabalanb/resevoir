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
var unencrypted_file_system_keystore_exports = {};
__export(unencrypted_file_system_keystore_exports, {
  UnencryptedFileSystemKeyStore: () => import_keystores_node.UnencryptedFileSystemKeyStore,
  readKeyFile: () => import_keystores_node.readKeyFile
});
module.exports = __toCommonJS(unencrypted_file_system_keystore_exports);
var import_keystores_node = require("@near-js/keystores-node");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnencryptedFileSystemKeyStore,
  readKeyFile
});

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
var key_pair_exports = {};
__export(key_pair_exports, {
  KeyPair: () => import_crypto.KeyPair,
  KeyPairEd25519: () => import_crypto.KeyPairEd25519,
  KeyType: () => import_crypto.KeyType,
  PublicKey: () => import_crypto.PublicKey,
  Signature: () => import_crypto.Signature
});
module.exports = __toCommonJS(key_pair_exports);
var import_crypto = require("@near-js/crypto");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KeyPair,
  KeyPairEd25519,
  KeyType,
  PublicKey,
  Signature
});

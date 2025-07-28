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
var serialize_exports = {};
__export(serialize_exports, {
  Schema: () => import_borsh.Schema,
  base_decode: () => import_utils.baseDecode,
  base_encode: () => import_utils.baseEncode,
  deserialize: () => import_borsh.deserialize,
  serialize: () => import_borsh.serialize
});
module.exports = __toCommonJS(serialize_exports);
var import_borsh = require("borsh");
var import_utils = require("@near-js/utils");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Schema,
  base_decode,
  base_encode,
  deserialize,
  serialize
});

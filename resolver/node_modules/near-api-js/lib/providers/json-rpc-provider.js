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
var json_rpc_provider_exports = {};
__export(json_rpc_provider_exports, {
  ErrorContext: () => import_types.ErrorContext,
  JsonRpcProvider: () => import_providers.JsonRpcProvider,
  TypedError: () => import_types.TypedError
});
module.exports = __toCommonJS(json_rpc_provider_exports);
var import_types = require("@near-js/types");
var import_providers = require("@near-js/providers");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorContext,
  JsonRpcProvider,
  TypedError
});

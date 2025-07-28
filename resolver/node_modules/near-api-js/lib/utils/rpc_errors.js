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
var rpc_errors_exports = {};
__export(rpc_errors_exports, {
  ServerError: () => import_utils.ServerError,
  formatError: () => import_utils.formatError,
  getErrorTypeFromErrorMessage: () => import_utils.getErrorTypeFromErrorMessage,
  parseResultError: () => import_utils.parseResultError,
  parseRpcError: () => import_utils.parseRpcError
});
module.exports = __toCommonJS(rpc_errors_exports);
var import_utils = require("@near-js/utils");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ServerError,
  formatError,
  getErrorTypeFromErrorMessage,
  parseResultError,
  parseRpcError
});

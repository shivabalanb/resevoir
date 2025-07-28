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
var errors_exports = {};
__export(errors_exports, {
  ArgumentSchemaError: () => import_accounts.ArgumentSchemaError,
  ArgumentTypeError: () => import_types.ArgumentTypeError,
  ConflictingOptions: () => import_accounts.ConflictingOptions,
  ErrorContext: () => import_types.ErrorContext,
  PositionalArgsError: () => import_types.PositionalArgsError,
  TypedError: () => import_types.TypedError,
  UnknownArgumentError: () => import_accounts.UnknownArgumentError,
  UnsupportedSerializationError: () => import_accounts.UnsupportedSerializationError
});
module.exports = __toCommonJS(errors_exports);
var import_accounts = require("@near-js/accounts");
var import_types = require("@near-js/types");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArgumentSchemaError,
  ArgumentTypeError,
  ConflictingOptions,
  ErrorContext,
  PositionalArgsError,
  TypedError,
  UnknownArgumentError,
  UnsupportedSerializationError
});

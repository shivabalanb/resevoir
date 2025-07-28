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
var providers_exports = {};
__export(providers_exports, {
  ErrorContext: () => import_json_rpc_provider.ErrorContext,
  ExecutionOutcomeWithId: () => import_provider.ExecutionOutcomeWithId,
  FailoverRpcProvider: () => import_failover_rpc_provider.FailoverRpcProvider,
  FinalExecutionOutcome: () => import_provider.FinalExecutionOutcome,
  FinalExecutionStatus: () => import_provider.FinalExecutionStatus,
  FinalExecutionStatusBasic: () => import_provider.FinalExecutionStatusBasic,
  JsonRpcProvider: () => import_json_rpc_provider.JsonRpcProvider,
  Provider: () => import_provider.Provider,
  TypedError: () => import_json_rpc_provider.TypedError,
  getTransactionLastResult: () => import_provider.getTransactionLastResult
});
module.exports = __toCommonJS(providers_exports);
var import_provider = require('./provider.js');
var import_json_rpc_provider = require('./json-rpc-provider.js');
var import_failover_rpc_provider = require('./failover-rpc-provider.js');
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorContext,
  ExecutionOutcomeWithId,
  FailoverRpcProvider,
  FinalExecutionOutcome,
  FinalExecutionStatus,
  FinalExecutionStatusBasic,
  JsonRpcProvider,
  Provider,
  TypedError,
  getTransactionLastResult
});

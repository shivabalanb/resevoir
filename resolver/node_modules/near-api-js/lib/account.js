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
var account_exports = {};
__export(account_exports, {
  Account: () => import_accounts.Account,
  AccountAuthorizedApp: () => import_accounts.AccountAuthorizedApp,
  AccountBalance: () => import_accounts.AccountBalance,
  ChangeFunctionCallOptions: () => import_accounts.ChangeFunctionCallOptions,
  FunctionCallOptions: () => import_accounts.FunctionCallOptions,
  SignAndSendTransactionOptions: () => import_accounts.SignAndSendTransactionOptions,
  ViewFunctionCallOptions: () => import_accounts.ViewFunctionCallOptions
});
module.exports = __toCommonJS(account_exports);
var import_accounts = require("@near-js/accounts");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Account,
  AccountAuthorizedApp,
  AccountBalance,
  ChangeFunctionCallOptions,
  FunctionCallOptions,
  SignAndSendTransactionOptions,
  ViewFunctionCallOptions
});

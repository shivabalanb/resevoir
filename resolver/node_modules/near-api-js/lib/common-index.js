"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var common_index_exports = {};
__export(common_index_exports, {
  Account: () => import_account.Account,
  Connection: () => import_connection.Connection,
  Contract: () => import_contract.Contract,
  KeyPair: () => import_key_pair.KeyPair,
  KeyPairSigner: () => import_signer.KeyPairSigner,
  Near: () => import_near.Near,
  Signer: () => import_signer.Signer,
  accountCreator: () => accountCreator,
  providers: () => providers,
  transactions: () => transactions,
  utils: () => utils,
  validators: () => validators
});
module.exports = __toCommonJS(common_index_exports);
var providers = __toESM(require('./providers/index.js'));
var utils = __toESM(require('./utils/index.js'));
var transactions = __toESM(require('./transaction.js'));
var validators = __toESM(require('./validators.js'));
var import_account = require('./account.js');
var accountCreator = __toESM(require('./account_creator.js'));
var import_connection = require('./connection.js');
var import_signer = require('./signer.js');
var import_contract = require('./contract.js');
var import_key_pair = require('./utils/key_pair.js');
var import_near = require('./near.js');
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Account,
  Connection,
  Contract,
  KeyPair,
  KeyPairSigner,
  Near,
  Signer,
  accountCreator,
  providers,
  transactions,
  utils,
  validators
});

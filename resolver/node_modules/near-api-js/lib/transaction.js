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
var transaction_exports = {};
__export(transaction_exports, {
  AccessKey: () => import_transactions.AccessKey,
  AccessKeyPermission: () => import_transactions.AccessKeyPermission,
  Action: () => import_transactions.Action,
  AddKey: () => import_transactions.AddKey,
  CreateAccount: () => import_transactions.CreateAccount,
  DeleteAccount: () => import_transactions.DeleteAccount,
  DeleteKey: () => import_transactions.DeleteKey,
  DeployContract: () => import_transactions.DeployContract,
  FullAccessPermission: () => import_transactions.FullAccessPermission,
  FunctionCall: () => import_transactions.FunctionCall,
  FunctionCallPermission: () => import_transactions.FunctionCallPermission,
  SCHEMA: () => import_transactions.SCHEMA,
  Signature: () => import_transactions.Signature,
  SignedTransaction: () => import_transactions.SignedTransaction,
  Stake: () => import_transactions.Stake,
  Transaction: () => import_transactions.Transaction,
  Transfer: () => import_transactions.Transfer,
  addKey: () => addKey,
  createAccount: () => createAccount,
  createTransaction: () => import_transactions.createTransaction,
  deleteAccount: () => deleteAccount,
  deleteKey: () => deleteKey,
  deployContract: () => deployContract,
  encodeDelegateAction: () => import_transactions.encodeDelegateAction,
  encodeSignedDelegate: () => import_transactions.encodeSignedDelegate,
  encodeTransaction: () => import_transactions.encodeTransaction,
  fullAccessKey: () => fullAccessKey,
  functionCall: () => functionCall,
  functionCallAccessKey: () => functionCallAccessKey,
  stake: () => stake,
  stringifyJsonOrBytes: () => import_transactions.stringifyJsonOrBytes,
  transfer: () => transfer
});
module.exports = __toCommonJS(transaction_exports);
var import_transactions = require("@near-js/transactions");
var import_transactions2 = require("@near-js/transactions");
const addKey = (publicKey, accessKey) => import_transactions2.actionCreators.addKey(publicKey, accessKey);
const createAccount = () => import_transactions2.actionCreators.createAccount();
const deleteAccount = (beneficiaryId) => import_transactions2.actionCreators.deleteAccount(beneficiaryId);
const deleteKey = (publicKey) => import_transactions2.actionCreators.deleteKey(publicKey);
const deployContract = (code) => import_transactions2.actionCreators.deployContract(code);
const fullAccessKey = () => import_transactions2.actionCreators.fullAccessKey();
const functionCall = (methodName, args, gas, deposit, stringify) => import_transactions2.actionCreators.functionCall(methodName, args, gas, deposit, stringify);
const functionCallAccessKey = (receiverId, methodNames, allowance) => import_transactions2.actionCreators.functionCallAccessKey(receiverId, methodNames, allowance);
const stake = (stake2, publicKey) => import_transactions2.actionCreators.stake(stake2, publicKey);
const transfer = (deposit) => import_transactions2.actionCreators.transfer(deposit);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccessKey,
  AccessKeyPermission,
  Action,
  AddKey,
  CreateAccount,
  DeleteAccount,
  DeleteKey,
  DeployContract,
  FullAccessPermission,
  FunctionCall,
  FunctionCallPermission,
  SCHEMA,
  Signature,
  SignedTransaction,
  Stake,
  Transaction,
  Transfer,
  addKey,
  createAccount,
  createTransaction,
  deleteAccount,
  deleteKey,
  deployContract,
  encodeDelegateAction,
  encodeSignedDelegate,
  encodeTransaction,
  fullAccessKey,
  functionCall,
  functionCallAccessKey,
  stake,
  stringifyJsonOrBytes,
  transfer
});

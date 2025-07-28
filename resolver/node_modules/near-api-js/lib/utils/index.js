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
var utils_exports = {};
__export(utils_exports, {
  KeyPair: () => import_key_pair.KeyPair,
  KeyPairEd25519: () => import_key_pair.KeyPairEd25519,
  KeyPairString: () => import_key_pair.KeyPairString,
  Logger: () => import_logger.Logger,
  PublicKey: () => import_key_pair.PublicKey,
  enums: () => enums,
  format: () => format,
  key_pair: () => key_pair,
  rpc_errors: () => rpc_errors,
  serialize: () => serialize
});
module.exports = __toCommonJS(utils_exports);
var key_pair = __toESM(require('./key_pair.js'));
var serialize = __toESM(require('./serialize.js'));
var enums = __toESM(require('./enums.js'));
var format = __toESM(require('./format.js'));
var rpc_errors = __toESM(require('./rpc_errors.js'));
var import_key_pair = require('./key_pair.js');
var import_logger = require('./logger.js');
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KeyPair,
  KeyPairEd25519,
  KeyPairString,
  Logger,
  PublicKey,
  enums,
  format,
  key_pair,
  rpc_errors,
  serialize
});

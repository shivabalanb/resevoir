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
var unencrypted_file_system_keystore_exports = {};
__export(unencrypted_file_system_keystore_exports, {
  UnencryptedFileSystemKeyStore: () => UnencryptedFileSystemKeyStore,
  readKeyFile: () => readKeyFile
});
module.exports = __toCommonJS(unencrypted_file_system_keystore_exports);
var import_crypto = require("@near-js/crypto");
var import_keystores = require("@near-js/keystores");
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_util = require("util");
const promisify = (fn) => {
  if (!fn) {
    return () => {
      throw new Error("Trying to use unimplemented function. `fs` module not available in web build?");
    };
  }
  return (0, import_util.promisify)(fn);
};
const exists = promisify(import_fs.default.exists);
const readFile = promisify(import_fs.default.readFile);
const writeFile = promisify(import_fs.default.writeFile);
const unlink = promisify(import_fs.default.unlink);
const readdir = promisify(import_fs.default.readdir);
const mkdir = promisify(import_fs.default.mkdir);
async function loadJsonFile(filename) {
  const content = await readFile(filename);
  return JSON.parse(content.toString());
}
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}
async function readKeyFile(filename) {
  const accountInfo = await loadJsonFile(filename);
  let privateKey = accountInfo.private_key;
  if (!privateKey && accountInfo.secret_key) {
    privateKey = accountInfo.secret_key;
  }
  return [accountInfo.account_id, import_crypto.KeyPair.fromString(privateKey)];
}
class UnencryptedFileSystemKeyStore extends import_keystores.KeyStore {
  /** @hidden */
  keyDir;
  /**
   * @param keyDir base directory for key storage. Keys will be stored in `keyDir/networkId/accountId.json`
   */
  constructor(keyDir) {
    super();
    this.keyDir = import_path.default.resolve(keyDir);
  }
  /**
   * Store a {@link KeyPair} in an unencrypted file
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the key pair
   * @param keyPair The key pair to store in local storage
   */
  async setKey(networkId, accountId, keyPair) {
    await ensureDir(`${this.keyDir}/${networkId}`);
    const content = { account_id: accountId, public_key: keyPair.getPublicKey().toString(), private_key: keyPair.toString() };
    await writeFile(this.getKeyFilePath(networkId, accountId), JSON.stringify(content), { mode: 384 });
  }
  /**
   * Gets a {@link KeyPair} from an unencrypted file
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the key pair
   * @returns {Promise<KeyPair>}
   */
  async getKey(networkId, accountId) {
    if (!await exists(this.getKeyFilePath(networkId, accountId))) {
      return null;
    }
    const accountKeyPair = await readKeyFile(this.getKeyFilePath(networkId, accountId));
    return accountKeyPair[1];
  }
  /**
   * Deletes an unencrypted file holding a {@link KeyPair}
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the key pair
   */
  async removeKey(networkId, accountId) {
    if (await exists(this.getKeyFilePath(networkId, accountId))) {
      await unlink(this.getKeyFilePath(networkId, accountId));
    }
  }
  /**
   * Deletes all unencrypted files from the `keyDir` path.
   */
  async clear() {
    for (const network of await this.getNetworks()) {
      for (const account of await this.getAccounts(network)) {
        await this.removeKey(network, account);
      }
    }
  }
  /** @hidden */
  getKeyFilePath(networkId, accountId) {
    return `${this.keyDir}/${networkId}/${accountId}.json`;
  }
  /**
   * Get the network(s) from files in `keyDir`
   * @returns {Promise<string[]>}
   */
  async getNetworks() {
    const files = await readdir(this.keyDir);
    const result = new Array();
    files.forEach((item) => {
      result.push(item);
    });
    return result;
  }
  /**
   * Gets the account(s) files in `keyDir/networkId`
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   */
  async getAccounts(networkId) {
    if (!await exists(`${this.keyDir}/${networkId}`)) {
      return [];
    }
    const files = await readdir(`${this.keyDir}/${networkId}`);
    return files.filter((file) => file.endsWith(".json")).map((file) => file.replace(/.json$/, ""));
  }
  /** @hidden */
  toString() {
    return `UnencryptedFileSystemKeyStore(${this.keyDir})`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnencryptedFileSystemKeyStore,
  readKeyFile
});

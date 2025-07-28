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
var multi_contract_browser_local_storage_key_store_exports = {};
__export(multi_contract_browser_local_storage_key_store_exports, {
  MultiContractBrowserLocalStorageKeyStore: () => MultiContractBrowserLocalStorageKeyStore
});
module.exports = __toCommonJS(multi_contract_browser_local_storage_key_store_exports);
var import_crypto = require("@near-js/crypto");
var import_keystores = require("@near-js/keystores");
const LOCAL_STORAGE_KEY_PREFIX = "near-api-js:keystore:";
class MultiContractBrowserLocalStorageKeyStore extends import_keystores.MultiContractKeyStore {
  /** @hidden */
  localStorage;
  /** @hidden */
  prefix;
  /**
   * @param localStorage defaults to window.localStorage
   * @param prefix defaults to `near-api-js:keystore:`
   */
  constructor(localStorage = window.localStorage, prefix = LOCAL_STORAGE_KEY_PREFIX) {
    super();
    this.localStorage = localStorage;
    this.prefix = prefix || LOCAL_STORAGE_KEY_PREFIX;
  }
  /**
   * Stores a {@link utils/key_pair!KeyPair} in local storage.
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the key pair
   * @param keyPair The key pair to store in local storage
   * @param contractId The contract to store in local storage
   */
  async setKey(networkId, accountId, keyPair, contractId) {
    this.localStorage.setItem(this.storageKeyForSecretKey(networkId, accountId, contractId), keyPair.toString());
  }
  /**
   * Gets a {@link utils/key_pair!KeyPair} from local storage
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the key pair
   * @param contractId The NEAR contract tied to the key pair
   * @returns {Promise<KeyPair>}
   */
  async getKey(networkId, accountId, contractId) {
    const value = this.localStorage.getItem(this.storageKeyForSecretKey(networkId, accountId, contractId));
    if (!value) {
      return null;
    }
    return import_crypto.KeyPair.fromString(value);
  }
  /**
   * Removes a {@link utils/key_pair!KeyPair} from local storage
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the key pair
   * @param contractId The NEAR contract tied to the key pair
   */
  async removeKey(networkId, accountId, contractId) {
    this.localStorage.removeItem(this.storageKeyForSecretKey(networkId, accountId, contractId));
  }
  /**
   * Removes all items that start with `prefix` from local storage
   */
  async clear() {
    for (const key of this.storageKeys()) {
      if (key.startsWith(this.prefix)) {
        this.localStorage.removeItem(key);
      }
    }
  }
  /**
   * Get the network(s) from local storage
   * @returns {Promise<string[]>}
   */
  async getNetworks() {
    const result = /* @__PURE__ */ new Set();
    for (const key of this.storageKeys()) {
      if (key.startsWith(this.prefix)) {
        const parts = key.substring(this.prefix.length).split(":");
        result.add(parts[1]);
      }
    }
    return Array.from(result.values());
  }
  /**
   * Gets the account(s) from local storage
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   */
  async getAccounts(networkId) {
    const result = [];
    for (const key of this.storageKeys()) {
      if (key.startsWith(this.prefix)) {
        const parts = key.substring(this.prefix.length).split(":");
        if (parts[1] === networkId) {
          result.push(parts[0]);
        }
      }
    }
    return result;
  }
  /**
   * Gets the contract(s) from local storage
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The targeted account.
   */
  async getContracts(networkId, accountId) {
    const result = [];
    for (const key of this.storageKeys()) {
      if (key.startsWith(this.prefix)) {
        const parts = key.substring(this.prefix.length).split(":");
        if (parts[1] === networkId && parts[0] === accountId) {
          result.push(parts[2]);
        }
      }
    }
    return result;
  }
  /**
   * @hidden
   * Helper function to retrieve a local storage key
   * @param networkId The targeted network. (ex. default, betanet, etc…)
   * @param accountId The NEAR account tied to the storage keythat's sought
   * @param contractId The NEAR contract tied to the storage keythat's sought
   * @returns {string} An example might be: `near-api-js:keystore:near-friend:default`
   */
  storageKeyForSecretKey(networkId, accountId, contractId) {
    return `${this.prefix}${accountId}:${networkId}:${contractId}`;
  }
  /** @hidden */
  *storageKeys() {
    for (let i = 0; i < this.localStorage.length; i++) {
      yield this.localStorage.key(i);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MultiContractBrowserLocalStorageKeyStore
});

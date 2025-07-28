import * as _near_js_transactions from '@near-js/transactions';
import { AccessKey, stringifyJsonOrBytes, AccessKeyPermission, Action, AddKey, CreateAccount, DeleteAccount, DeleteKey, DeployContract, FullAccessPermission, FunctionCall, FunctionCallPermission, SCHEMA, Signature, SignedTransaction, Stake, Transaction, Transfer, createTransaction, encodeDelegateAction, encodeSignedDelegate, encodeTransaction } from '@near-js/transactions';
import { PublicKey } from '@near-js/crypto';

declare const addKey: (publicKey: PublicKey, accessKey: AccessKey) => _near_js_transactions.Action;
declare const createAccount: () => _near_js_transactions.Action;
declare const deleteAccount: (beneficiaryId: string) => _near_js_transactions.Action;
declare const deleteKey: (publicKey: PublicKey) => _near_js_transactions.Action;
declare const deployContract: (code: Uint8Array) => _near_js_transactions.Action;
declare const fullAccessKey: () => AccessKey;
declare const functionCall: (methodName: string, args: object | Uint8Array, gas: bigint, deposit: bigint, stringify?: typeof stringifyJsonOrBytes) => _near_js_transactions.Action;
declare const functionCallAccessKey: (receiverId: string, methodNames: string[], allowance?: bigint) => AccessKey;
declare const stake: (stake: bigint, publicKey: PublicKey) => _near_js_transactions.Action;
declare const transfer: (deposit: bigint) => _near_js_transactions.Action;

declare const transaction_AccessKey: typeof AccessKey;
declare const transaction_AccessKeyPermission: typeof AccessKeyPermission;
declare const transaction_Action: typeof Action;
declare const transaction_AddKey: typeof AddKey;
declare const transaction_CreateAccount: typeof CreateAccount;
declare const transaction_DeleteAccount: typeof DeleteAccount;
declare const transaction_DeleteKey: typeof DeleteKey;
declare const transaction_DeployContract: typeof DeployContract;
declare const transaction_FullAccessPermission: typeof FullAccessPermission;
declare const transaction_FunctionCall: typeof FunctionCall;
declare const transaction_FunctionCallPermission: typeof FunctionCallPermission;
declare const transaction_SCHEMA: typeof SCHEMA;
declare const transaction_Signature: typeof Signature;
declare const transaction_SignedTransaction: typeof SignedTransaction;
declare const transaction_Stake: typeof Stake;
declare const transaction_Transaction: typeof Transaction;
declare const transaction_Transfer: typeof Transfer;
declare const transaction_addKey: typeof addKey;
declare const transaction_createAccount: typeof createAccount;
declare const transaction_createTransaction: typeof createTransaction;
declare const transaction_deleteAccount: typeof deleteAccount;
declare const transaction_deleteKey: typeof deleteKey;
declare const transaction_deployContract: typeof deployContract;
declare const transaction_encodeDelegateAction: typeof encodeDelegateAction;
declare const transaction_encodeSignedDelegate: typeof encodeSignedDelegate;
declare const transaction_encodeTransaction: typeof encodeTransaction;
declare const transaction_fullAccessKey: typeof fullAccessKey;
declare const transaction_functionCall: typeof functionCall;
declare const transaction_functionCallAccessKey: typeof functionCallAccessKey;
declare const transaction_stake: typeof stake;
declare const transaction_stringifyJsonOrBytes: typeof stringifyJsonOrBytes;
declare const transaction_transfer: typeof transfer;
declare namespace transaction {
  export { transaction_AccessKey as AccessKey, transaction_AccessKeyPermission as AccessKeyPermission, transaction_Action as Action, transaction_AddKey as AddKey, transaction_CreateAccount as CreateAccount, transaction_DeleteAccount as DeleteAccount, transaction_DeleteKey as DeleteKey, transaction_DeployContract as DeployContract, transaction_FullAccessPermission as FullAccessPermission, transaction_FunctionCall as FunctionCall, transaction_FunctionCallPermission as FunctionCallPermission, transaction_SCHEMA as SCHEMA, transaction_Signature as Signature, transaction_SignedTransaction as SignedTransaction, transaction_Stake as Stake, transaction_Transaction as Transaction, transaction_Transfer as Transfer, transaction_addKey as addKey, transaction_createAccount as createAccount, transaction_createTransaction as createTransaction, transaction_deleteAccount as deleteAccount, transaction_deleteKey as deleteKey, transaction_deployContract as deployContract, transaction_encodeDelegateAction as encodeDelegateAction, transaction_encodeSignedDelegate as encodeSignedDelegate, transaction_encodeTransaction as encodeTransaction, transaction_fullAccessKey as fullAccessKey, transaction_functionCall as functionCall, transaction_functionCallAccessKey as functionCallAccessKey, transaction_stake as stake, transaction_stringifyJsonOrBytes as stringifyJsonOrBytes, transaction_transfer as transfer };
}

export { addKey as a, deleteKey as b, createAccount as c, deleteAccount as d, deployContract as e, fullAccessKey as f, functionCall as g, functionCallAccessKey as h, transfer as i, stake as s, transaction as t };

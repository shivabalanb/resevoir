import { JsonRpcProvider } from "ethers";
import { fromEnv, config } from "./config";
import { Wallet } from "../wallet";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import {
  JsonRpcProvider as NearJsonRpcProvider,
  Provider,
} from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { Account } from "@near-js/accounts";
import {
  createSignedOrder,
  deployEscrows,
  withdrawFunds,
} from "./utils";


async function ethToNearFlow() {
  const provider = new JsonRpcProvider(config.src.url);
  const userWallet = new Wallet(config.src.user.private_key, provider);
  const resolverWallet = new Wallet(config.src.resolver.private_key, provider);

  const nearProvider = new NearJsonRpcProvider({ url: config.dst.url });
  const signer = new KeyPairSigner(
    KeyPair.fromString(config.dst.resolver.private_key as KeyPairString)
  );
  const resolverAccount = new Account(
    fromEnv.DST_RESOLVER_WALLET_ID,
    nearProvider as Provider,
    signer
  );

  // await deployEvmSwapInfrastructure(
  //   new SignerWallet(config.src.user.private_key, provider)
  // );
  // await fundAndApprove(userWallet,resolverWallet);

  let { order, signature, secret } = await createSignedOrder(userWallet);
  let { dstImmutables, srcEscrow, dstEscrow } = await deployEscrows(
    order,
    signature,
    resolverWallet,
    resolverAccount
  );
  await withdrawFunds(
    secret,
    srcEscrow,
    dstEscrow,
    resolverAccount,
    resolverWallet,
    dstImmutables
  );
}

ethToNearFlow();







// async function nearToEthFlow() {
//   const provider = new JsonRpcProvider(config.src.url);
//   const userWallet = new Wallet(config.src.user.private_key, provider);
//   const resolverWallet = new Wallet(config.src.resolver.private_key, provider);
//     const resolverKeyPair = KeyPair.fromString(config.dst.resolver.private_key as KeyPairString);
//   const resolverSigner = new KeyPairSigner(resolverKeyPair);

//   const nearProvider = new NearJsonRpcProvider({ url: config.dst.url });
//   const signer = KeyPair.fromString(
//     config.dst.resolver.private_key as KeyPairString
//   );

//   const resolverAccount = new Account(
//     fromEnv.DST_RESOLVER_WALLET_ID,
//     nearProvider as Provider,
//     resolverSigner
//   );

//   const {order, orderHash, secret, signature, hashlock} = await createSignedOrderN(signer);
//   // const {srcEscrowAddress, dstEscrowAddress, immutables} = await deployEscrowsN(order, orderHash, hashlock,resolverWallet, resolverAccount,  )
  
// }
// nearToEthFlow()
// findErrror('0x118cdaa7');

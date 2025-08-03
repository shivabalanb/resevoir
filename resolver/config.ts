import { z } from "zod";
import * as dotenv from "dotenv";
import * as Sdk from "@1inch/cross-chain-sdk";
dotenv.config();

const ConfigSchema = z.object({
  SRC_CHAIN_RPC: z.string().url(),
  SRC_CHAIN_ID: z.string().transform(Number),
  DST_CHAIN_RPC: z.string().url(),
  DST_CHAIN_ID: z.string().transform(Number),

  USER_WALLET_ADDRESS: z.string().startsWith("0x"),
  USER_WALLET_PRIVATE_KEY: z.string().startsWith("0x"),

  SRC_RESOLVER_WALLET_ADDRESS: z.string().startsWith("0x"),
  SRC_RESOLVER_WALLET_PRIVATE_KEY: z.string().startsWith("0x"),

  DST_USER_WALLET_ID: z.string(),
  DST_RESOLVER_WALLET_ID: z.string(),
  DST_RESOLVER_WALLET_PUBLIC_KEY: z.string(),
  DST_RESOLVER_WALLET_PRIVATE_KEY: z.string(),

  SRC_RESOLVER_CONTRACT_ADDRESS: z.string().startsWith("0x"),
  LOP_ADDRESS: z.string().startsWith("0x"),
  ESCROW_FACTORY_ADDRESS: z.string().startsWith("0x"),
  MOCK_ADDRESS: z.string().startsWith("0x"),
  WRAPPED_NATIVE: z.string().startsWith("0x"),

  INCH_AUTH_KEY: z.string(),

  //   NEAR_NODE_URL: z.string().url(),
  //   NEAR_CONTRACT_ID: z.string(),
  //   NEAR_USER_ACCOUNT_ID: z.string(),
  //   NEAR_USER_PRIVATE_KEY: z.string().startsWith("ed25519:"),
  //   NEAR_RESOLVER_ACCOUNT_ID: z.string(),
  //   NEAR_RESOLVER_PRIVATE_KEY: z.string().startsWith("ed25519:"),
});

export const fromEnv = ConfigSchema.parse(process.env);

export const config = {
  chain: {
    source: {
      chainId: Sdk.NetworkEnum.ETHEREUM,
      url: fromEnv.SRC_CHAIN_RPC,
      limitOrderProtocol: fromEnv.LOP_ADDRESS,
      wrappedNative: fromEnv.WRAPPED_NATIVE,
      ownerPrivateKey: fromEnv.USER_WALLET_PRIVATE_KEY,
      tokens: {
        MOCK: {
          address: fromEnv.MOCK_ADDRESS,
        },
      },
    },
  },
} as const;

export type ChainConfig = (typeof config.chain)["source"];

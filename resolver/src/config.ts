import { z } from "zod";
import * as dotenv from "dotenv";
import * as Sdk from "@1inch/cross-chain-sdk";
import { ZeroAddress } from "ethers";
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
  DST_RESOLVER_WALLET_PRIVATE_KEY: z.string(),

  SRC_RESOLVER_CONTRACT_ADDRESS: z.string().startsWith("0x"),
  LOP_ADDRESS: z.string().startsWith("0x"),
  ESCROW_FACTORY_ADDRESS: z.string().startsWith("0x"),
  MOCK_ADDRESS: z.string().startsWith("0x"),
  WRAPPED_NATIVE: z.string().startsWith("0x"),

  INCH_AUTH_KEY: z.string(),
});

export const fromEnv = ConfigSchema.parse(process.env);

export const config = {
  src: {
    chainId: Sdk.NetworkEnum.ETHEREUM, // ETH
    url: fromEnv.SRC_CHAIN_RPC,
    limitOrderProtocol: fromEnv.LOP_ADDRESS,
    escrowFactory: fromEnv.ESCROW_FACTORY_ADDRESS,
    resolverContract: fromEnv.SRC_RESOLVER_CONTRACT_ADDRESS,
    wrappedNative: fromEnv.WRAPPED_NATIVE,
    ownerPrivateKey: fromEnv.USER_WALLET_PRIVATE_KEY,
    user: {
      wallet_address: fromEnv.USER_WALLET_ADDRESS,
      private_key: fromEnv.USER_WALLET_PRIVATE_KEY,
    },
    resolver: {
      wallet_address: fromEnv.SRC_RESOLVER_WALLET_ADDRESS,
      private_key: fromEnv.SRC_RESOLVER_WALLET_PRIVATE_KEY,
    },
    tokens: {
      MOCK: fromEnv.MOCK_ADDRESS,
    },
  },
  dst: {
    chainId: Sdk.NetworkEnum.ARBITRUM, // NEAR
    url: fromEnv.DST_CHAIN_RPC,
    user: {
      wallet_id: fromEnv.DST_USER_WALLET_ID,
    },
    resolver: {
      wallet_id: fromEnv.DST_RESOLVER_WALLET_ID,
      private_key: fromEnv.DST_RESOLVER_WALLET_PRIVATE_KEY,
    },
    tokens: {
      NEAR: ZeroAddress, // NEAR
    },
  },
} as const;

export const configN = {
  src: {
    chainId: Sdk.NetworkEnum.ARBITRUM, // NEAR
    url: fromEnv.DST_CHAIN_RPC,
     user: {
      wallet_id: fromEnv.DST_USER_WALLET_ID,
    },
    resolver: {
      wallet_id: fromEnv.DST_RESOLVER_WALLET_ID,
      private_key: fromEnv.DST_RESOLVER_WALLET_PRIVATE_KEY,
    },
    tokens: {
      NEAR: ZeroAddress, // NEAR
    },
  },
  dst: {
    chainId: Sdk.NetworkEnum.ETHEREUM, // ETH
    url: fromEnv.DST_CHAIN_RPC,
    limitOrderProtocol: fromEnv.LOP_ADDRESS,
    escrowFactory: fromEnv.ESCROW_FACTORY_ADDRESS,
    resolverContract: fromEnv.SRC_RESOLVER_CONTRACT_ADDRESS,
    wrappedNative: fromEnv.WRAPPED_NATIVE,
    user: {
      wallet_address: fromEnv.USER_WALLET_ADDRESS,
      private_key: fromEnv.USER_WALLET_PRIVATE_KEY,
    },
    resolver: {
      wallet_address: fromEnv.SRC_RESOLVER_WALLET_ADDRESS,
      private_key: fromEnv.SRC_RESOLVER_WALLET_PRIVATE_KEY,
    },
    tokens: {
      MOCK: fromEnv.MOCK_ADDRESS,
    },
  },
} as const;

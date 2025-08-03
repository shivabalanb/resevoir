import { Interface, Signature, TransactionRequest } from "ethers";
import * as Sdk from "@1inch/cross-chain-sdk";
import Contract from "./abi/Resolver.json";

export class Resolver {
  private readonly iface = new Interface(Contract.abi);

  constructor(public readonly srcAddress: string) {}

  public deploySrc(
    chainId: number,
    order: Sdk.CrossChainOrder,
    signature: string,
    takerTraits: Sdk.TakerTraits,
    amount: bigint,
    hashLock = order.escrowExtension.hashLockInfo
  ): TransactionRequest {
    const { r, yParityAndS: vs } = Signature.from(signature);
    const { args, trait } = takerTraits.encode();
    const immutables = order.toSrcImmutables(
      chainId,
      new Sdk.Address(this.srcAddress),
      amount,
      hashLock
    );

    return {
      to: this.srcAddress,
      data: this.iface.encodeFunctionData("deploySrc", [
        immutables.build(),
        order.build(),
        r,
        vs,
        amount,
        trait,
        args,
      ]),
      value: order.escrowExtension.srcSafetyDeposit,
    };
  }

  public withdraw(
    side: "src",
    escrow: Sdk.Address,
    secret: string,
    immutables: Sdk.Immutables
  ): TransactionRequest {
    return {
      to: this.srcAddress,
      data: this.iface.encodeFunctionData("withdraw", [
        escrow.toString(),
        secret,
        immutables.build(),
      ]),
    };
  }

  public cancel(
    side: "src",
    escrow: Sdk.Address,
    immutables: Sdk.Immutables
  ): TransactionRequest {
    return {
      to: this.srcAddress,
      data: this.iface.encodeFunctionData("cancel", [
        escrow.toString(),
        immutables.build(),
      ]),
    };
  }

  public executeApprove(
    token: string,
    spender: string,
    amount: bigint // Using bigint for uint256
  ): TransactionRequest {
    return {
      to: this.srcAddress, // The transaction is sent to the Resolver contract
      data: this.iface.encodeFunctionData("executeApprove", [
        token,
        spender,
        amount,
      ]),
      value: 0n, // No Ether is sent with an approve call
    };
  }
}

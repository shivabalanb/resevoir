import { ContractFactory, Wallet as SignerWallet, ZeroAddress } from "ethers";
import factoryContract from "../../../contracts-eth/out/TestEscrowFactory.sol/TestEscrowFactory.json";
import resolverContract from "../../../contracts-eth/out/Resolver.sol/Resolver.json";
import { config } from "../config";

export async function deployEvmSwapInfrastructure(
  deployer: SignerWallet
): Promise<{
  escrowFactory: string;
  resolver: string;
}> {
  const srcChainId = config.src.chainId;

  const escrowFactory = await deployOnEth(
    factoryContract,
    [
      config.src.limitOrderProtocol,
      config.src.wrappedNative,
      ZeroAddress,
      deployer.address,
      60 * 30,
      60 * 30,
    ],
    deployer
  );
  console.log(
    `[${srcChainId}]`,
    `Escrow factory contract deployed to`,
    escrowFactory
  );

  const resolver = await deployOnEth(
    resolverContract,
    [escrowFactory, config.src.limitOrderProtocol, config.src],
    deployer
  );

  console.log(`[${srcChainId}]`, `Resolver contract deployed to`, resolver);
  return { resolver, escrowFactory };
}

export async function deployOnEth(
  json: { abi: any; bytecode: any },
  params: unknown[],
  deployer: SignerWallet
): Promise<string> {
  const deployed = await new ContractFactory(
    json.abi,
    json.bytecode,
    deployer
  ).deploy(...params);
  await deployed.waitForDeployment();

  return await deployed.getAddress();
}

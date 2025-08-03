// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MOCK} from "../src/MOCK.sol";

// Import your custom contracts
import {TestEscrowFactory} from "../src/TestEscrowFactory.sol";
import {Resolver} from "../src/Resolver.sol";

// Import interfaces and base contracts
import {LimitOrderProtocol} from "limit-order-protocol/contracts/LimitOrderProtocol.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IWETH} from "solidity-utils/contracts/interfaces/IWETH.sol";

contract Deploy1inch is Script {
    address constant _WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function run()
        external
        returns (address lop, address factory, address resolver)
    {
        // --- Get Both Private Keys ---
        uint256 deployerPrivateKey = vm.envUint("USER_PRIVATE_KEY");
        uint256 resolverPrivateKey = vm.envUint("RESOLVER_PRIVATE_KEY");

        address deployerAddress = vm.addr(deployerPrivateKey);
        address resolverOwnerAddress = vm.addr(resolverPrivateKey);

        // --- Deploy Core Contracts with the Main Deployer Key ---
        vm.startBroadcast(deployerPrivateKey);

        // MOCK mock = new MOCK("MOCK", "MOCK");
        // console.log("MOCK deployed at:", address(mock));

        // LimitOrderProtocol lopContract = new LimitOrderProtocol(IWETH(_WETH));

        address lop = address("0x111111125421cA6dc452d289314280a0f8842A65");
        console.log("LimitOrderProtocol deployed at:", lop);

        TestEscrowFactory factoryContract = new TestEscrowFactory(
            lop,
            IWETH(_WETH),
            IERC20(address(0)),
            deployerAddress, // Main deployer owns the factory
            60 * 30,
            60 * 30
        );
        factory = address(factoryContract);
        console.log("TestEscrowFactory deployed at:", factory);

        vm.stopBroadcast();

        // --- Deploy the Resolver with the Resolver's Key ---
        vm.startBroadcast(resolverPrivateKey);

        Resolver resolverContract = new Resolver(
            lop,
            factoryContract,
            resolverOwnerAddress // Set the resolver as its own owner
        );
        resolver = address(resolverContract);
        console.log("Resolver deployed at:", resolver);
        console.log("Resolver Owner set to:", resolverOwnerAddress);

        // --- Verify the owner of the deployed Resolver contract ---
        console.log("Verified Resolver Owner:", resolverContract.owner());

        vm.stopBroadcast();
    }
}

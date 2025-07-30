// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockToken} from "../src/MockToken.sol";

// Import the necessary 1inch contracts from the submodules
import {LimitOrderProtocol} from "limit-order-protocol/contracts/LimitOrderProtocol.sol";
import {EscrowFactory} from "cross-chain-swap/contracts/EscrowFactory.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IWETH} from "solidity-utils/contracts/interfaces/IWETH.sol";

contract Deploy1inch is Script {
    // The official WETH address on the localnet.
    // Your local Anvil fork will have a copy of this contract.
    address constant SEPOLIA_WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;

    function run() external returns (address, address) {
        // --- Get the deployer's private key from environment variables ---
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // --- Step 1: Deploy a Mock ERC20 Token ---
        // This will be used as the feeToken and accessToken
        MockToken mockToken = new MockToken("Mock Token", "MOCK");
        console.log(
            "MockToken (for fees/access) deployed at:",
            address(mockToken)
        );

        // --- Step 2: Deploy the Limit Order Protocol ---
        // The LOP constructor for this version requires a WETH address.
        LimitOrderProtocol lop = new LimitOrderProtocol(IWETH(SEPOLIA_WETH));
        console.log("LimitOrderProtocol deployed at:", address(lop));

        // --- Step 3: Deploy the Escrow Factory ---
        // The factory needs the addresses of the other contracts to work.
        address deployerAddress = vm.addr(deployerPrivateKey);
        uint32 rescueDelay = 86400; // 1 day in seconds

        EscrowFactory factory = new EscrowFactory(
            address(lop),
            IERC20(address(mockToken)),
            IERC20(address(mockToken)),
            deployerAddress, // The owner of the factory
            rescueDelay,
            rescueDelay
        );
        console.log("EscrowFactory deployed at:", address(factory));

        vm.stopBroadcast();

        return (address(lop), address(factory));
    }
}

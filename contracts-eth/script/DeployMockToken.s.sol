// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockToken} from "../src/MockToken.sol";

contract DeployMockToken is Script {
    function run() external returns (address) {
        vm.startBroadcast();

        // Deploy the contract with the name "Mock Token" and symbol "MOCK"
        MockToken mockToken = new MockToken("Mock Token", "MOCK");

        vm.stopBroadcast();

        console.log("MockToken deployed at:", address(mockToken));
        return address(mockToken);
    }
}

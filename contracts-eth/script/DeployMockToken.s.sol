// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MOCK} from "../src/MOCK.sol";

contract DeployMOCK is Script {
    function run() external returns (address) {
        vm.startBroadcast();

        // Deploy the contract with the name "Mock Token" and symbol "MOCK"
        MOCK mockToken = new MOCK("MOCK", "MOCK");

        vm.stopBroadcast();

        console.log("MOCK deployed at:", address(mockToken));
        return address(mockToken);
    }
}

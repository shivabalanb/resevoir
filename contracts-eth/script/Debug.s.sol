// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Script} from "forge-std/Script.sol";

// Import the required interfaces and libraries from your project's structure
import {IOrderMixin} from "limit-order-protocol/contracts/interfaces/IOrderMixin.sol";
import {TakerTraits} from "limit-order-protocol/contracts/libraries/TakerTraitsLib.sol";
import {IBaseEscrow} from "../lib/cross-chain-swap/contracts/interfaces/IBaseEscrow.sol";
import {Resolver} from "../src/Resolver.sol";
import {Address} from "solidity-utils/contracts/libraries/AddressLib.sol";
import {Timelocks} from "../lib/cross-chain-swap/contracts/libraries/TimelocksLib.sol";

contract DeploySrcScript is Script {
    function run() external {
        // --- Input Parameters from your log ---
    

        // The target contract address
        address resolverContractAddress = 0xE1f00Ff0b554be4e865666D2ca3Ac2525a407f1B;

        // Immutables struct (using the imported type)
        IBaseEscrow.Immutables memory immutables = IBaseEscrow.Immutables({
            orderHash: 0x878f78f36235e7ade44c8c2dae2c40b7f12b8da5977d036523cdbfabc054f3d2,
            hashlock: 0xb04f5d31b51616a3c325dbe266fdf5e63d749f1d0c99912d9e0e5eb14700b140,
            maker: Address(uint256(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)),
            taker: 0xE1f00Ff0b554be4e865666D2ca3Ac2525a407f1B,
            token: 0x6316f95849B0c7c0df3c40D397735Ae183757868,
            amount: 100000000,
            safetyDeposit: 1000000000000000,
            timelocks: Timelocks.wrap(
                633987275420204920883907847243218011761572253150625035976714
            ) // <-- FIXED
        });

        // Order struct (using the imported type)
        IOrderMixin.Order memory order = IOrderMixin.Order({
            maker: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266,
            makerAsset: 0x6316f95849b0c7c0df3c40d397735ae183757868,
            takerAsset: 0xda0000d4000015a526378bb6fafc650cea5966f8,
            makerTraits: 62419173104490761595518734106688686742175969536080324089180312870275568893952,
            salt: 500680459206152265906834486598907154060264508625876,
            makingAmount: 100000000,
            takingAmount: 99000000,
            receiver: 0x0000000000000000000000000000000000000000
        });

        // Other parameters
        bytes32 r = 0x8f88560292c0bebec112e8f2891e06fc035f92bfe809bf07232b41c983cda33f;
        bytes32 vs = 0x96a89859e229510bcbf82ecd5f8f7380ce556b9925bf8c085f44ed31ecdc2eb8;
        uint256 amount = 100000000;

        TakerTraits takerTraits = TakerTraits.wrap(
            57896052787521937858429350288449525293583086444875042049522253778350569332416
        );
        bytes
            memory args = hex"0000010f0000004a0000004a0000004a0000004a000000250000000000000000053d77114eec8240500c4dd6453b7c59c5b76e6000000000000000688e0c49000078000000053d77114eec8240500c4dd6453b7c59c5b76e6000000000000000688e0c49000078000000053d77114eec8240500c4dd6453b7c59c5b76e60000000000c7d01b50e0d17dc79c8000008b04f5d31b51616a3c325dbe266fdf5e63d749f1d0c99912d9e0e5eb14700b14000000000000000000000000000000000000000000000000000000000000000890000000000000000000000006316f95849b0c7c0df3c40d397735ae183757868000000000000000000038d7ea4c68000000000000000000000038d7ea4c680000000000000000065000000640000000a0000007a00000079000000780000000a";
        uint256 safetyDeposit = 1000000000000000;

        // --- Execute the transaction ---

        vm.startBroadcast();
        Resolver resolver = Resolver(payable(resolverContractAddress));

        resolver.deploySrc{value: safetyDeposit}(
            immutables,
            order,
            r,
            vs,
            amount,
            takerTraits,
            args
        );

        vm.stopBroadcast();
    }
}

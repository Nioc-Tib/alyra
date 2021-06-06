// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

contract Pull {
    mapping(address => uint256) despositors;

    event LogDepositReceived(address);
    event LogWithdrawalSuccessful(address, uint256);

    function error() internal pure returns (string memory) {
        return "Transaction failed";
    }

    function withdraw(uint256 _amount) public payable {
        require(despositors[msg.sender] >= _amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: _amount}("");
        if (!success) {
            error();
        }
    }

    function deposit(uint256 _amount) public payable {
        (bool success, ) = address(this).call{value: _amount}("");
        if (!success) {
            error();
        }
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    fallback() external payable {
        require(msg.data.length == 0);
        despositors[msg.sender] = msg.value;
        emit LogDepositReceived(msg.sender);
    }

    receive() external payable {}
}

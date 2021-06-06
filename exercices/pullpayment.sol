// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Pull {
    using SafeMath for uint256;
    mapping(address => uint256) depositors;

    event LogDepositReceived(address, uint256);
    event LogWithdrawalSuccessful(address, uint256);

    function withdraw(uint256 _amount) public payable {
        require(depositors[msg.sender] >= _amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Withdrawal failed");
        emit LogWithdrawalSuccessful(msg.sender, _amount);
        depositors[msg.sender].sub(_amount);
    }

    function deposit(uint256 _amount) public payable {
        (bool success, ) = address(this).call{value: _amount}("");
        require(success, "deposit failed");
        depositors[msg.sender].add(_amount);
        emit LogDepositReceived(msg.sender, _amount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getDepositorBalance() public view returns (uint256) {
        return depositors[msg.sender];
    }

    fallback() external payable {
        require(msg.data.length == 0);
        depositors[msg.sender] = msg.value;
        emit LogDepositReceived(msg.sender, msg.value);
    }

    receive() external payable {}
}

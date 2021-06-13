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
        depositors[msg.sender] = depositors[msg.sender].sub(_amount);
    }

    function deposit() public payable {
        depositors[msg.sender] = depositors[msg.sender].add(msg.value);
        emit LogDepositReceived(msg.sender, msg.value);
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

    receive() external payable {
        depositors[msg.sender] = depositors[msg.sender].add(msg.value);
        emit LogDepositReceived(msg.sender, msg.value);
    }
}

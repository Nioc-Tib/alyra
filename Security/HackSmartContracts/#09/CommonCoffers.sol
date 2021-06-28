// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

//*** Exercice 9 ***//
// Simple coffer you deposit to and withdraw from.
contract CommonCoffers {
    mapping(address => uint256) public coffers;
    uint256 public scalingFactor;

    /** @dev Deposit money in one's coffer slot.
     *  @param _owner The coffer to deposit money on.
     * */
    function deposit(address _owner) external payable {
        if (scalingFactor != 0) {
            uint256 toAdd =
                (scalingFactor * msg.value) /
                    (address(this).balance - msg.value);
            coffers[_owner] += toAdd;
            scalingFactor += toAdd;
        } else {
            scalingFactor = 100;
            coffers[_owner] = 100;
        }
    }

    /** @dev Withdraw all of the money of one's coffer slot.
     *  @param _amount The slot to withdraw money from.
     * */
    function withdraw(uint256 _amount) external {
        uint256 toRemove = (scalingFactor * _amount) / address(this).balance;
        coffers[msg.sender] -= toRemove;
        scalingFactor -= toRemove;
        payable(msg.sender).transfer(_amount);
    }
}

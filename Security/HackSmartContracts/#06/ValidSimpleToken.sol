// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

//*** Exercice 6 ***//
// Simple token you can buy and send.
contract ValidSimpleToken {
    using SafeMath for uint256;

    mapping(address => uint256) public balances;

    /// @dev Creator starts with all the tokens.
    constructor() {
        balances[msg.sender] += 1000e18;
    }

    /** @dev Send token.
     *  @param _recipient The recipient.
     *  @param _amount The amount to send.
     */

    // use uint instead of int to avoid negative balance and add instead of sub
    function sendToken(address _recipient, uint256 _amount) public {
        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_recipient] = balances[msg.sender].add(_amount);
    }
}

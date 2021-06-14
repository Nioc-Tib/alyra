// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

//*** Exercice 12 ***//
// A Token contract that keeps a record of the users past balances.
contract ValidSnapShotToken {
    mapping(address => uint256) public balances;
    mapping(address => mapping(uint256 => uint256)) public balanceAt;

    event BalanceUpdated(
        address indexed user,
        uint256 oldBalance,
        uint256 newBalance
    );

    /// @dev Buy token at the price of 1ETH/token.
    function buyToken() public payable {
        uint256 _balance = balances[msg.sender];
        uint256 _newBalance = _balance + msg.value; // 1 token should be equal to 1 wei to avoid floats
        balances[msg.sender] = _newBalance;

        _updateCheckpoint(msg.sender, _balance, _newBalance);
    }

    /** @dev Transfer tokens.
     *  @param _to The recipient.
     *  @param _value The amount to send.
     */
    function transfer(address _to, uint256 _value) public {
        uint256 _balancesFrom = balances[msg.sender];
        uint256 _balancesTo = balances[_to];

        uint256 _balancesFromNew = _balancesFrom - _value;
        balances[msg.sender] = _balancesFromNew;

        uint256 _balancesToNew = _balancesTo + _value;
        balances[_to] = _balancesToNew;

        _updateCheckpoint(msg.sender, _balancesFrom, _balancesFromNew);
        _updateCheckpoint(_to, _balancesTo, _balancesToNew);
    }

    /**
     * @dev Record the users balance at this blocknumber
     *
     * @param _user The address who's balance is updated.
     * @param _oldBalance The previous balance.
     * @param _newBalance The updated balance.
     */
    function _updateCheckpoint(
        address _user,
        uint256 _oldBalance,
        uint256 _newBalance
    ) internal {
        balanceAt[_user][block.timestamp] = _newBalance;
        emit BalanceUpdated(_user, _oldBalance, _newBalance);
    }
}

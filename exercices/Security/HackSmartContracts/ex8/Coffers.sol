// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

//*** Exercice 8 ***//
// You can create coffers, deposit money and withdraw from them.
contract Coffers {
    struct Coffer {
        uint256 nbSlots;
        mapping(uint256 => uint256) slots;
    }
    mapping(address => Coffer) coffers;

    /** @dev Create coffers.
     *  @param _slots The amount of slots the coffer will have.
     * */
    function createCoffer(uint256 _slots) external {
        Coffer storage coffer = coffers[msg.sender];
        require(coffer.nbSlots == 0, "Coffer already created");
        coffer.nbSlots = _slots;
    }

    /** @dev Deposit money in one's coffer slot.
     *  @param _owner The coffer to deposit money on.
     *  @param _slot The slot to deposit money.
     * */
    function deposit(address _owner, uint256 _slot) external payable {
        Coffer storage coffer = coffers[_owner];
        require(_slot < coffer.nbSlots);
        coffer.slots[_slot] += msg.value;
    }

    /** @dev Withdraw all of the money of one's coffer slot.
     *  @param _slot The slot to withdraw money from.
     * */
    function withdraw(uint256 _slot) external {
        Coffer storage coffer = coffers[msg.sender];
        require(_slot < coffer.nbSlots);
        payable(msg.sender).transfer(coffer.slots[_slot]);
        coffer.slots[_slot] = 0;
    }

    /** @dev Close an account withdrawing all the money.
     * */
    function closeAccount() external {
        Coffer storage coffer = coffers[msg.sender];
        uint256 amountToSend;
        for (uint256 i = 0; i < coffer.nbSlots; ++i)
            amountToSend += coffer.slots[i];
        coffer.nbSlots = 0;
        payable(msg.sender).transfer(amountToSend);
    }
}

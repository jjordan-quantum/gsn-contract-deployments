// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {

    constructor() ERC20("Test Token", "TEST") {
        mint(1000000000 ether, msg.sender);
    }

    function mint(uint256 amount, address to) internal {
        _mint(to, amount);
    }
}

pragma solidity ^0.4.21;

import "zos-lib/contracts/migrations/Migratable.sol";
//import "openzeppelin-zos/contracts/token/ERC721/MintableERC721Token.sol";

contract MyContract is Migratable {
  uint256 public x;
//  MintableERC721Token public token;

  function initialize(uint256 _x) isInitializer("MyContract", "0") public {
    x = _x;
    // token = null;
  }

  function increment() public {
    x += 1;  
  }
  
//  function setToken(MintableERC721Token _token) external {
//    require(_token != address(0));
//    token = _token;
//  }
}


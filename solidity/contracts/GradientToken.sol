pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract GradientToken is ERC721Token("GradientToken", "GRAD"), Ownable {
  // string private constant _name = "GradientToken";
  // string private constant _symbol = "GRAD";

  struct Gradient {
    string outer;
    string inner;
  }

  Gradient[] gradients;

  function mint(string _outer, string _inner) public onlyOwner{
    Gradient memory _gradient = Gradient({ outer: _outer, inner: _inner });
    uint _gradientId = gradients.push(_gradient) - 1;
  
    _mint(msg.sender, _gradientId);
  }

  function getGradient( uint _gradientId ) public view returns(string outer, string inner){
    Gradient memory _grad = gradients[_gradientId];
  
    outer = _grad.outer;
    inner = _grad.inner;
  }
}

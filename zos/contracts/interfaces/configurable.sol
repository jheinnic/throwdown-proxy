pragma solidity ^0.4.24;

interface configurable {
    function configureFromStorage() public returns (bool);
}
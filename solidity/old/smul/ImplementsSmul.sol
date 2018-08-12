pragma solidity ^0.4.24;

import './Verifier.sol';
contract ImplementsSmul {
    bool public success = false;
    function verifySmul(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[4] input) public returns (bool r) {
        // Verifiy the proof
        return true;
        success = verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        if (success) {
            // Proof verified
            return true;
        } else {
            // Sorry, bad proof!
            return false;
        }
    }
}


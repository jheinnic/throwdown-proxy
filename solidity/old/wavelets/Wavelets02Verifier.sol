// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

pragma solidity ^0.4.14;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point) {
        return G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point p) pure internal returns (G1Point) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return the sum of two points of G1
    function addition(G1Point p1, G1Point p2) internal returns (G1Point r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 6, 0, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }
    /// @return the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point p, uint s) internal returns (G1Point r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 7, 0, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] p1, G2Point[] p2) internal returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 8, 0, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point a1, G2Point a2, G1Point b1, G2Point b2) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point a1, G2Point a2,
            G1Point b1, G2Point b2,
            G1Point c1, G2Point c2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point a1, G2Point a2,
            G1Point b1, G2Point b2,
            G1Point c1, G2Point c2,
            G1Point d1, G2Point d2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}
contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G2Point A;
        Pairing.G1Point B;
        Pairing.G2Point C;
        Pairing.G2Point gamma;
        Pairing.G1Point gammaBeta1;
        Pairing.G2Point gammaBeta2;
        Pairing.G2Point Z;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G1Point A_p;
        Pairing.G2Point B;
        Pairing.G1Point B_p;
        Pairing.G1Point C;
        Pairing.G1Point C_p;
        Pairing.G1Point K;
        Pairing.G1Point H;
    }
    function verifyingKey() pure internal returns (VerifyingKey vk) {
        vk.A = Pairing.G2Point([0x2d60c2f849d621d771799ac3871cdfc36cfdd443c9765fe9e36b2ee1db6d03d9, 0x163ac43b4a629da20e8669c21bd1819509808b8a8d8e3444e0a42bf1d6a73647], [0x151061d1dba3a546ec5505ca1ff5e4fce86834943b21acd59ae3ab5c5d09b476, 0xd1b6381aa7f8cce4f679915c4076a83db3c2adcf99da35d568fc28872e65677]);
        vk.B = Pairing.G1Point(0x13068503becd4d7c497d84b7cdb732602434f8fb9102bbf70ee2303885329032, 0x1461e890512568cfb1eebb6c792c863f7cb1e268a018b4d59ef179e67e16cbb6);
        vk.C = Pairing.G2Point([0x23f90471d88b6855451d38a805b802cbef1e44d2e3e4c955a2226fe4cfd25bc4, 0x79d170b65f102e82b36cf231c1d7b9791da4daa950ab1399a5fa89f4a55e2aa], [0x1e1595fce5c9e43b0d8f3ce2d130fc37aaff1284bffccede51645d38c7541c6e, 0x1b5ff9a60bd705b95b980dddda1725492cfb4ffee11454893dc9de42976a32]);
        vk.gamma = Pairing.G2Point([0x1e6c437fac0c0b88302ab27581a7dbb754e04c8c6897fb5d7db4fd82e2b813c1, 0x103580d372e2c7cf81f199ae23ebcdecf8debb89996e1e150af8d2bcc3cfc760], [0x2f26849f3a9828acfb084a4c5a37d42ca47a5bfa243c15c944341593d029f930, 0x29d3a4f2362039f101b24b43a7fe3e5f71e6330c4ea4c76464168fd49e27f2d8]);
        vk.gammaBeta1 = Pairing.G1Point(0xce057e025d6f48066949c2b5fb3513524b6cb0b02792ffddb0f58c98940dfa6, 0x1db0a15c52e9093def963d4ae54b3c5cf75760f48ba7c130d190516b0fd24989);
        vk.gammaBeta2 = Pairing.G2Point([0x115125f9ec6158708886068c512c7767424e72bbe7b057ca862936e07483f11b, 0x27d34772a62c12f5e30d9586cd29316bcc240316c7f0e9bca12f067f01629207], [0x14069e51ec1ac78ccc35e417fd8125bf3f7f1ebe8fccb57ec60759d81c3e6e99, 0xef2a3119f4dc6cf9bb9d3e51bab251f7868e07cf584bf57f35db647a9a38160]);
        vk.Z = Pairing.G2Point([0x19172af304c82e4d2ad691fcc73afb6cdccaf159c3c620464b0c32e59e8f980f, 0x1b47579a42ba215dc3c34f63211023b4f54b8f3d7a678ae23259a089eb07abf7], [0x24a054a9db21c4563099e96569182201ad102ef91d7f5081564226c9fe3fccde, 0x148c95729ef0b83efb5750059e93ea1cdc569e77b079275cfc1907dc5e591956]);
        vk.IC = new Pairing.G1Point[](8);
        vk.IC[0] = Pairing.G1Point(0x27c5c20e1a14ee85762394af6f55b15ed63f8044b8cb069c5b6bb38aa107a25c, 0x190f7cfb94580e12025fb6ad8fb74434046e10729ee69a316d844eb59fb7a463);
        vk.IC[1] = Pairing.G1Point(0xc88cad61e04b92f841e4ea933afeb418db17029fed2e572989f9b78879c9bd5, 0xe672223a666394c15d0156de065e207cc8208fea389e3cb64a8a33ace8fcc37);
        vk.IC[2] = Pairing.G1Point(0x10ced3615af38f6bcf5801b3cdc69199a235aea1ac48f3c7b1e01994e191dfe9, 0x2ab20cee7991f4811b44370b52bf5762029f466839634671bfeb3db2c905ee58);
        vk.IC[3] = Pairing.G1Point(0x13e36107c83e2cea41383f3fa6fd2dcab9f3d4d83866952ef0a197397b23bec1, 0x14d288a69fb1e0c09cbbca45583c126c339fa672ad240bbd56121d76b7ab15d9);
        vk.IC[4] = Pairing.G1Point(0xa7c8f3fe0c8db3acafbb069d778da8865c46cc29275cacb0b16f57ae4467585, 0x3729b9f5d0227cc95d928f7901ef13c15d33ecc822c2109be58e372a54c0c51);
        vk.IC[5] = Pairing.G1Point(0x15776be0bf5c3dd1eb869bf04aa0a7a21041c5e409a8f6875cc6dcb7b5bac19d, 0x3577155f69422fac2cee020809ba8496e7f4f072a669d825561847fa995919b);
        vk.IC[6] = Pairing.G1Point(0x32b73ed4efca32224a737bc31a3b45b2a5fb0c514c7dabc93b28f392e8a43d9, 0x12ffd2370e814afb0820480f1e6321b42182c76bbe767d8a56617c74deb46044);
        vk.IC[7] = Pairing.G1Point(0x169c44a63c9f9ccb540840e41ea38b9c7efa6975b5940aeea2342a734ec5ea6b, 0x2145ec846c2f30af6d41f09d2e6cd55a501f8e27fc7597c2a84bd3c13eef442c);
    }
    function verify(uint[] input, Proof proof) internal returns (uint) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++)
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.addition(vk_x, Pairing.addition(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        if (!Pairing.pairingProd3(
                Pairing.addition(vk_x, proof.A), proof.B,
                Pairing.negate(proof.H), vk.Z,
                Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        return 0;
    }
    event Verified(string);
    function verifyTx(
            uint[2] a,
            uint[2] a_p,
            uint[2][2] b,
            uint[2] b_p,
            uint[2] c,
            uint[2] c_p,
            uint[2] h,
            uint[2] k,
            uint[7] input
        ) public returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.A_p = Pairing.G1Point(a_p[0], a_p[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.B_p = Pairing.G1Point(b_p[0], b_p[1]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        proof.C_p = Pairing.G1Point(c_p[0], c_p[1]);
        proof.H = Pairing.G1Point(h[0], h[1]);
        proof.K = Pairing.G1Point(k[0], k[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            emit Verified("Transaction successfully verified.");
            return true;
        } else {
            return false;
        }
    }
}

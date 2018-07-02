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
        vk.A = Pairing.G2Point([0x122ce0f151e5319910fa593af23341ee5ef09a69b999ece1d6adf1dd642645db, 0xea4834deced75532da5d32330332d28878a2cfd3efb8f0b669f3deffecfeacc], [0x2c2433d48d08e92e67d8b17354d2f86db0508e6ff7bb5d6309dff7fde536f103, 0x3a05e7db062b6060ab89ae5c9a1a4e902f2a2f83d7898319444c7fd8acb130c]);
        vk.B = Pairing.G1Point(0x2f843bd6d1688f33414f520f44c822d6034ed471562f171d25fa99a60912b3b3, 0x150b6b30fc0883dae621e9c56d17a603dd493479d7a119a63ced23efc0bb1988);
        vk.C = Pairing.G2Point([0x2bd1f66971068034dfb02b689d19b6060fee86bdd233cb3830d086a54c872ca5, 0x17ed5220edfc660a7affbc64ee0b7be9d80c13cfd01afebf2435125ecb2e57b8], [0x2a3c85653d0edf4894ab45b094aaf8be2062bae3b66ae88d17204043b0e9ce91, 0x2ed5d9f103836762a2e5508517d5e6ba9d978614c474382cf2e1b67e89e1ffc6]);
        vk.gamma = Pairing.G2Point([0x1455fc4d42d702c99c4d984c55af89baae79324eed13070dcc987804c4d989e9, 0x1658651f6a8ede8b53f1dde35a1ae6cad5daf56fe68f02b59f0135ff2647ca9d], [0x87f759feaa99b6c534bc617129cad9eb896a82b7d392d084df4a36eb787591, 0x125bd9448303cf1b5b028c095c2113c39b4cd358da78a36ba26e206b252af001]);
        vk.gammaBeta1 = Pairing.G1Point(0xf9b217e3fcc6fcb213744316ee9be6041f22fdaa4cd2ddd5fb20bdaa196999e, 0x1507d9d2c03be771e489b62f7fb22dce692dc630af6a9f1916cfe0581e40d0c7);
        vk.gammaBeta2 = Pairing.G2Point([0x73dccbeb282171bf60a9891217ad09dcb1db99de24a52c2a9edf10f9544ae87, 0x2af34871ac8f7b7b7fc71145771ff882f44ee7a4c067ddab7e9e9e63ac34dd95], [0x32a2e44db246f9ca150168f2b56ac106cfb9ba941f267b7a1f24a457dd737f5, 0x28da1b4e0d5f0840fa7aa81f65bb38e02bb84f96c294d3320d5ce27dc4739c5f]);
        vk.Z = Pairing.G2Point([0x94826f1a87cbc09da932c852e0fc395fa05ad3c7cdd7e37b3d55079769c9eab, 0x17bb7cdbea4f6d72fa6ebfd97e901ecdf5f29fb6eade5fd3e22c33e6e7234879], [0x1a5ac027b4d678e0b0cc03ea0ea26a1c235478db005baad6bc0d9bc289fe09c6, 0x1f24c083f5ec8095410a2a40a958891609472f1ea360e87eb8ad63292b511fa9]);
        vk.IC = new Pairing.G1Point[](8);
        vk.IC[0] = Pairing.G1Point(0x3b281abfdd3279d1661368ba801e80838867b1864a26f1cf53b7a99f77df04e, 0x134e55392bfc14e073a6f46ad73c67a59d99e0af09dcf0e0fe44a2f6d17dbb41);
        vk.IC[1] = Pairing.G1Point(0x23d0565b5da4833cf68456a897f743f66ebbca5301aab397493478be3a1f9cdb, 0x29e15b1f69f0987298c6ee84b5c18309ee2e6da2baec9e111ad648f1f6e81bb5);
        vk.IC[2] = Pairing.G1Point(0x824c77a271ee741888c427c389e468dbfebbc75dd80a1b9d24988168c02d8a1, 0x8cb0331d454c7e114cae734e1d152bd7f625f2b57b064deca9db0fc8a4126e2);
        vk.IC[3] = Pairing.G1Point(0x20577d395445972ca5514517e963c84439a280abcbc2925a2d181bb1a2acfbc8, 0x112087464d0247d4f9849b06a92749179495c08984c3844bd363189713f7f067);
        vk.IC[4] = Pairing.G1Point(0x278189e91d5fd74c671d9c417ca9217d18709a12a920d9dbef56372a3aed1c16, 0x26e8ca5fd79e765eb3fd461cdc75b304353a70a49245d9ab44bd984faa003900);
        vk.IC[5] = Pairing.G1Point(0xd024082ab52e4f92d1b1a1d71cf861dbd51d785a29d3e76137374dfd1f2ff18, 0x121931b611b7abf44dcdb01b8be49e88fec589b3a9566ca5e406e0de5451881);
        vk.IC[6] = Pairing.G1Point(0x2401f71214a2b2edc5b138fe18e8ed8295a98620124fa27df84c7326072e096e, 0x1e9f9a041cd854771fcf0599663fd7e560e77b8027555391f2402ec99614e048);
        vk.IC[7] = Pairing.G1Point(0x2829848f39a38b34f8c77a44c454bd00f0a8f25a2ded763f3fca4bf27460b8b3, 0x24896d3af2dae657e0639052b902ce45d32b94d7d142af8a217105feefe32c5c);
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

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
        vk.A = Pairing.G2Point([0x9cad76e1a2213bea4a31b1e8a640be19af8b5fa14fdfc862ef6817f6093a3ad, 0x16a1d90ec0bc0442d37c0e569c059218c866e16c8338b0e57cddfae977378b05], [0x2f94153c2c57581a71c0f2c6714495717953e9b58c566c2a5887955a70b68596, 0x3e5d6b19fdb3b11d5622a89023ac32eea37b14114679c5f1405603e4ec9b541]);
        vk.B = Pairing.G1Point(0x218f07d0959efb54987a3b1d918bc6f2d718c4fdf0e732f8fa0d2c13aca1225d, 0x176db382bd95d9d2903f52f1b5453a83044128a9c01fbf9b6d084a3690abe822);
        vk.C = Pairing.G2Point([0xdfe9c31e6d41285b6efc251b47b430825483e9f9a1aee1616f78e805849bd68, 0xb0696bb8b0cdde5271855215968458847c4166f6e027634f6da72898f790aaa], [0x22085fd3ee34bed20615c23111449c66e1da5157c43390b0613c9f7658f5fdb5, 0x14467b0517044fc5105ff51b276c3e89964389c3b6a8034d38d7b61927d80f3]);
        vk.gamma = Pairing.G2Point([0x185d2827a1ea4aec7c807a1a8b99d40fe6aeb8ca7466c63c12f0479b0e093f2f, 0x16940a65e71b83b9d9668a67539e18d7cb516ecc4ec87fcc7ae7d80293c98b32], [0x247ce0db134b8df859db8009484484055ccd1b8ed914ec2c5a5acb00b2c42c0d, 0x24efd8bd0566d6ee0c97cd8d2e4aa14674a8063b0c799e12bcee33678ae00b72]);
        vk.gammaBeta1 = Pairing.G1Point(0x1e9c91ac614f32f711ed9b4028c870aef264c737af266fe501537521e6616e57, 0x1ddf0a09cd133ffc1db1cf12b96c74e6b85257d1d92cb7eec93f3345c9984101);
        vk.gammaBeta2 = Pairing.G2Point([0x254eb094889ce8487c9a5a85b3e358a38bc7e0c6dc42263041936d20b8b0560d, 0x2b4fbc3acc91d130161e501d3f49ccf95302bfe9fc3f0c3eb9ec0385ec370481], [0x6ab7c7d75a20ee413677742556a0928ece40bc23e9ccc78dffe6e8140f6222b, 0x171126fe2775ceac347c3fc0d15e4bb64078953a0d3b3eb711d28991f665ac38]);
        vk.Z = Pairing.G2Point([0x29d870f8cc9337bf2365fbd6f41eba4ecd166aaca10204bcfd7aef0afc86644b, 0x1cfca76aae35cc519dfb9321a5e32d2959e700aa67853d89291e7a5d4753e507], [0x18304b81782170220188595cea6bc9b18458c022439d03568214f838f4810fcf, 0x21fee57cc956c219ea5e8b78636336f37ae80668079e68256f6c23c2c1229f82]);
        vk.IC = new Pairing.G1Point[](10);
        vk.IC[0] = Pairing.G1Point(0x65c5ed42fe299e8bfd5af50f8b32fe580c86f41a8b67f1b5570b2447c12038, 0x5461315f3055094416aaad6fead94f5973c641cb56fe83a6a3344ad7d46421e);
        vk.IC[1] = Pairing.G1Point(0x299814902935db4426cc70c0136d90e4d8389e71955b2e6bbe85291bdadaf48a, 0x188cba3b7325062e211ea736325f230b87eaeaa8ff25ec72ee15eec5331f0ace);
        vk.IC[2] = Pairing.G1Point(0xfdcdd3dae8c299517e68bc9b36dd7a29f4a3a96234ac15bc936cfc26a4fe979, 0x1e7db1da784fed3abeed9ce7a4e61010a9577302c079986ce4af4ecaeb54b8b8);
        vk.IC[3] = Pairing.G1Point(0x15cef0b3b11d39fe0261208c59076ee3c0e9b00fcc8666a3505cc45c69162c2, 0x277f57c2375b9f04aa2bbce889f440f66e4f7d5e85ac1d4f847b7d02e8797043);
        vk.IC[4] = Pairing.G1Point(0x2092610cb4b74153f25ae1423b0726ccf0a6297f49201f3a746038d26cc1eb5c, 0x1456c49a6a4d521c652ad3d99a219ba7d9b9dae30c0df3c0f88e6e8990ec6078);
        vk.IC[5] = Pairing.G1Point(0x1ce8f98e962645bfc66c45c6da7be3929761f166defb7b3e9e491b62ad58d3f3, 0x9b3765d3ab586f5b66080fc25256d2350bdebcced352196d9b055cce52ee54b);
        vk.IC[6] = Pairing.G1Point(0xc233fa3f5b750b089ec94eb7a11cd627b33429d98355b7b9e486adc01b93757, 0x1da3c3a311f87f5c76291c566c555e967f08fd7d40c2a83776847f2dfa9b7141);
        vk.IC[7] = Pairing.G1Point(0x19d0166b072ef75cdc19104130bd91963f5ff87389498f85f3441e4995efa0fe, 0x1c8b3cbcbf2f0a7bc229b5885d092433dd4094bf39944fde00ddf1bfea852e41);
        vk.IC[8] = Pairing.G1Point(0x12491241595626aaa463ac1334ed76e6600ea1dfbdd688a9c5e9579de3c2ac40, 0x1c92af8f9f8f994af097a8bbb041d871733bc4027b662f290bfdb1cdc06e1a43);
        vk.IC[9] = Pairing.G1Point(0x1f8e4fb73392b5efce04d92b182ab291ad3807bd346f7b65a53d87ae16037e74, 0x1efc183653d64a2948bda6f0c86251bb8d4de4b09b5a12466259d7f684f75ba0);
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
            uint[9] input
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

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
        vk.A = Pairing.G2Point([0x1457a49bdde8032ecb4fbcaa01a9bf7a3d2439fab574fbce904545ddae0a3f63, 0x14de6d766e4b87254ad022327f28ea4c33ded5b8192a88898cf37650fd608f18], [0x192c26549c5762e5a1ab56520b066d2e2c01d02d86c867ea89579ae47b7c301d, 0x4502eb193d2be75861a2229f81a2166c45d2c97b56b46040ba090ec5de2c9b1]);
        vk.B = Pairing.G1Point(0x29e95936e5b23ba11b12110cbc6a79e075945cdd0cf75998ff603c083e9b4b49, 0x1544d5e2f2d4963d132ac4fa0b02f1635e8d61b84b676df3f52f6ab59d087a7b);
        vk.C = Pairing.G2Point([0x2169a75f7d4247559240559ca86ed8c23ac846856b8ff60d11298cd750b9b783, 0x2f3e1fd2da93e9d266d1e460f17dcd698f90554a2a46ac441b6cffc638e45b69], [0x2b4d4d536a979aa680a58bab1161724da4e4d7e47181d567a9e56f3e9abbba36, 0x19160bf5476e3b2fa631d7a48c1154a4d81dbde02d4ffa3d369c184d2245e6ad]);
        vk.gamma = Pairing.G2Point([0x1f25410074bcba7fc394ef8ef6af87d4179abd7dcddb61cfeab29f0a07c4789c, 0x146b67298a5e5b2c147d18f423de6d5f7e57349511ecabebb3ac994b112ce1a2], [0x17db69772091f44b07b977702e9411ab2854df1e9a117d5c969cf838fd689970, 0x161565b1ba08c51b7828f64aa3e546311b7a819943f582a229048a1259390bb9]);
        vk.gammaBeta1 = Pairing.G1Point(0x51c0c15116a8ed4809a363bedaa9ae78faa0f046bd541112cea3eacdbdfc57a, 0x246277b8ad97301ecb4f8dd9e3bbd053d93725155bac07c545f28e34e9482561);
        vk.gammaBeta2 = Pairing.G2Point([0x205378f41c6f86d71ac21e616898866e8c13e1b62f570108cf6564e0cef2d7d2, 0x6fbb06b1d25ec4ae33a04e60390a336e9327f0a013b433180f50dd3fb90a54c], [0x1b4c7bde4bc824b0354d6ddd76b6905c671da3447b93e3eb733dafee5fefc097, 0xf25be358316d04a9cdae20659c9b41b8754dfe254e6d18713d5b0c2ca5a7b]);
        vk.Z = Pairing.G2Point([0xd83e0ab2e2b963e0114405a6527d02cbf9c504908703563c4ab84d4517f96cd, 0x9ccf7daf5a6b3086385853f60cfed94da5f4d7762a5931bcc3a043476064639], [0x25aa257db68c724d36a1c26224b9584132f3db0cdeb0010162432266b83cff1e, 0x2aabaf675f57b6d6517265f967f4bd665fa91ec704f08ef0f45e5148c2141764]);
        vk.IC = new Pairing.G1Point[](6);
        vk.IC[0] = Pairing.G1Point(0x1a60dd5cdd8ce5a1bd72943d64621e830be132085e52adaac5834d35bb309a54, 0x17ccad4d1a5231a15801b5e8c116893d243e47dd8e982c5a0ebb88c0383d395b);
        vk.IC[1] = Pairing.G1Point(0x1eca92b396f817c56a18a01212f3c3aa28b2ed28867863db2eb47841d57e4e37, 0x162b45df44bf89223b7e7bc7f4b65eca46c9f70d0aa614b994cee1bb5ba13d82);
        vk.IC[2] = Pairing.G1Point(0x1544f22986051529aa415a22e1c230f75ce377e435050a8a1bf890dbd4b11ed0, 0x1de3fb24bee09ddc8042ecaf3d493decf93092290077c8d02c4999692a8940e3);
        vk.IC[3] = Pairing.G1Point(0x1026a0e8a1148f13e845492316702550c69aba63636d077c55a0e795eeb50a4f, 0xf3fb1b309b5f56a68741c5fb15716e8200994917ff4c57cdfde76f66540ac52);
        vk.IC[4] = Pairing.G1Point(0x1868dcf9a8247ba93c210e642a29e533cb62363a8be2bf863250ef03e18f23b4, 0x5fe4c5208a010fcd62b8d132af2fb17c8150a266c0d6600bfeab43d8380dcfb);
        vk.IC[5] = Pairing.G1Point(0x44b0dfe65902d113b7d0850fb3759c2823674a21caf1c824df2d8379222a5f5, 0x1fd19e9b0c01763f0cb51c12e0597877e35eb3281e2bcf893be6a02d649fcd1f);
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
            uint[5] input
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

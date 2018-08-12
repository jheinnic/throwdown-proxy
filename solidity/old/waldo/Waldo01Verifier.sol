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
        vk.A = Pairing.G2Point([0x203e3009c1bbc2e85f052cc2fdd4bb2ddf2b246ea34ad2adf541cb22c1f4ef96, 0x2ec213bcccca1411d45680ca3610af0744bf893cfe30194346e4cc2110a7efb], [0xf86a46b82abe3e804a7a46dbb8d1911e98be64bab4087269c94ea0de87e3513, 0x231b634ee47baf81001df0872e19e632f0d53e31a140f1fb91abb1bbe7f01c52]);
        vk.B = Pairing.G1Point(0x6f87ee5f38f309c3d078ed48a5fca503dbed6da8962b183febf6f8847c3d2be, 0x252fccbf2fff19b8f1dd5ee5580328543551d5367d89581869ed168a465921db);
        vk.C = Pairing.G2Point([0x2d010f61b6f1272925c88e4bf049bddf19ca4ffa99fe1fa24a3cdf73f7a855ea, 0x17edacee76979c4d7fe8935953c728e7e73ed3b468bf62fcebd2d04ed8978686], [0x1c7633eaa311e19daeb3ef6942f9b131a90d171da418a340eeb2bb4e743aaf61, 0x12f4ea4c5714e7ffb05517110c22cea3769023f53aec27a936fe4881c2893495]);
        vk.gamma = Pairing.G2Point([0x27a6ea55958602a2a735c19861d9facfe95d5c45a616fbd256616279c615ef97, 0x234b8c1b3ee079ff383cb13c16d49a91fceb7cdb0c1efb248b4fd3b3a488c47d], [0x2e8df20b6ca0a273e482d102a792143d5604709d09b17f3d56a5a3bca0240bdd, 0x2786a5cf348901b7e587a76342a32a55135c5d2a8b1eb5f2c455b0656db7521e]);
        vk.gammaBeta1 = Pairing.G1Point(0x2b78be1194e2c7ab694db7d82946eb8eee7fa4400fa71fe108de9d55a4495ebe, 0x1e76cd269c0ce64e03ec7eb7d4692b43b131a1c0818feef0bb4312c85b250700);
        vk.gammaBeta2 = Pairing.G2Point([0x151cff39c66aa4d07d36c66436a8682b6795aeab18ffa413970ad838afe59435, 0x1e952a0ae1b54c4be5154caa70edaefbd05044df0d72d71558f0f1c5da265682], [0x28ab8768e53f6b726d21c490661743904bc23d824ff63d23f489465393a719e0, 0x2d5dd66d75a557321def30866b0689a54bf79a121e92e0ed2be8148091a97139]);
        vk.Z = Pairing.G2Point([0x2075c6d1b88fac8897684069e45ba88fb001f5b7c34106c3bb5f437eefd8a491, 0x188be4589f5971403d4c36d89e17635fbc54e882d07b8448ced37cddd96c275f], [0x1ace6f9a45bdb8f0be0b65ae23277ca1aee5c3b3abcf91526c5382ec41630b78, 0x1fab5594a233948d15241464c9378df5931324c5ae1ab4376786877fe8ded8f7]);
        vk.IC = new Pairing.G1Point[](6);
        vk.IC[0] = Pairing.G1Point(0x2de4258891037a7688c77c1811475e6ebe688ceaf7034e4884b9a08f927f66d6, 0x10f8518158908bff3f4e50921cb0e36050a720e78a995f7cfafaae9d030075e2);
        vk.IC[1] = Pairing.G1Point(0x226915d7d60d717c0bc1239e84324d1323c6376248c8c0de94d5d17605625c9c, 0x2e0bb791443aa88616d93e5451c21680585be57ab06ed31ad5edbf9590c70349);
        vk.IC[2] = Pairing.G1Point(0x15ca0c36836845899f85239e5dc1a53b7485dabc741419c12df572c52d5fb9b5, 0xc8f383a99ded0698f268efbf8347dfb7f4cb340a022af072005dd5e2bcf5bb1);
        vk.IC[3] = Pairing.G1Point(0x1d3f216c543153fa466d2ddb93a566c74e1336da768d49c374e02c0235bebefb, 0x2c4a25057b62fd144e9992c7434c048d0eda3c6b305cf9d0a8f4d2e1ea164350);
        vk.IC[4] = Pairing.G1Point(0x11d2e4e0e865e453a2c8a89e86282243c043dbff1183bbce3967be58268921e1, 0x304262c979b3463dfd756ea53c8eff1b456c07d41f568315ded217c79e1cf4c2);
        vk.IC[5] = Pairing.G1Point(0x496010fa3f740441ec2f4708ff4762e18bd739306adaec471a2f2c9c338eb87, 0x26dec31b6af427e5ecfdf5a52f2667554b1c78bc5d97f337581aa2f75da629a);
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

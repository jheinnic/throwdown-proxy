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
        vk.A = Pairing.G2Point([0x1e29754b47a9d5a223a1035b54d7b68e1e3aff91bdca1dcc17beb0d9dcc3c7b1, 0x615118e81d31c4cd892e1716a7b45f7ca4316f44076a64d0c7f9398446c80ef], [0x2ef367ea8957f60fa5becd452a113493f87090329be90dbe71131bb78d6e9e2f, 0xfc726beb57de6b6ce0fa4ccddd9f50cd335084ba6015525220dd0600e82bf5c]);
        vk.B = Pairing.G1Point(0xb5bc09fa96e26b1e31e81169d788253cc739543c6462b547a758379edb67bbd, 0x21eeda43035742754cd5935e94814fa8bbdcd3229f398e30aaa20143865cbd7c);
        vk.C = Pairing.G2Point([0x1fa7e25c6c30f6d086a62af959072bf090097fd427f9fedd3df32311a6315d98, 0x1a43659cda96003531b4fc5eadb9525f7e05269c4587efad6346c4bdbd9d940], [0xa29d56d1823e2f1368dcb0b78eeb033886a8e11fe1416a1f366dc7d6013ddc3, 0x250d419546313aab02ed5204f3c1177dd1536b02a5e226a452f507eadd6f3866]);
        vk.gamma = Pairing.G2Point([0x1c02c31a50d1428d548d4372f353fd63ff22a84bf32622f4d4684ffbbe398a73, 0x2935ff445d01e5f065450f6a7c2aba2bf9b1bc559fca714f3b2bdcc4c948b67d], [0x17b7102c8a50e3ab0aacd097ed596d11887b3c3d429b0a595f06676e1cec7671, 0x2b0da452f7be6b5e66160228c68e42ba486f65139343e0c0c2c2d1fdcb69a23f]);
        vk.gammaBeta1 = Pairing.G1Point(0x25639a1ff75be7dae938764c1bf4dbf073ddf3fbae5cc82e3107766806caf8e4, 0x25bd27ff946ea4e2b65b107bc44504d5c98a7591dc393d640b3cf5b9931b4c84);
        vk.gammaBeta2 = Pairing.G2Point([0x1867a618656adeecad431e1bf447d58eb4892b99201f8d872d416e991b74ccd4, 0x11fc51ffe6a7ab8385e94e372159f81b688813f74e8e26199f096273f01e2e0e], [0x1e3ca59c0780bc59d27791ca06d105f996b81a27a2cd00064c40edf10ea297c, 0x2deb0003b4ecd55c82e8acbdd7c21666e60413a438ee9f04a6d768c1a16c59dd]);
        vk.Z = Pairing.G2Point([0x12dc9e9bcf4f751ac8cffb3254af61a04dfc39d391521b335902f1a8a37d13ea, 0xe156bb4bc994f5e359553dbcab16d1b1842b1234c057ff4c761bcab81963ebf], [0x6ba934e0a1ee896ab95f679ac2561478b092ad1cd70f4db603ffb7147580c9d, 0x188f7ed8ecc9dcc9281899086ee5e8e18edd71db422810c59465c9c7968ae6a0]);
        vk.IC = new Pairing.G1Point[](6);
        vk.IC[0] = Pairing.G1Point(0x2737d57563fd27acc7dcda107a6c8dbe106a877e0f99fda9d3f6de09427cdf4d, 0x2fdc299dbe9e11da0c3e3e0d628e475d7968342f0c2bebcff2ddd6bebc48ffd6);
        vk.IC[1] = Pairing.G1Point(0x2b41d453e59fb92f90773ac5e52006c69ee495e99bb02da473e36c6607f1fad4, 0x252788acbcdc8dc77d04a0d3a6102b3857fba18e33e35fef2c3b8615353dc420);
        vk.IC[2] = Pairing.G1Point(0x22490c57985b34b468b91702a0b9e992ec511fcd37e501c999df8d90ebd0ee15, 0x65c4e059c58beaeb3034ae300fae18b137bf933620f6ce3273a377a9a460e80);
        vk.IC[3] = Pairing.G1Point(0x18df1c60ef77b31a5de4cd296478a3797c24ec0392743b18b7f02ed2fb8182e8, 0x1f62eee47403c90c2462d9eb88bd2fa7c65fb62438b987e73be270f0418f2485);
        vk.IC[4] = Pairing.G1Point(0x2818125000c6f55e81c07d8b084df4cf92715d6f1a2224a6e68a1f4146f57fbb, 0xfe822a8b4ba7cf3e73a3b58b011fd4b5de3226d55058d5a5e5dae7d5ba71395);
        vk.IC[5] = Pairing.G1Point(0x2eb6b909f255c21a8d9fe995691ef6d9208fc3452617ee8523df823480906370, 0x2a0d85c666b08071ad3de2d6c641ae52ef056dd02ec1ddea5fe32bd8f3c88cac);
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

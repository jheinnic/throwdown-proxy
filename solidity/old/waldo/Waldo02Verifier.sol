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
        vk.A = Pairing.G2Point([0x2614d4d3e678cef2423415114fb801be524597648a7f35ecad2bd4cec6a5e443, 0x1080e1d202cba682880d8eaf4968babd16a0ed2ae1e846b571936a1b52417258], [0x3a6dfca9f280bd3a83f12a20bb222bca63ad506083625c4facc2b38b49ac122, 0x17952d82561ea64fe7348c772ad67a280595096fd8ca1975993e136d7f15c04a]);
        vk.B = Pairing.G1Point(0x17e12c68cb118cbd7252d3c0f08920c3b695413166451d7b568cd26f40ebf922, 0x5665c562c2b3d9983a716c2bbd9b9eb62ff9738c7f51ea29f6801dd4a1781ae);
        vk.C = Pairing.G2Point([0x2f4b1a1ce4c953551b91650d2cbde04eaaeb72e52a8063fb29f7aae2376e1d1b, 0x1f28771685ed47a479d5ef7136d4279d46ee7e077b9687d7665d9188884537ef], [0x2ff9cc094caf4752e8010de99439861f3ce811e32d82625f48c8ec6d62d8b61f, 0x186f0d7435ef936377928f1942323b8e0a0ffd3709d5fd8d418daf0a7e5d52c9]);
        vk.gamma = Pairing.G2Point([0x295825bc3a2bcd0c00b203f6bfa357cc03d5f507a39bfdd98b9cb9c4e9598a44, 0xfc28dd6ca919b815a27f9ecaae9585de5165a136f286e3324b0593b0e6fe7aa], [0x11f30a822e6e71c9d5fd44a72be05d51c6872d631bbf5e04ef951a46c3e48448, 0x2fd99115417aba012ae5e8c8a6ee7d854b87a2f1f94f9319f3d5efa69174f3b5]);
        vk.gammaBeta1 = Pairing.G1Point(0x22e4c5c4359035c33dfb1ac4fac592bedc38b74b28fe25a1857640df34c053a, 0x29ef8d4b25c633d5929f403cd729434b415462d465536073904ffd7f0b73c3e0);
        vk.gammaBeta2 = Pairing.G2Point([0x2c243db011be949e3e913ab6bf0d0b98aeed6efe508dfd7ef28d49629b52add0, 0x3dbf9d6127866a6525db7c5e9218e0ea53d48563c0c2334c3103c8c367124d2], [0x25bc509a53c2c9f5ec4acc2498a9a7515586deb5b8b6954d37c5ece2a694b5bf, 0x1b10f1a340317450b08345eb8557c7a1b5cda197f07ee352ad904d6478dbe4d6]);
        vk.Z = Pairing.G2Point([0x1fe0af21887bc12a11a57629d8f3c1a803e7dfff73df2e040a2c3f11f144e8af, 0x258874596ab37811331fe1497012b20f6be2a66f6ef6bccd5b5b1c5c275aae7c], [0xedd23c8ab3521a5341ebb0a835ffe47e462ff0c11111044bb7f1bc837c4c135, 0x1f7cc43fe95d29689989fdb23afbe26529a7fcb3eb0c551f5fc23db8eab9db28]);
        vk.IC = new Pairing.G1Point[](6);
        vk.IC[0] = Pairing.G1Point(0x90cf329e0f2d3c0c84cbe3db441eaaf01b4eb4c33bd52a41c7a63880e779460, 0x2d31f565266f4553a784ea627bfa3c7f0b5b86110fccdc73f1d30df06599a4f9);
        vk.IC[1] = Pairing.G1Point(0xe9337a314dda7bbf5e35f2c4efd018175b5f39b16d6b36b31bef234ae6c2719, 0xc50bf5d396e39a255e8fedd8dffed7d0b593c370362ba67f11c7e8184f63d9);
        vk.IC[2] = Pairing.G1Point(0x865dd3d338e1078cf25d5a726d5e366daee9cc72192d1b7c0a596f102992977, 0x1b43103a697c9c26f4bd6dff263550db2e91f03b6409b6d78575efa033290dbf);
        vk.IC[3] = Pairing.G1Point(0x2f465853759418f2547a4a998b02fde1e2173fce347c80d9f71bb988ffd9f3e7, 0x1694924eea07934d32e9c200c802994d818d5030baac493efdb1ede724d63dad);
        vk.IC[4] = Pairing.G1Point(0x1864723aa5811e3f7686086334e5fb557e8481643aaa4fd101a0727cae1fa20c, 0xdb71636ffb476f00c55e9814f746f4ba6ef550cad4e15cf8cea756e48937322);
        vk.IC[5] = Pairing.G1Point(0x17aebaef3d1b53ff6ecc27e54bd503dff2c475d9953447c0ecccf413ac2d6342, 0x1b5bd3b84b10143fd263caac8918cdff534a22bab5ba4c1cd040c03f08edcd5b);
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

// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

pragma solidity ^0.4.24;

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
            switch success case 0 { revert('Failed addition (op=6)', 32) }
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
            switch success case 0 { revert("Failed scalar_multiply (op=7)", 32) }
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
            switch success case 0 { revert("Failed pairing (op=8)", 32) }
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
        vk.A = Pairing.G2Point([0x28474a057da82c74feda8cdb61b1e59db564ec70c189b74ad27c2dd4a447f95f, 0x9d8b118df8120ff77bc385b3da3e22a474672446f0252f9f774c82b64f9c2f3], [0x2fbb7f244e42b4064b471af7cf07051ce0f523d1609698455a205955399c3efe, 0x1f2292e28f71e7288f0619f8a6842708a3780a90a9a03f97ba2574d9ab0f26f0]);
        vk.B = Pairing.G1Point(0x1c234ecaa33a34c22b37d82afb89cbf6fc1fc700828875805863f0fd681f07e8, 0x40683ebed0cc861ae4d74e5c145a437d400b0eab1edc6bf72aa192eac1ba0fd);
        vk.C = Pairing.G2Point([0x534d0f0a06b6fd1f321a87863d063fbf51a489de55b7b7447b3a8320b306595, 0x144ae7c85d6000bedd2c7206d4f364178cfe54c569ac0024ec75c2dd85b0bb0a], [0x1c0027cc101f3f8f96690d3951d3df1eedb73207ca2a64254d469eb0a7fc684e, 0x226f1badf0fa55a4354df2602cc31d4f28bb4979a41e142e669b1e64d8c57572]);
        vk.gamma = Pairing.G2Point([0x2520c9f5ebd1c1b8ed27ed4b87795ee0c4f47c89b506fe95ba32559cebf2786f, 0x192f125007b3b469e6502a4083baa02d453cd8882b14101afb2e98526befcd2b], [0x2551dff721b07d39a11b41b4f3e0b64752bda2778eb4e247757d289b7d9f6a51, 0x84ccd8d8498b13ec66755daa17c745bec3c5369a3bfa7f6eb9be78f3407c500]);
        vk.gammaBeta1 = Pairing.G1Point(0x28c2a30fa9c5509d34a3703fa5ac085ad384a0ec8766f86c6c16999349f06d37, 0x304b8fcf1913428f86ca6f759d651b7208d64673a8530778b44057920c711495);
        vk.gammaBeta2 = Pairing.G2Point([0x12fc5e980e29765dece3d0d2352b6df8a5f26457a8a05857adcb2fc62d286c95, 0x770117335b05f1c5638cff52f4ca8eed2381d029bd2afa48c4a5e4921163c9b], [0x1e06536d3e680036e9f9b0d217dfad997cd7573694b5fed139c2ddde5370af4e, 0x202000480ba124bf6a5baf21efc70c7e447266c96ce96ae062d63f75962ac3a1]);
        vk.Z = Pairing.G2Point([0x87ca24e4d8a2a178e2754d4dbd7dae3d82bd17e294e00b9240cc2911501c48a, 0x84f73584fd3405c6445c5d74d9fc6a0a5d1efe1928550cbbc9ce0d1d60c4d10], [0x53d4c279e44cf703c95b15e07e3598f08e37062f99813c2f840469e0d6297ce, 0x245109b6792ad481e87ce9599b0760bfe41f540ca69bc3f72e4d010f3daf959]);
        vk.IC = new Pairing.G1Point[](10);
        vk.IC[0] = Pairing.G1Point(0x13150ffcab4bb59d0ee1cb6fe4b6d18c254231be65fb2895c1cd63193120d8b4, 0x24c6fb4eb7e43a50894012d1887985e55699a5acd65372954b7b5c130cb071c7);
        vk.IC[1] = Pairing.G1Point(0xa8e19ff4419832e896ff930d365a7016d24059907103f99f276cc94946358e6, 0x661d797a3c0b23357751e01ebdca9e069f96d257df650ea11056b12cd089354);
        vk.IC[2] = Pairing.G1Point(0x1807614f01e4f21d873edbf1c219c618cd8de3d0381bf5648e064726969b72b9, 0xb7311a438a3c59f2c09bb82ec0d76008dcbece03ab2f8e83c8d423ce77ae9f6);
        vk.IC[3] = Pairing.G1Point(0x11a6deac4bbbfc2bb76375bd4427825307e2f8d135289aa6c0c45a93bf92ea68, 0x267a0e12aaeec2e180a3dce4da63a7b5901f549e3e9a0c1968124e16ca822d90);
        vk.IC[4] = Pairing.G1Point(0x252cd04520b7128586a35bc7953844f9628da2942dc9034fd8462da6044396c8, 0x28bdf3fb2f33be701fcd2b07725c6bf2a8803474c9e25f7db0c5fa8ec8af6b78);
        vk.IC[5] = Pairing.G1Point(0x187f5c93af2516222f34bc8838a7874e382e4b61f2f5b7dcf2636d98f3a89ede, 0x1c99734e4ea082dd33ec4347cea94c9b04dd9daf986b5a1f47e03539107974b3);
        vk.IC[6] = Pairing.G1Point(0x8c98fdf51a05cbed860e987f1ca0fcbfde40f70d69ac7af8d9c348100cd8679, 0xaf46283cae751f88eea32fbb332a49e20af3d1b325a040664bb848f556a78c7);
        vk.IC[7] = Pairing.G1Point(0x246282176792f6aa99a05f5541475de0274929819b96633e36d46f0e3e3c2dfc, 0x12b83d278de1f9c9ad21daed88302b747d6ec5452adc7e5a1dfe890828a64233);
        vk.IC[8] = Pairing.G1Point(0x128f2cc90313fdfe7af725b6689db377adf0fc703193541023b04837d40ababd, 0x530caf4551f86b2a3dec4febe85a02a1a2714b74621a1fda95951c4dcae51c1);
        vk.IC[9] = Pairing.G1Point(0x27857056aa3651816325f21e13523a3ecc867ccc2be88465e539ec194b8c650d, 0x6c9472a2fb5e512d01ba7b1c7cbdd970848a96da359273ebe99c61e214d4e51);
    }
    function verify(uint[] input, Proof proof) internal returns (uint) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++)
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        emit Verified("Beginning of first pairing test", true);
        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        emit Verified("Beginning of second pairing test", true);
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        emit Verified("Beginning of third pairing test", true);
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        emit Verified("Beginning of fourth pairing test", true);
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.addition(vk_x, Pairing.addition(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        emit Verified("Beginning of final pairing test", true);
        if (!Pairing.pairingProd3(
                Pairing.addition(vk_x, proof.A), proof.B,
                Pairing.negate(proof.H), vk.Z,
                Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        emit Verified("Returning home", true);
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
        emit Verified("Begin verification", 32);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            emit Verified("Transaction successfully verified.");
            return true;
        } else {
            emit Verified("Transaction failed to verify.");
            return false;
        }
    }
}

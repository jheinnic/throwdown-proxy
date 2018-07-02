// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

pragma solidity ^0.4.24;

import './Pairing.sol';

contract Wavelets02Verifier {
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
        emit Verified('Start of pairing tests', true);
        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        emit Verified('Passed first pairing test', true);
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        emit Verified('Passed second pairing test', true);
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        emit Verified('Passed third pairing test', true);
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.addition(vk_x, Pairing.addition(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        emit Verified('Passed fourth pairing test', true);
        if (!Pairing.pairingProd3(
                Pairing.addition(vk_x, proof.A), proof.B,
                Pairing.negate(proof.H), vk.Z,
                Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        emit Verified('Passed fifth pairing test', true);
        return 0;
    }

    event Verified(string message, bool isGood);

    event PrecompiledCall(string message, bool isGood);

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
        ) public {
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
        emit Verified("Transaction verification begins.", true);
        if (verify(inputValues, proof) == 0) {
            emit Verified("Transaction successfully verified.", true);
        } else {
            emit Verified("Transaction failed verification.", false);
        }
    }
}

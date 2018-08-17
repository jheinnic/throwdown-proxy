import {BitInputStream, BitOutputStream} from '@thi.ng/bitstream';
import * as crypto from 'crypto';
import * as readline from 'readline';
import * as sha256c from './SHA256Compress';

const default_iv_words = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
const iv_out = new BitOutputStream();
iv_out.writeWords(default_iv_words, 32);
const default_iv = Buffer.from(iv_out.bytes());

const inputs: string[] = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  // console.log(line.length);
  inputs.push(line);
  if (inputs.length === 3) {
    test_hashing_four(inputs[0], inputs[1], inputs[2]);
    inputs.splice(0, 2);
  }
});

function parse(bits: string, writer: BitOutputStream) {
    bits.split('').forEach( (bit: string) => {
        if (bit === '1') {
            writer.writeBit(1);
        } else {
            writer.writeBit(0);
        }
    });
}


function test_hashing(lbin: string, rbin: string, digest: string) {
    const lout = new BitOutputStream();
    const rout = new BitOutputStream();
    const dout = new BitOutputStream();

    parse(lbin, lout);
    parse(rbin, rout);
    parse(digest, dout);

    let hasher = crypto.createHash('sha256');
    hasher.update(default_iv);
    hasher.update(
        Buffer.from(lout.bytes()));
    hasher.update(
        Buffer.from(rout.bytes()));
    let dcomp = hasher.digest();

    let cin = new BitInputStream(dcomp);
    let cstr = cin.readWords(256, 1).join('');

    console.log('');
    console.log(dcomp.hexSlice());
    console.log(
        Buffer.from(dout.bytes()).hexSlice());
    console.log(digest);
    console.log(cstr);
}

function test_hashing_two(lbin: string, rbin: string, digest: string) {
    const lout = new BitOutputStream();
    const rout = new BitOutputStream();
    const dout = new BitOutputStream();

    parse(lbin, lout);
    parse(rbin, rout);
    parse(digest, dout);

    let hasher = crypto.createHash('sha256');
    hasher.update(
        Buffer.from(lout.bytes()));
    hasher.update(
        Buffer.from(rout.bytes()));
    let dcomp = hasher.digest();

    let cin = new BitInputStream(dcomp);
    let cstr = cin.readWords(256, 1).join('');

    console.log('');
    console.log(dcomp.hexSlice());
    console.log(
        Buffer.from(dout.bytes()).hexSlice());
    console.log(digest);
    console.log(cstr);
}

function test_hashing_three(lbin: string, rbin: string, digest: string) {
    const lout = new BitOutputStream();
    const rout = new BitOutputStream();
    const dout = new BitOutputStream();

    parse(lbin, lout);
    parse(rbin, rout);
    parse(digest, dout);

    let hasher = crypto.createHash('sha256');
    let hasherTwo = crypto.createHash('sha256');

    hasher.update(default_iv);
    hasher.update(
        Buffer.from(lout.bytes()));
    hasherTwo.update(
        hasher.digest());
    hasherTwo.update(
        Buffer.from(rout.bytes()));
    let dcomp = hasherTwo.digest();

    let cin = new BitInputStream(dcomp);
    let cstr = cin.readWords(256, 1).join('');

    console.log('');
    console.log(dcomp.hexSlice());
    console.log(
        Buffer.from(dout.bytes()).hexSlice());
    console.log(digest);
    console.log(cstr);
}

function test_hashing_four(lbin: string, rbin: string, digest: string) {
    const mout = new BitOutputStream();
    const dout = new BitOutputStream();

    parse(lbin, mout);
    parse(rbin, mout);
    parse(digest, dout);

    let dcomp = sha256c(
        Buffer.from(mout.bytes()));
    let cin = new BitInputStream(dcomp);
    let cstr = cin.readWords(256, 1).join('');

    console.log('');
    console.log(dcomp.hexSlice());
    console.log(
        Buffer.from(dout.bytes()).hexSlice());
    console.log(digest);
    console.log(cstr);
}


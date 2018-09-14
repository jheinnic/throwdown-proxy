"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hdkey = require("ethereumjs-wallet/hdkey");
var bip32 = require("bip32");
var bip39 = require("bip39");
var mnemonic = 'reward decide comfort submit reopen average surface surge harbor work stove holiday balcony adjust more come brass before snow afford labor vocal plate flash';
var entropy = bip32.fromSeed(bip39.mnemonicToSeed('reward decide comfort submit reopen average surface surge harbor work stove holiday balcony adjust more come brass before snow afford labor vocal plate flash'));
var hdRoot = hdkey.fromMasterSeed(bip39.mnemonicToSeed('reward decide comfort submit reopen average surface surge harbor work stove holiday balcony adjust more come brass before snow afford labor vocal plate flash'));

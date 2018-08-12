import * as hdkey from 'ethereumjs-wallet/hdkey';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';

const mnemonic = 'reward decide comfort submit reopen average surface surge harbor work stove holiday balcony adjust more come brass before snow afford labor vocal plate flash';

const entropy = bip32.fromSeed(
   Buffer.from(
     bip39.generateMnemonic(256).toSeed(),
     bip39.generateMnemonic(256).toSeed()
   )
);

const hdRoot = hdkey.fromMasterSeed(
   bip39.mnemonicToSeed('reward decide comfort submit reopen average surface surge harbor work stove holiday balcony adjust more come brass before snow afford labor vocal plate flash')
);



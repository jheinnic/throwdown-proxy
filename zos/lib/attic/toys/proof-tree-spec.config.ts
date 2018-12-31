import {configClass, configProp} from './config-class.decorator';
import '../infrastructure/reflection/index';

@configClass( "relativeToLastDir")
export class ProofTreeSpec {
   @configProp("1+2 = 5")
   protected foo: number = 8;

   @configProp("6 / 3 ! 2")
   protected bar( input: string ): number {
      return input.length;
   }
}

const aaa = new ProofTreeSpec();
/*
{
   "keySource": {
   "mnemonic": "number ticket outer asthma wine define arctic butter tower settle answer weird error kiss rail negative assault demand satisfy describe flat suggest bird wall average tuna inspire invest cart length",
     "key": "xprvA3YzySLTBTCvfPiLeA4PuT3XETYhiL7Rkb3XT7z7JZAabgJXfArVWTUYhB4Tccbj43W9f9m7iXs6HZBfcWa4voeQ3wrvUQ3YtNVvFcvXRd3",
     "path": "m/44'/60'/9'/138/2'"
},
   "proofDepths": [
   2,
   3,
   5,
   7
],
  "blockLayout": {
   "fieldSizes": {
      "gameId": 32,
        "checkBits": 4,
        "prizeTier": 10,
        "tierNonce": 18,
        "serial": 160
   },
   "fieldOrder": [
      {
         "fieldType": "gameId",
         "offset": 0
         */
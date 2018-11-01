import * as fs from 'fs';

import {PublicKeyContent} from '../../modules/tickets/values';
import {injectable} from 'inversify';

@injectable()
export class PublicKeyDataObject implements Iterable<PublicKeyContent>
{
   public [Symbol.iterator](): Iterator<PublicKeyContent>
   {
      return readPublicKeyDataFixture(
         '/Users/jheinnic/Documents/randomArt3/pkFixture/publicKeys.dat');
   }
}

function * readPublicKeyDataFixture(fixtureFilePath: string) {
   // @ts-ignore
   const fileData = fs.readFileSync(fixtureFilePath).utf8Slice(0).split('\n');
   let ii = 0;
   let dirSize = 4;
   for (let nextLine of fileData) {
      if (nextLine !== '') {
         const nextPublicPair = nextLine.split(':');
         console.log(nextPublicPair);
         const xBuffer = Buffer.from(nextPublicPair[0]);
         const yBuffer = Buffer.from(nextPublicPair[1]);
         const uuid = nextPublicPair[2];
         yield new PublicKeyContent({
            locator: {
               type: 'key-pair',
               slotIndex: {
                  depthLevel: 3,
                  directoryIndex: ii / dirSize,
                  relativeAssetIndex: ii % dirSize
               },
               versionUuid: uuid
            },
            publicKeyX: xBuffer,
            publicKeyY: yBuffer
         });
      }
   }
}

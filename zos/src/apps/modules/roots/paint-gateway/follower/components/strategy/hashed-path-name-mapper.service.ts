import * as crypto from "crypto";
import { BitInputStream } from '@thi.ng/bitstream';
import * as path from "path";
import { IHashPathConfig } from '../../interface/model/deployed';
import { IArtworkNamingStrategy } from '../../interface/strategy';
import { IArtworkSeed } from '../../interface/model/specification';
import { Path } from '../../../../../../../infrastructure/validation';

export class HashedPathNameMapper implements IArtworkNamingStrategy {
   private readonly fileNameEncoding: 'hex' | 'base64' | 'ascii' | 'latin1' | 'utf8';
   private readonly dirNameEncoding: 'hex' | 'base64';
   private readonly hashAlgorithm: 'md5' | 'sha256' | 'ripemd160' | 'sha1' | 'whirlpool';
   private readonly fileNameSeparator: string;
   private readonly prefixFirst: boolean;
   private readonly bitsPerTier: number[];

   constructor( config: IHashPathConfig ) {
      this.fileNameEncoding = config.fileNameEncoding;
      this.dirNameEncoding = config.dirNameEncoding;
      this.hashAlgorithm = config.hashAlgorithm;
      this.bitsPerTier = [...config.bitsPerTier];
      this.prefixFirst = config.prefixFirst;
      this.fileNameSeparator = config.fileNameSeparator;
   }

   public toName(modelSeed: IArtworkSeed): Path
   {
      let fileName = Buffer.from(modelSeed.prefixBits)
         .toString(this.fileNameEncoding);
      const suffix = Buffer.from(modelSeed.suffixBits)
         .toString(this.fileNameEncoding);
      if (this.prefixFirst) {
         fileName = `${fileName}${this.fileNameSeparator}${suffix}.png`;
      } else {
         fileName = `${fileName}${this.fileNameSeparator}${suffix}.png`;
      }

      const hashStream = crypto.createHash(this.hashAlgorithm);
      hashStream.update(modelSeed.prefixBits);
      hashStream.update(modelSeed.suffixBits);
      const hashBuffer = hashStream.digest();
      const reader = new BitInputStream(hashBuffer);

      return path.join(
         ...reader.readFields(this.bitsPerTier)
            .map((value: Buffer) => value.toString(this.dirNameEncoding)),
         fileName
      ) as Path;
   }
}
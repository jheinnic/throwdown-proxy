import { Chance } from 'chance';
import { IWordGenerator } from './word-generator.interface';

export class ChanceWordGenerator implements IWordGenerator
{
   private readonly ch: Chance.Chance;

   constructor() {
      this.ch = new Chance();
   }

   public getWord(): string
   {
      return this.getNormalWord(5.5, 1.5);
   }

   public getWordOfLength(wordLen: number): string
   {
      return this.ch.word({length: wordLen});
   }

   public getNormalWord(lengthMean: number, lengthDev: number): string
   {
      const wordLen = Math.round(
         Math.max(
            3, this.ch.normal({mean: lengthMean, dev: lengthDev})
         )
      );

      return this.getWordOfLength(wordLen);
   }
}


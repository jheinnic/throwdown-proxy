export interface IWordGenerator {
   getWord(): string

   getWordOfLength(length: number): string;

   getNormalWord(lengthMean: number, lengthDev: number): string;

   // getNWords(count: number): string[]

   // getNWordsOfLength(count: number, length: number): string[];

   // getNNormalWords(count: number, lengthMean: number, lengthDev: number): string[];
}
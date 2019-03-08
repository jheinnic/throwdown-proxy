export interface IAlphabetMapper {
   mapToAlphabet(seed: string, length: number): Promise<string[]>
}
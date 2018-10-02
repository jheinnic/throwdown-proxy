export interface TaskDefinition
{
   readonly relativePath: string;
   readonly nameExtension: string;
   readonly prefixBits: Uint8Array;
   readonly suffixBits: Uint8Array;
   readonly generation: number;
   readonly novel: boolean;
}


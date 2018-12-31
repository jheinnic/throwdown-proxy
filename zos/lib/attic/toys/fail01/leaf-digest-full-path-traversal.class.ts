import {BlockMappedDigestLocator} from '../../infrastructure/merkle/locator/index';
import * as path from "path";

export class LeafDigestFullPathTraversal {
   function formatDirectory(nextBlock: BlockMappedDigestLocator): string
   {
      const level = nextBlock.blockLevel;
      pathTokens.splice(level, pathTokens.length, `${nextBlock.blockLevel}-${nextBlock.blockOffset}`);
      currentDirectory = path.join(ticketKeyPairPath, ...pathTokens);

      return currentDirectory;
   }

   function formatFile(nextDigest: BlockMappedDigestLocator)
   {
      console.log(nextDigest.leftLeafSpan + ' to ' + nextDigest.rightLeafSpan + ' or '
         +  nextDigest.leftLeafPosition + ' to ' + nextDigest.rightLeafPosition);
      return path.join(currentDirectory, `${nextDigest.index}_${(1 + nextDigest.position).toString(16)}`);
   }
}
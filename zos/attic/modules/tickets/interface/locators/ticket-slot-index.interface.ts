export interface TicketSlotIndex {
   /**
    * Often redundant, since in typical uses all assets appear at the same depth, but yields a
    * 0-based index locating the depth at which the slot's directory is found.
    */
   readonly depthLevel: number;
   /**
    * 0-based index identifying the host directory amongst all directories at the same depth.
    */
   readonly directoryIndex: number;

   /**
    * 0-based index locating the target slot amongst all other slots located in the same directory.
    */
   readonly relativeAssetIndex: number;
}
import {Allow, IsPositive, Max, Min} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass("eth.lotto.eventSpec.prizePool.prizeTiers")
export class PrizeTier {
   @Min(0)
   @Max(1023)
   @configProp("tierId")
   readonly tierId: number;

   /**
    * Combined with the prizeUnits decimal place modifier, determines the value of each instance of a
    * prize at this tier in the prize pool.
    */
   @IsPositive()
   @configProp("prizeValue")
   readonly prizeValue: number;

   /**
    * Modifies the units for prize value.  Negative values indicate units less than one ether, while
    * positive values indicate units of multiple ether.  Absolute value maps to a specified number of
    * decimal places.  Values permitted in the range of -12...+12.
    */
   @Min(-12)
   @Max(12)
   @configProp("prizeUnits")
   readonly prizeUnits: number;

   /**
    * Establishes how many prizes are present in pool at this tier's value.  Upper bound is 262143.
    * If more prizes are to be planned at a given value, current recommendation is to distribute them
    * across more than one tier with the same payout such that the cumulative total number of prizes
    * are available.
    */
   @Min(1)
   @Max(262143)
   @configProp("instanceCount")
   readonly instanceCount: number;

   /**
    * Set this value true if prizes in this tier are considered safe for automated generation and
    * placement procedures, and false if they are instead to be seeded into the pool by alternate
    * procedures that require more operator input and place any secret material directly into secured
    * vault storage to avoid even transient unencrypted storage.
    */
   @Allow()
   @configProp("batched")
   readonly batched: boolean;

   constructor(tierId: number, prizeValue: number, prizeUnits: number, instanceCount: number, batched: boolean) {
      this.tierId = tierId;
      this.prizeValue = prizeValue;
      this.prizeUnits = prizeUnits;
      this.instanceCount = instanceCount;
      this.batched = batched;
   }
}
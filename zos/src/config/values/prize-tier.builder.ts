export interface PrizeTierBuilder {
   tierId(value: number): PrizeTierBuilder;
   prizeValue(value: number): PrizeTierBuilder;
   prizeUnits(value: number): PrizeTierBuilder;
   instanceCount(value: number): PrizeTierBuilder;
   batched(value: boolean): PrizeTierBuilder;
}
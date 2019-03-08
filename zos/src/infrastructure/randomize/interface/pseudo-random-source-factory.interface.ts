import { IPseudoRandomSource } from './pseudo-random-source.interface';

export interface IPseudoRandomSourceFactory<Seed> {
   seedGenerator(seedSource: Seed): IPseudoRandomSource;
}
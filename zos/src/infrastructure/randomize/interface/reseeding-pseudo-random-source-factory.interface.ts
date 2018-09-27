import {IReseedingPseudoRandomSource} from './reseeding-pseudo-random-source.interface';

export interface IReseedingPseudoRandomSourceFactory<S, T = undefined>
{
   seedGenerator(seedSource: S): IReseedingPseudoRandomSource<T>;
}

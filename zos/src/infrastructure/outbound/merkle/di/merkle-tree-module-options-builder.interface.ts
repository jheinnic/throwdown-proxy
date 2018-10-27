import {Director} from '../../lib';
import {IBfsOrderBuilder} from '../interface';

export interface IMerkleTreeModuleOptionsBuilder {
   withTraversals(director: Director<IBfsOrderBuilder>): IMerkleTreeModuleOptionsBuilder
}
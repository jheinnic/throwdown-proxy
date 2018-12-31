// @di
import {Builder, Instance} from 'fluent-interface-builder';
import {injectable, interfaces} from 'inversify';
import ContainerModuleCallBack = interfaces.ContainerModuleCallBack;
import Bind = interfaces.Bind;
import IsBound = interfaces.IsBound;
import Rebind = interfaces.Rebind;
import Unbind = interfaces.Unbind;
import Context = interfaces.Context;
import LRU from 'lru-cache';

import {MERKLE_TYPES} from './types';
import {BlockMappedDigestLocator, MerkleDigestLocator, MerkleTreeDescription} from '../locator';
import {MerkleCalculator} from '../merkle-calculator.class';
import {MerkleLocatorFactory} from '../merkle-locator-factory.class';
import {IMerkleTreeModuleOptionsBuilder} from './merkle-tree-module-options-builder.interface';
import {Director} from '../../lib';
import Factory = interfaces.Factory;
import {IMerkleCalculator, IBfsOrderBuilder} from '../interface';

interface BuilderWrapper extends IMerkleTreeModuleOptionsBuilder, Instance<ContainerModuleCallBack> {
}

@injectable()
export class MerkleTreeDiAdapterFactory
{
   constructor() {
   }

   public extendCallback(
      tag: PropertyKey, value: any,
      treeDescription: MerkleTreeDescription): (callback: ContainerModuleCallBack, director?: Director<IMerkleTreeModuleOptionsBuilder>) => ContainerModuleCallBack
   {
      const builderEngine = new Builder<ContainerModuleCallBack, BuilderWrapper>();
      builderEngine.chain("withTraversals", (director: Director<IBfsOrderBuilder>) => {
         return (callback: ContainerModuleCallBack) => {
            return (bind: Bind, unbind: Unbind, isBound: IsBound,
               rebind: Rebind) => {
               bind(MERKLE_TYPES.BlockTopologyWalk)
                  .toFactory((context: Context): Factory<Iterable<BlockMappedDigestLocator>> => {
                     return () => {
                        const calculator: IMerkleCalculator = context.container.getTagged(
                           MERKLE_TYPES.MerkleCalculator, tag, value);

                        return calculator.getTopoBlockOrder(director);
                     }
                  }).whenAnyAncestorTagged(tag, value);

               callback(bind, unbind, isBound, rebind);
            }
         };
      });

      return (callback: ContainerModuleCallBack) => {
         return (
            bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind) => {
            bind(MERKLE_TYPES.MerkleCalculator)
               .to(MerkleCalculator)
               .inSingletonScope()
               .whenAnyAncestorTagged(tag, value);
            bind(MERKLE_TYPES.LRUCache)
               .toConstantValue(
                  LRU<number, MerkleDigestLocator>(
                     Math.pow(2, 5)))
               .whenAnyAncestorTagged(tag, value);
            bind(MERKLE_TYPES.MerkleLocatorFactory)
               .to(MerkleLocatorFactory)
               .inSingletonScope()
               .whenAnyAncestorTagged(tag, value);
            bind(MERKLE_TYPES.MerkleTreeDescription)
               .toConstantValue(treeDescription)
               .whenAnyAncestorTagged(tag, value);

            callback(bind, unbind, isBound, rebind);
         }
      };
   }
}
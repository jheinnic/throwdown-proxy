import {BlockMappedDigestLocator} from '../locator';
import {getBuilderDecorators} from '../../lib';

export interface IBfsOrderBuilder {
   leftToRight(value: boolean): IBfsOrderBuilder;
   topToBottom(value: boolean): IBfsOrderBuilder;
   startFrom(value: BlockMappedDigestLocator): IBfsOrderBuilder;
   endWith(value: BlockMappedDigestLocator): IBfsOrderBuilder;
}

const decorators = getBuilderDecorators<IBfsOrderBuilder>('bind-bfs-order-builder-key');
export const bindInputParam = decorators.bindInputParam;
export const buildable = decorators.decorateBuildable;
export const factoryMethod = decorators.factoryMethod;
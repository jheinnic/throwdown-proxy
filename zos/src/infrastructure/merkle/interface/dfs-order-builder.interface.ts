import {DepthFirstVisitMode} from './depth-first-visit-mode.enum';
import {BlockMappedLayerLocator} from '../locator';
import {getBuilderDecorators} from '../../lib';

export interface IDfsOrderBuilder {
   leftToRight(value: boolean): IDfsOrderBuilder;
   finalLayer(value: BlockMappedLayerLocator): IDfsOrderBuilder;
   visitMode(value: DepthFirstVisitMode): IDfsOrderBuilder
}

const decorators = getBuilderDecorators<IDfsOrderBuilder>('bind-dfs-order-builder-key');
export const bindInputParam = decorators.bindInputParam;
export const buildable = decorators.decorateBuildable;
export const factoryMethod = decorators.factoryMethod;

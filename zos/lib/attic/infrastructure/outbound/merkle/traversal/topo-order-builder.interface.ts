import {getBuilderDecorators} from '../../lib';

export interface ITopoOrderBuilder {
   leftToRight(value: boolean): ITopoOrderBuilder;
   breadthFirst(value: boolean): ITopoOrderBuilder;
}

const decorators = getBuilderDecorators<ITopoOrderBuilder>('bind-topo-order-builder-key');
export const bindInputParam = decorators.bindInputParam;
export const buildable = decorators.decorateBuildable;
export const factoryMethod = decorators.factoryMethod;


import {DfsOrderOptions} from './interface/dfs-order-options.interface';
import {BlockMappedLayerLocator} from './locator';
import {DepthFirstVisitMode} from './interface/depth-first-visit-mode.enum';
import {FluentlyBuilt} from '../lib/fluent-options-bag';

const FluentDfsOrderOptions = FluentlyBuilt(DfsOrderOptions);

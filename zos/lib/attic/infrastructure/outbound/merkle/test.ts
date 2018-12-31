import {DfsOrderOptions} from './traversal/dfs-order-options';
import {BlockMappedLayerLocator} from './locator';
import {DepthFirstVisitMode} from './traversal/depth-first-visit-mode.enum';
import {FluentlyBuilt} from '../lib/fluent-options-bag';

const FluentDfsOrderOptions = FluentlyBuilt(DfsOrderOptions);

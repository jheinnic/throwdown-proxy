import {diModule} from '../decorators/di-module.decorator';
import {MODULES} from './modules';
import {AbstractDIModule} from '../abstract-di-module.class';

@diModule(MODULES.MerkleTreeBuilder)
export class MarkleTreeBuilderModule extends AbstractDIModule {

}
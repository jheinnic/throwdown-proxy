import {diModule} from '../decorators/di-module.decorator';
import {MODULES} from './modules';
import {ContainerModule} from 'inversify';

@diModule(MODULES.MerkleFileStore)
export class MerkleFileStoreModule extends ContainerModule {

}
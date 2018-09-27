import {ContainerModule, injectable, interfaces, taggedConstraint} from 'inversify';
import {RECORD_LIST_TYPES} from './types';
import {RECORD_LIST_TAGS} from './tags';
import {LocalFileRecordStore} from '../local-file-record-store.class';
import {COMMON_TAGS} from '../../di/index';
import Request = interfaces.Request;

@injectable()
export class LocalDirectoryRecordsModuleFactory {
   public createContainerModule(localDirectory: string, variantKey: symbol): ContainerModule {
      return new ContainerModule(
         function localDirectoryRecordsModule(bind: interfaces.Bind) {
            bind(RECORD_LIST_TYPES.LocalDirectory).toConstantValue(localDirectory)
               .whenAnyAncestorMatches((request: Request): boolean => {
                   return request.parentContext.container.taggedConstraint(COMMON_TAGS.VariantFor)(variantKey)(request);
               });
            bind(RECORD_LIST_TYPES.RecordList).to(LocalFileRecordStore)
               .inSingletonScope()
               .whenAnyAncestorTagged(COMMON_TAGS.CuratorOf, variantKey);
         }
      );
   }
}

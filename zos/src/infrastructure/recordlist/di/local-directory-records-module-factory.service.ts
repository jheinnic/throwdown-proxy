import {ContainerModule, injectable, interfaces, taggedConstraint} from 'inversify';
import {RECORD_LIST_TYPES} from './types';
import {LocalFileRecordStore} from '../local-file-record-store.class';
import Request = interfaces.Request;
import {COMMON_TAGS} from '../../outbound/di';

@injectable()
export class LocalDirectoryRecordsModuleFactory {
   public createContainerModule(localDirectory: string, variantKey: symbol): ContainerModule {
      return new ContainerModule(
         function localDirectoryRecordsModule(bind: interfaces.Bind) {
            bind(RECORD_LIST_TYPES.LocalDirectory).toConstantValue(localDirectory)
               .whenAnyAncestorMatches((request: Request): boolean => {
                   return taggedConstraint(COMMON_TAGS.VariantFor)(variantKey)(request.parentRequest);
               });
            bind(RECORD_LIST_TYPES.RecordList).to(LocalFileRecordStore)
               .inSingletonScope()
               .whenAnyAncestorTagged(COMMON_TAGS.CuratorOf, variantKey);
         }
      );
   }
}

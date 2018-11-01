import {injectable} from 'inversify';
import {PublicKeyDataObject} from './public-key-data.object';
import {CO_TYPES, IConcurrentWorkFactory} from '@jchptf/coroutines';
import {TICKET_POOL_TYPES} from '../../modules/tickets/di';
import {IPolicyMetadataAccess} from '../../modules/tickets/interface/policies';

@injectable()
export class ExperimentPipelineManager {
   constructor(
      @inject(PublicKeyDataObject) dataObject: PublicKeyDataObject,
      @inject(CO_TYPES.ConcurrentWorkFactory) workFactory: IConcurrentWorkFactory,
      @inject(TICKET_POOL_TYPES.PolicyAccess) policyAccess: IPolicyMetadataAccess,

   )
}
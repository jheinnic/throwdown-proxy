import {v1} from 'uuid';
import {v1String} from 'uuid/interfaces';
import {ICorrelationContextHolder} from '../interfaces/correlation-context-holder.interface._st';
import {UUID} from '../../../../../src/infrastructure/validation';
import {correlated, CorrelationHeaders, correlationId} from '../values/correlation-headers.interface';
import {SimpleHeaders} from '../values/simple-headers.value';

const CorrelatingHeaders = correlated(SimpleHeaders);

export abstract class CorrelationContextHolder<T extends any> implements ICorrelationContextHolder<T>
{
   private state: Map<UUID, T> = new Map<UUID, T>();

   protected constructor(
      private readonly cons: new () => T,
      private readonly uuidFactory: v1String = v1)
   { }

   public create( ): CorrelationHeaders
   {
      const context: T = new this.cons();
      const key: UUID = this.uuidFactory() as UUID;
      this.state.set(key, context);

      return new CorrelatingHeaders({ [correlationId]: key });
   }

   public get(key: UUID): T
   {
      const retVal = this.state.get(key);
      if (! retVal) {
         throw new Error(`No such key: ${key}`);
      }

      return retVal;
   }

   public clear(key: UUID): T
   {
      const retVal = this.state.get(key);
      if (! retVal) {
         throw new Error(`No such key: ${key}`);
      }

      this.state.delete(key);

      return retVal;
   }
}

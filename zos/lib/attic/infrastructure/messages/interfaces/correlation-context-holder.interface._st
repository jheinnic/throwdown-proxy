import {UUID} from '../../validation';
import {CorrelationHeaders} from '../values/correlation-headers.interface';

export interface ICorrelationContextHolder<T extends any>
{
   create(): CorrelationHeaders;

   get(uuid: UUID): T;

   clear(uuid: UUID): T;
}

import {GET_LEASE_MANAGER} from '../resource-semaphore.constants';
import {IResourceAdapter} from './resource-adapter.interface';

export interface IManagedResource<T extends object> {
   [GET_LEASE_MANAGER]: IResourceAdapter<T>
}
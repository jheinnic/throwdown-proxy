import {GET_LEASE_MANAGER} from '../resource-pool.constants';
import {IResourceAdapter} from './lease-manager.interface';

export interface IManagedResource<T extends object> {
   [GET_LEASE_MANAGER]: IResourceAdapter<T>
}
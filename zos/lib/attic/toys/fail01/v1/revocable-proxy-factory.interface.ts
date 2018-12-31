import {IDryAdapter} from './dry-adapter.interface';

export interface IRevocableProxyFactory {
   getRevocableAdapter<T>(wetObject: T): IDryAdapter<T>
}
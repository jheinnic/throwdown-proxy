import {LoadResourcePoolStrategyConfig} from '../../interfaces/load-strategy-config.interface';
import {Type} from '@nestjs/common';
import {ModuleMetadata} from '@nestjs/common/interfaces';

export interface ResourcePoolOptionsFactory<T extends object>
{
   createTypeOrmOptions(): Promise<LoadResourcePoolStrategyConfig<T>> | LoadResourcePoolStrategyConfig<T>;
}

export interface ResourcePoolModuleAsyncConfig<T extends object> extends Pick<ModuleMetadata, 'imports'>
{
   name?: string;
   useExisting?: any,
   useClass?: Type<ResourcePoolOptionsFactory<T>>;
   useFactory?: (...args: any[]) => Promise<LoadResourcePoolStrategyConfig<T>> | LoadResourcePoolStrategyConfig<T>;
   inject?: any[];
}
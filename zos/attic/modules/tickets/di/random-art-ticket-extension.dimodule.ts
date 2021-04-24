// import {interfaces} from 'inversify';
// import Context = interfaces.Context;
// import Bind = interfaces.Bind;
//
// import {CONFIG_TYPES, ConfigLoader} from '../../../infrastructure/config/index';
// import {RANDOM_ART_CONFIG_TYPES} from './types';
// import {RandomArtPlayAssets} from '../config/index';
//
//
// export function configContainerModule(bind: Bind): void
// {
//    bind(RANDOM_ART_CONFIG_TYPES.RandomArtPlayAssets)
//       .toDynamicValue(
//          (context: Context) => {
//             const configLoader: ConfigLoader =
//                context.container.get(CONFIG_TYPES.ConfigLoader)
//
//             return configLoader.getConfig(RandomArtPlayAssets)
//          }
//       )
//       .inSingletonScope();
// }
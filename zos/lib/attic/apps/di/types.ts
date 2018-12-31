import {getDynamicProviderToken, getModuleIdentifier, getNamedTypeIntent} from '@jchptf/api';
import {CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING} from '@jchptf/config';

export const appModuleId = getModuleIdentifier('@jchptf/zosConfig');

export const DEPLOYMENT_TYPE = getNamedTypeIntent('Deployment');
export const EVENT_SPECIFICATION_TYPE = getNamedTypeIntent('EventSpecification');
export const PRIZE_MINTING_POLICY_TYPE = getNamedTypeIntent('PrizeMintingPolicy');
export const TICKET_MINTING_POLICY_TYPE = getNamedTypeIntent('TicketMintingPolicy');
export const TICKET_STAGING_POLICY_TYPE = getNamedTypeIntent('TicketStagingPolicy');
export const PLAY_ASSETS_TYPE = getNamedTypeIntent('PlayAssets');

export const DEPLOYMENT_PROVIDER =
   getDynamicProviderToken(appModuleId, CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING, DEPLOYMENT_TYPE);
export const EVENT_SPECIFICATION_PROVIDER =
   getDynamicProviderToken(appModuleId, CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING, EVENT_SPECIFICATION_TYPE);
export const PRIZE_MINTING_POLICY_PROVIDER =
   getDynamicProviderToken(appModuleId, CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING, PRIZE_MINTING_POLICY_TYPE);
export const TICKET_MINTING_POLICY_PROVIDER =
   getDynamicProviderToken(appModuleId, CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING, TICKET_MINTING_POLICY_TYPE);
export const TICKET_STAGING_POLICY_PROVIDER =
   getDynamicProviderToken(appModuleId, CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING, TICKET_STAGING_POLICY_TYPE);
export const PLAY_ASSETS_PROVIDER =
   getDynamicProviderToken(appModuleId, CONFIG_MODULE_DYNAMIC_PROVIDER_BINDING, PLAY_ASSETS_TYPE);

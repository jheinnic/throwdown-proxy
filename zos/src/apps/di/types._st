import {
   getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent
} from '@jchptf/nestjs';

export const appModuleId = getModuleIdentifier('@jchptf/zosConfig');

export const DEPLOYMENT_TYPE = getNamedTypeIntent('Deployment');
export const EVENT_SPECIFICATION_TYPE = getNamedTypeIntent('EventSpecification');
export const PRIZE_MINTING_POLICY_TYPE = getNamedTypeIntent('PrizeMintingPolicy');
export const TICKET_MINTING_POLICY_TYPE = getNamedTypeIntent('TicketMintingPolicy');
export const TICKET_STAGING_POLICY_TYPE = getNamedTypeIntent('TicketStagingPolicy');
export const PLAY_ASSETS_TYPE = getNamedTypeIntent('PlayAssets');

export const DEPLOYMENT_PROVIDER =
   getLocalProviderToken(appModuleId, DEPLOYMENT_TYPE);
export const EVENT_SPECIFICATION_PROVIDER =
   getLocalProviderToken(appModuleId, EVENT_SPECIFICATION_TYPE);
export const PRIZE_MINTING_POLICY_PROVIDER =
   getLocalProviderToken(appModuleId, PRIZE_MINTING_POLICY_TYPE);
export const TICKET_MINTING_POLICY_PROVIDER =
   getLocalProviderToken(appModuleId, TICKET_MINTING_POLICY_TYPE);
export const TICKET_STAGING_POLICY_PROVIDER =
   getLocalProviderToken(appModuleId, TICKET_STAGING_POLICY_TYPE);
export const PLAY_ASSETS_PROVIDER =
   getLocalProviderToken(appModuleId, PLAY_ASSETS_TYPE);

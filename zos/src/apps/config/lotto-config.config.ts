import {ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {configClass, configProp} from '@jchptf/config';
import {EventSpecification} from './event-specification.config';
import {PrizeMintingPolicy} from './prize-minting-policy.config';
import {Deployment} from './deployment.config';

import {PlayAssets} from './play-assets.config';

@configClass("eth.lotto")
export class LottoConfig
{
   @configProp("deployment")
   @ValidateNested()
   @Type(() => Deployment)
   public readonly deployment: Deployment = new Deployment();

   @configProp("setupPolicy")
   @ValidateNested()
   @Type(() => PrizeMintingPolicy)
   public readonly setupPolicy: PrizeMintingPolicy = new PrizeMintingPolicy();

   @configProp("eventSpec")
   @ValidateNested()
   @Type(() => EventSpecification)
   public readonly eventSpec: EventSpecification = new EventSpecification();

   @configProp("playAssets")
   @ValidateNested()
   @Type(() => PlayAssets)
   public readonly playAssets: PlayAssets = new PlayAssets();
}
import {ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {EventSpecification} from './event-specification.config';
import {SetupPolicy} from './setup-policy.config';
import {Deployment} from './deployment.config';

import {configClass, configProp} from '../../infrastructure/config/decorator/index';
import '../../infrastructure/reflection/index';

@configClass("eth.lotto")
export class LottoConfig
{
   @configProp("deployment")
   @ValidateNested()
   @Type(() => Deployment)
   public readonly deployment: Deployment = new Deployment();

   @configProp("setupPolicy")
   @ValidateNested()
   @Type(() => SetupPolicy)
   public readonly setupPolicy: SetupPolicy = new SetupPolicy();

   @configProp("eventSpec")
   @ValidateNested()
   @Type(() => EventSpecification)
   public readonly eventSpec: EventSpecification = new EventSpecification();
}
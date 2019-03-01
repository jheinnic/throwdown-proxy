import {configClass, configProp} from '@jchptf/config';

@configClass("jchptf.boot.consul.health_check")
export class ConsulHealthCheck {
   @configProp("timeout")
   public readonly timeout: string;

   @configProp("interval")
   public readonly interval: string;
}
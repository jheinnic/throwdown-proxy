import { MODULE_ID } from '@jchptf/nestjs';

export const APPLICATION_MODULE = Symbol('appModule');
export type APPLICATION_MODULE = typeof APPLICATION_MODULE;

export class ApplicationModuleId {
   [MODULE_ID] = APPLICATION_MODULE;
}

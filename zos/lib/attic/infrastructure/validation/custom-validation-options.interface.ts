import {ValidationOptions} from 'class-validator';
import {Omit} from 'simplytyped';

/**
 * class-validator does not support 'each' on custom validators.  This convenience type makes that
 * more apparent by not allowing consumers to set 'each'.
 */
export type CustomValidationOptions = Omit<ValidationOptions, 'each'>;
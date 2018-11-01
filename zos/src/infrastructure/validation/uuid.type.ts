import {Nominal} from 'simplytyped';

/**
 * Nominal type intended to augment the @IsUUID validation constraint.  Constraint enforcement
 * may occur at a program's runtime boundaries, and the UUID type should be used with the
 * constraint at such boundaries allowing the compiler to proactively benefit from such runtime
 * enforcement.
 */
export type UUID = Nominal<string, 'UUID'>;
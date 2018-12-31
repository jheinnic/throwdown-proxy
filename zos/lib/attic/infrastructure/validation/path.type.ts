import {Nominal} from 'simplytyped';

/**
 * Nominal type intended to augment the @IsPath validation constraint.  Constraint enforcement
 * may occur at a program's runtime boundaries, and the Name type should be used with the
 * constraint at such boundaries allowing the compiler to proactively benefit from such runtime
 * enforcement.
 *
 * Paths are a sequence of Name elements used to identify an element within a hierarchical
 * organization.
 */
export type Path = Nominal<string, 'Path'>;
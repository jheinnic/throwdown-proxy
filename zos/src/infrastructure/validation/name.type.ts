import {Nominal} from 'simplytyped';

/**
 * Nominal type intended to augment the @IsName validation constraint.  Constraint enforcement
 * may occur at a program's runtime boundaries, and the Name type should be used with the
 * constraint at such boundaries allowing the compiler to proactively benefit from such runtime
 * enforcement.
 *
 * Name is associated with a constrained character set, has a maximum length, and serves a functional
 * purpose in establishing loose referential integrity.  Name is a poor choice for linking objects
 * across document boundaries because names are mutable, and cannot be kept in sync across independent
 * aggregate boundaries.  Name should not be used to represent an identifier from a foreign system,
 * because no guarantees can be made about discrepancies regarding character set or maximum length.
 */
export type Name = Nominal<string, 'Name'>;
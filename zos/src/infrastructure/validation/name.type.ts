import {Nominal} from 'simplytyped';

/**
 * Nominal type intended to augment the @IsName validation constraint.  Constraint enforcement
 * may occur at a program's runtime boundaries, and the Name type should be used with the
 * constraint at such boundaries allowing the compiler to proactively benefit from such runtime
 * enforcement.
 *
 * Name is associated with a constrained character set, has a maximum length, and serves a functional
 * purpose by providing loose referential integrity.  Name is a poor choice for linking objects
 * across document boundaries because names are mutable, and cannot be kept in sync across independent
 * aggregate boundaries.  Name should not be used to represent an identifier from a foreign context,
 * because no guarantees can be made about discrepancies regarding character set or maximum length.
 *
 * However, within the boundaries of a single aggregate, names can serve as a means of linking
 * reusable sub-graphs using identifiers that are user-managed.  Aggregates that use names this way
 * are responsible for defining the semantics of name mutability--e.g. whether a user's intent
 * to change a name should propagate to existing usage of the previous name for linking
 * purposes, or whether changing a name should instead cause links to be severed.  Aggregates may
 * utilize names only for establishing references in commands and events as well, although caution
 * must be taken to include name changes with an event in such cases.
 */
export type Name = Nominal<string, 'Name'>;
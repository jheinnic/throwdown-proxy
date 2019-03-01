/**
 * If a PseudoRandom iterator implementation happens to accept incremental additional seed data
 * at each generation instance, its generator functions may cast its return using this interface in
 * order to specify the required value type to provide to next() in such a case.
 *
 * If no incremental re-seeding is done, then IterableIterator itself is preferred for returned
 * iterator handles.
 */
export interface IReseedingRandomIterator<V, S = undefined> extends IterableIterator<V> {
   next(value: S): IteratorResult<V>;
}

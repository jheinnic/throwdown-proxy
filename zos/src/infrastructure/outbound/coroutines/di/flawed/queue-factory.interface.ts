import {Queue} from 'co-priority-queue';

import {ConcreteFactory} from '../../../di/interfaces/index';

/**
 * Use Priority Queues to deliver messages to co-routines that suspend themselves on a yield when there
 * is no work available.  Priority queue use cases have fire-and-forget semantics.  If you instead need
 * call-and-response semantics, then you probably want use co, co.wrap, or LimiterFactory.  The latter
 * is appropriate if you want the experience of being suspended on the queue for access to a limited
 * resource with intentionally constrained concurrent access supported.
 *
 * Priority queues deliver incoming messages in the same order they were received, subject to the
 * priority ranking specified by each caller contributing a message.
 *
 * @see co
 * @see co.wrap
 * @see LimiterFactory
 */
export type QueueFactory<M> = ConcreteFactory<Queue<M>, []>;

/**
 * Resolve/reject method pair to be passed in to a processing pipeline through its initial input
 * message, then passed down the chain through successive messages until called at the conclusion
 * of the workflow's final stage to signal overall job completion.
 */
import {Chan} from 'medium';
import {ReplyMessage} from './reply-message.value';

export type CompletionSignal<T extends any> = Chan<ReplyMessage<T>>;

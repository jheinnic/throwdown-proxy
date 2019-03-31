import { Chan } from 'medium';

export type CompletionSignal<ReplyType> = Chan<ReplyType, any>;

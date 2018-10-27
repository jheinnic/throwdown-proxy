/**
 * Resolve/reject method pair to be passed in to a processing pipeline through its initial input
 * message, then passed down the chain through successive messages until called at the conclusion
 * of the workflow's final stage to signal overall job completion.
 */
export interface CompletionSignal<T = void> {
   readonly resolve: (value: T) => void;
   readonly reject: (error: any) => void;
}
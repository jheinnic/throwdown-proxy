export type MessageHandler<I extends any, O extends any, H = void> =
   (input: I, headers: H) => O;
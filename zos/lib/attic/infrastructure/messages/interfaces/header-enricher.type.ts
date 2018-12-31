export type HeaderEnricher<I, O, M extends any = any> =
   (input: M, headers: I) => O;
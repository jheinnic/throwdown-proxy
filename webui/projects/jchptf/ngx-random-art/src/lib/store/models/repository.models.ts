import {PaintActivityModels} from './paint-activity.models';

export namespace RepositoryModels
{
  /*
  export interface Extent<U extends Document<any, U> = Document<any, U>> {
    rootFolders: Folder<U>;
    documents: Document<any, U>
  }

  export interface Folder<S extends Document<any, S> = Document<any, S>> {
    subFolders: Folder<S>[];
    documents: Document<any, S>[];

    contents: (Folder<S> | Document<any, S>)
  }

  export interface Document<T, O extends Document<T, O>> {
    documentContainer: O;
    firstClassObject: T;
  }

  import NameToken = PaintActivityModels.NameToken;
  */

  export interface Identifiable<M extends Identifiable<M>> {
    readonly uuid: string;
  }

  export type Model<M extends Identifiable<M>> = Identifiable<M>;

  export interface Proxy<M extends Model<M>>
  {
    readonly memento: string;
  }

  export interface Extent<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5>
  {
    getReachableContent(): Iterator<Model<any>>
    getCrossReferences(): Iterator<Proxy<any>>
  }

  export interface Repository<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5> extends Extent<T1, T2, T3, T4, T5, T6>
  {
    rootFolders: Array<Folder<T1, T2, T3, T4, T5, T6>>;
    nestedDocuments: Array<Document<T1> | Document<T2> | Document<T3> | Document<T4> | Document<T5> | Document<T6>>
  }

  export interface Folder<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5> extends Model
  {
    children: Array<Folder<T1, T2, T3, T4, T5, T6> | Document<T1> | Document<T2> | Document<T3> | Document<T4> | Document<T5> | Document<T6>>;
  }

  export enum DocumentType
  {
    SIMPLE,
    AGGREGATE
  }

  export type CommonDocument<T> = SimpleDocument<T> | AggregateDocument<T, any>

  export abstract class Document<T> implements Model
  {
    readonly docType: DocumentType;

    readonly rootObject: T;

    readonly documentName: string;
  }

  export interface SimpleDocument<T> extends Document<T>
  {
    docType: DocumentType.SIMPLE;
  }

  export interface AggregateDocument<T, T1 = T, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5> extends Document<T>
  {
    docType: DocumentType.AGGREGATE;
    reachableProxies: Proxy<any>[];
    managedExtent: Extent<T1, T2, T3, T4, T5, T6>;
  }
}

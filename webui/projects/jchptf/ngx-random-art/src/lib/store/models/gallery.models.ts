import {RepositoryModels} from './repository.models';
import {PopulationModels} from './population.models';
import {environment} from '../../../../../../throwdown/src/environments/environment';
import {Path} from '@thi.ng/api';

export namespace GalleryModels {
  import Folder = RepositoryModels.Folder;
  import PopulationParameters = PopulationModels.PopulationParameters;
  import Proxy = RepositoryModels.Proxy;

  export type GalleryFolder = Folder<Lexicon, TermPairsArtBundle, TermCliquesArtBundle>;

  export type Term = string;

  export type ImagePath = Path;

  export interface Lexicon {
    content: Term[];
  }

  export interface TermAsBytes {
    source: Term;
    binary: Buffer;
  }

  export interface ArtConcept {
    readonly prefix: Term;
    readonly suffix: Term;
  }

  export interface PaintedArtwork extends ArtConcept {
    readonly imagePath: string;
  }

  export interface RGBColor {
    red: number;
    green: number;
    blue: number;
  }

  export type InternalArtRef = PaintedArtwork | ImagePath;

  export interface ColorStudy<S extends InternalArtRef>
  {
    primaryColors: RGBColor[];
    secondaryColors: RGBColor[];
    studySubject: S;
  }

  export interface ArtBundle<S extends InternalArtRef> {
    sourcePopulationRef: Proxy<PopulationParameters>;
    lexiconRef: Proxy<Lexicon>
    colorStudies: Array<ColorStudy<S>>
    futureArtwork: Array<ArtConcept>
  }

  export interface TermPairsArtBundle extends ArtBundle<PaintedArtwork>
  {
    paintedArtwork: Array<PaintedArtwork>
  }

  export interface TermCliquesArtBundle extends ArtBundle<ImagePath>
  {
    prefixes: Term[];
    suffixes: Term[];
    futureArtwork: Array<ArtConcept>
    colorStudies: Array<ColorStudy<ImagePath>>
  }

  export interface CliqueGenConfig {

  }

  export enum ImageStoreType {
    IN_MEMORY,
    LOCAL_STORAGE,
    CLOUDINARY,
    IPFS
  };


  export interface InMemoryImageStore {
    type: ImageStoreType.LOCAL_STORAGE;
  }

  export interface LocalStorageStore {
    type: ImageStoreType.LOCAL_STORAGE;
    rootPath: string;
  }

  export interface CloudinaryImageStore {
    type: ImageStoreType.CLOUDINARY;
    cloudName: string,
    uploadPreset: string,
    rootPath: string;
  }

  export interface IpfsImageStoreSettings {
    type: ImageStoreType.IPFS;
    rootPath: string;
  }

  export type ImageStoreSettings = InMemoryImageStore | LocalStorageStore | CloudinaryImageStore | IpfsImageStoreSettings
}


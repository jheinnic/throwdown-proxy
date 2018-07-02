export namespace IpfsServiceModels {
  export interface IpfsApiEndpoint {
    hostname: string;
    port: number;
    protocol: string;
    authenticationHeader: string;
  };

  export interface IpfsLinkedFile {
    name: string;
    metaHash: string;
    size: string;
  }

  export interface IpfsLinkedDirectory {
    name: string;
    metaHash: string;
  }

  export interface IpfsDirectoryListing {
    name: string;
    metaHash: string;
    linkedFiles: IpfsLinkedFile[];
    linkedDirectories: IpfsLinkedDirectory[];
  }
}

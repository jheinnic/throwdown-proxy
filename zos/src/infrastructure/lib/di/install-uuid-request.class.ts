export type UuidVersionType = "v1" | "v4";

export interface UuidFactoryRequest
{
   versionType: UuidVersionType;
   diTag: symbol;
}

export interface InstallUuidRequest
{
   instances: UuidFactoryRequest[];
}

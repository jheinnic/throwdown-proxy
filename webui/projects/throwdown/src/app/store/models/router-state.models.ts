import {Data, ParamMap, Params} from '@angular/router';

export namespace RouterStateModels
{
  export interface RouterStateUrl
  {
    url: string;
    queryParams: Params;
    params: Params;
    queryParamMap: ParamMap;
    paramMap: ParamMap;
    data: Data;
  }
}

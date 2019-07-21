import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helpers/headers";
import { transformRequest, transformResponse } from "./helpers/data";

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-SXRF-TOEKN',

  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(data, headers);
      return transformRequest(data);
    }
  ],
  transformResponse: [
    function(data: any):any {
      return transformResponse(data);
    }
  ],
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }
}

const methodsNodata = ['delete', 'get', 'head', 'options'];

methodsNodata.forEach(method => {
  defaults.headers[method] = {};
})

const methodsWithData = ['post', 'put', 'patch'];

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults

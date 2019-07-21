import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createError } from "../helpers/error";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {
    const { data = null, url, method ='get', headers, responseType, timeout, cancelToken} = config;

    const request:XMLHttpRequest = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType;
    }

    if (timeout) {
      request.timeout = timeout;
    }

    request.ontimeout = function headleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, null, request));
    }

    request.open(method.toLocaleUpperCase(), url!, true);

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders());

      const responseData = responseType !== 'text' ? request.response: request.responseText;

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      handleResponse(response);
    }

    request.onerror = function handleError() {
      reject(createError(`Net error`, config, null, request));
    }

    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLocaleLowerCase() === 'content-type') {
        delete headers[name];
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort();
        reject(reason);
      })
    }

    request.send(data);

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(createError(`Response failed with status is ${response.status}`, config, null, request, response));
      }
    }
  })
}

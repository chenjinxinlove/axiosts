import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createError } from "../helpers/error";
import { isURLSameOrigin } from "../helpers/url";
import cookie from "../helpers/cookie";
import { STATUS_CODES } from "http";
import { isFormData } from "../helpers/utils";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method ='get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config;

    const request:XMLHttpRequest = new XMLHttpRequest();

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

    configureRequest();

    addEvent();

    processHeaders();

    processCancel();

    request.send(data);

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType;
      }

      if (timeout) {
        request.timeout = timeout;
      }

      if (withCredentials) {
        request.withCredentials = withCredentials;
      }
    }

    function addEvent():void {
      request.onerror = function handleError() {
        reject(createError(`Net error`, config, null, request));
      }

      request.ontimeout = function headleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress;
      }

    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type'];
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName);
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue;
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic' + btoa(auth.username + ':' + auth.password);
      }

      Object.keys(headers).forEach((name) => {
        if (data === null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name];
        } else {
          request.setRequestHeader(name, headers[name]);
        }
      })

    }

    function processCancel():void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort();
          reject(reason);
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(`Response failed with status is ${response.status}`, config, null, request, response));
      }
    }


  })
}

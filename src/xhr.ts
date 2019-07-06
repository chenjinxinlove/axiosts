import { AxiosRequestConfig } from "./types";

export default function xhr(config: AxiosRequestConfig):void {
  const { data = null, url, method ='get'} = config;

  const request:XMLHttpRequest = new XMLHttpRequest();

  request.open(method.toLocaleUpperCase(), url, true);

  request.send(data);
}

import { factory } from "func-di";
import { contentTypeHeader } from "./constants.js";
import { $net } from "./deps.js";
import { create } from "./utils.js";

export type RawResponse = {
  /** url */
  url: string;
  /** content */
  content: unknown;
  /** content type header */
  contentType: string | null;
  /** status code */
  status: number;
};

export type NetReader = {
  /** read net content */
  read(url: string): RawResponse | null;
};
const createNetReader = (): NetReader => {
  const read: NetReader["read"] = (url) => {
    const xhr = create(XMLHttpRequest);
    xhr.open("GET", url, false);
    xhr.send();
    const { response, responseURL, status } = xhr;
    if (status !== 200 /** 404 not found or other */) {
      return null;
    }
    return {
      content: response,
      contentType: xhr.getResponseHeader(contentTypeHeader),
      url: responseURL,
      status,
    };
  };
  return {
    read,
  };
};
export const NetReaderImpl = factory($net, createNetReader);

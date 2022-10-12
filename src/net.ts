import { contentTypeHeader } from "./constants";
import { create } from "./utils";

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

export const createNetReader = (fetch: typeof window.fetch): NetReader => {
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

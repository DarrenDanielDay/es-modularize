import { contentTypeHeader } from "./constants";
import { create, Perform, performAs } from "./utils";

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
  read: Perform<[url: string], RawResponse | null>;
};

/**
 *
 * @param async Whether to use asynchronous request. Synchronous request is only available in browser.
 */
export const createNetReader = (fetch: typeof window.fetch, async = false): NetReader => {
  const read: NetReader["read"] = async
    ? performAs((resume, url) => {
        fetch(url)
          .then(async (response) => {
            const content = await response.text();
            return resume({
              url: response.url,
              content,
              contentType: response.headers.get(contentTypeHeader),
              status: response.status,
            });
          })
          .catch(() => resume(null));
      })
    : performAs((resume, url) => {
        const xhr = create(XMLHttpRequest);
        xhr.open("GET", url, false);
        xhr.send();
        const { response, responseURL, status } = xhr;
        if (status !== 200 /** 404 not found or other */) {
          return resume(null);
        }
        resume({
          content: response,
          contentType: xhr.getResponseHeader(contentTypeHeader),
          url: responseURL,
          status,
        });
      });
  return {
    read,
  };
};

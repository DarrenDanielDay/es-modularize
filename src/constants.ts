export const slash = "/";
export const selfReference = ".";
export const relativeTo = `${selfReference}${slash}` as const;
export const parentTo = `${selfReference}${relativeTo}` as const;
export const scopeTag = "@";
export const contentTypeHeader = "content-type";
export const globalEvaluatedVariable = "__ES_MODULARIZE_GLOBAL_EVALUATED__";

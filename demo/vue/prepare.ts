import "./vue-globals";
import { compile, CompilerOptions, CompilerError } from "@vue/compiler-dom";
import { registerRuntimeCompiler, RenderFunction, warn } from "@vue/runtime-dom";
import * as runtimeDom from "@vue/runtime-dom";
import { isString, NOOP, generateCodeFrame, extend } from "@vue/shared";
//#region vuejs/core/packages/runtime-core/src/component.ts:192,202-207
type InternalRenderFunction = {
  _rc?: boolean; // isRuntimeCompiled

  // __COMPAT__ only
  _compatChecked?: boolean; // v3 and already checked for v2 compat
  _compatWrapped?: boolean; // is wrapped for v2 compat
};
//#endregion



//#region vuejs/core/packages/vue/src/dev.ts:1-14
import { initCustomFormatter } from "@vue/runtime-dom";

function initDev() {
  if (__BROWSER__) {
    if (!__ESM_BUNDLER__) {
      console.info(
        `You are running a development build of Vue.\n` +
          `Make sure to use the production build (*.prod.js) when deploying for production.`
      );
    }

    initCustomFormatter();
  }
}
//#endregion

//#region vuejs/core/packages/vue/src/index.ts:10-87
if (__DEV__) {
  initDev();
}

const compileCache: Record<string, RenderFunction> = Object.create(null);

function compileToFunction(template: string | HTMLElement, options?: CompilerOptions): RenderFunction {
  if (!isString(template)) {
    if (template.nodeType) {
      template = template.innerHTML;
    } else {
      __DEV__ && warn(`invalid template option: `, template);
      return NOOP;
    }
  }

  const key = template;
  const cached = compileCache[key];
  if (cached) {
    return cached;
  }

  if (template[0] === "#") {
    const el = document.querySelector(template);
    if (__DEV__ && !el) {
      warn(`Template element not found or is empty: ${template}`);
    }
    // __UNSAFE__
    // Reason: potential execution of JS expressions in in-DOM template.
    // The user must make sure the in-DOM template is trusted. If it's rendered
    // by the server, the template should not contain any user data.
    template = el ? el.innerHTML : ``;
  }

  const { code } = compile(
    template,
    extend(
      {
        hoistStatic: true,
        onError: __DEV__ ? onError : undefined,
        onWarn: __DEV__ ? (e) => onError(e, true) : NOOP,
      } as CompilerOptions,
      options
    )
  );

  function onError(err: CompilerError, asWarning = false) {
    const message = asWarning ? err.message : `Template compilation error: ${err.message}`;
    const codeFrame = err.loc && generateCodeFrame(template as string, err.loc.start.offset, err.loc.end.offset);
    warn(codeFrame ? `${message}\n${codeFrame}` : message);
  }

  // The wildcard import results in a huge object with every export
  // with keys that cannot be mangled, and can be quite heavy size-wise.
  // In the global build we know `Vue` is available globally so we can avoid
  // the wildcard object.
  const render = (__GLOBAL__ ? new Function(code)() : new Function("Vue", code)(runtimeDom)) as RenderFunction;

  // mark the function as runtime compiled
  (render as InternalRenderFunction)._rc = true;

  return (compileCache[key] = render);
}

registerRuntimeCompiler(compileToFunction);
//#endregion
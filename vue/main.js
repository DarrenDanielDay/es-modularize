Object.assign(globalThis,{__VUE_OPTIONS_API__:!0,__VUE_PROD_DEVTOOLS__:!0,__DEV__:!1,__GLOBAL__:!1,__BROWSER__:!1,__ESM_BUNDLER__:!1});import{compile as E}from"@vue/compiler-dom";import{registerRuntimeCompiler as g,warn as n}from"@vue/runtime-dom";import*as b from"@vue/runtime-dom";import{isString as R,NOOP as p,generateCodeFrame as h,extend as O}from"@vue/shared";import{initCustomFormatter as D}from"@vue/runtime-dom";function V(){__BROWSER__&&(__ESM_BUNDLER__||console.info(`You are running a development build of Vue.
Make sure to use the production build (*.prod.js) when deploying for production.`),D())}__DEV__&&V();var s=Object.create(null);function S(o,d){if(!R(o))if(o.nodeType)o=o.innerHTML;else return __DEV__&&n("invalid template option: ",o),p;let r=o,t=s[r];if(t)return t;if(o[0]==="#"){let e=document.querySelector(o);__DEV__&&!e&&n(`Template element not found or is empty: ${o}`),o=e?e.innerHTML:""}let{code:i}=E(o,O({hoistStatic:!0,onError:__DEV__?_:void 0,onWarn:__DEV__?e=>_(e,!0):p},d));function _(e,f=!1){let a=f?e.message:`Template compilation error: ${e.message}`,l=e.loc&&h(o,e.loc.start.offset,e.loc.end.offset);n(l?`${a}
${l}`:a)}let c=__GLOBAL__?new Function(i)():new Function("Vue",i)(b);return c._rc=!0,s[r]=c}g(S);import{defineComponent as C}from"vue";import{defineComponent as F,ref as v}from"vue";var u=F({template:`<h1>{{ msg }}</h1>

<p>
  <a href="./full-load">Full load demo (very slow)</a>
</p>

<p>
  Recommended IDE setup:
  <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
  +
  <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
</p>

<p>See <code>README.md</code> for more information.</p>

<p>
  <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
</p>

<button type="button" @click="count++">count is: {{ count }}</button>
<p>
  Edit
  <code>components/HelloWorld.vue</code> and press <code>F5</code> to reload.
</p>
`,props:{msg:String},setup(){return{count:v(0)}}});var m=C({template:`<img alt="Vue logo" src="./logo.png" />
<HelloWorld msg="Hello Vue 3 + TypeScript + ESModularize" />
`,components:{HelloWorld:u}});import{createApp as L}from"vue";L(m).mount("#app");
//# sourceMappingURL=main.js.map

import { defineComponent } from "vue";
import "./App.css";
import HelloWorld from "./HelloWorld";
export default defineComponent({
  template: `\
<img alt="Vue logo" src="./logo.png" />
<HelloWorld msg="Hello Vue 3 + TypeScript + ESModularize" />
`,
  components: {
    HelloWorld,
  },
});

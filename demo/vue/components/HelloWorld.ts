import { defineComponent, ref } from "vue";
import "./HelloWorld.css";
export default defineComponent({
  template: `\
<h1>{{ msg }}</h1>

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
`,
  props: {
    msg: String,
  },
  setup() {
    const count = ref(0);
    return {
      count,
    };
  },
});

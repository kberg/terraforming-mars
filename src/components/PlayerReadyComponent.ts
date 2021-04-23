
import Vue from 'vue';

export const PlayerReadyComponent = Vue.component('player-ready-component', {
  props: {
    name: {
      type: Object as () => string,
    },
    onsave: {
      type: Function as unknown as () => (out: string) => void,
    },
  },
  data: function() {
    return {
    };
  },
  methods: {
    saveData: function() {
      const response = {
        name: this.$data.name,
      };

      this.onsave(JSON.stringify(response));
    },
  },
  template: `
<div class="wf-component">
  <input class="form-input form-inline create-game-player-name" placeholder="Your name" v-model="name" />
  <button class="btn btn-primary btn-submit" v-on:click="saveData">{{playerinput.buttonLabel}}</button>
</div>
`,
});


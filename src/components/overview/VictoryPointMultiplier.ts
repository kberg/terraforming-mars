import Vue from 'vue';

export const VictoryPointMultiplier = Vue.component('VictoryPointMultiplier', {
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {},
  template: `
    <div class="player-vp-multiplier">{{ amount }}</div>
  `,
});
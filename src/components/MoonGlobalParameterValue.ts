import Vue from 'vue';
import {TranslateMixin} from './TranslateMixin';
import {MAXIMUM_COLONY_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE} from '../constants';
import {MoonModel} from '../models/MoonModel';

export const MoonGlobalParameterValue = Vue.component('moon-global-parameter-value', {
  props: {
    moonData: {
      type: Object as () => MoonModel,
    },
  },
  mixins: [TranslateMixin],
  methods: {
    isMax: function(): boolean {
      return this.moonData.colonyRate >= MAXIMUM_COLONY_RATE &&
      this.moonData.miningRate >= MAXIMUM_MINING_RATE &&
      this.moonData.logisticsRate >= MAXIMUM_LOGISTICS_RATE;
    },
    colonyRate: function(): number {
      return this.moonData.colonyRate;
    },
    logisticsRate: function(): number {
      return this.moonData.logisticsRate;
    },
    miningRate: function(): number {
      return this.moonData.miningRate;
    },
  },
  template: `
<div>
  <div class="moon-tile"></div>
  <div>
    <div v-if="isMax()" class="preferences_global_params_value">
      <img src="/assets/misc/checkmark.png" class="preferences_checkmark" :alt="$t('Completed!')">
    </div>
    <div v-else class="moon_params_value">
      <span class="colony">{{colonyRate()}}</span>
      <span class="logistics">{{logisticsRate()}}</span>
      <span class="mining">{{miningRate()}}</span>
    </div>
  </div>
</div>
  `,
});
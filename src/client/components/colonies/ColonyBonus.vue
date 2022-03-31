<template>
  <span>
    <div v-if="colonyName === ColonyName.GANYMEDE" class="resource plant"></div>
    <div v-if="colonyName === ColonyName.EUROPA" class="resource money">1</div>
    <div v-if="colonyName === ColonyName.TITAN" class="resource floater"></div>
    <div v-if="colonyName === ColonyName.ENCELADUS" class="resource microbe"></div>
    <div v-if="colonyName === ColonyName.CALLISTO" class="resource energy"></div>
    <div v-if="colonyName === ColonyName.CALLISTO" class="resource energy"></div>
    <div v-if="colonyName === ColonyName.CALLISTO" class="resource energy"></div>
    <div v-if="colonyName === ColonyName.TRITON" class="resource titanium"></div>
    <div v-if="colonyName === ColonyName.MIRANDA" class="resource card card-with-border" style="transform:scale(0.8)" ></div>
    <div v-if="colonyName === ColonyName.CERES" class="resource steel"></div>
    <div v-if="colonyName === ColonyName.CERES" class="resource steel"></div>
    <div v-if="colonyName === ColonyName.IO" class="resource heat"></div>
    <div v-if="colonyName === ColonyName.IO" class="resource heat"></div>
    <div v-if="colonyName === ColonyName.LUNA" class="resource money">2</div>

    <template v-if="colonyName === ColonyName.IAPETUS" >
      <div class="resource card card-with-border" style="transform: scale(0.8);"></div>
      <span class="white-char">:</span>
      <div class="resource money">-1</div>
    </template>

    <div v-if="colonyName === ColonyName.MERCURY" class="resource money">2</div>
    <div v-if="colonyName === ColonyName.HYGIEA" class="resource money">3</div>
    <div v-if="colonyName === ColonyName.TITANIA" class="resource money">-3</div>
    <div v-if="colonyName === ColonyName.VENUS" class="resource" style="background:white;margin:15px 10px 10px 20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>

    <div v-if="colonyName === ColonyName.PALLAS" style="display:inline-block">
      <div class="resource money">1</div> / party <div class="delegate"></div>
    </div>

    <template v-if="colonyName === ColonyName.LEAVITT">
      <span style="display: inline-block;margin-left: 10px;font-size: 14px;">REVEAL TOP CARD OF DECK.</span>
      <span><br></span>
      <span style="font-size: 14px; margin-left: 10px;">BUY OR DISCARD IT.</span>
    </template>

    <template v-if="colonyName === ColonyName.PLUTO">
      <span class="white-char" style="margin-left:5px;">+</span>
      <div class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
      <span class="white-char">-</span>
      <div class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
    </template>

    <span class="colony-background-color">
      <template v-if="colonyName !== ColonyName.TITANIA">
        Colony Bonus
      </template>
      <template v-else>
        Colony Fee
      </template>
    </span>
  </span>
</template>
<script lang="ts">

import Vue from 'vue';

import {ColonyName} from '@/common/colonies/ColonyName';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';

export default Vue.extend({
  name: 'ColonyBonus',
  props: {
    metadata: {
      type: Object as () => IColonyMetadata,
      required: true,
    },
  },
  computed: {
    colonyName(): ColonyName {
      return this.metadata.name;
    },
    ColonyName(): typeof ColonyName {
      return ColonyName;
    },
  },
});
</script>

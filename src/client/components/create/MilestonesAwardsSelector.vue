<!-- Button showing how the milestones and awards are chosen, which opens a popup for changing it. -->
<template>
  <div>
    <input type="checkbox" v-model="showPopup" id="maSelector-checkbox">
    <label for="maSelector-checkbox">
      <span v-i18n>Milestones and Awards</span>&nbsp;(<span v-i18n>{{ MA_MODE_LABELS[mode] }}</span><template v-if="mode === 'random'">, <span v-i18n>{{ MA_SOURCE_LABELS[source] }}</span>, <span v-i18n>{{ randomMA }}</span></template>)
    </label>
    <MilestonesAwardsPopup
      v-if="showPopup"
      :randomMA="randomMA"
      :modularMA="modularMA"
      :includeFanMA="includeFanMA"
      :customMA="customMA"
      :limit="limit"
      @update:randomMA="$emit('update:randomMA', $event)"
      @update:modularMA="$emit('update:modularMA', $event)"
      @update:includeFanMA="$emit('update:includeFanMA', $event)"
      @update:customMA="$emit('update:customMA', $event)"
      @close="showPopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import MilestonesAwardsPopup from './MilestonesAwardsPopup.vue';
import {CustomMA} from '@/common/ma/CustomMA';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {MA_MODE_LABELS, MA_SOURCE_LABELS, maMode, maSource} from './maMode';

const props = defineProps<{
  randomMA: RandomMAOptionType;
  modularMA: boolean;
  includeFanMA: boolean;
  customMA: CustomMA | undefined;
  /** How many milestones, and how many awards, a hand-picked selection needs. */
  limit: number;
}>();

defineEmits<{
  'update:randomMA': [value: RandomMAOptionType];
  'update:modularMA': [value: boolean];
  'update:includeFanMA': [value: boolean];
  'update:customMA': [value: CustomMA | undefined];
}>();

const mode = computed(() => maMode(props.randomMA));
const source = computed(() => maSource(props.modularMA, props.includeFanMA));

const showPopup = ref(false);
</script>

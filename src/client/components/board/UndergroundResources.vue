<template>
  <div>
    <div v-if="this.space.undergroundResources !== undefined" :class='resourceClass'></div>
    <div v-if="this.space.excavator !== undefined" :class='excavatorClass'></div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {SpaceModel} from '@/common/models/SpaceModel';

export default Vue.extend({
  name: 'underground-resources',
  props: {
    space: {
      type: Object as () => SpaceModel,
    },
  },
  computed: {
    resourceClass(): string {
      return 'underground-token underground-token--' + this.space.undergroundResources;
    },
    excavatorClass(): string {
      return ' underground-excavator underground-excavator--' + this.space.excavator;
    },
  },
});

</script>

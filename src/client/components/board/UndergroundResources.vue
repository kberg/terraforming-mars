<template>
  <div>
  {{space.undergroundResources}}<br/> {{space.excavator}}
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
    // klass(): string {
    //   let css = 'board-space';
    //   if (this.tileType !== undefined) {
    //     let cssClass: string | undefined = tileTypeToCssClass[this.tileType];
    //     if (this.aresExtension && tileTypeToCssClassAresOverride.has(this.tileType)) {
    //       cssClass = tileTypeToCssClassAresOverride.get(this.tileType);
    //     }
    //     // Special case Crashlanding rotation
    //     if (this.tileType === TileType.CRASHLANDING && this.space.rotated === true) {
    //       cssClass += '-rotated';
    //     }
    //     css += ' board-space-tile--' + cssClass;
    //   } else {
    //     if (this.spaceType === SpaceType.OCEAN) {
    //       css += ' board-space-type-ocean';
    //     } else if (this.spaceType === SpaceType.COVE) {
    //       if (this.highlight !== 'volcanic') {
    //         // Custom for Arabia Terra's space Tikhonarov.
    //         css += ' board-space-type-cove';
    //       } else {
    //         css += ' board-space-type-volcanic-cove';
    //       }
    //     } else if (!this.restricted) {
    //       css += ` board-space-type-land`;

    //       if (this.highlight) {
    //         css += ` board-space-type-land-${this.highlight}`;
    //       }
    //     }
    //   }
    //   if (this.tileView !== 'show') {
    //     css += ' board-hidden-tile';
    //   }
    //   return css;
    // },
  },
});

</script>

import Vue from 'vue';
import {CardType} from '../../cards/CardType';
import {CardCorporationLogo} from './CardCorporationLogo';
import {translateText} from '../../directives/i18n';

export const CardTitle = Vue.component('CardTitle', {
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (card: CardType) => Object.values(CardType).includes(card),
    },
  },
  components: {
    CardCorporationLogo,
  },
  methods: {
    isCorporation: function(): boolean {
      return this.type === CardType.CORPORATION;
    },
    isPrelude: function(): boolean {
      return this.type === CardType.PRELUDE;
    },
    isLeader() {
      return this.type === CardType.LEADER;
    },
    getClasses: function(title: string): string {
      const classes: Array<String> = ['card-title'];

      if (this.type === CardType.AUTOMATED) {
        classes.push('background-color-automated');
      } else if (this.type === CardType.ACTIVE) {
        classes.push('background-color-active');
      } else if (this.type === CardType.EVENT) {
        classes.push('background-color-events');
      } else if (this.type === CardType.PRELUDE) {
        classes.push('background-color-prelude');
      } else if (this.type === CardType.STANDARD_PROJECT || this.type === CardType.STANDARD_ACTION) {
        classes.push('background-color-standard-project');
      } else if (this.type === CardType.LEADER) {
        classes.push('background-color-leader');
      }

      const localeSpecificTitle = translateText(this.getCardTitleWithoutSuffix(title));

      if (localeSpecificTitle.length > 28) {
        classes.push('title-smallest');
      } else if (localeSpecificTitle.length > 26) {
        classes.push('title-smaller');
      }else if (localeSpecificTitle.length > 23) {
        classes.push('title-small');
      }

      return classes.join(' ');
    },
    getMainClasses() {
      const classes: Array<String> = ['card-title'];
      if (this.type === CardType.STANDARD_PROJECT || this.type === CardType.STANDARD_ACTION) {
        classes.push('card-title-standard-project');
      }
      return classes.join(' ');
    },
    getCardTitleWithoutSuffix(title: string): string {
      return title.split(':')[0];
    },
  },
  template: `
      <div :class="getMainClasses()">
          <div v-if="isPrelude()" class="prelude-label">prelude</div>
          <div v-if="isLeader()" class="leader-label">leader</div>
          <div v-if="isCorporation()" class="corporation-label">corporation</div>
          <CardCorporationLogo v-if="isCorporation()" :title="title"/>
          <div v-else :class="getClasses(title)">{{ getCardTitleWithoutSuffix(title) }}</div>
      </div>
  `,
});
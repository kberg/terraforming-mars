import Vue from 'vue';
import {Tags} from '../cards/Tags';
import {$t} from '../directives/i18n';

export const Tag = Vue.component('tag', {
  props: {
    tag: {
      type: String as () => Tags,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['tag-count'];
      const showTooltip = (this.tag as any) !== 'escape';
      if (showTooltip) classes.push('tooltip', 'tooltip-bottom');

      classes.push(`tag-${this.tag}`);
      if (this.size !== undefined) {
        classes.push(`tag-size-${this.size}`);
      }
      if (this.type !== undefined) {
        classes.push(`tag-type-${this.type}`);
      }
      return classes.join(' ');
    },
    getToolTip: function(): string | undefined {
      if ((this.tag as any) === 'escape') return undefined;
      return $t(this.tag);
    }
  },
  template: '<div :class="getClasses()" :data-tooltip="getToolTip()" />',
});

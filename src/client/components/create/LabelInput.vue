<template>
  <div>
    <input type="checkbox" :name="prefix" :id="id" v-model="zheck"
      @change="$emit('checked', $event.target.checked)">
    <!-- <input type="checkbox" :name="prefix" :id="id" v-bind:model="value"
          v-on:change="$emit('change', $event.target.value)"> -->
    <label :for="id" class="expansion-button">
        <div :class="iconClass"></div>
        <span v-i18n>{{title}}</span>&nbsp;<a href="https://github.com/terraforming-mars/terraforming-mars/wiki/Variants#promo-cards" class="tooltip" target="_blank">&#9432;</a>
    </label>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LabelInput',
  props: {
    value: {
      type: Boolean,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    prefix: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      zheck: this.value,
    };
  },
  computed: {
    id(): string {
      return this.prefix + '-checkbox';
    },
    iconClass(): string {
      return 'create-game-expansion-icon expansion-icon-' + this.prefix;
    },
  },
});
</script>

<template>
  <div class="payments_widget_cont">
    <Button type="minus" :onClick="_=>decrement()" />
    <input
      class="form-input payments_input form-inline"
      :value="value"
      @input="$emit('input', $event.target.value)"
     />
    <Button type="plus" :onClick="_=>increment()" />
    <Button type="max" v-if="showMax" :onClick="_=>setMax()" title="MAX" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {Button} from './Button';

export default Vue.extend({
  name: 'PaymentsWidget',
  props: {
    value: {
      type: Number,
    },
    max: {
      type: Number,
    },
    min: {
      type: Number,
      default: 0,
    },
    showMax: {
      type: Boolean,
      default: true,
    },
  },
  data: function() {
    return {
      available: this.max,
    };
  },
  components: {
    Button,
  },
  methods: {
    setValue: function(value: number) {
      const el = this.$el.getElementsByTagName('input')[0];
      console.log('1', el.value);
      el.value = String(value);
      console.log('2', el.value);
      this.$emit('update', this.value);
    },
    increment: function(): void {
      this.setValue(Math.min(this.value + 1, this.max));
    },
    decrement: function(): void {
      this.setValue(Math.max(this.value - 1, this.min));
    },
    setMax: function(): void {
      this.setValue(this.max);
    },
  },
});
</script>

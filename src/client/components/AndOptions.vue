<template>
  <div class='wf-options'>
    <div v-if="showtitle" class="wf-title">{{ $t(playerinput.title) }}</div>
    <player-input-factory v-for="(option, idx) in (playerinput.options || [])"
      :key="idx"
      ref="childInputs"
      :players="players"
      :playerView="playerView"
      :playerinput="option"
      :onsave="playerFactorySaved(idx)"
      :showsave="false"
      :showtitle="true" />
    <div v-if="showsave" class="wf-action">
      <AppButton :title="playerinput.buttonLabel" type="submit" size="normal" @click="saveData" :disabled="!canSave()"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {AndOptionsModel} from '@/common/models/PlayerInputModel';
import AppButton from '@/client/components/common/AppButton.vue';
import {AndOptionsResponse, InputResponse} from '@/common/inputs/InputResponse';

interface DataModel {
  responded: Array<InputResponse | undefined>,
}

export default defineComponent({
  name: 'and-options',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    playerinput: {
      type: Object as () => AndOptionsModel,
    },
    onsave: {
      type: Function as unknown as () => (out: AndOptionsResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    AppButton,
  },
  data(): DataModel {
    return {
      responded: this.playerinput.options.map(() => undefined),
    };
  },
  methods: {
    playerFactorySaved(idx: number) {
      return (out: InputResponse) => {
        this.responded[idx] = out;
      };
    },
    canSave(): boolean {
      const refs = this.$refs.childInputs as any[];
      if (!refs) return true;
      for (const child of refs) {
        const canSave = child.canSave;
        if (canSave instanceof Function) {
          if (canSave() === false) {
            return false;
          }
        }
      }
      return true;
    },
    saveData() {
      if (this.canSave() === false) {
        alert('Not all options selected');
        return;
      }
      const refs = this.$refs.childInputs as any[];
      if (refs) {
        for (const child of refs) {
          if (child.saveData instanceof Function) {
            child.saveData();
          }
        }
      }
      this.onsave({
        type: 'and',
        responses: this.responded as Array<InputResponse>,
      });
    },
  },
});

</script>


<template>
   <li v-if="message !== undefined && message.data !== undefined && message.message !== undefined" v-on:click.prevent="$emit('click')">
    <span v-if="message.type !== LogMessageType.NEW_GENERATION" :title="when">{{ icon }}</span>
    <template v-for="(data, idx) of entries" :key="idx">
      <span class="log-plain-text" v-if="typeof(data) === 'string'">{{ data }}</span>
      <span v-else>
        <span v-if="data.type === undefined || data.value === undefined"></span>
        <span v-else-if="data.type === LogMessageDataType.PLAYER" class="log-player" :class="'player_bg_color_' + data.value"> {{ getPlayerName(data.value) }} </span>
        <LogCard v-else-if="data.type === LogMessageDataType.CARD"
                 :cardName="data.value"
                 :showTags="data.attrs?.tags === true"
                 :showCost="data.attrs?.cost === true" />
        <span v-else-if="data.type === LogMessageDataType.GLOBAL_EVENT" class="log-card background-color-global-event" v-i18n>
          {{data.value}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.TILE_TYPE" v-i18n>
          {{tileTypeToString[data.value]}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.COLONY" class="log-card background-color-colony" v-i18n>
          {{data.value}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.UNDERGROUND_TOKEN" class="log-excavation-token" v-i18n>
          {{undergroundResourceTokenDescription[data.value]}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.SPACE" class="log-space-id" v-on:click.prevent="$emit('spaceClicked', data.value)">
            <svg width="20" height="14" viewBox="0 0 28 37">
              <circle cx="14" cy="19" r="16" stroke="black" stroke-width="1" transform="translate(0, 2)" :fill="isMoonSpace(data.value) ? 'gray' : '#b7410e'" />
            </svg>
            {{ getSpaceName(data.value) }}
        </span>
        <template v-else-if="data.type === LogMessageDataType.CARDS">
          <span v-if="data.attrs?.ellipsis" class="log-card background-color-standard-project">...</span>
          <template v-else>
            <template v-for="(cardName, cardIdx) in data.value" :key="cardIdx">
              <LogCard :cardName="cardName"
                       :showTags="data.attrs?.tags === true"
                       :showCost="data.attrs?.cost === true" />{{ ' ' }}
            </template>
          </template>
        </template>

        <span v-else-if="data.type === LogMessageDataType.RAW_STRING">{{ data.value }}</span>
        <span v-else v-i18n>{{ data.value }}</span>
      </span>
    </template>
   </li>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {Color} from '@/common/Color';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {ViewModel} from '@/common/models/PlayerModel';
import {tileTypeToString} from '@/common/TileType';
import {Log} from '@/common/logs/Log';
import {undergroundResourceTokenDescription} from '@/common/underworld/UndergroundResourceToken';
import {isMoonSpace, getSpaceName} from '@/common/boards/spaces';
import LogCard from '@/client/components/logpanel/LogCard.vue';

export default defineComponent({
  name: 'LogMessageComponent',
  components: {LogCard},
  props: {
    message: {
      type: Object as () => LogMessage,
      required: true,
    },
    viewModel: {
      type: Object as () => ViewModel,
      required: true,
    },
  },
  methods: {
    getPlayerName(color: Color) {
      const player = this.viewModel.players.find((player) => player.color === color);
      return player?.name ?? color;
    },
  },
  computed: {
    entries() {
      if (this.message === undefined) {
        return [];
      }
      const e = {
        message: this.$t(this.message.message),
        data: this.message.data,
      };
      return Log.parse(e);
    },
    when() {
      return new Date(this.message.timestamp).toLocaleString();
    },
    icon(): string {
      return this.message.playerId === undefined ? '\u{1F551}' : '\u{1F4AC}';
    },
    LogMessageType(): typeof LogMessageType {
      return LogMessageType;
    },
    LogMessageDataType(): typeof LogMessageDataType {
      return LogMessageDataType;
    },
    getSpaceName(): typeof getSpaceName {
      return getSpaceName;
    },
    isMoonSpace(): typeof isMoonSpace {
      return isMoonSpace;
    },
    undergroundResourceTokenDescription(): typeof undergroundResourceTokenDescription {
      return undergroundResourceTokenDescription;
    },
    tileTypeToString(): typeof tileTypeToString {
      return tileTypeToString;
    },
  },
});
</script>

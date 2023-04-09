import Vue from 'vue';
import {PlayerModel} from '../../models/PlayerModel';
import {TagCount} from '../TagCount';

export const AutomaBotInfo = Vue.component('AutomaBotInfo', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
  },
  components: {
    'tag-count': TagCount,
  },
  template: `
    <div class="player-info">
        <div class="player-info-top">
            <div class="name-and-icon bot_translucent_bg_color">
                <div class="player-info-name">Bot</div>
            </div>

            <div class="player-corp bot_translucent_bg_color">{{ this.player.automaBotCorporation.name }}</div>
        </div>
        <div class="player-info-bottom bot_translucent_bg_color">
            <div class="player-tags">
                <div class="player-tags-main">
                    <tag-count :tag="'vp'" :count="this.player.automaBotVictoryPointsBreakdown.total" :size="'big'" :type="'main'" />
                    <tag-count :tag="'tr'" :count="this.player.automaBotVictoryPointsBreakdown.terraformRating" :size="'big'" :type="'main'"/>
                </div>
            </div>
        </div>
    </div>
  `,
});

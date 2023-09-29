import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('oof, lots to draw');
  // b.vSpace(Size.MEDIUM).br.text('9').diverseTag(1).influence({size: Size.SMALL}).colon().megacredits(10);
});

export class MediaStir extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MEDIA_STIR,
      description: 'Lose 3 MC per corruption resource they have (max 5), minus influence. Players with 0 corruption gain 1 TR.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const corruption = Math.min(player.underworldData.corruption, 5);
      const adjusted = Math.max(0, corruption - turmoil.getPlayerInfluence(player));
      if (adjusted > 0) {
        const cost = adjusted * 3;
        player.stock.deduct(Resource.MEGACREDITS, cost, {log: true, from: this.name});
      }
      if (player.underworldData.corruption === 0) {
        // TODO(kberg): Add "from"
        // player.increaseTerraformRating(1, {log: true, from: this.name});
        player.increaseTerraformRating(1, {log: true});
      }
    });
  }
}

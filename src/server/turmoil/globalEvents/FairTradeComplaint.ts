import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-1).slash().cards(1, {over: 6}).influence({size: Size.SMALL}).nbsp;
  b.text('MAX 6').cards(1).colon().cards(2, {digit});
});

export class FairTradeComplaint extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.FAIR_TRADE_COMPLAINT,
      description: 'Lose 1 M€ for each card in hand over 6 cards (no limit.) ' +
        'Each point of influence reduces the damage by 2 M€. ' +
        'Each player with 6 or fewer cards in hand draws 2 cards.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const penalty = Math.max(0, (player.cardsInHand.length - 6));
      if (penalty === 0) {
        player.drawCard(2);
      }
      const savings = 2 * turmoil.getPlayerInfluence(player);
      const cost = Math.max(0, penalty - savings);
      if (cost > 0) {
        player.stock.deduct(Resource.MEGACREDITS, cost, {log: true, from: this.name});
      }
    });
  }
}

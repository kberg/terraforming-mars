import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-3).slash().colonies(1).influence({size: Size.SMALL});
});

export class MicrogravityHealthProblems extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS,
      description: 'Lose 3 M€ for each colony (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      let coloniesCount = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      player.stock.deduct(
        Resource.MEGACREDITS,
        3 *
          Math.max(
            0,
            Math.min(5, coloniesCount) - turmoil.getInfluence(player),
          ),
        {log: true, from: {globalEvent: this}},
      );
    });
  }
}

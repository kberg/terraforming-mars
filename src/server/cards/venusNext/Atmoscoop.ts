import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {IGame} from '../../IGame';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import * as constants from '../../../common/constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';

export class Atmoscoop extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ATMOSCOOP,
      cost: 22,
      tags: [Tag.JOVIAN, Tag.SPACE],

      requirements: {tag: Tag.SCIENCE, count: 3},
      victoryPoints: 1,

      behavior: {
        addResourcesToAnyCard: {count: 2, type: CardResource.FLOATER},
      },

      metadata: {
        cardNumber: '217',
        description: 'Requires 3 science tags. Either raise the temperature 2 steps, or raise Venus 2 steps. Add 2 floaters to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).or(Size.SMALL).venus(2).br;
          b.resource(CardResource.FLOATER, 2).asterix();
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp01')) {
      const cost = player.getCardCost(this);
      if (!player.canAfford(cost)) {
        return false;
      }
      // TODO(kberg): this is not correct, because the titanium can't be used for the reds cost.
      return player.canAfford({cost, tr: {temperature: 2}, titanium: true}) ||
        player.canAfford({cost, tr: {venus: 2}, titanium: true});
    }

    return true;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) {
      return undefined;
    }

    const increaseTemp = new SelectOption('Raise temperature 2 steps', 'Raise temperature').andThen(() => {
      game.increaseTemperature(player, 2);
      return undefined;
    });
    const increaseVenus = new SelectOption('Raise Venus 2 steps', 'Raise Venus').andThen(() => {
      game.increaseVenusScaleLevel(player, 2);
      return undefined;
    });
    const increaseTempOrVenus = new OrOptions(increaseTemp, increaseVenus)
      .setTitle('Choose global parameter to raise');

    if (!this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) {
      player.game.increaseTemperature(player, 2);
    } else if (this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
      player.game.increaseVenusScaleLevel(player, 2);
    } else {
      return increaseTempOrVenus;
    }
    return undefined;
  }

  private temperatureIsMaxed(game: IGame) {
    return game.getTemperature() === constants.MAX_TEMPERATURE;
  }

  private venusIsMaxed(game: IGame) {
    return game.getVenusScaleLevel() === constants.MAX_VENUS_SCALE;
  }
}

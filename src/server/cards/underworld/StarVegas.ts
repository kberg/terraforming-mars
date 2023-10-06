import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';
import {SpaceType} from '../../../common/boards/SpaceType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {newMessage} from '../../logs/MessageBuilder';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class StarVegas extends Card {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.STAR_VEGAS,
      cost: 32,
      tags: [Tag.SPACE, Tag.CITY],
      requirements: {cities: 3, all},

      metadata: {
        cardNumber: 'U53',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix().corruption(2).br;
          b.production((pb) => pb.megacredits(1).slash().city({all}));
        }),
        description: 'Requires 3 cities in play. Place a city on a space reserved for a different space city. ' +
         'Gain 2 corruption. Increase your M€ production one step for each city in play.',
      },
    });
  }

  getAvailableSpaces(player: IPlayer) {
    return player.game.board.spaces
      .filter((space) => space.spaceType === SpaceType.COLONY)
      .filter((space) => space.tile === undefined);
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(newMessage('Select space colony for ${0}', (b) => b.card(this)),
      this.getAvailableSpaces(player),
      (space) => {
        player.game.addCity(player, space, this.name);
        UnderworldExpansion.gainCorruption(player, 2, {log: true});
        const cities = player.game.board.getCities(player).length;
        player.production.add(Resource.MEGACREDITS, cities, {log: true});
        return undefined;
      });
  }
}


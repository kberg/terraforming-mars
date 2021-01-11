import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImportOfAdvancedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORT_OF_ADVANCED_GHG,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 9,

      metadata: {
        cardNumber: '167',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.heat(2))),
        description: 'Increase your heat production 2 steps.',
      },
    });
  }

  public play(player: Player, _game: Game) {
    player.addHeatProduction(2);
    return undefined;
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {Board} from '../../boards/Board';

export class OutdoorSports extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OUTDOOR_SPORTS,
      cost: 8,
      productionBox: Units.of({megacredits: 2}),
      requirements: CardRequirements.builder((b) => b.cities(1).any().oceans(1)),
      metadata: {
        cardNumber: 'X38',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires any city adjacent to an ocean. Increase your M€ production 2 steps.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player) {
    const board = player.game.board;
    const oceans = board.getOceansTiles(true);
    return oceans.some((ocean) => board.getAdjacentSpaces(ocean).some((space) => Board.isCitySpace(space)));
  }

  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    return undefined;
  }
}

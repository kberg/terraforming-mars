import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {Board} from '../../boards/Board';

export class AqueductSystems extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.AQUEDUCT_SYSTEMS,
      tags: [Tags.BUILDING],
      cost: 9,
      requirements: CardRequirements.builder((b) => b.cities(1).any().oceans(1)),

      metadata: {
        cardNumber: '??',
        description: 'Requires any city adjacent to an ocean. Draw 3 building cards.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.cards(3).secondaryTag(Tags.BUILDING);
        }),
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
    player.drawCard(3, {tag: Tags.BUILDING});
    return undefined;
  }

  public getVictoryPoints(): number {
    return 1;
  }
}

import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {Board} from '../../boards/Board';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../Units';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';

export class GreatDamPromo extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.GREAT_DAM_PROMO,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: 'X32',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, true, false).asterix();
      }),
      description: 'Requires 4 ocean tiles. Increase your Energy production 2 steps. Place this tile ADJACENT TO an ocean tile.',
      victoryPoints: 1,
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.ENERGY, Tags.BUILDING],
      productionBox: Units.of({energy: 2}),
      cost: 15,
      requirements: CardRequirements.builder((b) => b.oceans(4)),
      adjacencyBonus,
      metadata,
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) {
      return false;
    }
    return this.getAvailableSpaces(player).length > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2);

    const availableSpaces = this.getAvailableSpaces(player);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.GREAT_DAM});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }

  public getVictoryPoints() {
    return 1;
  }

  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter(
        (space) => player.game.board.getAdjacentSpaces(space).filter(
          (adjacentSpace) => Board.isOceanSpace(adjacentSpace),
        ).length > 0,
      );
  }
}


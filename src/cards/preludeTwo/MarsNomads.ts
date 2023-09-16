import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Multiset} from '../../utils/Multiset';
import {SpaceType} from '../../SpaceType';

export class MarsNomads extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARS_NOMADS,
      cost: 13,

      metadata: {
        cardNumber: '??',
        description: 'PLACE THE NOMADS on a non-reserved, empty area on the game board.',
        renderData: CardRenderer.builder((b) => {
          b.action('MOVE THE NOMADS to an adjacent, non-reserved empty area and collect THE PLACEMENT BONUS as if placing a special tile there. No tiles may be placed on the Nomad area.', (eb) => {
            eb.empty().startAction.nomads(1).asterix();
          });
          b.br;
          b.nomads(1).asterix();
        }),
      },
    });
  }

  public canPlay(player: Player) {
    const spaces = player.game.board.getAvailableSpacesOnLand(player);
    return spaces.length > 0;
  }

  public play(player: Player) {
    return new SelectSpace(
      'Select space for Nomads',
      player.game.board.getAvailableSpacesOnLand(player),
      (space: ISpace) => {
        space.hasNomads = true;
        // Grant space bonuses        
        if (space.bonus.length > 0) {
          const bonuses = new Multiset(space.bonus);
          bonuses.entries().forEach(([bonus, count]) => {
            player.game.grantSpaceBonus(player, bonus, count);
          });
        }

        return undefined;
      },
    );
  }

  public canAct(player: Player) {
    const board = player.game.board;
    if (board.spaces.some((space) => space.hasNomads) === false) return false;

    const currentNomadSpace = board.spaces.find((space) => space.hasNomads) as ISpace;
    const eligibleAdjacentSpaces = board.getAdjacentSpaces(currentNomadSpace).filter((space) => space.spaceType === SpaceType.LAND && space.tile === undefined && space.player === undefined);
    return eligibleAdjacentSpaces.length > 0;
  }

  public action(player: Player) {
    const board = player.game.board;
    const currentNomadSpace = board.spaces.find((space) => space.hasNomads) as ISpace;
    const eligibleAdjacentSpaces = board.getAdjacentSpaces(currentNomadSpace).filter((space) => space.spaceType === SpaceType.LAND && space.tile === undefined && space.player === undefined);
    
    return new SelectSpace(
      'Select adjacent space to move Nomads to',
      eligibleAdjacentSpaces,
      (space: ISpace) => {
        board.spaces.forEach((s) => s.hasNomads = false);
        space.hasNomads = true;
        // Grant space bonuses        
        if (space.bonus.length > 0) {
          const bonuses = new Multiset(space.bonus);
          bonuses.entries().forEach(([bonus, count]) => {
            player.game.grantSpaceBonus(player, bonus, count);
          });
        }

        return undefined;
      },
    );
  }
}

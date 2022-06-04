import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectCard} from '../../inputs/SelectCard';
import {ISpace} from '../../boards/ISpace';
import {ResourceType} from '../../ResourceType';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {Multiset} from '../../utils/Multiset';
import {ICard} from '../ICard';

export class Gaia extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.GAIA,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L32',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().colon().adjacencyBonus().any.asterix();
          b.br;
        }),
        description: 'Once per game, gain the adjacency bonuses of all tiles placed on Mars.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const board = player.game.board;
    const allPlayers = player.game.getPlayers();

    allPlayers.forEach((p) => {
      board.spaces
        .filter((space) => space.player === p)
        .forEach((space) => {
          board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
            this.grantAdjacencyBonus(adjacentSpace, player);
          });   
        });
    });

    this.isDisabled = true;
    return undefined;
  }

  public grantAdjacencyBonus(adjacentSpace: ISpace, player: Player) {
    if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
      return undefined;
    }

    const addResourceToCard = function(player: Player, resourceType: ResourceType, resourceAsText: string) {
      const availableCards = player.getResourceCards(resourceType);
      if (availableCards.length === 0) {
      } else if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0], {log: true});
      } else if (availableCards.length > 1) {
        player.game.defer(new DeferredAction(
          player,
          () => new SelectCard(
            'Select a card to add 1 ' + resourceAsText,
            'Add ' + resourceAsText + 's',
            availableCards,
            (selected: ICard[]) => {
              player.addResourceTo(selected[0], {log: true});
              return undefined;
            },
          ),
        ));
      }
    };

    const bonuses = new Multiset<SpaceBonus>();

    adjacentSpace.adjacency.bonus.forEach((bonus) => {
      bonuses.add(bonus);

      switch (bonus) {
      case SpaceBonus.ANIMAL:
        addResourceToCard(player, ResourceType.ANIMAL, 'animal');
        break;

      case SpaceBonus.MICROBE:
        addResourceToCard(player, ResourceType.MICROBE, 'microbe');
        break;

      default:
        player.game.grantSpaceBonus(player, bonus);
        break;
      }
    });

    const bonusText = bonuses.entries().map((elem) => `${elem[1]} ${SpaceBonus.toString(elem[0])}`).join(', ');
    const tileText = adjacentSpace.tile !== undefined ? TileType.toString(adjacentSpace.tile?.tileType) : 'no tile';
    player.game.log('${0} gains ${1} from a tile placed next to ${2}', (b) => b.player(player).string(bonusText).string(tileText));

    return undefined;
  }
}

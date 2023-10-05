import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {Resource} from '../../../common/Resource';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';
import {SelectSpace} from '../../inputs/SelectSpace';

export class Deepmining extends Card implements IProjectCard {
  public bonusResource?: Array<Resource>;

  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.DEEPMINING,
      cost: 11,
      tags: [Tag.BUILDING],

      metadata: {
        cardNumber: 'U29',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).asterix().br;

          b.tile(TileType.MINING_RIGHTS, true).asterix().br;
          b.production((pb) => pb.steel(1).or().titanium(1)).asterix();
        }),
        description: 'Excavate an IDENTIFIED underground resource ANYWHERE ON MARS with a steel or titanium placement bonus. ' +
        'Increase that production 1 step.',
      },
    });
  }

  public getAvailableSpaces(player: IPlayer): ReadonlyArray<Space> {
    return UnderworldExpansion.identifiedSpaces(player.game)
      .filter((space) => space.excavator === undefined)
      .filter((space) => space.bonus.includes(SpaceBonus.STEEL) || space.bonus.includes(SpaceBonus.TITANIUM));
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }

  public produce(player: IPlayer) {
    if (this.bonusResource && this.bonusResource.length === 1) {
      player.production.add(this.bonusResource[0], 1, {log: true});
    }
  }

  // TODO(kberg): Reduce duplication with MiningCard.
  public override bespokePlay(player: IPlayer): SelectSpace {
    return new SelectSpace(
      'Select an excavatable space with a steel or titanium bonus',
      this.getAvailableSpaces(player), (space: Space) => {
        const bonusResources = [];
        if (space.bonus.includes(SpaceBonus.STEEL)) {
          bonusResources.push(Resource.STEEL);
        }
        if (space.bonus.includes(SpaceBonus.TITANIUM)) {
          bonusResources.push(Resource.TITANIUM);
        }

        player.game.defer(
          new SelectResourceTypeDeferred(
            player,
            bonusResources,
            'Select a resource to gain 1 unit of production'))
          .andThen(
            (resource) => {
              player.production.add(resource, 1, {log: true});
              this.bonusResource = [resource];
              UnderworldExpansion.excavate(player, space);
            },
          );
        return undefined;
      });
  }
}

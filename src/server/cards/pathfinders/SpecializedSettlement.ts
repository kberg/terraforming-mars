import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card, productionBoxWithBonusResource} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';
import {SpaceId} from '../../../common/Types';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';
import {Units} from '../../../common/Units';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {AdjustProduction} from '../../deferredActions/AdjustProduction';

export class SpecializedSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SPECIALIZED_SETTLEMENT,
      tags: [Tag.CITY, Tag.BUILDING, Tag.MARS],
      cost: 20,

      metadata: {
        cardNumber: 'PF57',
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. ' +
          'Place a city tile on Mars. Increase your production by 1 of a resource on the map gained by placement bonus.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.energy(-1).br;
            pb.plus().megacredits(3);
            pb.plus().wild(1);
          }).nbsp.city();
        }),
      },
    });
  }

  public bonusResource: Array<Resource> | undefined;
  // The resource the player chose from the city space's standard resource placement bonus.
  private chosenStandardResource: {spaceId: SpaceId, resource: Resource | undefined} | undefined;

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.board.getAvailableSpacesForCity(player).length === 0) {
      return false;
    }
    if (player.production.energy >= 1) {
      return true;
    }
    // A Mars-track advance can grant +1 energy production, which offsets the cost.
    return PathfindersExpansion.willGainEnergyProductionOnNextMarsTag(player);
  }

  private bonusResources(space: Space) {
    const resources: Set<Resource> = new Set();
    space.bonus.forEach((bonus) => {
      switch (bonus) {
      case SpaceBonus.STANDARD_RESOURCE:
        const chosen = this.chosenStandardResource?.spaceId === space.id ? this.chosenStandardResource.resource : undefined;
        if (chosen !== undefined && chosen !== Resource.MEGACREDITS) {
          resources.add(chosen);
        }
        break;
      case SpaceBonus.STEEL:
        resources.add(Resource.STEEL);
        break;
      case SpaceBonus.TITANIUM:
        resources.add(Resource.TITANIUM);
        break;
      case SpaceBonus.PLANT:
        resources.add(Resource.PLANTS);
        break;
      case SpaceBonus.ENERGY:
        resources.add(Resource.ENERGY);
        break;
      case SpaceBonus.HEAT:
        resources.add(Resource.HEAT);
        break;
      }
    });
    return Array.from(resources);
  }

  public override bespokePlay(player: IPlayer) {
    // Deferred in case the energy production gain comes from the Planetary track.
    player.game.defer(new AdjustProduction(player, this.defaultProductionBox));

    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player))
      .andThen((space) => {
        const coveringExistingTile = space.tile !== undefined;

        if (space.bonus.includes(SpaceBonus.STANDARD_RESOURCE)) {
          this.chosenStandardResource = {spaceId: space.id, resource: undefined};
        }
        player.game.addCity(player, space);

        if (coveringExistingTile) {
          return;
        }
        // Deferred so it follows the player's choice from a standard resource placement bonus.
        player.defer(() => {
          const bonusResources = this.bonusResources(space);
          this.chosenStandardResource = undefined;
          this.produceForTile(player, bonusResources);
          return undefined;
        });
        return undefined;
      },
      );
  }

  public onStandardResourcePlacementBonus(_cardOwner: IPlayer, _activePlayer: IPlayer, space: Space, resource: Resource) {
    if (this.chosenStandardResource?.spaceId === space.id) {
      this.chosenStandardResource.resource = resource;
    }
  }

  public readonly defaultProductionBox = Units.of({energy: -1, megacredits: 3});
  public productionBox() {
    return productionBoxWithBonusResource(this);
  }

  public produceForTile(player: IPlayer, bonusResources: Array<Resource>) {
    if (bonusResources.length === 0) {
      return;
    }

    player.game.defer(new SelectResourceTypeDeferred(
      player, bonusResources,
      'Select a resource to gain 1 unit of production'))
      .andThen(
        (resource) => {
          player.production.add(resource, 1, {log: true});
          this.bonusResource = [resource];
        },
      );
  }
}

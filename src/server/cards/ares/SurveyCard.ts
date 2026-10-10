import {Card, StaticCardProperties} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Phase} from '../../../common/Phase';
import {IProjectCard} from '../IProjectCard';
import {BoardType} from '../../boards/BoardType';
import {SpaceType} from '../../../common/boards/SpaceType';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Board} from '../../boards/Board';
import {AresHandler} from '../../ares/AresHandler';

/**
 * Abstraction for cards that give rewards based on tile placement.  (e.g. Ecological Survey, Geological Survey.)
 */
export abstract class SurveyCard extends Card implements IProjectCard {
  constructor(properties: StaticCardProperties) {
    super(properties);
  }

  /**
   * Returns true if this space yields an adjacency bonus.
   */
  private anyAdjacentSpaceGivesBonus(board: Board, space: Space, bonus: SpaceBonus): boolean {
    return board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }

  /**
   * Returns true if the tile just placed gives a bonus of a given type.
   */
  private grantsBonusNow(space: Space, bonus: SpaceBonus) {
    return space.tile?.covers === undefined && space.bonus.includes(bonus);
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    // Adjacency bonuses are only available on Mars.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (cardOwner.game.phase === Phase.SOLAR || cardOwner.id !== activePlayer.id) {
      return;
    }

    this.checkForBonuses(cardOwner, space);
  }

  protected abstract checkForBonuses(cardOwner: IPlayer, space: Space): void;

  public onStandardResourcePlacementBonus(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, resource: Resource) {
    if (cardOwner.game.phase === Phase.SOLAR || cardOwner.id !== activePlayer.id) {
      return;
    }
    this.checkForChosenResource(cardOwner, space, resource);
  }

  /**
   * Like `checkForBonuses`, for the standard resource `resource` the player chose from the space's
   * standard resource placement bonus.
   */
  protected abstract checkForChosenResource(cardOwner: IPlayer, space: Space, resource: Resource): void;

  private log(cardOwner: IPlayer, resource: Resource | CardResource): void {
    cardOwner.game.log(
      '${0} gained a bonus ${1} because of ${2}',
      (b) => b.player(cardOwner).string(resource).cardName(this.name));
  }

  /**
   * Optionally grants a unit of `resource` (which matches `bonus`) based on `cardOwner` having placed a tile on `space`.
   */
  protected maybeRewardStandardResource(cardOwner: IPlayer, space: Space, resource: Resource, bonus: SpaceBonus): void {
    if (this.rewardsStandardResource(cardOwner, space, resource, bonus)) {
      cardOwner.stock.add(resource, 1);
      this.log(cardOwner, resource);
    }
  }

  /**
   * Grants a unit of `resource` when the player chose `chosen` from the space's standard resource
   * placement bonus, unless placing the tile already rewarded `resource`.
   */
  protected maybeRewardChosenResource(cardOwner: IPlayer, space: Space, chosen: Resource, resource: Resource, bonus: SpaceBonus): void {
    if (chosen === resource && !this.rewardsStandardResource(cardOwner, space, resource, bonus)) {
      cardOwner.stock.add(resource, 1);
      this.log(cardOwner, resource);
    }
  }

  private rewardsStandardResource(cardOwner: IPlayer, space: Space, resource: Resource, bonus: SpaceBonus): boolean {
    const board = cardOwner.game.board;
    if (this.grantsBonusNow(space, bonus) || this.anyAdjacentSpaceGivesBonus(board, space, bonus)) {
      return true;
    }
    switch (resource) {
    case Resource.STEEL:
      return space.spaceType !== SpaceType.COLONY &&
          PartyHooks.shouldApplyPolicy(cardOwner, PartyName.MARS, 'mp01');
    case Resource.PLANTS:
      return Board.isUncoveredOceanSpace(space) &&
        cardOwner.tableau.has(CardName.ARCTIC_ALGAE);
    }
    return false;
  }

  /**
   * Optionally grants a unit of `resource` (which matches `bonus`) based on `cardOwner` having placed a tile on `space`.
   */
  protected maybeRewardCardResource(cardOwner: IPlayer, space: Space, resource: CardResource, bonus: SpaceBonus) {
    const board = cardOwner.game.board;
    if (cardOwner.playedCards.some((card) => card.resourceType === resource) &&
        (this.grantsBonusNow(space, bonus) || AresHandler.anyAdjacentSpaceGivesBonus(board, space, bonus))) {
      cardOwner.game.defer(new AddResourcesToCard(
        cardOwner,
        resource,
        {log: true}))
        .andThen(() => this.log(cardOwner, resource));
    }
  }
}

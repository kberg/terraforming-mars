import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';
import {Resources} from '../../Resources';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';

export class DeimosDownPromo extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor(
    name: CardName = CardName.DEIMOS_DOWN_PROMO,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: 'X31',
      renderData: CardRenderer.builder((b) => {
        b.temperature(3).br;
        b.tile(TileType.DEIMOS_DOWN, true).asterix().br;
        b.steel(4).digit.nbsp().minus().plants(-6).any;
      }),
      description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 Plants from any player.',
    }) {
    super({
      cardType: CardType.EVENT,
      name,
      tags: [Tags.SPACE],
      cost: 31,
      tr: {temperature: 3},
      adjacencyBonus,
      metadata,
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    const canPlaceTile = player.game.board.getAvailableSpacesForCity(player).length > 0;
    if (!canPlaceTile) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    } 

    return true;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 3);
    player.game.defer(new RemoveAnyPlants(player, 6));
    player.addResource(Resources.STEEL, 4);

    const availableSpaces = player.game.board.getAvailableSpacesForCity(player);

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.DEIMOS_DOWN});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({
      card: card,
      temperatureIncrease: 3,
      nonOceanToPlace: TileType.DEIMOS_DOWN,
      nonOceanAvailableSpaces: player.game.board.getAvailableSpacesForCity(player),
    });
  }
}

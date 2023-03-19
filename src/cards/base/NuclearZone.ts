import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class NuclearZone extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor(
    name: CardName = CardName.NUCLEAR_ZONE,
    cost: number = 10,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '097',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.NUCLEAR_ZONE, true).br;
        b.temperature(2);
      }),
      description: 'Place this tile and raise temperature 2 steps.',
      victoryPoints: -2,
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.EARTH],
      tr: {temperature: 2},
      cost,
      adjacencyBonus,
      metadata,
    });
  }
  public canPlay(player: Player): boolean {
    const canPlaceTile = player.game.board.getAvailableSpacesOnLand(player).length > 0;
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!canPlaceTile) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    const game = player.game;

    game.defer(new DeferredAction(
      player,
      () => {
        game.increaseTemperature(player, 2)
        return undefined;
      },
    ));

    return new SelectSpace('Select space for special tile', player.game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NUCLEAR_ZONE});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }

  public getVictoryPoints() {
    return -2;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, temperatureIncrease: 2, nonOceanToPlace: TileType.NUCLEAR_ZONE, nonOceanAvailableSpaces: player.game.board.getAvailableSpacesOnLand(player)});
  }
}

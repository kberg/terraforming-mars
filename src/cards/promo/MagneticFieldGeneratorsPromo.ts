import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';

export class MagneticFieldGeneratorsPromo extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor(
    name: CardName = CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: 'X33',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(4).digit.br;
          pb.plus().plants(2);
        }).br;
        b.tr(3).digit.tile(TileType.MAGNETIC_FIELD_GENERATORS, true).asterix();
      }),
      description: 'Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.',
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.BUILDING],
      cost: 22,
      productionBox: Units.of({energy: -4, plants: 2}),
      tr: {tr: 3},
      adjacencyBonus,
      metadata,
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    const meetsEnergyRequirements = player.getProduction(Resources.ENERGY) >= 4;
    const canPlaceTile = player.game.board.getAvailableSpacesOnLand(player).length > 0;

    if (!meetsEnergyRequirements) return false;
    if (!canPlaceTile) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    this.howToAffordReds = undefined;
    return true;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -4);
    player.addProduction(Resources.PLANTS, 2);
    player.increaseTerraformRatingSteps(3);

    const availableSpaces = player.game.board.getAvailableSpacesOnLand(player);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.MAGNETIC_FIELD_GENERATORS});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({
      card: card,
      TRIncrease: 3,
      nonOceanToPlace: TileType.MAGNETIC_FIELD_GENERATORS,
      nonOceanAvailableSpaces: player.game.board.getAvailableSpacesOnLand(player),
    });
  }
}

import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class LunarMineUrbanization extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.LUNAR_MINE_URBANIZATION,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 8,
      productionBox: Units.of({megacredits: 1}),
      tr: {moonColony: 1},
      // NOTE(kberg): Rules were that it says it Requires 1 mine tile. Changing to "Requires you have 1 mine tile."
      requirements: CardRequirements.builder((b) => b.miningTiles(1)),
      metadata: {
        description: 'Requires you have 1 mine tile. Increase your M€ production 1 step. Replace one of your mine tiles ' +
        'with this special tile. Raise the Colony Rate 1 step. This tile counts both as a colony and a mine tile.',
        cardNumber: 'M55',

        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.moonColonyRate();
          b.tile(TileType.LUNAR_MINE_URBANIZATION, true).asterix();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!super.canPlay(player)) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    this.howToAffordReds = undefined;
    return true;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    const tiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {ownedBy: player});
    return new SelectSpace('Select one of your mines to upgrade', tiles, (space) => {
      if (space.tile === undefined) {
        throw new Error(`Space ${space.id} should have a tile, how doesn't it?`);
      }
      space.tile.tileType = TileType.LUNAR_MINE_URBANIZATION;
      MoonExpansion.raiseColonyRate(player);
      return undefined;
    });
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonColonyRateIncrease: 1});
  }
}

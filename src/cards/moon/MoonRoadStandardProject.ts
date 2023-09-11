import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Units} from '../../Units';
import {IMoonCard} from './IMoonCard';
import {TileType} from '../../TileType';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Card} from '../Card';

export class MoonRoadStandardProject extends StandardProjectCard implements IMoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor(properties = {
    name: CardName.MOON_ROAD_STANDARD_PROJECT,
    cost: 18,
    tr: {moonLogistics: 1},
    reserveUnits: Units.of({steel: 1}),

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 18 M€ and 1 steel to place a road on the moon and raise the Logistics Rate 1 step.', (eb) => {
          eb.megacredits(18).steel(1).startAction.moonRoad().secondaryTag(AltSecondaryTag.MOON_LOGISTICS_RATE);
        }),
      ),
    },
  }) {
    super(properties);
  }

  public tilesBuilt = [TileType.MOON_ROAD];

  public discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4 + super.discount(player);
    }
    return super.discount(player);
  }

  public canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    if (spaces.length === 0) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this, false, 'take this action');

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      const reserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
      return this.howToAffordReds.canAfford && player.steel >= reserveUnits.steel;
    }

    return super.canAct(player);
  }

  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    player.game.defer(new PlaceMoonRoadTile(player));
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1});
  }
}

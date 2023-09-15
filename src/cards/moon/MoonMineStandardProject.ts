import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../Units';
import {Resources} from '../../Resources';
import {IMoonCard} from './IMoonCard';
import {TileType} from '../../TileType';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Card} from '../Card';

export class MoonMineStandardProject extends StandardProjectCard implements IMoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor(properties = {
    name: CardName.MOON_MINE_STANDARD_PROJECT,
    cost: 20,
    tr: {moonMining: 1},
    reserveUnits: Units.of({titanium: 1}),

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 20 M€ and 1 titanium to place a mine on the moon, raise the Mining Rate 1 step, and raise steel production 1 step.', (eb) => {
          eb.megacredits(20).titanium(1).startAction.moonMine().secondaryTag(AltSecondaryTag.MOON_MINING_RATE).production((pb) => pb.steel(1));
        }),
      ),
    },
  }) {
    super(properties);
  }

  public tilesBuilt = [TileType.MOON_MINE];

  public discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4 + super.discount(player);
    }
    return super.discount(player);
  }

  public canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesForMine(player);

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
      return this.howToAffordReds.canAfford && player.titanium >= reserveUnits.titanium;
    }

    this.howToAffordReds = undefined;
    return super.canAct(player);
  }

  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    player.game.defer(new PlaceMoonMineTile(player));
    player.addProduction(Resources.STEEL, 1, {log: true});
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonMiningRateIncrease: 1});
  }
}

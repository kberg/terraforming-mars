import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {MoonCard} from './MoonCard';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Card} from '../Card';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class TychoRoadNetwork extends MoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.TYCHO_ROAD_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 15,
      productionBox: Units.of({megacredits: 1}),
      reserveUnits: Units.of({steel: 1}),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Spend 1 steel. Increase your M€ production 1 step. ' +
        'Place a road tile on the Moon and raise the Logistics Rate 1 step.',
        cardNumber: 'M09',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).br;
          b.production((eb) => eb.megacredits(1)).br;
          b.moonRoad().secondaryTag(AltSecondaryTag.MOON_LOGISTICS_RATE);
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_ROAD],
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    if (spaces.length === 0) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonRoadTile(player));
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1});
  }
}

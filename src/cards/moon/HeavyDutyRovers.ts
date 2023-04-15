import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {Resources} from '../../Resources';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';
import {IMoonData} from '../../moon/IMoonData';

export class HeavyDutyRovers extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HEAVY_DUTY_ROVERS,
      cost: 12,
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Gain 4 M€ for each mining tile adjacent to a road tile. Raise the Logistic Rate 1 step.',
        cardNumber: 'M39',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(4).slash().moonRoad({size: Size.SMALL}).any.moonMine({size: Size.SMALL}).any;
          b.br;
          b.moonLogisticsRate({size: Size.SMALL});
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!super.canPlay(player)) return false;

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
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const count = this.getminesNextToRoadsCount(player, moonData);
      player.addResource(Resources.MEGACREDITS, count * 4, {log: true});
      MoonExpansion.raiseLogisticRate(player);
    });
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    const count = this.getminesNextToRoadsCount(player, MoonExpansion.moonData(player.game));
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1, bonusMegaCredits: count * 4});
  }

  private getminesNextToRoadsCount(player: Player, moonData: IMoonData): number {
    const mines = MoonExpansion.tiles(player.game, TileType.MOON_MINE);
    const minesNextToRoads = mines.filter((mine) => {
      const spacesNextToMine = moonData.moon.getAdjacentSpaces(mine);
      const firstRoad = spacesNextToMine.find((s) => MoonExpansion.spaceHasType(s, TileType.MOON_ROAD));
      return firstRoad !== undefined;
    });

    return minesNextToRoads.length;
  }
}

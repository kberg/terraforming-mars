import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class OffWorldCityLiving extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.OFF_WORLD_CITY_LIVING,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.SPACE],
      cost: 35,
      tr: {moonColony: 1},

      metadata: {
        // Check the card for a clever icon.
        description: 'Increase your M€ production 1 step per city tile NOT ON MARS. Increase Colony Rate 1 step.',
        cardNumber: 'M53',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().city().any.secondaryTag(Tags.SPACE).br;
          b.moonColonyRate().br;
          b.vpText('1 VP for each 3 city tiles in play.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3, true),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

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
    const amount = player.game.getCitiesInPlay() - player.game.getCitiesInPlayOnMars();
    player.addProduction(Resources.MEGACREDITS, amount, {log: true});
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }

  public getVictoryPoints(player: Player) {
    const amount = player.game.getCitiesInPlay();
    return Math.floor(amount / 3);
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonColonyRateIncrease: 1});
  }
}

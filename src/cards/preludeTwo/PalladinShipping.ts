import {IActionCard} from '../ICard';
import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Size} from '../render/Size';
import {Units} from '../../Units';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {HowToAffordRedsPolicy, RedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {IProjectCard} from '../IProjectCard';

export class PalladinShipping extends Card implements IActionCard, CorporationCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.PALLADIN_SHIPPING,
      tags: [Tags.SPACE],
      startingMegaCredits: 36,

      metadata: {
        cardNumber: '??',
        description: 'You start with 36 M€. Gain 5 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(36).titanium(5).digit;
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('When you play a Space Event, gain 1 titanium.', (eb) => {
              eb.space().played.event().played.nbsp(Size.TINY).startEffect.titanium(1);
            });
            ce.action('Spend 2 titanium to raise temperature 1 step.', (eb) => {
              eb.titanium(2).startAction.temperature(1);
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.TITANIUM, 5);
    return undefined;
  }

  public canAct(player: Player): boolean {
    if (player.titanium < 2) return false;

    const temperatureMaxed = player.game.getTemperature() === MAX_TEMPERATURE;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    const trGain = this.getTotalTRGain(player);
    Card.setRedsActionWarningText(player, trGain, this, redsAreRuling, 'raise temperature');

    if (temperatureMaxed) {
      Card.setUselessActionWarningText(this, 'temperature is already maxed');
      return true;
    }

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public action(player: Player) {
    player.deductResource(Resources.TITANIUM, 2);
    player.game.increaseTemperature(player, 1);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    const corpOwner = player.game.getCardPlayer(this.name);

    if (card.cardType === CardType.EVENT && card.tags.includes(Tags.SPACE) && player.id === corpOwner.id) {
      corpOwner.addResource(Resources.TITANIUM, 1, {log: true});
    }
  }

  private getTotalTRGain(player: Player): number {
    const temperature = player.game.getTemperature();
    let trGain = temperature === MAX_TEMPERATURE ? 0 : 1;
    if (temperature === -2) trGain += 1;

    return trGain;
  }

  public getActionDetails() {
    return new ActionDetails({temperatureIncrease: 1});
  }
}

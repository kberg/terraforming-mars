import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Resources} from '../../Resources';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {Units} from '../../Units';

export class BigAsteroid extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BIG_ASTEROID,
      tags: [Tags.SPACE],
      cost: 27,
      tr: {temperature: 2},

      metadata: {
        description: 'Raise temperature 2 steps and gain 4 titanium. Remove up to 4 Plants from any player.',
        cardNumber: '011',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.titanium(4).br;
          b.minus().plants(-4).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    } else {
      return true;
    }
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 2);
    player.game.defer(new RemoveAnyPlants(player, 4));
    player.addResource(Resources.TITANIUM, 4);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, temperatureIncrease: 2});
  }
}

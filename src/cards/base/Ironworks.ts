import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';
import {Resources} from '../../Resources';

export class Ironworks extends Card implements IActionCard, IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.IRONWORKS,
      tags: [Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '101',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 1 steel and raise oxygen 1 step.', (eb) => {
            eb.energy(4).digit.startAction.steel(1).oxygen(1);
          });
        }),
      },
    });
  }

  public play(_player: Player) {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const hasEnoughEnergy = player.energy >= 4;
    const oxygenMaxed = player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    let trGain = oxygenMaxed ? 0 : 1;
    if (player.game.getOxygenLevel() === 7) trGain += 1;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsActionWarningText(trGain, this, redsAreRuling);

    if (!hasEnoughEnergy) return false;
    if (oxygenMaxed) return true;

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
    player.energy -= 4;
    player.addResource(Resources.STEEL, 1);
    return player.game.increaseOxygenLevel(player, 1);
  }

  public getActionDetails() {
    return new ActionDetails({oxygenIncrease: 1});
  }
}

import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class WaterSplittingPlant extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_SPLITTING_PLANT,
      tags: [Tags.BUILDING],
      cost: 12,

      requirements: CardRequirements.builder((b) => b.oceans(2)),
      metadata: {
        cardNumber: '177',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 Energy to raise oxygen 1 step.', (eb) => {
            eb.energy(3).startAction.oxygen(1);
          });
        }),
        description: 'Requires 2 ocean tiles.',
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const hasEnoughEnergy = player.energy >= 3;
    const oxygenMaxed = player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    let trGain = oxygenMaxed ? 0 : 1;
    if (player.game.getOxygenLevel() === 7) trGain += 1;
    if (player.game.getTemperature() === -2) trGain += 1;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsActionWarningText(player, trGain, this, redsAreRuling);

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
    // This line is needed if the action places or could potentially place a tile
    if (this.howToAffordReds !== undefined) player.howToAffordReds = this.howToAffordReds;

    player.energy -= 3;
    return player.game.increaseOxygenLevel(player, 1);
  }

  public getActionDetails() {
    return new ActionDetails({oxygenIncrease: 1});
  }
}

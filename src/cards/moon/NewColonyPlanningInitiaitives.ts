import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class NewColonyPlanningInitiaitives extends Card {
  constructor() {
    super({
      name: CardName.NEW_COLONY_PLANNING_INITIAITIVES,
      cardType: CardType.AUTOMATED,
      cost: 6,
      tr: {moonColony: 1},

      requirements: CardRequirements.builder((b) => b.colonyRate(2)),
      metadata: {
        description: 'Requires Colony Rate to be 2 or higher. Raise the Colony Rate 1 step.',
        cardNumber: 'M31',
        renderData: CardRenderer.builder((b) => {
          b.moonColonyRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    return true;
  }

  public play(player: Player) {
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}

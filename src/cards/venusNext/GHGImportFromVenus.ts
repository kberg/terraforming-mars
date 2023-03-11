import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class GHGImportFromVenus extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.GHG_IMPORT_FROM_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE, Tags.VENUS],
      cost: 23,
      tr: {venus: 1},

      metadata: {
        description: 'Raise Venus 1 step. Increase your heat production 3 steps.',
        cardNumber: '228',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).production((pb) => {
            pb.heat(3);
          });
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

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
    player.addProduction(Resources.HEAT, 3);
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 1});
  }
}

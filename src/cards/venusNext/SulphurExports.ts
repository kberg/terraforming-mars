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

export class SulphurExports extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.SULPHUR_EXPORTS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.SPACE],
      cost: 21,
      tr: {venus: 1},

      metadata: {
        cardNumber: '250',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.megacredits(1).slash().venus(1).played);
        }),
        description: 'Increase Venus 1 step. Increase your M€ production 1 step for each Venus tag you have, including this.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.VENUS) + 1, {log: true});
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 1, megaCreditsProduction: player.getTagCount(Tags.VENUS) + 1});
  }
}

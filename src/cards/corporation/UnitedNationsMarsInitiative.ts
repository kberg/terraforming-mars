import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class UnitedNationsMarsInitiative extends Card implements IActionCard, CorporationCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      tags: [Tags.EARTH],
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'R32',
        description: 'You start with 40 M€.',
        renderData: CardRenderer.builder((b) => {
          // TODO(chosta): find a not so hacky solutions to spacing
          b.br.br.br;
          b.empty().nbsp().nbsp().nbsp().nbsp().megacredits(40);
          b.corpBox('action', (ce) => {
            ce.action('If your Terraform Rating was raised this generation, you may pay 3 M€ to raise it 1 step more.', (eb) => {
              eb.megacredits(3).startAction.tr(1).asterix();
            });
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const hasIncreasedTR = player.hasIncreasedTerraformRatingThisGeneration;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    const actionCost = 3;

    if (!hasIncreasedTR) return false;
    Card.setRedsActionWarningText(1, this, redsAreRuling);

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return player.canAfford(actionCost);
  }

  public action(player: Player) {
    player.payMegacreditsDeferred(
      3,
      'Select how to pay for UNMI action.',
      () => player.increaseTerraformRatingSteps(1),
    );
    return undefined;
  }

  public getActionDetails() {
    return new ActionDetails({cost: 3, TRIncrease: 1});
  }
}

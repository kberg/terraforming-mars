import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class ImportedNitrogen extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_NITROGEN,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 23,
      tr: {tr: 1},

      metadata: {
        cardNumber: '163',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plants(4).digit;
          b.microbes(3).digit.asterix().nbsp();
          b.animals(2).digit.asterix();
        }),
        description: 'Raise your TR 1 step and gain 4 Plants. Add 3 Microbes to ANOTHER card and 2 Animals to ANOTHER card.',
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

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    player.plants += 4;
    player.increaseTerraformRatingSteps(1);
    player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 3}));
    player.game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {count: 2}));
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, TRIncrease: 1});
  }
}

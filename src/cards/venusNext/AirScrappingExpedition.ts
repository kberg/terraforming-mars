import {ICard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class AirScrappingExpedition extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_EXPEDITION,
      cardType: CardType.EVENT,
      tags: [Tags.VENUS],
      cost: 13,
      tr: {venus: 1},

      metadata: {
        cardNumber: '215',
        description: 'Raise Venus 1 step. Add 3 Floaters to ANY Venus CARD.',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).floaters(3).secondaryTag(Tags.VENUS);
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    let floaterCards = player.getResourceCards(ResourceType.FLOATER);
    floaterCards = floaterCards.filter((card) => card.tags.some((cardTag) => cardTag === Tags.VENUS));

    if (floaterCards.length === 0) return undefined;

    if (floaterCards.length === 1) {
      player.addResourceTo(floaterCards[0], {qty: 3, log: true});
      return undefined;
    }

    return new SelectCard('Select card to add 3 floaters', 'Add floaters', floaterCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {qty: 3, log: true});
      return undefined;
    });
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 1});
  }
}

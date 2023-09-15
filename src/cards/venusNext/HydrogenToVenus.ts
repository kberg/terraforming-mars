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

export class HydrogenToVenus extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.HYDROGEN_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 11,
      tr: {venus: 1},

      metadata: {
        cardNumber: '231',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // double br is intentional for visual appeal
          b.floaters(1).secondaryTag(Tags.VENUS).slash().jovian().played;
        }),
        description: 'Raise Venus 1 step. Add 1 Floater to A Venus CARD for each Jovian tag you have.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    this.howToAffordReds = undefined;
    return true;
  }

  public play(player: Player) {
    const jovianTags: number = player.getTagCount(Tags.JOVIAN);
    const floatersCards = player.getResourceCards(ResourceType.FLOATER).filter((card) => card.tags.includes(Tags.VENUS));
    if (jovianTags > 0) {
      if (floatersCards.length === 1) {
        player.addResourceTo(floatersCards[0], {qty: jovianTags, log: true});
      }
      if (floatersCards.length > 1) {
        return new SelectCard(
          'Select card to add ' + jovianTags + ' floater(s)',
          'Add floater(s)',
          floatersCards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], {qty: jovianTags, log: true});
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        );
      }
    }
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 1});
  }
}

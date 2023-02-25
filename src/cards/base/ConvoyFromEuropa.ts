import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class ConvoyFromEuropa extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CONVOY_FROM_EUROPA,
      tags: [Tags.SPACE],
      cost: 15,
      tr: {oceans: 1},

      metadata: {
        cardNumber: '161',
        description: 'Place 1 ocean tile and draw 1 card.',
        renderData: CardRenderer.builder((b) => b.oceans(1).cards(1)),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsWarningText(trGain, this);

    if (trGain === 0) return true;

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    } else {
      return true;
    }
  }

  public play(player: Player) {
    player.drawCard();
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, oceansToPlace: 1});
  }
}

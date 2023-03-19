import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class IceMoonColony extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cost: 23,
      tags: [Tags.SPACE],
      name: CardName.ICE_MOON_COLONY,
      cardType: CardType.AUTOMATED,
      tr: {oceans: 1},

      metadata: {
        cardNumber: 'C15',
        renderData: CardRenderer.builder((b) => b.colonies(1).oceans(1)),
        description: 'Place 1 colony and 1 ocean tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    // TODO: Could lose an additional 3 M€ if building on Europa / Iapetus
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    const canBuildColony = player.hasAvailableColonyTileToBuildOn();
    if (!canBuildColony) return false;

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
    player.game.defer(new BuildColony(player, false, 'Select colony for Ice Moon Colony'));
    player.game.defer(new PlaceOceanTile(player, 'Select ocean for Ice Moon Colony'));
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, oceansToPlace: 1});
  }
}

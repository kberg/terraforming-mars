import {IActionCard, ICard} from './../ICard';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {Card} from '../Card';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class MoholeLake extends Card implements IActionCard, IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MOHOLE_LAKE,
      tags: [Tags.BUILDING],
      cost: 31,
      tr: {temperature: 1, oceans: 1},

      metadata: {
        cardNumber: 'X27',
        renderData: CardRenderer.builder((b) => {
          b.action('Add a microbe or animal to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(1).asterix();
            eb.nbsp().or().nbsp().animals(1).asterix();
          }).br;
          b.plants(3).temperature(1).oceans(1);
        }),
        description: 'Gain 3 plants. Raise temperature 1 step, and place 1 ocean tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);
    
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    player.game.defer(new PlaceOceanTile(player));
    player.plants += 3;
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const availableCards = player.getResourceCards(ResourceType.MICROBE).concat(player.getResourceCards(ResourceType.ANIMAL));

    if (availableCards.length === 0) {
      return undefined;
    }

    if (availableCards.length === 1) {
      player.addResourceTo(availableCards[0], {log: true});
      return undefined;
    }

    return new SelectCard('Select card to add microbe or animal', 'Add resource', availableCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {log: true});
      return undefined;
    });
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, temperatureIncrease: 1, oceansToPlace: 1});
  }
}

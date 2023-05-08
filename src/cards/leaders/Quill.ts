import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {DeferredAction, Priority} from '../../deferredActions/DeferredAction';
import {Resources} from '../../Resources';

export class Quill extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.QUILL,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L17',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.cards(1).secondaryTag(AltSecondaryTag.FLOATER).colon().floaters(2).megacredits(1).asterix();
          b.br;
        }),
        description: 'Once per game, add 2 floaters to each of your cards that collect floaters, then add 2 floaters to ANY card. Gain 1 M€ for each floater added this way.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const resourceCards = player.getResourceCards(ResourceType.FLOATER);
    resourceCards.forEach((card) => player.addResourceTo(card, {qty: 2, log: true}));

    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));

    player.game.defer(new DeferredAction(player,() => {
      player.addResource(Resources.MEGACREDITS, (resourceCards.length + 1) * 2, {log: true});
      return undefined;
    }), Priority.GAIN_RESOURCE_OR_PRODUCTION);

    this.isDisabled = true;
    return undefined;
  }
}

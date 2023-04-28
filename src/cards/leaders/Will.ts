import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ResourceType} from '../../ResourceType';

export class Will extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.WILL,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L23',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('GAIN BELOW RESOURCES').br;
          b.animals(1).animals(1).microbes(1).microbes(1).br;
          b.floaters(1).floaters(1).wild(1).wild(1);
          b.br;
        }),
        description: 'Once per game, add 2 animals to ANOTHER card, 2 microbes to ANOTHER card, 2 floaters to ANOTHER card, and 2 resources to ANY card.',
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
    player.game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {count: 2}));
    player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 2}));
    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
    player.game.defer(new AddResourcesToCard(player, undefined, {count: 2}));

    this.isDisabled = true;
    return undefined;
  }
}

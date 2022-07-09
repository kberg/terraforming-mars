import {CardName} from '../../CardName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Tags} from '../Tags';

export class TempestConsultancy extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.TEMPEST_CONSULTANCY,
      tags: [Tags.MOON],
      startingMegaCredits: 37,
      initialActionText: 'Place 2 delegates in one party',

      metadata: {
        description: 'You start with 37 M€. As your first action, place 2 delegates in one party.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(37).delegates(2);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('When your delegate becomes the chairman, increase your TR 1 step.', (eb) => {
              eb.chairman().startEffect.tr(1, Size.SMALL);
            });
            ce.vSpace(Size.SMALL);
            ce.action('Place 1 delegate in any party for every 5 moon tags you have [max 3.]', (eb) => {
              eb.empty().startAction.delegates(1).slash(Size.LARGE).text('5').nbsp.moon(1).nbsp.asterix();
            });
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    const title = 'Tempest Consultancy first action - Select where to send two delegates';
    player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'reserve'}));

    return undefined;
  }

  public canAct(player: Player) {
    return player.getTagCount(Tags.MOON) >= 5;
  }

  public action(player: Player) {
    let count = Math.floor(player.getTagCount(Tags.MOON) / 5);
    count = Math.min(count, 3);
    player.game.defer(new SendDelegateToArea(
      player,
      `Select a party to send ${count} delegate(s) to`,
      {count: count, source: 'reserve'}));

    return undefined;
  };
}

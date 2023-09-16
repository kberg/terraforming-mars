import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Size} from '../render/Size';
import {ResourceType} from '../../ResourceType';

export class KuiperCooperative extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.KUIPER_COOPERATIVE,
      tags: [Tags.SPACE, Tags.SPACE],
      startingMegaCredits: 33,
      resourceType: ResourceType.ASTEROID,

      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(33).production((pb) => pb.titanium(1));
          b.text('(You start with 1 titanium production and 33 M€.)', Size.TINY, false, false);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Add 1 asteroid here for every Space tag you have.', (eb) => {
              eb.empty().startAction.asteroids(1).slash().space().played;
            });
            ce.vSpace(Size.SMALL);
            ce.effect('When you use the ASTEROID or AQUIFER standard projects, asteroids here may be used as 1 M€ each.', (eb) => {
              eb.plate('Standard projects', Size.SMALL).asterix().startEffect.asteroids(1).equals().megacredits(1);
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public resourceCount = 0;

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    const spaceTagCount = player.getTagCount(Tags.SPACE);
    player.addResourceTo(this, {qty: spaceTagCount, log: true});
    return undefined;
  }
}

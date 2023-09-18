import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainProduction} from '../../deferredActions/GainProduction';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class LakefrontResorts extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LAKEFRONT_RESORTS,
      tags: [Tags.BUILDING],
      startingMegaCredits: 54,

      metadata: {
        cardNumber: 'R38',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(54);
          b.text('(You start with 54 M€.)', Size.TINY, false, false);

          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.oceans(1, Size.SMALL).any.startEffect.production((pb) => pb.megacredits(1));
            });
            ce.vSpace(Size.SMALL);
            ce.effect('When any ocean tile is placed, increase your M€ production 1 step. Your bonus for placing adjacent to oceans is 3 M€ instead of 2 M€.', (eb) => {
              eb.emptyTile('normal', Size.SMALL).oceans(1, Size.SMALL);
              eb.startEffect.megacredits(3);
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.oceanBonus = 3;
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (space.tile?.tileType === TileType.OCEAN) {
      cardOwner.game.defer(
        new GainProduction(cardOwner, Resources.MEGACREDITS),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }
}

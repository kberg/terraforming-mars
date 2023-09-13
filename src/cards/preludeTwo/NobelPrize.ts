import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tags} from '../Tags';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Size} from '../render/Size';

export class NobelPrize extends PreludeCard {
  constructor() {
    super({
      name: CardName.NOBEL_PRIZE,
      tags: [Tags.WILDCARD],
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2);
          b.cards(1).secondaryTag(AltSecondaryTag.REQ).nbsp(Size.TINY);
          b.cards(1).secondaryTag(AltSecondaryTag.REQ);
        }),
        description: 'Gain 2 M€. Draw 2 cards with requirements.',
        victoryPoints: 2,
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, 2);

    player.drawCard(2, {
      include: (card) => card.requirements !== undefined,
    });

    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
}


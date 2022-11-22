import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class ConvoyFromEuropa extends Card implements IProjectCard {
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
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    return true;
  }

  public play(player: Player) {
    player.drawCard();
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}

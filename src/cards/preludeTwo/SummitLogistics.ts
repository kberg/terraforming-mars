import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Size} from '../render/Size';
import {Tags} from '../Tags';

export class SummitLogistics extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SUMMIT_LOGISTICS,
      tags: [Tags.BUILDING, Tags.SPACE],
      cost: 10,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),
      metadata: {
        cardNumber: '??',
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. Gain 1 M€ per planet tag and colony you have. Draw 2 cards.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().jovian(true).played.earth(1, true).played.venus(1, Size.MEDIUM, true).played.nbsp(Size.SMALL).plus(Size.SMALL).colonies(1, Size.SMALL);
          b.br.br;
          b.cards(2);
        }),
      },
    });
  }

  public play(player: Player) {
    const planetTagsCount = player.getTagCount(Tags.JOVIAN) + player.getTagCount(Tags.EARTH) + player.getTagCount(Tags.VENUS);
    const coloniesCount = player.getColoniesCount();

    player.addResource(Resources.MEGACREDITS, planetTagsCount + coloniesCount, {log: true});
    player.drawCard(2);

    return undefined;
  }
}

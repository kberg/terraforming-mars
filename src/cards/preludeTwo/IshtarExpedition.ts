import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../Tags';

export class IshtarExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      tags: [Tags.VENUS],
      name: CardName.ISHTAR_EXPEDITION,
      cost: 6,
      requirements: CardRequirements.builder((b) => b.venus(10)),

      metadata: {
        cardNumber: '??',
        description: 'Requires Venus 10%. Gain 3 titanium and draw 2 Venus cards.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.titanium(3);
          b.nbsp().cards(2).secondaryTag(Tags.VENUS);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.TITANIUM, 3);
    player.drawCard(2, {tag: Tags.VENUS});

    return undefined;
  }
}

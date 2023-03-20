import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {IProjectCard} from '../IProjectCard';
import {IMoonData} from '../../moon/IMoonData';
import {Size} from '../render/Size';

export class Neil extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.NEIL,
      cardType: CardType.LEADER,
      tags: [Tags.MOON],
      metadata: {
        cardNumber: 'L34',
        renderData: CardRenderer.builder((b) => {
          b.moon(1).played.any.colon().megacredits(1);
          b.br.br;
          b.opgArrow().production((pb) => pb.megacredits(1000)).nbsp(Size.SMALL).asterix();
        }),
        description: 'Gain 1 M€ when any player plays a Moon tag, including this. Once per game, increase your M€ production by the value of the LOWEST Moon rate.',
      },
    });
  }

  public isDisabled = false;

  public play(player: Player) {
    player.megaCredits += 1;
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    const moonTagCount = card.tags.filter((tag) => tag === Tags.MOON).length;

    if (moonTagCount > 0) {
      player.game.getCardPlayer(this.name).addResource(Resources.MEGACREDITS, moonTagCount, {log: true});
    }
  }

  public canAct(): boolean {
   return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const moonData = game.moonData as IMoonData;
    const lowestRate = Math.min(moonData.colonyRate, moonData.logisticRate, moonData.miningRate);

    if (lowestRate > 0) {
      player.addProduction(Resources.MEGACREDITS, lowestRate, {log: true});
    }

    this.isDisabled = true;
    return undefined;
  }
}

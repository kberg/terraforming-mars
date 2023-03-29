import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Size} from '../render/Size';

export class Darwin extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.DARWIN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L39',
        renderData: CardRenderer.builder((b) => {
          b.greyPlate('Dominant party change').nbsp(Size.SMALL).colon().megacredits(2);
          b.br.br;
          b.opgArrow().plus().influence(2).asterix();
          b.br;
        }),
        description: 'Gain 2 M€ whenever the dominant party changes. Once per game, gain 2 influence for THIS GENERATION only.',
      },
    });
  }

  public isDisabled = false;
  public opgActionIsActive = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
   return this.isDisabled === false;
  }

  public action(): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    return undefined;
  }

  public static onDominantPartyChange(game: Game): void {
    game.getPlayers()
      .filter((player) => player.cardIsInEffect(CardName.DARWIN))
      .forEach((player) => player.addResource(Resources.MEGACREDITS, 2, {log: true}));
  }
}

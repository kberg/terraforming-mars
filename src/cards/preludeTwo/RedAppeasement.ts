import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';

export class RedAppeasement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.RED_APPEASEMENT,
      cost: 1,
      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),

      metadata: {
        cardNumber: '??',
        description: 'Requires that Reds are ruling or that you have 2 delegates there, AND THAT NO OTHER PLAYER HAS PASSED. Increase your M€ production 2 steps. This counts as passing, you get no more turns this generation.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp().text('PASS').asterix();
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const passedPlayers = player.game.getPassedPlayers();
    return super.canPlay(player) && passedPlayers.length === 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.pass();

    return undefined;
  }
}

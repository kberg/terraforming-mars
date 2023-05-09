import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Turmoil} from '../../turmoil/Turmoil';
import {PartyName} from '../../turmoil/parties/PartyName';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {Resources} from '../../Resources';
import {Size} from '../render/Size';

export class Zan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.ZAN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L26',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.redsInactive().nbsp(Size.SMALL).asterix();
          b.br.br;
          b.opgArrow().text('ALL', Size.SMALL).delegates(1).colon().reds().megacredits(1);
        }),
        description: 'You are immune to Reds\' ruling policy. Once per game, place ALL your delegates in Reds. Gain 1 M€ for each delegate placed this way.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
   return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const reserveDelegates = turmoil.delegateReserve.filter((d) => d === player.id).length;
    const totalMegacreditsGained = turmoil.lobby.has(player.id) ? reserveDelegates + 1 : reserveDelegates;

    for (let i = 0; i < reserveDelegates; i++) {
      game.defer(new DeferredAction(player, () => {
        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
        player.totalDelegatesPlaced++;
        return undefined;
      }));
    }

    if (turmoil.lobby.has(player.id)) {
      game.defer(new DeferredAction(player, () => {
        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'lobby');
        player.totalDelegatesPlaced++;
        return undefined;
      }));
    }

    player.addResource(Resources.MEGACREDITS, totalMegacreditsGained, {log: true});
    this.isDisabled = true;
    return undefined;
  }
}

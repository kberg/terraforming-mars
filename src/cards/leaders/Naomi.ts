import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {MAX_COLONY_TRACK_POSITION} from '../../constants';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class Naomi extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.NAOMI,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L14',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.colonies(1).colon().energy(2);
          b.br.br.br;
          b.opgArrow().text('SET ALL').colonies(1).asterix();
        }),
        description: 'When you build a colony, gain 2 energy. Once per game, move each colony tile track marker to either its highest or lowest value.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    if (player.game.gameOptions.coloniesExtension === false) return false;

    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
    return openColonies.length > 0 && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const openColonies = game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);

    openColonies.forEach((colony) => {
      game.defer(new DeferredAction(player, () => new OrOptions(
        new SelectOption('Increase ' + colony.name + ' track to its highest value', 'Select', () => {
          colony.trackPosition = MAX_COLONY_TRACK_POSITION;
          return undefined;
        }),
        new SelectOption('Decrease ' + colony.name + ' track to its lowest value', 'Select', () => {
          colony.trackPosition = colony.colonies.length;
          return undefined;
        }),
      )));
    });

    game.defer(new DeferredAction(player, () => {
      this.isDisabled = true;
      return undefined;
    }));

    return undefined;
  }
}

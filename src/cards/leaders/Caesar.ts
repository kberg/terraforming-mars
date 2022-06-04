import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PlaceHazardTile} from '../../deferredActions/PlaceHazardTile';
import {Resources} from '../../Resources';
import {Size} from '../render/Size';

export class Caesar extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.CAESAR,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L33',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().colon().text('X').hazardTile(1, {size: Size.LARGE}).megacredits(2).multiplier.asterix();
          b.br;
        }),
        description: 'Once per game, place X hazard tiles. Do not trigger any adjacency effects or collect any tile placement bonuses. Gain 2X M€.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const game = player.game;
    return this.isDisabled === false && game.board.getAvailableSpacesOnLand(player).length >= game.generation;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const title = 'Select space for hazard tile';

    for (let i = 0; i < game.generation; i++) {
      const availableSpaces = game.board.getAvailableSpacesOnLand(player);
      game.defer(new PlaceHazardTile(player, game, title, availableSpaces));
    }

    player.addResource(Resources.MEGACREDITS, game.generation * 2, {log: true});
    this.isDisabled = true;
    return undefined;
  }
}

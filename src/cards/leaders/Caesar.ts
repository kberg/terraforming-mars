import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PlaceHazardTile} from '../../deferredActions/PlaceHazardTile';
import {Size} from '../render/Size';
import {SelectProductionToLoseDeferred} from '../../deferredActions/SelectProductionToLoseDeferred';
import {HAZARD_TILES} from '../../TileType';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class Caesar extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.CAESAR,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L33',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().colon().text('X').hazardTile(1, {size: Size.LARGE}).nbsp();
          b.minus().production((pb) => pb.wild(1).any).asterix();
          b.br;
        }),
        description: 'Once per game, place X hazard tiles equal to the current generation number. Each opponent loses units of production equal to half the number of hazard tiles in play, rounded up.',
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

    const otherPlayers = game.getPlayers().filter((p) => p.id !== player.id);

    game.defer(new DeferredAction(player, () => {
      const hazardTileCount = game.board.spaces.filter((space) => space.tile && HAZARD_TILES.has(space.tile.tileType)).length;

      otherPlayers.forEach((player) => {
        game.defer(new SelectProductionToLoseDeferred(player, Math.ceil(hazardTileCount / 2)));
      });

      return undefined;
    }));

    this.isDisabled = true;
    return undefined;
  }
}

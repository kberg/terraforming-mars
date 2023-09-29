import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {isHazardTileType} from '../../../common/AresTileType';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('oof, lots to draw');
  // b.vSpace(Size.MEDIUM).br.text('9').diverseTag(1).influence({size: Size.SMALL}).colon().megacredits(10);
});

export class SeismicPredictions extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SEISMIC_PREDICTIONS,
      description: 'Discard all unclaimed underground resources. ' +
      'Lose 2 MC for each tile on Mars you own WITHOUT excavation markers (max 5) minus influence.' +
        'Each point of incluence reduce the damage by 2 MC. ' +
        'Each player with 6 or fewer cards in hand draws 2 cards.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    UnderworldExpansion.removeAllUnclaimedMarkers(game);

    game.getPlayersInGenerationOrder().forEach((player) => {
      const playerSpaces = player.game.board.spaces.filter((space) => {
        return space.player === player && space.tile !== undefined && !isHazardTileType(space.tile?.tileType);
      });
      const filtered = playerSpaces.filter(
        (space) => space.undergroundResources !== undefined && space.excavator === undefined);
      const penalty = Math.min(5, filtered.length) - turmoil.getPlayerInfluence(player);
      const cost = penalty * 2;
      if (cost > 0) {
        player.stock.deduct(Resource.MEGACREDITS, cost, {log: true, from: this.name});
      }
    });
  }
}

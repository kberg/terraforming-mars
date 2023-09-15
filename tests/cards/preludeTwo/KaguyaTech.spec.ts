import {expect} from 'chai';
import {KaguyaTech} from '../../../src/cards/preludeTwo/KaguyaTech';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/TileType';

describe('KaguyaTech', function() {
  let card : KaguyaTech; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new KaguyaTech();
    
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('canPlay', function() {
    expect(card.canPlay(player)).is.false;

    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);
    expect(card.canPlay(player)).is.true;
  });

  it('Play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);

    const selectSpace = card.play(player) as SelectSpace;
    const space = selectSpace.availableSpaces[0];
    selectSpace.cb(space);
    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.player).eq(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
    expect(player.cardsInHand).has.length(1);
  });
});

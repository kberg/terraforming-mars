import {expect} from 'chai';
import {AquiferTurbines} from '../../../src/server/cards/prelude/AquiferTurbines';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('AquiferTurbines', function() {
  let card: AquiferTurbines;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AquiferTurbines();
    [game, player] = testGame(1);
  });

  it('Can not play', function() {
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.false;
  });

  it('Can play', function() {
    player.megaCredits = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    player.megaCredits = 3;
    card.play(player);

    // PlaceOceanTile
    game.deferredActions.pop();

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.production.energy).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });
});

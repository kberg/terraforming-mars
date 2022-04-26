import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {LavaFlows} from '../../../src/cards/base/LavaFlows';
import {Vitor} from '../../../src/cards/prelude/Vitor';
import {OutdoorSports} from '../../../src/cards/promo/OutdoorSports';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Vitor', function() {
  let card : Vitor; let player : Player; let game : Game;

  beforeEach(() => {
    card = new Vitor();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).eq(0);
  });

  it('Has initial action', function() {
    const action = card.initialAction(player);
    expect(action).instanceOf(OrOptions);
    (action as OrOptions).options[0].cb();
    expect(game.hasBeenFunded(game.awards[0])).is.true;
  });

  it('No initial action for solo games', function() {
    Game.newInstance('foobar', [player], player);
    const action = card.initialAction(player);
    expect(action).is.undefined;
  });

  it('Give mega credits when card played', function() {
    player.corporationCard = card;

    card.onCardPlayed(player, new Ants());
    expect(player.megaCredits).eq(3);

    card.onCardPlayed(player, new LavaFlows());
    expect(player.megaCredits).eq(3);

    card.onCardPlayed(player, new OutdoorSports());
    expect(player.megaCredits).eq(6);
  });
});

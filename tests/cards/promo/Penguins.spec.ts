import {expect} from 'chai';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {Game} from '../../../src/server/Game';
import {maxOutOceans, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Penguins', function() {
  let card: Penguins;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Penguins();
    [game, player] = testGame(1);
  });

  it('Cannot play', function() {
    maxOutOceans(player, 7);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 8);
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    card.action(player);
    runAllActions(game);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});

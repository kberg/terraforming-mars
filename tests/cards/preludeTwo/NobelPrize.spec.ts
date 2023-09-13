import {expect} from 'chai';
import {NobelPrize} from '../../../src/cards/preludeTwo/NobelPrize';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';

describe('NobelPrize', function() {
  let card : NobelPrize; let player : Player

  beforeEach(() => {
    card = new NobelPrize();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.megaCredits).eq(2);
    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand.every((card) => card.requirements !== undefined));
  });

  it('Victory points', function() {
    expect(card.getVictoryPoints()).eq(2);
  });
});

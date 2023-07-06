import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Misinformation1} from '../../../src/cards/community/misinformation/Misinformation1';

describe('Misinformation', function() {
  let card : Misinformation1; let player : Player;

  beforeEach(() => {
    card = new Misinformation1();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play();
    expect(player.megaCredits).to.eq(0);
  });
});

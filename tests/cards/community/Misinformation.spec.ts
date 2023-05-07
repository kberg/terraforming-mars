import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Misinformation} from '../../../src/cards/community/Misinformation';

describe('Misinformation', function() {
  let card : Misinformation; let player : Player;

  beforeEach(() => {
    card = new Misinformation();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Cannot play', function() {
    expect(card.canPlay()).is.false;
  });
});

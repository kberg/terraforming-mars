import {expect} from 'chai';
import {MartianSurvey} from '../../../src/cards/prelude/MartianSurvey';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('MartianSurvey', function() {
  let card : MartianSurvey; let player : Player; let game : Game;

  beforeEach(() => {
    card = new MartianSurvey();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Cannot play', () => {
    game.setOxygenLevel(5);
    expect(card.canPlay(player)).is.false;
  });
  it('Can play', () => {
    game.setOxygenLevel(4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(card.getVictoryPoints()).eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});

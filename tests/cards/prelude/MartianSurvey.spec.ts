import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {MartianSurvey} from '../../../src/server/cards/prelude/MartianSurvey';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MartianSurvey', function() {
  let card: MartianSurvey;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MartianSurvey();
    [game, player] = testGame(1);
  });

  it('Cannot play', () => {
    setOxygenLevel(game, 5);
    expect(player.simpleCanPlay(card)).is.not.true;
  });
  it('Can play', () => {
    setOxygenLevel(game, 4);
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should play', () => {
    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);

    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});

import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {TransNeptuneProbe} from '../../../src/cards/base/TransNeptuneProbe';
import {HeadStart} from '../../../src/cards/promo/HeadStart';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('HeadStart', function() {
  let card : HeadStart; let player : Player; let game : Game;

  beforeEach(() => {
    card = new HeadStart();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('foobar', [player], player, gameOptions);
  });

  it('Play', function() {
    player.cardsInHand.push(new TransNeptuneProbe(), new Research());

    card.play(player);
    expect(player.megaCredits).to.eq(4);
    expect(player.steel).to.eq(2);
    expect(game.deferredActions).has.length(2);

    game.deferredActions.runAll(() => {});
    expect(game.activePlayer).to.eq(player.id);
  });
});

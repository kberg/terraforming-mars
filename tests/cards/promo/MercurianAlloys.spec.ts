import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {MercurianAlloys} from '../../../src/server/cards/promo/MercurianAlloys';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MercurianAlloys', function() {
  let card: MercurianAlloys;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MercurianAlloys();
    [, player] = testGame(1);
  });

  it('Can not play if not enough science tags available', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.getTitaniumValue()).to.eq(4);
  });
});

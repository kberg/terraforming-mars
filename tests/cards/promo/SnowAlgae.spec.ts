import {expect} from 'chai';
import {SnowAlgae} from '../../../src/server/cards/promo/SnowAlgae';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SnowAlgae', function() {
  let card: SnowAlgae;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SnowAlgae();
    [, player] = testGame(1);
  });

  it('Can not play', function() {
    maxOutOceans(player, 1);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 2);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });
});

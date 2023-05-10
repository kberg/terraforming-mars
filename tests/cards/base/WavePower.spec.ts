import {expect} from 'chai';
import {WavePower} from '../../../src/server/cards/base/WavePower';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans} from '../../TestingUtils';

describe('WavePower', function() {
  let card: WavePower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new WavePower();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    maxOutOceans(player, 2);
    expect(player.canPlay(card, {testAffordability: false})).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    expect(player.canPlay(card, {testAffordability: false})).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});

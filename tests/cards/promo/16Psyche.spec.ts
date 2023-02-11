import {expect} from 'chai';
import {SixteenPsyche} from '../../../src/cards/promo/16Psyche';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('16Psyche', function() {
  let card : SixteenPsyche; let player : Player;

  beforeEach(() => {
    card = new SixteenPsyche();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Play', function() {
    card.play(player);
    expect(player.titanium).eq(3);
    expect(player.getProduction(Resources.TITANIUM)).eq(2);
  });
});

import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {EarthOffice} from '../../../src/cards/base/EarthOffice';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('EarthOffice', function() {
  let card : EarthOffice; let player : Player;

  beforeEach(() => {
    card = new EarthOffice();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should play', function() {
    expect(card.getCardDiscount(player, card)).eq(3);
    expect(card.getCardDiscount(player, new Birds())).eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, new LunaGovernor())).eq(6);
  });
});


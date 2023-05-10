import {expect} from 'chai';
import {FuelFactory} from '../../../src/server/cards/base/FuelFactory';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('FuelFactory', function() {
  let card: FuelFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FuelFactory();
    [/* skipped */, player] = testGame(1);
  });

  it('Can not play', function() {
    expect(player.canPlay(card, {testAffordability: false})).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(player.canPlay(card, {testAffordability: false})).is.true;
    card.play(player);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
    expect(player.production.titanium).to.eq(1);
  });
});

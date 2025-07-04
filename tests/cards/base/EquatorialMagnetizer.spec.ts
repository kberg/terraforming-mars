import {expect} from 'chai';
import {EquatorialMagnetizer} from '../../../src/server/cards/base/EquatorialMagnetizer';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('EquatorialMagnetizer', () => {
  let card: EquatorialMagnetizer;
  let player: TestPlayer;

  beforeEach(() => {
    card = new EquatorialMagnetizer();
    [/* game */, player] = testGame(2);
  });

  it('Can not act', () => {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.production.energy).to.eq(0);
    expect(player.terraformRating).to.eq(21);
  });
});

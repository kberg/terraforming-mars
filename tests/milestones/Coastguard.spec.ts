import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Coastguard} from '../../src/server/milestones/Coastguard';
import {addCity, addGreenery, maxOutOceans} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';

describe('Coastguard', () => {
  let milestone: Coastguard;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Coastguard();
    [/* game */, player] = testGame(2);

    maxOutOceans(player);
  });

  it('Can claim with 4 tiles adjacent to oceans', () => {
    addCity(player, '09');
    addGreenery(player, '20');
    addCity(player, '11');
    expect(milestone.canClaim(player)).is.false;

    addGreenery(player, '24');
    expect(milestone.canClaim(player)).is.true;
  });
});
